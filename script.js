(() => {
  'use strict';

  /* ----------------------------------------------------------
     0. INTRO
     ---------------------------------------------------------- */
  const introScreen = document.getElementById('intro');
  const btnContinuar = document.getElementById('btnContinuar');

  document.body.classList.add('intro-active');

  btnContinuar?.addEventListener('click', () => {
    introScreen.classList.add('is-leaving');
    window.setTimeout(() => {
      introScreen.classList.add('is-hidden');
      document.body.classList.remove('intro-active');
    }, 400); // 400ms dissolve ease-in-out acorde a especificación Figma
  });

  /* ----------------------------------------------------------
     1. Overlays "¿Cómo funciona?"
     ---------------------------------------------------------- */
  const backdrop = document.getElementById('overlayBackdrop');
  const overlays = Array.from(document.querySelectorAll('.overlay'));

  function closeAllOverlays() {
    overlays.forEach(o => o.classList.remove('is-visible'));
    backdrop.classList.remove('is-visible');
  }

  document.querySelectorAll('[data-overlay]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllOverlays();
      const target = document.getElementById(btn.dataset.overlay);
      target.classList.add('is-visible');
      backdrop.classList.add('is-visible');
    });
  });

  overlays.forEach(o => {
    o.querySelector('.overlay__close').addEventListener('click', closeAllOverlays);
  });
  backdrop.addEventListener('click', closeAllOverlays);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAllOverlays(); });

  /* ----------------------------------------------------------
     2. "¿Qué es lo que ha sucedido?"
     ---------------------------------------------------------- */
  const revealToggle = document.getElementById('revealToggle');
  const revealBody = document.getElementById('revealBody');
  revealToggle.addEventListener('click', () => {
    const isOpen = revealBody.classList.toggle('is-open');
    revealToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ----------------------------------------------------------
     3. Utilidades compartidas
     ---------------------------------------------------------- */

  // Escala musical (Hz) — igual a InstrumentoVisual.py
  const ESCALA = [130.81, 146.83, 164.81, 196.00, 220.00, 261.63, 293.66,
                  329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

  // Port de obtener_nombre_color() (3colores.py) a partir de RGB
  function nombreColor(r, g, b) {
    const max = Math.max(r, g, b) / 255, min = Math.min(r, g, b) / 255;
    const v = max * 100;
    const s = max === 0 ? 0 : ((max - min) / max) * 100;
    let h = 0;
    const d = max - min;
    if (d !== 0) {
      switch (max) {
        case r / 255: h = ((g / 255 - b / 255) / d) % 6; break;
        case g / 255: h = (b / 255 - r / 255) / d + 2; break;
        default:      h = (r / 255 - g / 255) / d + 4; break;
      }
      h *= 60;
      if (h < 0) h += 360;
    }

    if (v < 15) return 'negro';
    if (v > 85 && s < 10) return 'blanco';
    if (s < 12) return 'gris';

    if (h >= 0 && h < 20) {
      if (v < 50 && s > 20) return 'marrón';
      if (v > 70 && s < 40) return 'beige';
      return 'rojo';
    } else if (h < 45) {
      if (v < 45) return 'marrón';
      return 'naranja';
    } else if (h < 70) {
      if (v > 80 && s < 30) return 'crema';
      return 'amarillo';
    } else if (h < 155) {
      if (v < 40) return 'verde oscuro';
      return 'verde';
    } else if (h < 185) {
      return 'cian / turquesa';
    } else if (h < 255) {
      if (v < 40) return 'azul marino';
      return 'azul';
    } else if (h < 290) {
      return 'morado / violeta';
    } else if (h < 335) {
      return 'magenta / fucsia';
    } else {
      if (s < 50 && v > 60) return 'rosado';
      return 'rojo';
    }
  }


  function kMeans(pixels, k = 3, iterations = 8) {
    const n = pixels.length / 3;
    if (n === 0) return [];
    // Centros iniciales: muestras aleatorias
    let centers = [];
    for (let i = 0; i < k; i++) {
      const idx = Math.floor(Math.random() * n) * 3;
      centers.push([pixels[idx], pixels[idx + 1], pixels[idx + 2]]);
    }

    let assignments = new Int32Array(n);

    for (let iter = 0; iter < iterations; iter++) {
      // Asignación
      for (let i = 0; i < n; i++) {
        const r = pixels[i * 3], g = pixels[i * 3 + 1], b = pixels[i * 3 + 2];
        let best = 0, bestDist = Infinity;
        for (let c = 0; c < k; c++) {
          const dr = r - centers[c][0], dg = g - centers[c][1], db = b - centers[c][2];
          const dist = dr * dr + dg * dg + db * db;
          if (dist < bestDist) { bestDist = dist; best = c; }
        }
        assignments[i] = best;
      }
      // Recalcular centros
      const sums = Array.from({ length: k }, () => [0, 0, 0, 0]);
      for (let i = 0; i < n; i++) {
        const c = assignments[i];
        sums[c][0] += pixels[i * 3];
        sums[c][1] += pixels[i * 3 + 1];
        sums[c][2] += pixels[i * 3 + 2];
        sums[c][3] += 1;
      }
      centers = sums.map((s, idx) => s[3] > 0
        ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]]
        : centers[idx]);
    }

    // Frecuencias
    const freq = new Array(k).fill(0);
    for (let i = 0; i < n; i++) freq[assignments[i]]++;

    return centers
      .map((c, i) => ({ r: Math.round(c[0]), g: Math.round(c[1]), b: Math.round(c[2]), count: freq[i] }))
      .sort((a, b) => b.count - a.count);
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
  }

  function drawMirroredVideo(ctx, canvas) {
    const { width: w, height: h } = canvas;
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();
  }

  /* ----------------------------------------------------------
     4. Estado de cámara + MediaPipe Hands
     ---------------------------------------------------------- */
  const video = document.getElementById('sourceVideo');
  const cameraToggle = document.getElementById('cameraToggle');
  const cameraState = document.getElementById('cameraState');
  const demoCards = Array.from(document.querySelectorAll('.demo-card'));

  const state = {
    cameraOn: false,
    stream: null,
    handsLandmarks: null,   // últimos landmarks detectados (array de manos)
    handsBusy: false,
    rafId: null,
  };

  let handsModel = null;
  function getHandsModel() {
    if (handsModel || typeof Hands === 'undefined') return handsModel;
    handsModel = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    handsModel.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.7,
    });
    handsModel.onResults((results) => {
      state.handsLandmarks = results.multiHandLandmarks || [];
    });
    return handsModel;
  }

  async function handsLoop() {
    if (!state.cameraOn) return;
    const model = getHandsModel();
    if (model && video.readyState >= 2 && !state.handsBusy) {
      state.handsBusy = true;
      try { await model.send({ image: video }); }
      catch (e) { /* ignora frames perdidos */ }
      state.handsBusy = false;
    }
    if (state.cameraOn) requestAnimationFrame(handsLoop);
  }

  async function startCamera() {
    try {
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 }, audio: false,
      });
      video.srcObject = state.stream;
      await video.play();
      state.cameraOn = true;
      cameraToggle.setAttribute('aria-checked', 'true');
      cameraState.textContent = 'Cámara encendida';
      demoCards.forEach(c => c.dataset.active = 'true');
      handsLoop();
      mainLoop();
    } catch (err) {
      alert('No se pudo acceder a la cámara. Revisa los permisos del navegador.');
      console.error(err);
    }
  }

  function stopCamera() {
    state.cameraOn = false;
    if (state.stream) state.stream.getTracks().forEach(t => t.stop());
    state.stream = null;
    cameraToggle.setAttribute('aria-checked', 'false');
    cameraState.textContent = 'Cámara apagada';
    demoCards.forEach(c => c.dataset.active = 'false');
    if (state.rafId) cancelAnimationFrame(state.rafId);
    trazosMP.length = 0;
    trazoMPActivo = null;
    particulas.length = 0;
    trazosCombo.length = 0;
    detenerAudio();
  }

  cameraToggle.addEventListener('click', () => {
    state.cameraOn ? stopCamera() : startCamera();
  });

  /* ----------------------------------------------------------
     5. DEMO 1 — MediaPipe: lienzo con estela (DibujoManos.py)
     ---------------------------------------------------------- */
  const canvasMP = document.getElementById('canvasMediapipe');
  const ctxMP = canvasMP.getContext('2d');
  const TIEMPO_BORRADO_DIBUJO = 10.0;
  const TIEMPO_VIDA_PARTICULA = 2.0;
  let trazosMP = [];
  let trazoMPActivo = null;
  let particulas = [];
  const COLOR_BASE = [100, 230, 255]; // r,g,b — celeste neón

  function manoEnPuno(lm) {
    // Un puño se reconoce cuando las cuatro puntas están por debajo de sus
    // respectivos nudillos medios. Esa postura levanta el "pincel".
    return [[8, 6], [12, 10], [16, 14], [20, 18]]
      .every(([punta, nudillo]) => lm[punta].y > lm[nudillo].y);
  }

  function updateMediapipeDemo(tNow) {
    const w = canvasMP.width, h = canvasMP.height;
    ctxMP.globalCompositeOperation = 'source-over';
    drawMirroredVideo(ctxMP, canvasMP);

    const hands = state.handsLandmarks;
    const manoParaDibujar = hands?.find(lm => !manoEnPuno(lm));
    if (manoParaDibujar) {
        const lm = manoParaDibujar;
        const tip = lm[8];
        const x = (1 - tip.x) * w, y = tip.y * h;
        const punto = { x, y, t: tNow };
        if (!trazoMPActivo) {
          trazoMPActivo = [punto];
          trazosMP.push(trazoMPActivo);
        } else {
          trazoMPActivo.push(punto);
        }
        for (let i = 0; i < 4; i++) {
          particulas.push({
            x, y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            t: tNow,
          });
        }
    } else {
      trazoMPActivo = null;
    }

    trazosMP = trazosMP.filter(trazo => {
      const ultimo = trazo[trazo.length - 1];
      return ultimo && tNow - ultimo.t < TIEMPO_BORRADO_DIBUJO;
    });
    ctxMP.globalCompositeOperation = 'lighter';
    trazosMP.forEach(trazo => {
      for (let i = 1; i < trazo.length; i++) {
        const a = trazo[i - 1], b = trazo[i];
        ctxMP.strokeStyle = `rgb(${COLOR_BASE[0]},${COLOR_BASE[1]},${COLOR_BASE[2]})`;
        ctxMP.lineWidth = 7;
        ctxMP.lineCap = 'round';
        ctxMP.beginPath();
        ctxMP.moveTo(a.x, a.y);
        ctxMP.lineTo(b.x, b.y);
        ctxMP.stroke();
      }
    });

    particulas = particulas.filter(p => tNow - p.t < TIEMPO_VIDA_PARTICULA);
    particulas.forEach(p => {
      const vida = Math.max(0, 1 - (tNow - p.t) / TIEMPO_VIDA_PARTICULA);
      p.x += p.vx; p.y += p.vy;
      const radio = 5 * vida + 1;
      ctxMP.fillStyle = `rgba(${COLOR_BASE[0]},${COLOR_BASE[1]},${COLOR_BASE[2]},${vida})`;
      ctxMP.beginPath();
      ctxMP.arc(p.x, p.y, radio, 0, Math.PI * 2);
      ctxMP.fill();
    });
    ctxMP.globalCompositeOperation = 'source-over';
  }

  /* ----------------------------------------------------------
     6. DEMO 2 — OpenCV: paleta K-Means (3colores.py)
     ---------------------------------------------------------- */
  const canvasCV = document.getElementById('canvasOpencv');
  const ctxCV = canvasCV.getContext('2d');
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = 60; sampleCanvas.height = 60;
  const sampleCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

  let paletaActual = [];
  let lastKMeansTs = 0;

  function updateOpencvDemo(tNow) {
    const w = canvasCV.width, h = canvasCV.height;

    if (tNow - lastKMeansTs > 0.35) {
      lastKMeansTs = tNow;
      sampleCtx.drawImage(video, 0, 0, 60, 60);
      const data = sampleCtx.getImageData(0, 0, 60, 60).data;
      const pixels = new Uint8ClampedArray((data.length / 4) * 3);
      for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
        pixels[j] = data[i]; pixels[j + 1] = data[i + 1]; pixels[j + 2] = data[i + 2];
      }
      paletaActual = kMeans(pixels, 3, 6);
    }

    // Panel oscuro, como en 3colores.py
    ctxCV.fillStyle = '#141414';
    ctxCV.fillRect(0, 0, w, h);
    ctxCV.fillStyle = '#ffffff';
    ctxCV.font = `${Math.round(h * 0.045)}px "Space Mono", monospace`;
    ctxCV.fillText('PALETA DE COLORES PRINCIPALES', w * 0.06, h * 0.12);

    const yInicial = h * 0.24;
    const espaciado = h * 0.26;
    const boxSize = h * 0.16;

    paletaActual.forEach((c, i) => {
      const y = yInicial + i * espaciado;
      const hex = rgbToHex(c.r, c.g, c.b);
      const nombre = nombreColor(c.r, c.g, c.b);

      ctxCV.fillStyle = `rgb(${c.r},${c.g},${c.b})`;
      ctxCV.fillRect(w * 0.06, y, boxSize, boxSize);
      ctxCV.strokeStyle = '#ffffff';
      ctxCV.lineWidth = 1;
      ctxCV.strokeRect(w * 0.06, y, boxSize, boxSize);

      ctxCV.fillStyle = '#969696';
      ctxCV.font = `${Math.round(h * 0.032)}px "Space Mono", monospace`;
      ctxCV.fillText(`Color ${i + 1}`, w * 0.06 + boxSize + 20, y + boxSize * 0.3);

      ctxCV.fillStyle = '#ffffff';
      ctxCV.font = `${Math.round(h * 0.045)}px "Space Mono", monospace`;
      ctxCV.fillText(nombre.toUpperCase(), w * 0.06 + boxSize + 20, y + boxSize * 0.62);

      ctxCV.fillStyle = '#00BEFF';
      ctxCV.font = `${Math.round(h * 0.038)}px "Space Mono", monospace`;
      ctxCV.fillText(hex, w * 0.06 + boxSize + 20, y + boxSize * 0.92);
    });


  }

  /* ----------------------------------------------------------
     7. DEMO 3 — Combo: lienzo musical (InstrumentoVisual.py)
     ---------------------------------------------------------- */
  const canvasCombo = document.getElementById('canvasCombo');
  const ctxCombo = canvasCombo.getContext('2d');
  const comboSwatches = Array.from(document.querySelectorAll('.combo-swatch'));
  const comboPlayBtn = document.getElementById('comboPlay');
  const comboClearBtn = document.getElementById('comboClear');

  const ESTILOS = ['tecno', 'pop', 'rock'];
  let coloresLapices = [[255, 100, 100], [100, 255, 100], [100, 100, 255]];
  let lapizSeleccionado = 0;
  let trazosCombo = [];
  let ultimoPunto = null;
  let reproduciendo = false;
  let lineaTiempoX = 0;
  const velocidadReproduccion = 3; // px por fotograma: recorrido más pausado
  let lastComboKMeansTs = 0;

  comboSwatches.forEach(btn => {
    btn.addEventListener('click', () => {
      lapizSeleccionado = Number(btn.dataset.pen);
      comboSwatches.forEach(b => b.classList.remove('combo-swatch--active'));
      btn.classList.add('combo-swatch--active');
    });
  });
  comboClearBtn.addEventListener('click', () => { trazosCombo = []; ultimoPunto = null; });
  comboPlayBtn.addEventListener('click', () => {
    const actx = getAudioCtx();
    if (actx && actx.state === 'suspended') actx.resume();
    reproduciendo = !reproduciendo;
    comboPlayBtn.textContent = reproduciendo ? 'Detener' : 'Reproducir';
    if (reproduciendo) lineaTiempoX = 0;
    else detenerAudio();
  });

  /* ---- Web Audio (reemplaza a pyaudio) ---- */
  let audioCtx = null;
  const vocesActivas = new Map(); // clave "freq_estilo" -> {osc, gain}

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function tipoOscilador(estilo) {
    if (estilo === 'tecno') return 'square';
    if (estilo === 'rock') return 'sawtooth';
    return 'sine'; // pop
  }

  function sincronizarVoces(notasDeseadas) {
    if (!reproduciendo) { detenerAudio(); return; }
    const ctx = getAudioCtx();
    const clavesDeseadas = new Set(notasDeseadas.map(([f, e]) => `${f}_${e}`));

    // Apagar voces que ya no están sonando
    for (const [clave, voz] of vocesActivas) {
      if (!clavesDeseadas.has(clave)) {
        voz.gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        voz.osc.stop(ctx.currentTime + 0.08);
        vocesActivas.delete(clave);
      }
    }
    // Encender voces nuevas
    notasDeseadas.forEach(([freq, estilo]) => {
      const clave = `${freq}_${estilo}`;
      if (vocesActivas.has(clave)) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipoOscilador(estilo);
      osc.frequency.value = freq;
      gain.gain.value = 0;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      gain.gain.linearRampToValueAtTime(0.18 / Math.max(1, notasDeseadas.length), ctx.currentTime + 0.05);
      vocesActivas.set(clave, { osc, gain });
    });
  }

  function detenerAudio() {
    if (!audioCtx) return;
    for (const [, voz] of vocesActivas) {
      try { voz.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.05); voz.osc.stop(audioCtx.currentTime + 0.08); }
      catch (e) { /* ya detenido */ }
    }
    vocesActivas.clear();
  }

  function updateComboDemo(tNow) {
    const w = canvasCombo.width, h = canvasCombo.height;
    drawMirroredVideo(ctxCombo, canvasCombo);

    // 1. Paleta en vivo (extraída con k-means, cada ~350ms)
    if (tNow - lastComboKMeansTs > 0.35) {
      lastComboKMeansTs = tNow;
      sampleCtx.drawImage(video, 0, 0, 60, 60);
      const data = sampleCtx.getImageData(0, 0, 60, 60).data;
      const pixels = new Uint8ClampedArray((data.length / 4) * 3);
      for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
        pixels[j] = data[i]; pixels[j + 1] = data[i + 1]; pixels[j + 2] = data[i + 2];
      }
      const paleta = kMeans(pixels, 3, 5);
      if (paleta.length === 3) {
        coloresLapices = paleta.map(c => [c.r, c.g, c.b]);
        comboSwatches.forEach((btn, i) => {
          const [r, g, b] = coloresLapices[i];
          btn.style.setProperty('--sw', `rgb(${r},${g},${b})`);
        });
      }
    }

    // 2. Rastreo del índice + dibujo (idéntico a InstrumentoVisual.py)
    const hands = state.handsLandmarks;
    let dedoDetectado = false;
    if (hands && hands.length) {
      const lm = hands[0];
      // Igual que la imagen de esta pantalla, los trazos usan X invertida.
      const ix = (1 - lm[8].x) * w, iy = lm[8].y * h;
      const indiceAbajo = lm[8].y > lm[6].y;
      if (!indiceAbajo) {
        dedoDetectado = true;
        const punto = { x: ix, y: iy, lapiz: lapizSeleccionado };
        if (!ultimoPunto) trazosCombo.push([punto]);
        else trazosCombo[trazosCombo.length - 1].push(punto);
        ultimoPunto = punto;
      }
    }
    if (!dedoDetectado) ultimoPunto = null;

    trazosCombo.forEach(trazo => {
      for (let i = 1; i < trazo.length; i++) {
        const [r, g, b] = coloresLapices[trazo[i].lapiz];
        ctxCombo.strokeStyle = `rgb(${r},${g},${b})`;
        ctxCombo.lineWidth = 6;
        ctxCombo.lineCap = 'round';
        ctxCombo.beginPath();
        ctxCombo.moveTo(trazo[i - 1].x, trazo[i - 1].y);
        ctxCombo.lineTo(trazo[i].x, trazo[i].y);
        ctxCombo.stroke();
      }
    });

    // 3. Reproducción: línea de tiempo + interpolación de notas
    const notasDeseadas = [];
    if (reproduciendo) {
      lineaTiempoX += velocidadReproduccion;
      if (lineaTiempoX >= w) lineaTiempoX = 0;
      ctxCombo.strokeStyle = 'rgba(0,230,255,0.9)';
      ctxCombo.lineWidth = 2;
      ctxCombo.beginPath();
      ctxCombo.moveTo(lineaTiempoX, 0);
      ctxCombo.lineTo(lineaTiempoX, h);
      ctxCombo.stroke();

      trazosCombo.forEach(trazo => {
        for (let i = 1; i < trazo.length; i++) {
          const x1 = trazo[i - 1].x, x2 = trazo[i].x;
          const y1 = trazo[i - 1].y, y2 = trazo[i].y;
          if (Math.min(x1, x2) <= lineaTiempoX && lineaTiempoX <= Math.max(x1, x2)) {
            const yInterp = x2 === x1 ? y1 : y1 + ((lineaTiempoX - x1) / (x2 - x1)) * (y2 - y1);
            const pctAltura = 1 - yInterp / h;
            const idxNota = Math.round(pctAltura * (ESCALA.length - 1));
            const freq = ESCALA[Math.max(0, Math.min(idxNota, ESCALA.length - 1))];
            const estilo = ESTILOS[trazo[i].lapiz];
            if (!notasDeseadas.some(([f, e]) => f === freq && e === estilo)) {
              notasDeseadas.push([freq, estilo]);
            }
          }
        }
      });
    }
    sincronizarVoces(notasDeseadas);
  }

  /* ----------------------------------------------------------
     8. Loop principal
     ---------------------------------------------------------- */
  function mainLoop() {
    if (!state.cameraOn) return;
    const tNow = performance.now() / 1000;
    updateMediapipeDemo(tNow);
    updateOpencvDemo(tNow);
    updateComboDemo(tNow);
    state.rafId = requestAnimationFrame(mainLoop);
  }

})();