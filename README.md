# ⚽ Día del Padre - Torneo Futbolero

Aplicación web para organizar una actividad presencial del Día del Padre con temática de fútbol. Administra equipos de 4 personas, puntuación automática y cuatro minijuegos: **Trivia Mundialista**, **Penales de la Suerte**, **Adivina el Jugador** y **Mímica de Acciones**.

No requiere internet, servidor, ni instalación de dependencias. Funciona con HTML, CSS y JavaScript puro directamente en el navegador.

## Cómo ejecutarla el día del evento

1. Copia la carpeta `DiaDelPadreFutbol` completa a la computadora que se usará (puede ir en USB, por correo, o ya estar en el escritorio).
2. Haz doble clic sobre el archivo `index.html`. Se abrirá en tu navegador predeterminado (Chrome, Edge, Safari, Firefox, etc.).
   - Si prefieres, también puedes abrir el navegador primero y luego arrastrar `index.html` a la ventana.
3. Conecta la computadora al proyector/TV y, si es posible, pon el navegador en pantalla completa (`F11` en Windows/Linux, `Cmd+Ctrl+F` en Mac) para que los botones grandes se vean mejor.
4. ¡Listo! No necesitas instalar nada más.

> No es necesario tener internet, salvo que quieras que carguen las fuentes decorativas (Google Fonts); si no hay conexión, la app usa una tipografía de respaldo y funciona igual.

## Cómo se juega

### 1. Registro de equipos
- Al iniciar, pulsa **"Comenzar Torneo"**.
- Ingresa el nombre de cada equipo (mínimo 2, sin límite máximo). Cada equipo debería tener 4 integrantes jugando en conjunto.
- Pulsa **"Guardar y continuar"** para ir al menú principal.

### 2. Menú principal
Desde aquí puedes:
- Elegir cualquiera de los 3 juegos.
- Ver la **Tabla de Posiciones** en cualquier momento.
- **Finalizar Torneo**: calcula y muestra el equipo ganador (o empate) con celebración.
- **Reiniciar Torneo**: borra todos los puntajes y equipos para empezar de nuevo (pide confirmación).

El marcador en vivo de todos los equipos se muestra fijo en la parte superior durante todos los juegos.

### 3. Trivia Mundialista 🧠
- Selecciona los 2 equipos que competirán.
- Se alternan turnos para responder preguntas de opción múltiple sobre Copas del Mundo (banco de 100+ preguntas).
- El equipo en turno responde verbalmente; el anfitrión hace clic en la opción elegida.
- Respuesta correcta = **10 puntos** para el equipo en turno.
- Son 8 preguntas por ronda. Al terminar, se puede iniciar otra ronda con otros equipos.

### 4. Penales de la Suerte 🥅
- Selecciona los 2 equipos (uno dispara, el otro ataja).
- El equipo atacante elige una zona de disparo (centro, arriba/abajo izquierda o derecha) y el anfitrión hace clic.
- Luego el equipo portero elige dónde atajar y el anfitrión hace clic.
- Si las zonas coinciden → **atajada**. Si no coinciden → **¡gol!** y el equipo atacante gana **10 puntos**.
- Cada equipo dispara 5 penales (al terminar los 5 del primer equipo, se invierten los roles).

### 5. Adivina el Jugador 🔎
- Pulsa **"Mostrar Jugador"** para revelar la primera pista de un futbolista histórico (banco de 50 jugadores).
- Cualquier equipo puede gritar la respuesta; el anfitrión hace clic en el botón del equipo que adivinó.
- Mientras menos pistas se hayan mostrado, más puntos se ganan:
  - 1 pista: 50 pts · 2 pistas: 40 pts · 3 pistas: 30 pts · 4 pistas: 20 pts · 5 pistas: 10 pts
- Si nadie adivina, pulsa **"Nadie adivinó / Revelar"** para mostrar el nombre y continuar con otro jugador.

