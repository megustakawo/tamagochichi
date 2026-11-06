// Estado local del audio y la interfaz
let sonidoHabilitado = true;
let audioCtx = null;

// Inicialización de Web Audio API para sonidos retro sintetizados de 8-bits
function reproducirSonido(tipo) {
    if (!sonidoHabilitado) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const ahora = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const ganancia = audioCtx.createGain();
        osc.connect(ganancia);
        ganancia.connect(audioCtx.destination);

        if (tipo === 'comer') {
            // Sonido ascendente tipo "nom nom"
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(320, ahora);
            osc.frequency.exponentialRampToValueAtTime(640, ahora + 0.15);
            ganancia.gain.setValueAtTime(0.3, ahora);
            ganancia.gain.exponentialRampToValueAtTime(0.01, ahora + 0.2);
            osc.start(ahora);
            osc.stop(ahora + 0.2);
        } else if (tipo === 'jugar') {
            // Arpegio alegre tipo salto de videojuego
            osc.type = 'square';
            osc.frequency.setValueAtTime(440, ahora);
            osc.frequency.setValueAtTime(554.37, ahora + 0.08);
            osc.frequency.setValueAtTime(659.25, ahora + 0.16);
            ganancia.gain.setValueAtTime(0.2, ahora);
            ganancia.gain.exponentialRampToValueAtTime(0.01, ahora + 0.28);
            osc.start(ahora);
            osc.stop(ahora + 0.28);
        } else if (tipo === 'dormir') {
            // Tono suave descendente
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, ahora);
            osc.frequency.exponentialRampToValueAtTime(200, ahora + 0.4);
            ganancia.gain.setValueAtTime(0.2, ahora);
            ganancia.gain.exponentialRampToValueAtTime(0.01, ahora + 0.4);
            osc.start(ahora);
            osc.stop(ahora + 0.4);
        } else if (tipo === 'mimar') {
            // Bip agudo tierno
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587, ahora);
            osc.frequency.exponentialRampToValueAtTime(880, ahora + 0.12);
            ganancia.gain.setValueAtTime(0.2, ahora);
            ganancia.gain.exponentialRampToValueAtTime(0.01, ahora + 0.15);
            osc.start(ahora);
            osc.stop(ahora + 0.15);
        } else if (tipo === 'alerta') {
            // Tono grave de alerta
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, ahora);
            osc.frequency.setValueAtTime(180, ahora + 0.1);
            ganancia.gain.setValueAtTime(0.15, ahora);
            ganancia.gain.exponentialRampToValueAtTime(0.01, ahora + 0.25);
            osc.start(ahora);
            osc.stop(ahora + 0.25);
        }
    } catch (e) {
        console.warn('Audio no soportado o bloqueado:', e);
    }
}

// Elementos del DOM
const petName = document.getElementById('petName');
const petAge = document.getElementById('petAge');
const speechBubble = document.getElementById('speechBubble');
const petAvatar = document.getElementById('petAvatar');
const petSvg = document.getElementById('petSvg');
const petImg = document.getElementById('petImg');
const petEmotionOverlay = document.getElementById('petEmotionOverlay');
const petEyes = document.getElementById('petEyes');
const petMouth = document.getElementById('petMouth');
const floatingIcons = document.getElementById('floatingIcons');

const valHambre = document.getElementById('valHambre');
const barHambre = document.getElementById('barHambre');
const valEnergia = document.getElementById('valEnergia');
const barEnergia = document.getElementById('barEnergia');
const valFelicidad = document.getElementById('valFelicidad');
const barFelicidad = document.getElementById('barFelicidad');

const moodLabel = document.getElementById('moodLabel');
const sleepIcon = document.getElementById('sleepIcon');
const sleepText = document.getElementById('sleepText');
const activityLog = document.getElementById('activityLog');

const btnAlimentar = document.getElementById('btnAlimentar');
const btnJugar = document.getElementById('btnJugar');
const btnDormir = document.getElementById('btnDormir');
const btnAcariciar = document.getElementById('btnAcariciar');
const btnSonido = document.getElementById('btnSonido');
const btnCambiarSkin = document.getElementById('btnCambiarSkin');
const btnReiniciar = document.getElementById('btnReiniciar');
const petNameDisplay = document.getElementById('petNameDisplay');
const chatPetName = document.getElementById('chatPetName');
const formChat = document.getElementById('formChat');
const inputMensaje = document.getElementById('inputMensaje');
const btnEnviarMensaje = document.getElementById('btnEnviarMensaje');
const quickBtns = document.querySelectorAll('.quick-btn');
const skinCards = document.querySelectorAll('.skin-card');

