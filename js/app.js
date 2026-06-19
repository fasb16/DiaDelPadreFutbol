// Lógica principal de la aplicación - Día del Padre: Torneo Futbolero
document.addEventListener("DOMContentLoaded", () => {

  const PUNTOS_TRIVIA = 10;
  const PUNTOS_PENAL = 10;
  const PUNTOS_JUGADOR = [50, 40, 30, 20, 10]; // según cantidad de pistas mostradas (1..5)
  const PREGUNTAS_POR_RONDA = 8;

  // -------------------- Navegación --------------------
  function mostrarPantalla(id) {
    document.querySelectorAll(".pantalla").forEach((p) => p.classList.remove("activa"));
    document.getElementById(id).classList.add("activa");
    const marcador = document.getElementById("marcador-global");
    if (id === "pantalla-inicio" || id === "pantalla-registro") {
      marcador.classList.add("oculto");
    } else {
      marcador.classList.remove("oculto");
      renderMarcadorGlobal();
    }
    window.scrollTo(0, 0);
  }

  function renderMarcadorGlobal() {
    const cont = document.getElementById("marcador-lista");
    cont.innerHTML = "";
    Estado.obtenerEquipos().forEach((eq) => {
      const div = document.createElement("div");
      div.className = "marcador-item";
      div.style.borderLeftColor = eq.color;
      div.textContent = `${eq.nombre}: ${eq.puntos} pts`;
      cont.appendChild(div);
    });
  }

  // -------------------- Pantalla Inicio --------------------
  document.getElementById("btn-ir-registro").addEventListener("click", () => {
    Sonidos.click();
    iniciarFormularioRegistro();
    mostrarPantalla("pantalla-registro");
  });

  // -------------------- Registro de equipos --------------------
  function iniciarFormularioRegistro() {
    const cont = document.getElementById("lista-equipos-form");
    cont.innerHTML = "";
    const existentes = Estado.obtenerEquipos();
    const cantidadInicial = existentes.length >= 2 ? existentes.length : 2;
    for (let i = 0; i < cantidadInicial; i++) {
      agregarFilaEquipo(existentes[i] ? existentes[i].nombre : "");
    }
    document.getElementById("error-registro").textContent = "";
  }

  function agregarFilaEquipo(valorInicial = "") {
    const cont = document.getElementById("lista-equipos-form");
    const fila = document.createElement("div");
    fila.className = "fila-equipo";
    const numero = cont.children.length + 1;
    fila.innerHTML = `
      <input type="text" class="input-nombre-equipo" placeholder="Nombre del Equipo ${numero}" value="${valorInicial}" maxlength="30">
      <button type="button" class="btn-quitar" title="Quitar equipo">✕</button>
    `;
    fila.querySelector(".btn-quitar").addEventListener("click", () => {
      if (cont.children.length > 2) {
        fila.remove();
        actualizarPlaceholders();
      }
    });
    cont.appendChild(fila);
  }

  function actualizarPlaceholders() {
    const filas = document.querySelectorAll("#lista-equipos-form .fila-equipo");
    filas.forEach((fila, i) => {
      const input = fila.querySelector("input");
      if (!input.value) input.placeholder = `Nombre del Equipo ${i + 1}`;
    });
  }

  document.getElementById("btn-agregar-equipo").addEventListener("click", () => {
    Sonidos.click();
    agregarFilaEquipo();
  });

  document.getElementById("btn-guardar-equipos").addEventListener("click", () => {
    const inputs = document.querySelectorAll("#lista-equipos-form .input-nombre-equipo");
    const nombres = Array.from(inputs).map((i) => i.value.trim()).filter((n) => n.length > 0);
    const error = document.getElementById("error-registro");
    if (nombres.length < 2) {
      error.textContent = "Debes registrar al menos 2 equipos.";
      return;
    }
    const unicos = new Set(nombres.map((n) => n.toLowerCase()));
    if (unicos.size !== nombres.length) {
      error.textContent = "Los nombres de los equipos deben ser distintos.";
      return;
    }
    error.textContent = "";
    Estado.registrarEquipos(nombres);
    Sonidos.correcto();
    mostrarPantalla("pantalla-menu");
  });

  // -------------------- Menú principal --------------------
  document.getElementById("btn-menu-trivia").addEventListener("click", () => {
    Sonidos.click();
    prepararSeleccionEquipos("trivia-equipo-a", "trivia-equipo-b");
    document.getElementById("trivia-seleccion").classList.remove("oculto");
    document.getElementById("trivia-juego").classList.add("oculto");
    document.getElementById("trivia-final").classList.add("oculto");
    mostrarPantalla("pantalla-trivia");
  });

  document.getElementById("btn-menu-penales").addEventListener("click", () => {
    Sonidos.click();
    prepararSeleccionEquipos("penales-equipo-a", "penales-equipo-b");
    document.getElementById("penales-seleccion").classList.remove("oculto");
    document.getElementById("penales-juego").classList.add("oculto");
    document.getElementById("penales-final").classList.add("oculto");
    mostrarPantalla("pantalla-penales");
  });

  document.getElementById("btn-menu-jugador").addEventListener("click", () => {
    Sonidos.click();
    document.getElementById("jugador-inicio").classList.remove("oculto");
    document.getElementById("jugador-juego").classList.add("oculto");
    mostrarPantalla("pantalla-jugador");
  });

  document.getElementById("btn-menu-tabla").addEventListener("click", () => {
    Sonidos.click();
    renderTablaPosiciones();
    mostrarPantalla("pantalla-tabla");
  });

  document.getElementById("btn-finalizar-torneo").addEventListener("click", () => {
    mostrarPantallaGanador();
  });

  document.getElementById("btn-reiniciar-torneo").addEventListener("click", () => {
    confirmarReinicio();
  });
  document.getElementById("btn-ganador-reiniciar").addEventListener("click", () => {
    confirmarReinicio();
  });

  function confirmarReinicio() {
    if (confirm("¿Seguro que deseas reiniciar el torneo? Se borrarán todos los puntajes.")) {
      Estado.reiniciarTodo();
      mostrarPantalla("pantalla-inicio");
    }
  }

  function prepararSeleccionEquipos(idSelectA, idSelectB) {
    const equipos = Estado.obtenerEquipos();
    const selA = document.getElementById(idSelectA);
    const selB = document.getElementById(idSelectB);
    selA.innerHTML = "";
    selB.innerHTML = "";
    equipos.forEach((eq) => {
      selA.add(new Option(eq.nombre, eq.id));
      selB.add(new Option(eq.nombre, eq.id));
    });
    if (equipos.length > 1) selB.selectedIndex = 1;
  }

  function botonVolverMenu(idBoton) {
    document.getElementById(idBoton).addEventListener("click", () => {
      Sonidos.click();
      mostrarPantalla("pantalla-menu");
    });
  }
  botonVolverMenu("btn-trivia-cancelar");
  botonVolverMenu("btn-trivia-volver");
  botonVolverMenu("btn-penales-cancelar");
  botonVolverMenu("btn-penales-volver");
  botonVolverMenu("btn-jugador-cancelar");
  botonVolverMenu("btn-tabla-volver");
  botonVolverMenu("btn-ganador-volver");

  // ==================== JUEGO 1: TRIVIA MUNDIALISTA ====================
  let triviaRonda = null;

  function obtenerPreguntasAleatorias(cantidad) {
    const usadas = new Set(Estado.preguntasUsadas());
    let disponibles = BANCO_TRIVIA.map((_, idx) => idx).filter((idx) => !usadas.has(idx));
    if (disponibles.length < cantidad) {
      // Si se agotó el banco, se reutilizan todas las preguntas de nuevo.
      disponibles = BANCO_TRIVIA.map((_, idx) => idx);
    }
    const elegidas = [];
    while (elegidas.length < cantidad && disponibles.length > 0) {
      const i = Math.floor(Math.random() * disponibles.length);
      elegidas.push(disponibles.splice(i, 1)[0]);
    }
    return elegidas;
  }

  document.getElementById("btn-iniciar-trivia").addEventListener("click", () => {
    const idA = parseInt(document.getElementById("trivia-equipo-a").value, 10);
    const idB = parseInt(document.getElementById("trivia-equipo-b").value, 10);
    if (idA === idB) {
      alert("Selecciona dos equipos diferentes.");
      return;
    }
    triviaRonda = {
      equipoA: idA,
      equipoB: idB,
      preguntas: obtenerPreguntasAleatorias(PREGUNTAS_POR_RONDA),
      indice: 0,
      puntosRonda: { [idA]: 0, [idB]: 0 },
    };
    document.getElementById("trivia-seleccion").classList.add("oculto");
    document.getElementById("trivia-juego").classList.remove("oculto");
    mostrarPreguntaTrivia();
  });

  function equipoTurnoTrivia() {
    return triviaRonda.indice % 2 === 0 ? triviaRonda.equipoA : triviaRonda.equipoB;
  }

  function mostrarPreguntaTrivia() {
    document.getElementById("trivia-resultado").textContent = "";
    const idxPregunta = triviaRonda.preguntas[triviaRonda.indice];
    const pregunta = BANCO_TRIVIA[idxPregunta];
    const equipoTurno = Estado.obtenerEquipo(equipoTurnoTrivia());

    document.getElementById("trivia-turno").textContent = `🎯 Turno de: ${equipoTurno.nombre}`;
    document.getElementById("trivia-contador").textContent =
      `Pregunta ${triviaRonda.indice + 1} de ${triviaRonda.preguntas.length}`;
    document.getElementById("trivia-pregunta").textContent = pregunta.pregunta;

    const cont = document.getElementById("trivia-opciones");
    cont.innerHTML = "";
    pregunta.opciones.forEach((op, i) => {
      const btn = document.createElement("button");
      btn.className = "opcion-btn";
      btn.textContent = op;
      btn.addEventListener("click", () => responderTrivia(i, pregunta, idxPregunta, btn));
      cont.appendChild(btn);
    });
  }

  function responderTrivia(seleccion, pregunta, idxPregunta, btnClickeado) {
    document.querySelectorAll("#trivia-opciones .opcion-btn").forEach((b) => (b.disabled = true));
    const equipoId = equipoTurnoTrivia();
    const equipo = Estado.obtenerEquipo(equipoId);
    const correcta = seleccion === pregunta.correcta;

    if (correcta) {
      btnClickeado.classList.add("correcta");
      Estado.sumarPuntos(equipoId, PUNTOS_TRIVIA, "Trivia Mundialista");
      triviaRonda.puntosRonda[equipoId] += PUNTOS_TRIVIA;
      document.getElementById("trivia-resultado").textContent = `✅ ¡Correcto! ${equipo.nombre} suma ${PUNTOS_TRIVIA} puntos.`;
      Sonidos.correcto();
    } else {
      btnClickeado.classList.add("incorrecta");
      document.querySelectorAll("#trivia-opciones .opcion-btn")[pregunta.correcta].classList.add("correcta");
      document.getElementById("trivia-resultado").textContent = `❌ Incorrecto. La respuesta era: "${pregunta.opciones[pregunta.correcta]}"`;
      Sonidos.incorrecto();
    }
    renderMarcadorGlobal();
    Estado.marcarPreguntaUsada(idxPregunta);

    setTimeout(() => {
      triviaRonda.indice++;
      if (triviaRonda.indice >= triviaRonda.preguntas.length) {
        finalizarRondaTrivia();
      } else {
        mostrarPreguntaTrivia();
      }
    }, 1600);
  }

  function finalizarRondaTrivia() {
    document.getElementById("trivia-juego").classList.add("oculto");
    document.getElementById("trivia-final").classList.remove("oculto");
    const eqA = Estado.obtenerEquipo(triviaRonda.equipoA);
    const eqB = Estado.obtenerEquipo(triviaRonda.equipoB);
    const ptsA = triviaRonda.puntosRonda[triviaRonda.equipoA];
    const ptsB = triviaRonda.puntosRonda[triviaRonda.equipoB];
    document.getElementById("trivia-resumen").textContent =
      `${eqA.nombre} ganó ${ptsA} puntos en esta ronda. ${eqB.nombre} ganó ${ptsB} puntos en esta ronda.`;
  }

  // ==================== JUEGO 2: PENALES DE LA SUERTE ====================
  let penalesRonda = null;
  const ZONAS = ["arriba-izquierda", "centro", "arriba-derecha", "abajo-izquierda", "abajo-derecha"];

  document.getElementById("btn-iniciar-penales").addEventListener("click", () => {
    const idA = parseInt(document.getElementById("penales-equipo-a").value, 10);
    const idB = parseInt(document.getElementById("penales-equipo-b").value, 10);
    if (idA === idB) {
      alert("Selecciona dos equipos diferentes.");
      return;
    }
    penalesRonda = {
      // fases: primero A dispara y B ataja (5 tiros), luego B dispara y A ataja (5 tiros)
      fases: [
        { tirador: idA, portero: idB, tiro: 0, goles: 0 },
        { tirador: idB, portero: idA, tiro: 0, goles: 0 },
      ],
      faseActual: 0,
      zonaDisparo: null,
    };
    document.getElementById("penales-seleccion").classList.add("oculto");
    document.getElementById("penales-juego").classList.remove("oculto");
    document.getElementById("penales-final").classList.add("oculto");
    iniciarTiroPenal();
  });

  function faseActualPenal() {
    return penalesRonda.fases[penalesRonda.faseActual];
  }

  function iniciarTiroPenal() {
    document.getElementById("penales-resultado").textContent = "";
    const fase = faseActualPenal();
    const tirador = Estado.obtenerEquipo(fase.tirador);
    const portero = Estado.obtenerEquipo(fase.portero);
    document.getElementById("penales-turno").textContent = `⚽ ${tirador.nombre} dispara — 🧤 ${portero.nombre} defiende`;
    document.getElementById("penales-contador").textContent = `Tiro ${fase.tiro + 1} de 5`;
    document.getElementById("penales-fase-disparo").classList.remove("oculto");
    document.getElementById("penales-fase-atajada").classList.add("oculto");
    habilitarZonas("penales-fase-disparo", true);
    habilitarZonas("penales-fase-atajada", true);
  }

  function habilitarZonas(idContenedor, habilitar) {
    document.querySelectorAll(`#${idContenedor} .zona`).forEach((z) => (z.disabled = !habilitar));
  }

  document.querySelectorAll("#penales-fase-disparo .zona").forEach((btn) => {
    btn.addEventListener("click", () => {
      Sonidos.click();
      penalesRonda.zonaDisparo = btn.dataset.zona;
      habilitarZonas("penales-fase-disparo", false);
      document.getElementById("penales-fase-disparo").classList.add("oculto");
      document.getElementById("penales-fase-atajada").classList.remove("oculto");
    });
  });

  document.querySelectorAll("#penales-fase-atajada .zona").forEach((btn) => {
    btn.addEventListener("click", () => {
      habilitarZonas("penales-fase-atajada", false);
      resolverTiroPenal(btn.dataset.zona);
    });
  });

  function resolverTiroPenal(zonaAtajada) {
    const fase = faseActualPenal();
    const tirador = Estado.obtenerEquipo(fase.tirador);
    const portero = Estado.obtenerEquipo(fase.portero);
    const esGol = zonaAtajada !== penalesRonda.zonaDisparo;
    const resultadoDiv = document.getElementById("penales-resultado");

    if (esGol) {
      fase.goles++;
      Estado.sumarPuntos(fase.tirador, PUNTOS_PENAL, "Penales de la Suerte");
      resultadoDiv.textContent = `⚽🎉 ¡GOOOL de ${tirador.nombre}!`;
      Sonidos.gol();
    } else {
      resultadoDiv.textContent = `🧤 ¡ATAJADA de ${portero.nombre}!`;
      Sonidos.atajada();
    }
    renderMarcadorGlobal();
    fase.tiro++;

    setTimeout(() => {
      if (fase.tiro >= 5) {
        penalesRonda.faseActual++;
        if (penalesRonda.faseActual >= penalesRonda.fases.length) {
          finalizarPenales();
        } else {
          iniciarTiroPenal();
        }
      } else {
        iniciarTiroPenal();
      }
    }, esGol ? 2200 : 1800);
  }

  function finalizarPenales() {
    document.getElementById("penales-juego").classList.add("oculto");
    document.getElementById("penales-final").classList.remove("oculto");
    const [fase1, fase2] = penalesRonda.fases;
    const eq1 = Estado.obtenerEquipo(fase1.tirador);
    const eq2 = Estado.obtenerEquipo(fase2.tirador);
    document.getElementById("penales-resumen").textContent =
      `${eq1.nombre} anotó ${fase1.goles} de 5 penales. ${eq2.nombre} anotó ${fase2.goles} de 5 penales.`;
  }

  // ==================== JUEGO 3: ADIVINA EL JUGADOR ====================
  let jugadorActual = null;
  let pistasMostradas = 0;

  document.getElementById("btn-iniciar-jugador").addEventListener("click", () => {
    iniciarNuevoJugador();
  });

  function obtenerJugadorAleatorio() {
    const usados = new Set(Estado.jugadoresUsados());
    let disponibles = BANCO_JUGADORES.filter((j) => !usados.has(j.nombre));
    if (disponibles.length === 0) disponibles = BANCO_JUGADORES;
    return disponibles[Math.floor(Math.random() * disponibles.length)];
  }

  function iniciarNuevoJugador() {
    jugadorActual = obtenerJugadorAleatorio();
    pistasMostradas = 1;
    document.getElementById("jugador-inicio").classList.add("oculto");
    document.getElementById("jugador-juego").classList.remove("oculto");
    document.getElementById("jugador-revelado").classList.add("oculto");
    document.getElementById("jugador-revelado").textContent = "";
    renderEquiposBotonJugador();
    renderPistas();
  }

  function renderPistas() {
    const cont = document.getElementById("jugador-pistas");
    cont.innerHTML = "";
    for (let i = 0; i < pistasMostradas; i++) {
      const div = document.createElement("div");
      div.className = "pista-item";
      div.textContent = `Pista ${i + 1}: ${jugadorActual.pistas[i]}`;
      cont.appendChild(div);
    }
    const puntosActuales = PUNTOS_JUGADOR[pistasMostradas - 1];
    document.getElementById("jugador-puntos-disponibles").textContent = `💰 Puntos en juego si adivinan ahora: ${puntosActuales}`;
    document.getElementById("btn-siguiente-pista").disabled = pistasMostradas >= jugadorActual.pistas.length;
    document.getElementById("btn-siguiente-pista").textContent =
      pistasMostradas >= jugadorActual.pistas.length ? "No hay más pistas" : "➡️ Mostrar siguiente pista";
  }

  document.getElementById("btn-siguiente-pista").addEventListener("click", () => {
    if (pistasMostradas < jugadorActual.pistas.length) {
      pistasMostradas++;
      Sonidos.click();
      renderPistas();
    }
  });

  function renderEquiposBotonJugador() {
    const cont = document.getElementById("jugador-botones-equipos");
    cont.innerHTML = "";
    Estado.obtenerEquipos().forEach((eq) => {
      const btn = document.createElement("button");
      btn.className = "btn-equipo-marcar";
      btn.style.background = eq.color;
      btn.textContent = eq.nombre;
      btn.addEventListener("click", () => acertarJugador(eq.id));
      cont.appendChild(btn);
    });
  }

  function acertarJugador(equipoId) {
    const equipo = Estado.obtenerEquipo(equipoId);
    const puntos = PUNTOS_JUGADOR[pistasMostradas - 1];
    Estado.sumarPuntos(equipoId, puntos, "Adivina el Jugador");
    Estado.marcarJugadorUsado(jugadorActual.nombre);
    renderMarcadorGlobal();
    Sonidos.correcto();
    mostrarRevelado(`✅ ¡${equipo.nombre} adivinó! Era ${jugadorActual.nombre}. Gana ${puntos} puntos.`);
  }

  document.getElementById("btn-nadie-adivino").addEventListener("click", () => {
    Estado.marcarJugadorUsado(jugadorActual.nombre);
    Sonidos.incorrecto();
    mostrarRevelado(`😅 Nadie adivinó. El jugador era: ${jugadorActual.nombre}.`);
  });

  function mostrarRevelado(mensaje) {
    const div = document.getElementById("jugador-revelado");
    div.classList.remove("oculto");
    div.textContent = mensaje;
    document.getElementById("btn-siguiente-pista").disabled = true;
    document.querySelectorAll("#jugador-botones-equipos .btn-equipo-marcar").forEach((b) => (b.disabled = true));
    document.getElementById("btn-nadie-adivino").disabled = true;

    setTimeout(() => {
      document.getElementById("btn-siguiente-pista").disabled = false;
      document.querySelectorAll("#jugador-botones-equipos .btn-equipo-marcar").forEach((b) => (b.disabled = false));
      document.getElementById("btn-nadie-adivino").disabled = false;
      iniciarNuevoJugador();
    }, 3200);
  }

  // ==================== TABLA DE POSICIONES ====================
  function renderTablaPosiciones() {
    const cont = document.getElementById("tabla-posiciones");
    cont.innerHTML = "";
    const equipos = [...Estado.obtenerEquipos()].sort((a, b) => b.puntos - a.puntos);
    equipos.forEach((eq, i) => {
      const fila = document.createElement("div");
      fila.className = "fila-tabla";
      fila.style.borderLeftColor = eq.color;
      fila.innerHTML = `
        <span class="posicion">${i + 1}°</span>
        <span class="nombre-equipo-tabla">${medallaPara(i)} ${eq.nombre}</span>
        <span class="puntos-equipo-tabla">${eq.puntos} pts</span>
      `;
      cont.appendChild(fila);
    });
  }

  function medallaPara(i) {
    return i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : "⚽";
  }

  // ==================== PANTALLA GANADOR ====================
  function mostrarPantallaGanador() {
    const equipos = [...Estado.obtenerEquipos()].sort((a, b) => b.puntos - a.puntos);
    if (equipos.length === 0) return;
    const maxPuntos = equipos[0].puntos;
    const ganadores = equipos.filter((e) => e.puntos === maxPuntos);

    const nombreGanador = ganadores.map((g) => g.nombre).join(" y ");
    document.getElementById("nombre-ganador").textContent = ganadores.length > 1 ? `¡Empate! ${nombreGanador}` : `🏅 ${nombreGanador} 🏅`;
    document.getElementById("puntos-ganador").textContent = `con ${maxPuntos} puntos`;

    const podio = document.getElementById("podio-completo");
    podio.innerHTML = "";
    equipos.forEach((eq, i) => {
      const div = document.createElement("div");
      div.className = "fila-tabla";
      div.style.borderLeftColor = eq.color;
      div.innerHTML = `<span class="posicion">${i + 1}°</span><span class="nombre-equipo-tabla">${medallaPara(i)} ${eq.nombre}</span><span class="puntos-equipo-tabla">${eq.puntos} pts</span>`;
      podio.appendChild(div);
    });

    generarConfeti();
    mostrarPantalla("pantalla-ganador");
    Sonidos.ganador();
  }

  function generarConfeti() {
    const cont = document.getElementById("confeti");
    cont.innerHTML = "";
    const colores = ["#e63946", "#f4b400", "#2a9d4a", "#1d3557", "#fff", "#ff8c42"];
    for (let i = 0; i < 80; i++) {
      const pieza = document.createElement("div");
      pieza.className = "pieza-confeti";
      pieza.style.left = Math.random() * 100 + "%";
      pieza.style.background = colores[Math.floor(Math.random() * colores.length)];
      pieza.style.animationDuration = 2 + Math.random() * 2.5 + "s";
      pieza.style.animationDelay = Math.random() * 1.5 + "s";
      cont.appendChild(pieza);
    }
  }

  // -------------------- Arranque --------------------
  if (Estado.hayEquipos()) {
    mostrarPantalla("pantalla-menu");
  } else {
    mostrarPantalla("pantalla-inicio");
  }
});
