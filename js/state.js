// Estado global del torneo. Se guarda en sessionStorage (se mantiene mientras la pestaña/app esté abierta).
const Estado = (() => {
  const CLAVE = "diaDelPadreFutbol_estado_v1";

  function vacio() {
    return {
      equipos: [], // { id, nombre, color, puntos }
      jugadoresUsados: [], // nombres de jugadores ya usados en "Adivina el Jugador"
      preguntasUsadas: [], // índices de preguntas ya usadas en trivia
      historial: [], // log de eventos para depurar/mostrar
    };
  }

  let data = cargar();

  function cargar() {
    try {
      const raw = sessionStorage.getItem(CLAVE);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignorar */ }
    return vacio();
  }

  function guardar() {
    try {
      sessionStorage.setItem(CLAVE, JSON.stringify(data));
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
    guardar();
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
    marcarPreguntaUsada,
    preguntasUsadas,
    marcarJugadorUsado,
    jugadoresUsados,
    obtenerHistorial,
    hayEquipos,
  };
})();
