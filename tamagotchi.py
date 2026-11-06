import time

class Tamagotchi:
    """
    Clase que modela el comportamiento y estado de una mascota virtual.
    Diseñada para el proyecto del Club de Ciencias.
    """
    def __init__(self, nombre="Tama", skin="conejo"):
        self.nombre = nombre
        self.skin = skin        # "conejo", "gato", "ciervo", "clasico"
        # Niveles entre 0 y 100
        self.hambre = 20        # 0 = sin hambre (satisfecho), 100 = hambriento
        self.energia = 100      # 100 = con máxima energía, 0 = agotado
        self.felicidad = 80     # 100 = muy feliz, 0 = deprimido
        self.esta_durmiendo = False
        self.esta_vivo = True
        self.ultimo_tiempo = time.time()
        self.edad_segundos = 0
        self.mensajes_historial = [f"¡Hola! Ha nacido {self.nombre}."]

    def _limitar(self, valor, minimo=0, maximo=100):
        """Asegura que un valor numérico se mantenga en el rango [minimo, maximo]."""
        return max(minimo, min(maximo, valor))

    def actualizar_tiempo(self):
        """
        Calcula el paso del tiempo real y degrada/recupera estadísticas según corresponda.
        Se ejecuta antes de cada acción o consulta de estado.
        """
        if not self.esta_vivo:
            return

        ahora = time.time()
        segundos_transcurridos = ahora - self.ultimo_tiempo
        self.ultimo_tiempo = ahora
        self.edad_segundos += int(segundos_transcurridos)

        # Cada ciclo de tiempo afecta a la mascota
        if self.esta_durmiendo:
            # Mientras duerme recupera energía y el hambre aumenta lentamente
            self.energia = self._limitar(self.energia + segundos_transcurridos * 2.0)
            self.hambre = self._limitar(self.hambre + segundos_transcurridos * 0.3)
            # Si la energía llega al 100%, se despierta automáticamente
            if self.energia >= 100:
                self.esta_durmiendo = False
                self.mensajes_historial.append(f"{self.nombre} se ha despertado con la energía al 100%.")
        else:
            # Despierto: el hambre sube, la energía y felicidad bajan gradualmente
            self.hambre = self._limitar(self.hambre + segundos_transcurridos * 0.8)
            self.energia = self._limitar(self.energia - segundos_transcurridos * 0.5)

            # Si tiene mucha hambre o poca energía, la felicidad decae más rápido
            factor_tristeza = 1.0
            if self.hambre > 75:
                factor_tristeza += 1.5
            if self.energia < 25:
                factor_tristeza += 1.5
            self.felicidad = self._limitar(self.felicidad - (segundos_transcurridos * 0.4 * factor_tristeza))

        # Verificar si sobrevive a condiciones extremas
        if self.hambre >= 100 and self.energia <= 0:
            self.esta_vivo = False
            self.mensajes_historial.append(f"Oh no... {self.nombre} no resistió el descuido y se ha desmayado.")

    def alimentar(self):
        """Acción de alimentar al Tamagotchi."""
        self.actualizar_tiempo()
        if not self.esta_vivo:
            return {"exito": False, "mensaje": f"{self.nombre} no puede comer porque no tiene energía vital."}
        if self.esta_durmiendo:
            return {"exito": False, "mensaje": f"¡Shhh! {self.nombre} está durmiendo. Despiértalo primero."}
        if self.hambre <= 5:
            return {"exito": False, "mensaje": f"{self.nombre} está completamente lleno y no quiere más comida."}

        self.hambre = self._limitar(self.hambre - 25)
        self.energia = self._limitar(self.energia + 5)
        self.felicidad = self._limitar(self.felicidad + 5)
        mensaje = f"¡Ñam ñam! Alimentaste a {self.nombre} con una deliciosa merienda."
        self.mensajes_historial.append(mensaje)
        return {"exito": True, "mensaje": mensaje}

    def jugar(self):
        """Acción de jugar con el Tamagotchi."""
        self.actualizar_tiempo()
        if not self.esta_vivo:
            return {"exito": False, "mensaje": f"{self.nombre} no puede jugar ahora."}
        if self.esta_durmiendo:
            return {"exito": False, "mensaje": f"{self.nombre} está durmiendo profundamente."}
        if self.energia < 15:
            return {"exito": False, "mensaje": f"{self.nombre} está demasiado cansado para jugar. ¡Déjalo dormir!"}
        if self.hambre > 85:
            return {"exito": False, "mensaje": f"{self.nombre} tiene demasiada hambre para jugar."}

        self.felicidad = self._limitar(self.felicidad + 25)
        self.energia = self._limitar(self.energia - 15)
        self.hambre = self._limitar(self.hambre + 10)
        mensaje = f"¡Qué divertido! Jugaste a la pelota con {self.nombre}."
        self.mensajes_historial.append(mensaje)
        return {"exito": True, "mensaje": mensaje}

    def dormir(self):
        """Alterna el estado de dormir/despertar del Tamagotchi."""
        self.actualizar_tiempo()
        if not self.esta_vivo:
            return {"exito": False, "mensaje": f"{self.nombre} no responde."}

        if self.esta_durmiendo:
            self.esta_durmiendo = False
            mensaje = f"{self.nombre} se ha despertado listo para un nuevo día."
        else:
            self.esta_durmiendo = True
            mensaje = f"{self.nombre} se fue a dormir zZz..."

        self.mensajes_historial.append(mensaje)
        return {"exito": True, "mensaje": mensaje}

    def acariciar(self):
        """Acción extra: darle cariño para subir su felicidad."""
        self.actualizar_tiempo()
        if not self.esta_vivo:
            return {"exito": False, "mensaje": f"{self.nombre} no responde."}
        if self.esta_durmiendo:
            self.felicidad = self._limitar(self.felicidad + 5)
            mensaje = f"{self.nombre} sonríe en sueños al sentir tus mimos."
            self.mensajes_historial.append(mensaje)
            return {"exito": True, "mensaje": mensaje}

        self.felicidad = self._limitar(self.felicidad + 15)
        mensaje = f"Le diste cariño a {self.nombre}. ¡Ronronea de felicidad!"
        self.mensajes_historial.append(mensaje)
        return {"exito": True, "mensaje": mensaje}

    def reiniciar(self, nuevo_nombre=None):
        """Reinicia la mascota con un nombre nuevo o el mismo."""
        nombre = nuevo_nombre if nuevo_nombre else self.nombre
        self.__init__(nombre=nombre)
        return {"exito": True, "mensaje": f"¡Un nuevo {self.nombre} ha nacido!"}

    def obtener_estado_animacion(self):
        """Determina la emoción y expresión visual del Tamagotchi."""
        if not self.esta_vivo:
            return "muerto"
        if self.esta_durmiendo:
            return "durmiendo"
        if self.hambre > 75:
            return "hambriento"
        if self.energia < 25:
            return "cansado"
        if self.felicidad < 30:
            return "triste"
        if self.felicidad >= 70:
            return "muy_feliz"
        return "feliz"

    def cambiar_skin(self, nueva_skin):
        """Cambia la apariencia (skin) de la mascota."""
        skins_validas = {
            "conejo": "Conejito Blanco 🐰",
            "gato": "Gatito Orejón 🐱",
            "ciervo": "Ciervito Travieso 🦌",
            "clasico": "Bichito Clásico 🐣"
        }
        if nueva_skin in skins_validas:
            self.skin = nueva_skin
            mensaje = f"¡{self.nombre} ahora luce la skin de {skins_validas[nueva_skin]}!"
            self.mensajes_historial.append(mensaje)
            return {"exito": True, "mensaje": mensaje, "skin": self.skin}
        return {"exito": False, "mensaje": f"Skin '{nueva_skin}' no reconocida."}

    def serializar(self):
        """Devuelve un diccionario con el estado actual formateado para la interfaz web."""
        self.actualizar_tiempo()
        # Convertir edad a formato legible
        minutos = self.edad_segundos // 60
        segundos = self.edad_segundos % 60
        edad_str = f"{minutos}m {segundos}s"

        return {
            "nombre": self.nombre,
            "skin": self.skin,
            "hambre": round(self.hambre, 1),
            "energia": round(self.energia, 1),
            "felicidad": round(self.felicidad, 1),
            "esta_durmiendo": self.esta_durmiendo,
            "esta_vivo": self.esta_vivo,
            "estado": self.obtener_estado_animacion(),
            "edad": edad_str,
            "ultimos_mensajes": self.mensajes_historial[-5:]
        }
