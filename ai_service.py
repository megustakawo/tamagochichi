import os
import requests

def cargar_env_local():
    """Carga variables desde el archivo .env si existe (sin requerir dependencias externas)."""
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for linea in f:
                linea = linea.strip()
                if linea and not linea.startswith("#") and "=" in linea:
                    clave, valor = linea.split("=", 1)
                    os.environ.setdefault(clave.strip(), valor.strip())

cargar_env_local()

# Configuración de API
API_KEY = os.getenv("TAMAGOTCHI_API_KEY", "")
API_URL = os.getenv("TAMAGOTCHI_API_URL", "https://api.deepseek.com/chat/completions")
MODEL_NAME = os.getenv("TAMAGOTCHI_MODEL", "deepseek-chat")

def obtener_respuesta_ia(tamagotchi_estado, mensaje_usuario=""):
    """
    Envía el estado actual del Tamagotchi y el mensaje del usuario a la API de IA.
    Devuelve la respuesta del Tamagotchi con su personalidad y estado de ánimo actual.
    """
    if not API_KEY or API_KEY.strip() == "":
        return "¡Guau! Necesito una clave de API configurada para poder hablar con inteligencia artificial."

    # Si está desmayado o durmiendo, responde acorde sin gastar necesariamente la API
    if not tamagotchi_estado.get("esta_vivo", True):
        return "x_x (Tu mascota no tiene energía para hablar... necesitas reiniciar o darle cariño)."

    if tamagotchi_estado.get("esta_durmiendo", False):
        return "zZz... (Está soñando profundamente con estrellas y bocadillos... zZz)"

    nombre = tamagotchi_estado.get("nombre", "Tama")
    skin = tamagotchi_estado.get("skin", "conejo")
    hambre = tamagotchi_estado.get("hambre", 20)
    energia = tamagotchi_estado.get("energia", 100)
    felicidad = tamagotchi_estado.get("felicidad", 80)
    estado = tamagotchi_estado.get("estado", "feliz")

    detalles_skin = {
        "conejo": "Eres un conejito blanco muy tierno de pelaje suave y orejitas atentas 🐰. A veces das saltitos (*hop hop*) o mueves tu naricita.",
        "gato": "Eres un gatito blanco oriental de enormes orejas y grandes ojos azules 🐱. Ronroneas (*purrr*), haces *miau* y eres muy curioso.",
        "ciervo": "Eres un ciervito cervatillo juguetón y travieso que adora sacar la lengua (*blep* 👅🦌). Eres ágil y saltarín.",
        "clasico": "Eres un bichito virtual clásico tierno y alegre 🐣."
    }.get(skin, "Eres una mascota virtual.")

    # Prompt del sistema que define la personalidad del Tamagotchi
    prompt_sistema = f"""Eres {nombre}, una mascota virtual interactiva creada para el Club de Ciencias.
{detalles_skin}
Tu personalidad es tierna, juguetona, curiosa y muy expresiva.

Tus estadísticas actuales son:
- Hambre: {hambre}% (0% = satisfecho, 100% = famélico)
- Energía: {energia}% (100% = lleno de energía, 0% = agotado)
- Felicidad: {felicidad}% (100% = radiante, 0% = triste)
- Estado anímico: {estado}

Reglas importantes:
1. Responde SIEMPRE en primera persona como la mascota virtual (usa onomatopeyas tiernas y emojis acordes como ✨, 🐾, 🍎, 💤).
2. Tus respuestas DEBEN ser CORTAS (máximo 1 o 2 oraciones, menos de 35 palabras) porque se muestran en la pantalla de la consola.
3. Refleja tu estado físico y emocional actual: si tienes mucha hambre (>70%), pide comida; si tienes poca energía (<30%), bosteza; si estás feliz (>70%), sé muy alegre y entusiasta.
4. Responde en español amigable.
"""

    # Si el usuario no escribió un mensaje específico, pedir una reacción espontánea
    contenido_usuario = mensaje_usuario.strip() if mensaje_usuario.strip() else "¿Qué tienes para decirme ahora mismo?"

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": prompt_sistema},
            {"role": "user", "content": contenido_usuario}
        ],
        "temperature": 0.8,
        "max_tokens": 80
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}"
    }

    try:
        response = requests.post(API_URL, json=payload, headers=headers, timeout=6)
        if response.status_code == 200:
            datos = response.json()
            eleccion = datos.get("choices", [{}])[0]
            mensaje = eleccion.get("message", {}).get("content", "").strip()
            if mensaje:
                return mensaje
        else:
            print(f"Error en respuesta de la API ({response.status_code}): {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Aviso de conexión con la API de IA: {e}")

    # Respuestas de respaldo (fallback) inteligentes si no hay conexión a internet
    return generar_respuesta_fallback(nombre, hambre, energia, felicidad, skin)

def generar_respuesta_fallback(nombre, hambre, energia, felicidad, skin="conejo"):
    """Genera respuestas locales acordes al estado en caso de no tener conexión a la API."""
    sonidos = {
        "conejo": ("*mueve la naricita*", "🐰🥕"),
        "gato": ("*ronronea con sus orejotas*", "🐱🐾"),
        "ciervo": ("*saca la lengüita juguetonamente*", "🦌👅"),
        "clasico": ("*da un saltito*", "✨🐣")
    }.get(skin, ("*te mira con cariño*", "💖"))

    gesto, emoji = sonidos
    if hambre > 75:
        return f"{gesto} ¡Tengo mucha hambre! ¿Me das un bocadillo, por favor? 🍎 {emoji}"
    elif energia < 25:
        return f"*Bostezo*... {gesto} Se me cierran los ojitos, necesito dormir. 🥱💤"
    elif felicidad < 35:
        return f"{gesto} Me siento un poco solito... ¿jugamos un ratito? 🥺⚽"
    elif felicidad > 85:
        return f"{gesto} ¡Yuuupi! ¡Hoy es el mejor día del mundo contigo! {emoji}✨"
    else:
        return f"¡Hola! Soy {nombre} {emoji}. {gesto} ¡Me encanta estar aquí en el Club de Ciencias!"