#### 🛡️ Vista de Administrador (para que tú sepas quién es el jugador)
Como las pistas se muestran en la misma pantalla que ve el público, normalmente tú tampoco sabrías el nombre hasta revelarlo. Para resolver esto:
- En la pantalla de "Adivina el Jugador" (o en "Mímica de Acciones") pulsa **"🛡️ Abrir Vista de Administrador"**. Se abrirá una ventana nueva (`admin.html`) que siempre muestra el nombre completo del jugador actual y todas sus pistas (o la palabra secreta de mímica), sincronizada en tiempo real con el juego.
- **Importante:** esa ventana NO debe proyectarse. Si tu computadora está en modo "duplicar pantalla" (mirror), todo lo que ves tú también lo ve el público — en ese caso, simplemente consulta esa ventana en momentos discretos (por ejemplo, minimízala y solo ábrela un instante cuando un equipo grite una respuesta) o, mejor aún, configura tu computadora en modo "extender pantalla" (no duplicar) y arrastra la ventana de administrador a tu pantalla, dejando solo la ventana principal del juego en el proyector.
- Alternativa sin tecnología: imprime la lista de los 50 jugadores (`js/data-players.js`) o el banco de acciones (`js/data-mimica.js`) como una hoja de referencia física para el anfitrión.

### 6. Mímica de Acciones 🎭
- Selecciona el equipo que va a actuar y pulsa **"🎲 Asignar Palabra Secreta"**.
- La palabra (una acción cotidiana, ej. "Pasear a la mascota", "Viendo televisión") se asigna en secreto — **solo aparece en la Vista de Administrador**, nunca en la pantalla pública.
- El actor del equipo se acerca a ver la Vista de Administrador (sin que el público la vea), y cuando esté listo, el anfitrión pulsa **"▶️ Iniciar Cronómetro (45s)"**.
- El actor representa la acción sin hablar mientras su equipo adivina contra el reloj.
- Mientras más tiempo quede al adivinar, más puntos se ganan:
  - 30s o más restantes: 20 pts · 15-29s restantes: 15 pts · 1-14s restantes: 10 pts · tiempo agotado: 0 pts
- Banco de más de 75 acciones distintas para actuar.

## Efectos de sonido

Los sonidos de gol, celebración, atajada, respuesta correcta/incorrecta y victoria se generan en tiempo real con la API de audio del navegador (Web Audio API). No se necesitan archivos de audio externos, así que funcionan sin internet y sin instalar nada. Si el navegador no reproduce sonido al inicio, haz clic una vez en cualquier botón de la pantalla de inicio (los navegadores requieren una interacción del usuario antes de permitir audio).

## Persistencia de datos

Los puntajes y el progreso del torneo se guardan en la memoria del navegador (`sessionStorage`) mientras la pestaña/ventana esté abierta. Si cierras el navegador o la pestaña, los datos se pierden (tal como se requiere). Si solo recargas la página sin cerrarla, el torneo continúa donde quedó.

## Estructura del proyecto

```
DiaDelPadreFutbol/
├── index.html              # Estructura de todas las pantallas
├── css/
│   └── styles.css          # Estilos festivos y tema futbolero
├── js/
│   ├── data-trivia.js      # Banco de 100+ preguntas de trivia
│   ├── data-players.js     # Banco de 50 jugadores históricos con pistas
│   ├── data-mimica.js      # Banco de acciones para Mímica
│   ├── sounds.js           # Efectos de sonido sintetizados
│   ├── state.js            # Estado del torneo y persistencia
│   └── app.js              # Lógica de navegación y de los 4 juegos
├── admin.html               # Vista privada del anfitrión (jugador/palabra secreta)
└── README.md
```

## Personalizar

- **Puntos por juego**: edita las constantes `PUNTOS_TRIVIA`, `PUNTOS_PENAL` y `PUNTOS_JUGADOR` al inicio de `js/app.js`.
- **Cantidad de preguntas por ronda de trivia**: constante `PREGUNTAS_POR_RONDA` en `js/app.js`.
- **Agregar más preguntas o jugadores**: añade nuevos objetos a los arreglos `BANCO_TRIVIA` (en `js/data-trivia.js`) o `BANCO_JUGADORES` (en `js/data-players.js`), siguiendo el mismo formato.
- **Colores de equipos**: arreglo `colores` dentro de `registrarEquipos()` en `js/state.js`.