// Información y configuración de skins disponibles
const SKINS_INFO = {
    conejo: {
        nombre: "Conejito Blanco",
        src: "/static/skins/conejo.png",
        tipo: "img",
        emoji: "🐰"
    },
    gato: {
        nombre: "Gatito Orejón",
        src: "/static/skins/gato.png",
        tipo: "img",
        emoji: "🐱"
    },
    ciervo: {
        nombre: "Ciervito Travieso",
        src: "/static/skins/ciervo.png",
        tipo: "img",
        emoji: "🦌"
    },
    clasico: {
        nombre: "Bichito Clásico",
        src: "",
        tipo: "svg",
        emoji: "🐣"
    }
};

let skinActual = localStorage.getItem('tamagotchi_skin') || 'conejo';

// Función para aplicar visualmente una skin
function aplicarSkin(skinId) {
    if (!SKINS_INFO[skinId]) skinId = 'conejo';
    skinActual = skinId;
    localStorage.setItem('tamagotchi_skin', skinId);

    // Actualizar botones del selector
    document.querySelectorAll('.skin-card').forEach(card => {
        if (card.getAttribute('data-skin') === skinId) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });

    const info = SKINS_INFO[skinId];
    if (info.tipo === 'img') {
        if (petImg) {
            petImg.src = info.src;
            petImg.style.display = 'block';
        }
        if (petSvg) petSvg.style.display = 'none';
    } else {
        if (petImg) petImg.style.display = 'none';
        if (petSvg) petSvg.style.display = 'block';
    }
}

// Función interactiva para cambiar la skin (llamada por el usuario)
async function cambiarSkin(skinId) {
    aplicarSkin(skinId);
    reproducirSonido('mimar');
    animarIconoFlotante('✨');
    const info = SKINS_INFO[skinId];
    speechBubble.textContent = `¡Ahora soy un ${info.nombre}! ${info.emoji}`;

    // Sincronizar con el backend
    await enviarAccion('cambiar_skin', { skin: skinId });
}

// Función para actualizar la interfaz con los datos del servidor
function actualizarUI(datos) {
    if (!datos) return;

    // Sincronizar skin si el backend reporta una
    if (datos.skin && datos.skin !== skinActual) {
        aplicarSkin(datos.skin);
    }

    // Nombre y Edad
    const nombre = datos.nombre || 'Tama';
    petName.textContent = nombre;
    if (chatPetName) chatPetName.textContent = nombre;
    petAge.textContent = datos.edad || '0m 0s';

    // Barras de estadísticas
    const hambre = Math.round(datos.hambre);
    const energia = Math.round(datos.energia);
    const felicidad = Math.round(datos.felicidad);

    valHambre.textContent = `${hambre}%`;
    barHambre.style.width = `${hambre}%`;

    valEnergia.textContent = `${energia}%`;
    barEnergia.style.width = `${energia}%`;

    valFelicidad.textContent = `${felicidad}%`;
    barFelicidad.style.width = `${felicidad}%`;

    // Cambiar texto de botón dormir según estado
    if (datos.esta_durmiendo) {
        sleepIcon.textContent = '☀️';
        sleepText.textContent = 'Despertar';
    } else {
        sleepIcon.textContent = '💤';
        sleepText.textContent = 'Dormir';
    }

    // Expresión visual según el estado
    actualizarExpresion(datos);

    // Actualizar historial
    if (datos.ultimos_mensajes && datos.ultimos_mensajes.length > 0) {
        activityLog.innerHTML = '';
        datos.ultimos_mensajes.slice().reverse().forEach(msg => {
            const li = document.createElement('li');
            li.textContent = msg;
            activityLog.appendChild(li);
        });
    }
}

