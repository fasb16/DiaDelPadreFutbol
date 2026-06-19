# ⚽ Día del Padre - Torneo Futbolero

Aplicación web para organizar una actividad presencial del Día del Padre con temática de fútbol. Administra equipos de 4 personas, puntuación automática y tres minijuegos: **Trivia Mundialista**, **Penales de la Suerte** y **Adivina el Jugador**.

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
│   ├── sounds.js           # Efectos de sonido sintetizados
│   ├── state.js            # Estado del torneo y persistencia
│   └── app.js              # Lógica de navegación y de los 3 juegos
└── README.md
```

## Personalizar

- **Puntos por juego**: edita las constantes `PUNTOS_TRIVIA`, `PUNTOS_PENAL` y `PUNTOS_JUGADOR` al inicio de `js/app.js`.
- **Cantidad de preguntas por ronda de trivia**: constante `PREGUNTAS_POR_RONDA` en `js/app.js`.
- **Agregar más preguntas o jugadores**: añade nuevos objetos a los arreglos `BANCO_TRIVIA` (en `js/data-trivia.js`) o `BANCO_JUGADORES` (en `js/data-players.js`), siguiendo el mismo formato.
- **Colores de equipos**: arreglo `colores` dentro de `registrarEquipos()` en `js/state.js`.
