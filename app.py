from flask import Flask, render_template, jsonify, request
from tamagotchi import Tamagotchi
from ai_service import obtener_respuesta_ia

app = Flask(__name__)

# Instancia global de la mascota virtual
mi_tamagotchi = Tamagotchi(nombre="Pikachu")

@app.route('/')
def inicio():
    """Ruta principal que entrega la interfaz visual del Tamagotchi."""
    return render_template('index.html')

@app.route('/api/estado', methods=['GET'])
def obtener_estado():
    """Endpoint para consultar el estado actual del Tamagotchi en formato JSON."""
    return jsonify(mi_tamagotchi.serializar())

@app.route('/api/accion', methods=['POST'])
def ejecutar_accion():
    """Endpoint para enviar órdenes e interactuar con la mascota."""
    datos = request.get_json() or {}
    accion = datos.get('accion')
    nuevo_nombre = datos.get('nombre')

    resultado = {"exito": False, "mensaje": "Acción no reconocida."}

    if accion == 'alimentar':
        resultado = mi_tamagotchi.alimentar()
    elif accion == 'jugar':
        resultado = mi_tamagotchi.jugar()
    elif accion == 'dormir':
        resultado = mi_tamagotchi.dormir()
    elif accion == 'acariciar':
        resultado = mi_tamagotchi.acariciar()
    elif accion == 'reiniciar':
        resultado = mi_tamagotchi.reiniciar(nuevo_nombre=nuevo_nombre)
    elif accion == 'cambiar_nombre' and nuevo_nombre:
        mi_tamagotchi.nombre = nuevo_nombre.strip()
        resultado = {"exito": True, "mensaje": f"El nuevo nombre es {mi_tamagotchi.nombre}."}
    elif accion == 'cambiar_skin':
        nueva_skin = datos.get('skin')
        resultado = mi_tamagotchi.cambiar_skin(nueva_skin)

    respuesta = mi_tamagotchi.serializar()
    respuesta["resultado_accion"] = resultado
    return jsonify(respuesta)

@app.route('/api/hablar', methods=['POST'])
def hablar_con_tamagotchi():
    """Endpoint para conversar con el Tamagotchi mediante la API de Inteligencia Artificial."""
    datos = request.get_json() or {}
    mensaje_usuario = datos.get('mensaje', '').strip()

    estado_actual = mi_tamagotchi.serializar()
    respuesta_ia = obtener_respuesta_ia(estado_actual, mensaje_usuario)

    # Conversar también aumenta un poquito la felicidad de la mascota
    if mi_tamagotchi.esta_vivo and not mi_tamagotchi.esta_durmiendo:
        mi_tamagotchi.felicidad = mi_tamagotchi._limitar(mi_tamagotchi.felicidad + 5)
        registro = f"💬 Tú: '{mensaje_usuario}' → {mi_tamagotchi.nombre}: '{respuesta_ia}'" if mensaje_usuario else f"{mi_tamagotchi.nombre}: '{respuesta_ia}'"
        mi_tamagotchi.mensajes_historial.append(registro)

    respuesta = mi_tamagotchi.serializar()
    respuesta["respuesta_ia"] = respuesta_ia
    return jsonify(respuesta)

if __name__ == '__main__':
    # Ejecución del servidor local en el puerto 5000
    print("Iniciando servidor de Tamagotchi en http://127.0.0.1:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