// Modifica la apariencia visual según el estado
function actualizarExpresion(datos) {
    petAvatar.className = 'pet-avatar'; // limpiar clases

    if (!datos.esta_vivo) {
        petAvatar.classList.add('dead');
        moodLabel.textContent = 'Estado: Desmayado 💀';
        speechBubble.textContent = '¡Oh no! Necesito un renacer...';
        if (petEmotionOverlay) petEmotionOverlay.textContent = '💀';
        if (petEyes) {
            petEyes.innerHTML = `
                <text x="38" y="65" font-size="16" font-weight="bold" fill="#333">X</text>
                <text x="70" y="65" font-size="16" font-weight="bold" fill="#333">X</text>
            `;
        }
        if (petMouth) petMouth.innerHTML = `<path d="M 50 78 Q 60 74 70 78" stroke="#222" stroke-width="3" fill="none"/>`;
        return;
    }

    if (datos.esta_durmiendo) {
        petAvatar.classList.add('sleeping');
        moodLabel.textContent = 'Estado: Durmiendo 💤';
        speechBubble.textContent = 'zZz... zZz...';
        if (petEmotionOverlay) petEmotionOverlay.textContent = '💤';
        if (petEyes) {
            petEyes.innerHTML = `
                <path d="M 38 60 Q 44 66 50 60" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 70 60 Q 76 66 82 60" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>
            `;
        }
        if (petMouth) petMouth.innerHTML = `<circle cx="60" cy="72" r="3" fill="#333"/>`;
        return;
    }

    if (datos.hambre > 75) {
        moodLabel.textContent = 'Estado: Hambriento 🍖';
        speechBubble.textContent = '¡Tengo mucha hambre!';
        if (petEmotionOverlay) petEmotionOverlay.textContent = '🍖';
        if (petEyes) {
            petEyes.innerHTML = `
                <circle cx="44" cy="58" r="5" fill="#222"/>
                <circle cx="76" cy="58" r="5" fill="#222"/>
            `;
        }
        if (petMouth) petMouth.innerHTML = `<ellipse cx="60" cy="74" rx="7" ry="5" fill="#222"/>`;
        petAvatar.classList.add('bounce');
        return;
    }

    if (datos.energia < 25) {
        moodLabel.textContent = 'Estado: Agotado 🥱';
        speechBubble.textContent = 'Bostezando... necesito dormir.';
        if (petEmotionOverlay) petEmotionOverlay.textContent = '🥱';
        if (petEyes) {
            petEyes.innerHTML = `
                <path d="M 40 58 L 48 62" stroke="#222" stroke-width="3" stroke-linecap="round"/>
                <path d="M 80 58 L 72 62" stroke="#222" stroke-width="3" stroke-linecap="round"/>
            `;
        }
        if (petMouth) petMouth.innerHTML = `<path d="M 52 74 Q 60 70 68 74" stroke="#222" stroke-width="3" fill="none"/>`;
        return;
    }

    if (datos.felicidad < 30) {
        moodLabel.textContent = 'Estado: Triste 😢';
        speechBubble.textContent = 'Me siento solito... ¿jugamos?';
        if (petEmotionOverlay) petEmotionOverlay.textContent = '💧';
        if (petEyes) {
            petEyes.innerHTML = `
                <circle cx="44" cy="60" r="5" fill="#222"/>
                <circle cx="76" cy="60" r="5" fill="#222"/>
                <circle cx="44" cy="68" r="3" fill="#64b5f6"/>
            `;
        }
        if (petMouth) petMouth.innerHTML = `<path d="M 52 76 Q 60 68 68 76" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round"/>`;
        return;
    }

    // Estado normal / feliz
    petAvatar.classList.add('bounce');
    moodLabel.textContent = 'Estado: ¡Muy Contento! ✨';
    if (petEmotionOverlay) petEmotionOverlay.textContent = '';
    if (petEyes) {
        petEyes.innerHTML = `
            <circle cx="44" cy="58" r="5" class="eye-color" />
            <circle cx="76" cy="58" r="5" class="eye-color" />
            <circle cx="46" cy="56" r="1.8" fill="#fff" />
            <circle cx="78" cy="56" r="1.8" fill="#fff" />
        `;
    }
    if (petMouth) petMouth.innerHTML = `<path d="M 52 70 Q 60 78 68 70" stroke="#222" stroke-width="3" fill="none" stroke-linecap="round" />`;
}

// Efecto visual de icono flotante
function animarIconoFlotante(icono) {
    const el = document.createElement('div');
    el.textContent = icono;
    el.style.position = 'absolute';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.fontSize = '1.8rem';
    el.style.animation = 'floatUp 1s forwards ease-out';
    floatingIcons.appendChild(el);

    setTimeout(() => el.remove(), 1000);
}

// Petición HTTP a la API de Flask
async function enviarAccion(accion, extra = {}) {
    try {
        const respuesta = await fetch('/api/accion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accion, ...extra })
        });
        const datos = await respuesta.json();
        
        if (datos.resultado_accion && datos.resultado_accion.mensaje) {
            speechBubble.textContent = datos.resultado_accion.mensaje;
        }

        actualizarUI(datos);
        return datos;
    } catch (error) {
        console.error('Error al enviar acción:', error);
    }
}

// Consultar estado periódico (polling)
async function consultarEstado() {
    try {
        const respuesta = await fetch('/api/estado');
        const datos = await respuesta.json();
        actualizarUI(datos);
    } catch (error) {
        console.warn('Error consultando estado:', error);
    }
}

