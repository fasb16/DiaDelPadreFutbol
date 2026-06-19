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

  // -------------------- Toasts de puntos --------------------
  function mostrarToast(equipo, puntos) {
    const cont = document.getElementById("toast-container");
    const div = document.createElement("div");
    div.className = "toast";
    div.style.borderLeftColor = equipo.color;
    div.textContent = `+${puntos} pts · ${equipo.nombre}`;
    cont.appendChild(div);
    setTimeout(() => div.remove(), 2000);
  }

  // -------------------- Badge de turno con color de equipo --------------------
  function crearBadgeEquipo(equipo, emoji = "") {
    const span = document.createElement("span");
    span.className = "turno-equipo";
    span.style.background = equipo.color;
    span.textContent = emoji ? `${emoji} ${equipo.nombre}` : equipo.nombre;
    return span;
  }

  // -------------------- Modo compacto (control desde celular) --------------------
  const CLAVE_MODO_COMPACTO = "diaDelPadreFutbol_modoCompacto";
  function aplicarModoCompacto(activo) {
    document.body.classList.toggle("modo-compacto", activo);
    document.getElementById("btn-modo-compacto").textContent =
      activo ? "🖥️ Modo normal" : "📱 Modo compacto";
  }
  document.getElementById("btn-modo-compacto").addEventListener("click", () => {
    const activo = !document.body.classList.contains("modo-compacto");
    Sonidos.click();
    aplicarModoCompacto(activo);
    try { localStorage.setItem(CLAVE_MODO_COMPACTO, activo ? "1" : "0"); } catch (e) { /* ignorar */ }
  });
  try { aplicarModoCompacto(localStorage.getItem(CLAVE_MODO_COMPACTO) === "1"); } catch (e) { /* ignorar */ }

  // -------------------- Deshacer última jugada --------------------
  document.getElementById("btn-deshacer").addEventListener("click", () => {
    const accion = Estado.ultimaAccion();
    if (!accion) {
      alert("No hay ninguna jugada para deshacer.");
      return;
    }
    const equipo = Estado.obtenerEquipo(accion.equipoId);
    const confirmado = confirm(
      `¿Deshacer la última jugada?\nSe restarán ${accion.puntos} pts a ${equipo.nombre} (${accion.razon}).`
    );
    if (!confirmado) return;
    Estado.deshacerUltima();
    Sonidos.click();
    renderMarcadorGlobal();
  });

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

  document.getElementById("btn-menu-mimica").addEventListener("click", () => {
    Sonidos.click();
    prepararSeleccionEquipoUnico("mimica-equipo");
    document.getElementById("mimica-seleccion").classList.remove("oculto");
    document.getElementById("mimica-espera").classList.add("oculto");
    document.getElementById("mimica-juego").classList.add("oculto");
    document.getElementById("mimica-final").classList.add("oculto");
    mostrarPantalla("pantalla-mimica");
  });

  document.getElementById("btn-menu-tabla").addEventListener("click", () => {
    Sonidos.click();
    renderTablaPosiciones();
    mostrarPantalla("pantalla-tabla");
  });

  document.getElementById("btn-menu-historial").addEventListener("click", () => {
    Sonidos.click();
    renderHistorial();
    mostrarPantalla("pantalla-historial");
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

  function prepararSeleccionEquipoUnico(idSelect) {
    const equipos = Estado.obtenerEquipos();
    const sel = document.getElementById(idSelect);
    sel.innerHTML = "";
    equipos.forEach((eq) => sel.add(new Option(eq.nombre, eq.id)));
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
  botonVolverMenu("btn-mimica-cancelar");
  botonVolverMenu("btn-mimica-volver");
  botonVolverMenu("btn-tabla-volver");
  botonVolverMenu("btn-historial-volver");
  botonVolverMenu("btn-ganador-volver");

  document.getElementById("btn-jugador-cancelar").addEventListener("click", () => {
    jugadorActual = null;
    difundirEstadoAdmin();
  });

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

    const turnoDiv = document.getElementById("trivia-turno");
    turnoDiv.innerHTML = "";
    turnoDiv.append("🎯 Turno de: ", crearBadgeEquipo(equipoTurno));
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
      mostrarToast(equipo, PUNTOS_TRIVIA);
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
  const TOTAL_RONDAS_PENAL = 5;

  document.getElementById("btn-iniciar-penales").addEventListener("click", () => {
    const idA = parseInt(document.getElementById("penales-equipo-a").value, 10);
    const idB = parseInt(document.getElementById("penales-equipo-b").value, 10);
    if (idA === idB) {
      alert("Selecciona dos equipos diferentes.");
      return;
    }
    // Sorteo: quién dispara primero se decide al azar, y ese orden se mantiene toda la tanda (como en un shootout real).
    const primero = Math.random() < 0.5 ? idA : idB;
    const segundo = primero === idA ? idB : idA;
    penalesRonda = {
      primero,
      segundo,
      ronda: 0,
      turno: "primero", // "primero" o "segundo": quién dispara en este sub-turno
      fase: "disparo", // "disparo" o "atajada"
      zonaDisparo: null,
      resultados: { primero: [], segundo: [] }, // 'gol' | 'atajada'
    };
    document.getElementById("penales-seleccion").classList.add("oculto");
    document.getElementById("penales-juego").classList.remove("oculto");
    document.getElementById("penales-final").classList.add("oculto");
    renderTablaPenales();
    iniciarTiroPenal();
  });

  function renderTablaPenales() {
    const equipoPrimero = Estado.obtenerEquipo(penalesRonda.primero);
    const equipoSegundo = Estado.obtenerEquipo(penalesRonda.segundo);
    const tbody = document.querySelector("#tabla-penales tbody");
    const filaHtml = (equipo, resultados) => {
      let celdas = "";
      for (let i = 0; i < TOTAL_RONDAS_PENAL; i++) {
        const r = resultados[i];
        let claseCelda = "celda-vacia";
        let contenido = "";
        if (r === "gol") {
          claseCelda = "celda-gol";
          contenido = "●";
        } else if (r === "atajada") {
          claseCelda = "celda-atajada";
          contenido = "✕";
        }
        celdas += `<td class="celda-penal ${claseCelda}"><span>${contenido}</span></td>`;
      }
      return `<tr><th class="nombre-equipo-penal">${equipo.nombre}</th>${celdas}</tr>`;
    };
    tbody.innerHTML =
      filaHtml(equipoPrimero, penalesRonda.resultados.primero) +
      filaHtml(equipoSegundo, penalesRonda.resultados.segundo);
  }

  function tiradorActual() {
    return penalesRonda.turno === "primero" ? penalesRonda.primero : penalesRonda.segundo;
  }

  function porteroActual() {
    return penalesRonda.turno === "primero" ? penalesRonda.segundo : penalesRonda.primero;
  }

  function iniciarTiroPenal() {
    document.getElementById("penales-resultado").textContent = "";
    document.getElementById("resultado-sello").className = "resultado-sello oculto";
    penalesRonda.fase = "disparo";
    penalesRonda.zonaDisparo = null;

    const tirador = Estado.obtenerEquipo(tiradorActual());
    const portero = Estado.obtenerEquipo(porteroActual());
    const turnoDiv = document.getElementById("penales-turno");
    turnoDiv.innerHTML = "";
    turnoDiv.append(
      crearBadgeEquipo(tirador, "⚽"),
      " dispara — ",
      crearBadgeEquipo(portero, "🧤"),
      " defiende"
    );
    document.getElementById("penales-contador").textContent = `Penal ${penalesRonda.ronda + 1} de ${TOTAL_RONDAS_PENAL}`;
    document.getElementById("instrucciones-penal").textContent = "⚽ El equipo atacante elige dónde disparar:";

    const balon = document.getElementById("balon-anim");
    const porteroEl = document.getElementById("portero-anim");
    balon.className = "balon-anim";
    porteroEl.className = "portero-anim";
    habilitarZonas(true);
  }

  function habilitarZonas(habilitar) {
    document.querySelectorAll("#porteria-penal .zona").forEach((z) => (z.disabled = !habilitar));
  }

  document.querySelectorAll("#porteria-penal .zona").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (penalesRonda.fase === "disparo") {
        Sonidos.click();
        penalesRonda.zonaDisparo = btn.dataset.zona;
        penalesRonda.fase = "atajada";
        document.getElementById("instrucciones-penal").textContent = "🧤 El equipo portero elige dónde atajar:";
      } else if (penalesRonda.fase === "atajada") {
        habilitarZonas(false);
        resolverTiroPenal(btn.dataset.zona);
      }
    });
  });

  function resolverTiroPenal(zonaAtajada) {
    const turno = penalesRonda.turno;
    const tirador = Estado.obtenerEquipo(tiradorActual());
    const portero = Estado.obtenerEquipo(porteroActual());
    const esGol = zonaAtajada !== penalesRonda.zonaDisparo;
    const resultadoDiv = document.getElementById("penales-resultado");

    const balon = document.getElementById("balon-anim");
    const porteroEl = document.getElementById("portero-anim");
    const sello = document.getElementById("resultado-sello");
    balon.className = `balon-anim disparo-${penalesRonda.zonaDisparo}`;
    porteroEl.className = `portero-anim atajada-${zonaAtajada}`;

    setTimeout(() => {
      penalesRonda.resultados[turno].push(esGol ? "gol" : "atajada");
      renderTablaPenales();

      const flash = document.getElementById("flash-pantalla");
      const escenario = document.getElementById("escenario-penal");
      if (esGol) {
        balon.classList.add("balon-gol");
        sello.textContent = "¡GOOOL!";
        sello.className = "resultado-sello sello-gol";
        Estado.sumarPuntos(tiradorActual(), PUNTOS_PENAL, "Penales de la Suerte");
        resultadoDiv.textContent = `⚽🎉 ¡GOOOL de ${tirador.nombre}!`;
        mostrarToast(tirador, PUNTOS_PENAL);
        flash.className = "flash-pantalla flash-gol";
        escenario.classList.add("shake");
        Sonidos.gol();
      } else {
        balon.classList.add("balon-atajado");
        sello.textContent = "¡ATAJADA!";
        sello.className = "resultado-sello sello-atajada";
        resultadoDiv.textContent = `🧤 ¡ATAJADA de ${portero.nombre}!`;
        flash.className = "flash-pantalla flash-atajada";
        Sonidos.atajada();
      }
      setTimeout(() => {
        flash.className = "flash-pantalla";
        escenario.classList.remove("shake");
      }, 500);
      renderMarcadorGlobal();
    }, 550);

    setTimeout(() => {
      avanzarTurnoPenal();
    }, esGol ? 2600 : 2200);
  }

  function avanzarTurnoPenal() {
    if (penalesRonda.turno === "primero") {
      penalesRonda.turno = "segundo";
    } else {
      penalesRonda.turno = "primero";
      penalesRonda.ronda++;
    }
    if (penalesRonda.ronda >= TOTAL_RONDAS_PENAL) {
      finalizarPenales();
    } else {
      iniciarTiroPenal();
    }
  }

  function finalizarPenales() {
    document.getElementById("penales-juego").classList.add("oculto");
    document.getElementById("penales-final").classList.remove("oculto");
    const eq1 = Estado.obtenerEquipo(penalesRonda.primero);
    const eq2 = Estado.obtenerEquipo(penalesRonda.segundo);
    const goles1 = penalesRonda.resultados.primero.filter((r) => r === "gol").length;
    const goles2 = penalesRonda.resultados.segundo.filter((r) => r === "gol").length;
    document.getElementById("penales-resumen").textContent =
      `${eq1.nombre} anotó ${goles1} de ${TOTAL_RONDAS_PENAL} penales. ${eq2.nombre} anotó ${goles2} de ${TOTAL_RONDAS_PENAL} penales.`;
  }

  // ==================== JUEGO 3: ADIVINA EL JUGADOR ====================
  let jugadorActual = null;
  let pistasMostradas = 0;
  const CLAVE_ADMIN = "diaDelPadreFutbol_adminJugador_v1";

  function difundirEstadoAdmin(extra) {
    try {
      const payload = jugadorActual
        ? { nombre: jugadorActual.nombre, pistas: jugadorActual.pistas, pistasMostradas, ...extra }
        : { nombre: null };
      localStorage.setItem(CLAVE_ADMIN, JSON.stringify({ ...payload, ts: Date.now() }));
    } catch (e) { /* ignorar si localStorage no está disponible (ej. file:// en algunos navegadores) */ }
  }

  document.getElementById("btn-iniciar-jugador").addEventListener("click", () => {
    iniciarNuevoJugador();
  });

  document.querySelectorAll(".btn-abrir-admin").forEach((btn) => {
    btn.addEventListener("click", () => {
      window.open("admin.html", "vistaAdminTorneo", "width=480,height=520");
    });
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
    difundirEstadoAdmin();
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
      difundirEstadoAdmin();
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
    mostrarToast(equipo, puntos);
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

  // ==================== JUEGO 4: MÍMICA DE ACCIONES ====================
  const DURACION_MIMICA = 4 * 60; // 4 minutos por equipo
  const PUNTOS_MIMICA = 10; // puntos por cada palabra adivinada
  const CLAVE_ADMIN_MIMICA = "diaDelPadreFutbol_adminMimica_v1";

  let mimicaActual = null; // { equipoId, palabra }
  let mimicaSegundosRestantes = DURACION_MIMICA;
  let mimicaIntervalo = null;
  let mimicaAciertos = 0;
  let mimicaPausado = false;

  function difundirEstadoAdminMimica() {
    try {
      const payload = mimicaActual ? { palabra: mimicaActual.palabra } : { palabra: null };
      localStorage.setItem(CLAVE_ADMIN_MIMICA, JSON.stringify({ ...payload, ts: Date.now() }));
    } catch (e) { /* ignorar si localStorage no está disponible */ }
  }

  function obtenerPalabraMimicaAleatoria() {
    const usadas = new Set(Estado.palabrasMimicaUsadas());
    let disponibles = BANCO_MIMICA.filter((p) => !usadas.has(p));
    if (disponibles.length === 0) disponibles = BANCO_MIMICA;
    return disponibles[Math.floor(Math.random() * disponibles.length)];
  }

  function asignarNuevaPalabraMimica(equipoId) {
    mimicaActual = { equipoId, palabra: obtenerPalabraMimicaAleatoria() };
    difundirEstadoAdminMimica();
  }

  document.getElementById("btn-asignar-palabra").addEventListener("click", () => {
    const equipoId = parseInt(document.getElementById("mimica-equipo").value, 10);
    const equipo = Estado.obtenerEquipo(equipoId);
    asignarNuevaPalabraMimica(equipoId);

    const turnoDiv = document.getElementById("mimica-turno");
    turnoDiv.innerHTML = "";
    turnoDiv.append("🎭 Actúa: ", crearBadgeEquipo(equipo));
    document.getElementById("mimica-seleccion").classList.add("oculto");
    document.getElementById("mimica-espera").classList.remove("oculto");
  });

  document.getElementById("btn-iniciar-cronometro").addEventListener("click", () => {
    const equipo = Estado.obtenerEquipo(mimicaActual.equipoId);
    mimicaAciertos = 0;
    mimicaPausado = false;
    const turnoDiv2 = document.getElementById("mimica-turno-2");
    turnoDiv2.innerHTML = "";
    turnoDiv2.append("🎭 Actúa: ", crearBadgeEquipo(equipo));
    document.getElementById("mimica-espera").classList.add("oculto");
    document.getElementById("mimica-juego").classList.remove("oculto");
    document.getElementById("mimica-resultado").textContent = "";
    document.getElementById("mimica-contador-aciertos").textContent = "Palabras adivinadas: 0";
    document.getElementById("btn-mimica-acerto").disabled = false;
    document.getElementById("btn-mimica-pasar").disabled = false;
    document.getElementById("btn-mimica-pausar").disabled = false;
    document.getElementById("btn-mimica-pausar").textContent = "⏸️ Pausar";
    iniciarCronometroMimica();
  });

  function iniciarCronometroMimica() {
    mimicaSegundosRestantes = DURACION_MIMICA;
    actualizarVisualCronometro();
    arrancarIntervaloMimica();
  }

  function arrancarIntervaloMimica() {
    mimicaIntervalo = setInterval(() => {
      mimicaSegundosRestantes--;
      actualizarVisualCronometro();
      if (mimicaSegundosRestantes <= 5 && mimicaSegundosRestantes > 0) {
        Sonidos.tic();
      }
      if (mimicaSegundosRestantes <= 0) {
        terminarRondaMimicaPorTiempo();
      }
    }, 1000);
  }

  document.getElementById("btn-mimica-pausar").addEventListener("click", () => {
    const btn = document.getElementById("btn-mimica-pausar");
    mimicaPausado = !mimicaPausado;
    Sonidos.click();
    if (mimicaPausado) {
      detenerCronometroMimica();
      btn.textContent = "▶️ Reanudar";
      document.getElementById("btn-mimica-acerto").disabled = true;
      document.getElementById("btn-mimica-pasar").disabled = true;
    } else {
      btn.textContent = "⏸️ Pausar";
      document.getElementById("btn-mimica-acerto").disabled = false;
      document.getElementById("btn-mimica-pasar").disabled = false;
      arrancarIntervaloMimica();
    }
  });

  function detenerCronometroMimica() {
    if (mimicaIntervalo) {
      clearInterval(mimicaIntervalo);
      mimicaIntervalo = null;
    }
  }

  function actualizarVisualCronometro() {
    const cronoDiv = document.getElementById("mimica-cronometro");
    const minutos = Math.floor(mimicaSegundosRestantes / 60);
    const segundos = mimicaSegundosRestantes % 60;
    cronoDiv.textContent = `${minutos}:${segundos.toString().padStart(2, "0")}`;
    cronoDiv.classList.toggle("urgente", mimicaSegundosRestantes <= 15);
  }

  document.getElementById("btn-mimica-acerto").addEventListener("click", () => {
    const equipo = Estado.obtenerEquipo(mimicaActual.equipoId);
    Estado.sumarPuntos(mimicaActual.equipoId, PUNTOS_MIMICA, "Mímica de Acciones");
    Estado.marcarPalabraMimicaUsada(mimicaActual.palabra);
    mimicaAciertos++;
    renderMarcadorGlobal();
    mostrarToast(equipo, PUNTOS_MIMICA);
    Sonidos.correcto();
    document.getElementById("mimica-contador-aciertos").textContent = `Palabras adivinadas: ${mimicaAciertos}`;
    document.getElementById("mimica-resultado").textContent =
      `✅ ¡${equipo.nombre} adivinó "${mimicaActual.palabra}"! +${PUNTOS_MIMICA} puntos.`;
    asignarNuevaPalabraMimica(mimicaActual.equipoId);
  });

  document.getElementById("btn-mimica-pasar").addEventListener("click", () => {
    Estado.marcarPalabraMimicaUsada(mimicaActual.palabra);
    Sonidos.click();
    document.getElementById("mimica-resultado").textContent = `⏭️ Palabra pasada: "${mimicaActual.palabra}". ¡Sigan intentando!`;
    asignarNuevaPalabraMimica(mimicaActual.equipoId);
  });

  function terminarRondaMimicaPorTiempo() {
    detenerCronometroMimica();
    Sonidos.finCronometro();
    document.getElementById("btn-mimica-acerto").disabled = true;
    document.getElementById("btn-mimica-pasar").disabled = true;
    document.getElementById("btn-mimica-pausar").disabled = true;
    const equipo = Estado.obtenerEquipo(mimicaActual.equipoId);
    const puntosGanados = mimicaAciertos * PUNTOS_MIMICA;
    mimicaActual = null;
    difundirEstadoAdminMimica();
    document.getElementById("mimica-juego").classList.add("oculto");
    document.getElementById("mimica-final").classList.remove("oculto");
    document.getElementById("mimica-final-titulo").textContent = "🎉 ¡Tiempo terminado! 🎉";
    document.getElementById("mimica-final-resumen").textContent =
      `${equipo.nombre} adivinó ${mimicaAciertos} palabra(s) y ganó ${puntosGanados} puntos en total.`;
  }

  document.getElementById("btn-mimica-cancelar").addEventListener("click", () => {
    detenerCronometroMimica();
    mimicaPausado = false;
    mimicaActual = null;
    difundirEstadoAdminMimica();
  });

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

  // ==================== HISTORIAL DE JUGADAS ====================
  function renderHistorial() {
    const cont = document.getElementById("historial-lista");
    cont.innerHTML = "";
    const historial = Estado.obtenerHistorial();
    if (historial.length === 0) {
      const p = document.createElement("p");
      p.className = "instrucciones";
      p.textContent = "Aún no hay jugadas registradas.";
      cont.appendChild(p);
      return;
    }
    [...historial].reverse().forEach((linea) => {
      const div = document.createElement("div");
      div.className = "historial-item";
      div.textContent = linea;
      cont.appendChild(div);
    });
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

  document.getElementById("btn-imprimir-resultados").addEventListener("click", () => {
    window.print();
  });

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
