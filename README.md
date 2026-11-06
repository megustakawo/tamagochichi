# 🐾 Tamagotchi Virtual Interactivo — Club de Ciencias

¡Bienvenidos al proyecto del **Club de Ciencias**! Este proyecto es un **Tamagotchi Virtual interactivo**, una mascota digital completa desarrollada utilizando **Python (Flask)** en el backend y **HTML5, CSS3 y JavaScript** en el frontend.

---

## 🎯 Objetivos Científicos y Pedagógicos

Este proyecto permite explorar y aprender conceptos clave de la informática y el desarrollo de software:

1. **Programación Orientada a Objetos (POO):**
   - Modelado de la mascota mediante la clase `Tamagotchi` con atributos de estado (`hambre`, `energia`, `felicidad`, `esta_durmiendo`, `esta_vivo`).
   - Métodos encapsulados para cada acción: `alimentar()`, `jugar()`, `dormir()`, `acariciar()`.

2. **Simulación de Sistemas en Tiempo Real (Decaimiento Temporal):**
   - El tiempo afecta el estado físico y emocional de la criatura incluso si el usuario no interactúa en el momento (el hambre aumenta, la energía se gasta, etc.).

3. **Arquitectura Cliente-Servidor y API REST:**
   - **Servidor (Python / Flask):** Expone rutas como `/api/estado` (GET) y `/api/accion` (POST) devolviendo respuestas en formato JSON.
   - **Cliente (Navegador):** Consulta periódicamente el estado (`fetch`) y actualiza el DOM de forma reactiva y asíncrona sin necesidad de recargar la página.

4. **Interfaz Multimedia y Accesibilidad:**
   - Animaciones CSS y SVGs dinámicos que cambian de rostro según el estado de ánimo (feliz, triste, comiendo, durmiendo, etc.).
   - Efectos de sonido retro de 8-bits generados mediante la **Web Audio API** de HTML5 (sin archivos externos pesados).

5. **Integración de Inteligencia Artificial (LLM API):**
   - Conexión con modelos de lenguaje vía API REST (DeepSeek / OpenAI compatible).
   - Generación de respuestas en primera persona donde el Tamagotchi adopta su personalidad y responde en función de su nivel de hambre, energía y felicidad.

6. **Sistema de Personalización y Skins:**
   - Selector interactivo de skins con vista previa: Conejito Blanco 🐰, Gatito Orejón 🐱, Ciervito Travieso 🦌 y Bichito Clásico 🐣.
   - Las skins reaccionan con animaciones de rebote, alimentación, sueño, juego y desmayo, y adaptan las respuestas y onomatopeyas de la IA según la especie seleccionada.

---

## 📁 Estructura del Proyecto

```
tamagotchi/
│
├── app.py              # Servidor web Flask y definición de endpoints API REST
├── tamagotchi.py       # Modelo POO con la lógica del Tamagotchi y el paso del tiempo
├── ai_service.py       # Módulo de integración con la API de IA (DeepSeek / OpenAI)
│
├── templates/
│   └── index.html      # Estructura visual de la consola retro y pantalla LCD
│
├── static/
│   ├── style.css       # Estilos visuales, forma de la consola y animaciones
│   ├── script.js       # Lógica cliente, sintetizador de audio y peticiones AJAX (fetch)
│   └── skins/          # Imágenes de las apariencias de la mascota
│       ├── conejo.png  # Skin de conejito blanco
│       ├── gato.png    # Skin de gatito orejón
│       └── ciervo.png  # Skin de ciervito travieso
│
├── .env.example        # Ejemplo de variables de configuración de la API
└── README.md           # Documentación del proyecto para el Club de Ciencias
```

---

## 🚀 Cómo Ejecutar la Aplicación

1. Abre una terminal y navega hasta la carpeta del proyecto:
   ```bash
   cd /home/estudiante/.gemini/antigravity/scratch/tamagotchi
   ```

2. Inicia el servidor Flask con Python:
   ```bash
   python3 app.py
   ```

3. Abre tu navegador web e ingresa a:
   ```
   http://127.0.0.1:5000
   ```

---

## 💡 Ideas para Continuar Extendiendo el Proyecto

Para la presentación o feria del Club de Ciencias, pueden agregar:
- **Evoluciones:** A medida que cumpla cierta edad (ej. 5 o 10 minutos), el Tamagotchi puede cambiar de forma (bebé -> niño -> adulto).
- **Persistencia de Datos:** Guardar la partida en un archivo JSON o base de datos SQLite para que la mascota siga viva entre reinicios del servidor.
- **Minijuegos:** Un juego de adivinanzas (piedra, papel o tijera / adivinar el número) para ganar puntos o felicidad extra.
- **Doble Mascota:** ¡Permitir que dos estudiantes tengan sus mascotas y se visiten mediante la red local!