// Event Listeners de Botones
btnAlimentar.addEventListener('click', () => {
    reproducirSonido('comer');
    animarIconoFlotante('🍎');
    petAvatar.classList.add('eating');
    setTimeout(() => petAvatar.classList.remove('eating'), 1000);
    enviarAccion('alimentar');
});

btnJugar.addEventListener('click', () => {
    reproducirSonido('jugar');
    animarIconoFlotante('⚽');
    petAvatar.classList.add('playing');
    setTimeout(() => petAvatar.classList.remove('playing'), 1000);
    enviarAccion('jugar');
});

btnDormir.addEventListener('click', () => {
    reproducirSonido('dormir');
    animarIconoFlotante('💤');
    enviarAccion('dormir');
});

btnAcariciar.addEventListener('click', () => {
    reproducirSonido('mimar');
    animarIconoFlotante('💖');
    enviarAccion('acariciar');
});

petAvatar.addEventListener('click', () => {
    reproducirSonido('mimar');
    animarIconoFlotante('💖');
    enviarAccion('acariciar');
});

btnSonido.addEventListener('click', () => {
    sonidoHabilitado = !sonidoHabilitado;
    btnSonido.textContent = sonidoHabilitado ? '🔊 Sonido' : '🔇 Mudo';
});

btnReiniciar.addEventListener('click', () => {
    const nombre = prompt('¿Qué nombre quieres darle a tu nueva mascota?', 'Tama');
    if (nombre) {
        enviarAccion('reiniciar', { nombre: nombre.trim() });
    }
});

petNameDisplay.addEventListener('click', () => {
    const nuevoNombre = prompt('Cambiar nombre de la mascota:', petName.textContent);
    if (nuevoNombre && nuevoNombre.trim()) {
        enviarAccion('cambiar_nombre', { nombre: nuevoNombre.trim() });
    }
});

// Función para enviar mensaje al Tamagotchi (IA)
async function enviarMensajeIA(texto) {
    if (!texto || !texto.trim()) return;

    const textoLimpio = texto.trim();
    speechBubble.textContent = '💭 Pensando...';
    animarIconoFlotante('🤖');
    reproducirSonido('mimar');

    if (btnEnviarMensaje) btnEnviarMensaje.disabled = true;
    if (inputMensaje) inputMensaje.disabled = true;

    try {
        const respuesta = await fetch('/api/hablar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje: textoLimpio })
        });
        const datos = await respuesta.json();

        if (datos.respuesta_ia) {
            speechBubble.textContent = datos.respuesta_ia;
            reproducirSonido('jugar');
            animarIconoFlotante('💬');
        }

        actualizarUI(datos);
    } catch (error) {
        console.error('Error al hablar con la IA:', error);
        speechBubble.textContent = '¡Ups! No pude escuchar bien.';
    } finally {
        if (btnEnviarMensaje) btnEnviarMensaje.disabled = false;
        if (inputMensaje) {
            inputMensaje.disabled = false;
            inputMensaje.value = '';
            inputMensaje.focus();
        }
    }
}

// Event listener del formulario de chat
if (formChat) {
    formChat.addEventListener('submit', (e) => {
        e.preventDefault();
        const texto = inputMensaje.value;
        enviarMensajeIA(texto);
    });
}

// Event listeners para botones rápidos de conversación
quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mensaje = btn.getAttribute('data-msg');
        if (mensaje) {
            enviarMensajeIA(mensaje);
        }
    });
});

// Animación CSS para icono flotante inyectada dinámicamente
const styleSheet = document.createElement('style');
styleSheet.textContent = `
@keyframes floatUp {
    0% { opacity: 1; transform: translate(-50%, 0) scale(0.8); }
    100% { opacity: 0; transform: translate(-50%, -40px) scale(1.3); }
}
`;
document.head.appendChild(styleSheet);

// Event listeners para selección de skins
skinCards.forEach(card => {
    card.addEventListener('click', () => {
        const skin = card.getAttribute('data-skin');
        if (skin) {
            cambiarSkin(skin);
        }
    });
});

// Botón auxiliar para alternar a la siguiente skin
if (btnCambiarSkin) {
    btnCambiarSkin.addEventListener('click', () => {
        const skins = Object.keys(SKINS_INFO);
        const idx = skins.indexOf(skinActual);
        const nextSkin = skins[(idx + 1) % skins.length];
        cambiarSkin(nextSkin);
    });
}

// Aplicar skin inicial (guardada o por defecto)
aplicarSkin(skinActual);

// Inicio: consultar estado inmediatamente y luego cada 2.5 segundos
consultarEstado();
setInterval(consultarEstado, 2500);
