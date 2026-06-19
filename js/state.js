// Estado global del torneo. Se guarda en localStorage para sobrevivir cierres accidentales
// de la pestaña/navegador durante el evento; "Reiniciar Torneo" es la única forma de borrarlo.
const Estado = (() => {
  const CLAVE = "diaDelPadreFutbol_estado_v1";

  function vacio() {
    return {
      equipos: [], // { id, nombre, color, puntos }
      jugadoresUsados: [], // nombres de jugadores ya usados en "Adivina el Jugador"
      preguntasUsadas: [], // índices de preguntas ya usadas en trivia
      palabrasMimicaUsadas: [], // palabras ya actuadas en "Mímica"
      historial: [], // log de eventos para depurar/mostrar
      acciones: [], // pila de jugadas con puntos, para poder deshacer la última
    };
  }

  let data = cargar();

  function cargar() {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) {
        const cargado = JSON.parse(raw);
        if (!cargado.acciones) cargado.acciones = [];
        return cargado;
      }
    } catch (e) { /* ignorar */ }
    return vacio();
  }

  function guardar() {
    try {
      localStorage.setItem(CLAVE, JSON.stringify(data));
    } catch (e) { /* ignorar */ }
  }

  function reiniciarTodo() {
    data = vacio();
    guardar();
  }

  function registrarEquipos(nombres) {
    const colores = ["#e63946", "#1d3557", "#2a9d8f", "#f4a900", "#6a4c93", "#e85d04"];
    data.equipos = nombres.map((nombre, i) => ({
      id: i + 1,
      nombre: nombre.trim(),
      color: colores[i % colores.length],
      puntos: 0,
    }));
    data.jugadoresUsados = [];
    data.preguntasUsadas = [];
    data.palabrasMimicaUsadas = [];
    data.historial = [];
    guardar();
  }

  function obtenerEquipos() {
    return data.equipos;
  }

  function obtenerEquipo(id) {
    return data.equipos.find((e) => e.id === id);
  }

  function sumarPuntos(id, puntos, razon) {
    const eq = obtenerEquipo(id);
    if (!eq) return;
    eq.puntos += puntos;
    data.historial.push(`${eq.nombre} +${puntos} pts (${razon})`);
    data.acciones.push({ equipoId: id, puntos, razon });
    guardar();
  }

  function ultimaAccion() {
    return data.acciones.length ? data.acciones[data.acciones.length - 1] : null;
  }

  // Solo revierte los puntos otorgados; no vuelve a poner en juego la pregunta/jugador/
  // palabra de esa jugada, ya que el uso esperado es corregir un clic equivocado al instante.
  function deshacerUltima() {
    const accion = data.acciones.pop();
    if (!accion) return null;
    const eq = obtenerEquipo(accion.equipoId);
    if (eq) eq.puntos -= accion.puntos;
    data.historial.pop();
    guardar();
    return accion;
  }

  function marcarPreguntaUsada(idx) {
    data.preguntasUsadas.push(idx);
    guardar();
  }

  function preguntasUsadas() {
    return data.preguntasUsadas;
  }

  function marcarJugadorUsado(nombre) {
    data.jugadoresUsados.push(nombre);
    guardar();
  }

  function jugadoresUsados() {
    return data.jugadoresUsados;
  }

  function marcarPalabraMimicaUsada(palabra) {
    data.palabrasMimicaUsadas.push(palabra);
    guardar();
  }

  function palabrasMimicaUsadas() {
    return data.palabrasMimicaUsadas;
  }

  function obtenerHistorial() {
    return data.historial;
  }

  function hayEquipos() {
    return data.equipos.length >= 2;
  }

  return {
    reiniciarTodo,
    registrarEquipos,
    obtenerEquipos,
    obtenerEquipo,
    sumarPuntos,
    ultimaAccion,
    deshacerUltima,
    marcarPreguntaUsada,
    preguntasUsadas,
    marcarJugadorUsado,
    jugadoresUsados,
    marcarPalabraMimicaUsada,
    palabrasMimicaUsadas,
    obtenerHistorial,
    hayEquipos,
  };
})();
