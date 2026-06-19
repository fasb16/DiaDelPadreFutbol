// Efectos de sonido sintetizados con Web Audio API (no requiere archivos externos ni internet)
const Sonidos = (() => {
  let ctx = null;
  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tono(freq, duracion, tipo = "sine", inicio = 0, volumen = 0.3) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    gain.gain.value = volumen;
    osc.connect(gain);
    gain.connect(c.destination);
    const t0 = c.currentTime + inicio;
    osc.start(t0);
    gain.gain.setValueAtTime(volumen, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + duracion);
    osc.stop(t0 + duracion);
  }

  function ruidoSilbato() {
    tono(1800, 0.18, "square", 0, 0.25);
    tono(1800, 0.18, "square", 0.22, 0.25);
  }

  function gol() {
    // Pequeño "fanfarreo" ascendente seguido de celebración
    const notas = [523, 659, 784, 1047];
    notas.forEach((f, i) => tono(f, 0.25, "triangle", i * 0.12, 0.35));
    setTimeout(celebracion, notas.length * 120 + 100);
  }

  function celebracion() {
    // Ráfaga tipo confeti / multitud (ruido blanco corto con pitidos)
    const c = getCtx();
    const bufferSize = c.sampleRate * 1.2;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2) * 0.5;
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1200;
    const gain = c.createGain();
    gain.gain.value = 0.4;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    noise.start();
    for (let i = 0; i < 5; i++) {
      tono(800 + Math.random() * 800, 0.08, "square", i * 0.1, 0.15);
    }
  }

  function atajada() {
    tono(220, 0.15, "sawtooth", 0, 0.3);
    tono(160, 0.25, "sawtooth", 0.1, 0.25);
  }

  function click() {
    tono(440, 0.06, "square", 0, 0.15);
  }

  function correcto() {
    tono(659, 0.12, "sine", 0, 0.3);
    tono(880, 0.18, "sine", 0.1, 0.3);
  }

  function incorrecto() {
    tono(200, 0.3, "sawtooth", 0, 0.25);
  }

  function ganador() {
    const notas = [523, 523, 523, 659, 784, 1047, 784, 1047];
    notas.forEach((f, i) => tono(f, 0.3, "triangle", i * 0.18, 0.35));
    setTimeout(celebracion, notas.length * 180);
  }

  return { gol, celebracion, atajada, click, correcto, incorrecto, ganador, ruidoSilbato };
})();
