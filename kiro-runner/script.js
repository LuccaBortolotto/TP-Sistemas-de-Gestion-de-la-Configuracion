"use strict";

/* ─── Paleta (espeja las CSS vars para uso en canvas) ────────── */
const COLOR = {
  primario:   "#7540b0",
  secundario: "#c2a9df",
  acento:     "#f472b6",
  cyan:       "#67e8f9",
  blanco:     "#ffffff",
  oscuro:     "#1e0a3c",
};

/* ─── Constantes de física y geometría ───────────────────────── */
const SUELO_Y         = 200;   // y absoluta del suelo (canvas 800×240)
const FANTASMA_X      = 90;    // posición x fija del fantasma
const FANTASMA_ANCHO  = 36;
const FANTASMA_ALTO   = 48;
const GRAVEDAD        = 0.55;
const FUERZA_SALTO    = -13;
const MAX_SALTOS      = 2;
const MAX_VIDAS       = 3;     // vidas máximas del fantasma

/* ─── Referencias al DOM ──────────────────────────────────────── */
const canvas        = document.getElementById("juego");
const ctx           = canvas.getContext("2d");
const W             = canvas.width;
const H             = canvas.height;
const overlay       = document.getElementById("overlay");
const tituloOverlay = document.getElementById("titulo-overlay");
const mensajeOverlay= document.getElementById("mensaje-overlay");
const puntajeFinal  = document.getElementById("puntaje-final");
const btnJugar      = document.getElementById("btn-jugar");
const displayPuntos = document.getElementById("display-puntos");
const displayMejor  = document.getElementById("display-mejor");
const displayNivel  = document.getElementById("display-nivel");
const displayVidas  = document.getElementById("display-vidas");

/* ─── Estado global ───────────────────────────────────────────── */
let enJuego      = false;
let muerto       = false;
let puntos       = 0;
let mejorPuntos  = 0;
let nivel        = 1;
let frameId      = null;
let vidas        = MAX_VIDAS;
let invulnerable = false;

let fantasmaY    = SUELO_Y - FANTASMA_ALTO;
let fantasmaVY   = 0;
let saltosDisp   = MAX_SALTOS;

let obstaculos      = [];
let temporizadorObs = 0;
let intervaloObs    = 110;
let velocidad       = 5;

let particulas      = [];
let trailFrames     = [];
let anguloFlotacion = 0;
let offsetSuelo     = 0;

/** Estrellas de fondo generadas una sola vez */
const estrellas = Array.from({ length: 80 }, () => ({
  x:  Math.random() * W,
  y:  Math.random() * (SUELO_Y - 20),
  r:  Math.random() * 1.5 + 0.3,
  a:  Math.random(),
  da: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? 1 : -1),
}));

/** Plantillas de obstáculos disponibles */
const TIPOS_OBSTACULO = [
  { w: 22, h: 34, color: COLOR.acento,   tipo: "pico"                   },
  { w: 18, h: 52, color: COLOR.acento,   tipo: "pico"                   },
  { w: 38, h: 24, color: COLOR.cyan,     tipo: "roca"                   },
  { w: 28, h: 28, color: COLOR.primario, tipo: "orbe", floatY: SUELO_Y - 80 },
];

/* ════════════════════════════════════════════════════════════════
   LÓGICA DE ESTADO
═══════════════════════════════════════════════════════════════ */

/**
 * Actualiza los corazones en el HUD según las vidas restantes.
 * Corazón lleno ❤️ = vida disponible · corazón vacío 🤍 = vida perdida.
 * @returns {void}
 */
function actualizarCorazones() {
  try {
    if (!displayVidas) return;
    const corazones = displayVidas.querySelectorAll(".corazon");
    corazones.forEach((c, i) => {
      c.textContent = i < vidas ? "❤️" : "🤍";
    });
  } catch (error) {
    console.error("Error al actualizar los corazones:", error);
  }
}

/**
 * Reinicia todas las variables de estado para una nueva partida.
 * @returns {void}
 */
function reiniciar() {
  try {
    puntos          = 0;
    nivel           = 1;
    velocidad       = 5;
    fantasmaY       = SUELO_Y - FANTASMA_ALTO;
    fantasmaVY      = 0;
    saltosDisp      = MAX_SALTOS;
    obstaculos      = [];
    particulas      = [];
    trailFrames     = [];
    temporizadorObs = 0;
    intervaloObs    = 110;
    offsetSuelo     = 0;
    anguloFlotacion = 0;
    vidas           = MAX_VIDAS;
    invulnerable    = false;
    actualizarCorazones();
  } catch (error) {
    console.error("Error al reiniciar el juego:", error);
  }
}

/**
 * Ejecuta un salto si hay saltos disponibles.
 * @returns {void}
 */
function saltar() {
  try {
    if (!enJuego || muerto) return;
    if (saltosDisp > 0) {
      fantasmaVY = FUERZA_SALTO;
      saltosDisp--;
      generarParticulasSalto();
    }
  } catch (error) {
    console.error("Error al ejecutar el salto:", error);
  }
}

/**
 * Inicia una nueva partida: resetea estado, oculta overlay y arranca el loop.
 * @returns {void}
 */
function iniciarPartida() {
  try {
    reiniciar();
    enJuego = true;
    muerto  = false;
    overlay.classList.add("oculto");
    puntajeFinal.classList.add("oculto");
    if (frameId) cancelAnimationFrame(frameId);
    loop();
  } catch (error) {
    console.error("Error al iniciar la partida:", error);
  }
}

/**
 * Muestra la pantalla de game over con el puntaje y detalle de vidas perdidas.
 * @returns {void}
 */
function mostrarGameOver() {
  try {
    enJuego = false;
    overlay.classList.remove("oculto");
    tituloOverlay.textContent  = "💀 JUEGO TERMINADO";
    const vidasPerdidas        = MAX_VIDAS - vidas;
    mensajeOverlay.textContent = `Vidas perdidas: ${"❤️".repeat(vidasPerdidas)}${"🤍".repeat(vidas)}`;
    puntajeFinal.textContent   = `Puntos: ${puntos}  ·  Mejor: ${mejorPuntos}`;
    puntajeFinal.classList.remove("oculto");
    btnJugar.textContent = "REINTENTAR";
  } catch (error) {
    console.error("Error al mostrar la pantalla de game over:", error);
  }
}

/**
 * Recoloca al fantasma en su posición inicial tras perder una vida.
 * Elimina obstáculos cercanos y activa la invulnerabilidad por 2 segundos.
 * @returns {void}
 */
function respawn() {
  try {
    fantasmaY  = SUELO_Y - FANTASMA_ALTO;
    fantasmaVY = 0;
    saltosDisp = MAX_SALTOS;
    // Quitar obstáculos cercanos para evitar colisión inmediata al reaparecer
    obstaculos = obstaculos.filter(o => o.x > FANTASMA_X + 100);
    muerto     = false;
    invulnerable = true;
    setTimeout(() => {
      invulnerable = false;
    }, 2000);
  } catch (error) {
    console.error("Error al hacer respawn del fantasma:", error);
  }
}

/**
 * Descuenta una vida al colisionar con un obstáculo.
 * Si quedan vidas realiza respawn tras 800 ms; si no, muestra game over.
 * @returns {void}
 */
function perderVida() {
  try {
    vidas--;
    generarParticulasMuerte();
    if (puntos > mejorPuntos) mejorPuntos = puntos;
    actualizarCorazones();
    if (vidas <= 0) {
      muerto = true;
      setTimeout(mostrarGameOver, 600);
    } else {
      muerto = true;
      setTimeout(respawn, 800);
    }
  } catch (error) {
    console.error("Error al perder una vida:", error);
  }
}

/* ════════════════════════════════════════════════════════════════
   OBSTÁCULOS
═══════════════════════════════════════════════════════════════ */

/**
 * Crea un nuevo obstáculo aleatorio y lo agrega a la lista.
 * @returns {void}
 */
function generarObstaculo() {
  try {
    const plantilla = TIPOS_OBSTACULO[Math.floor(Math.random() * TIPOS_OBSTACULO.length)];
    obstaculos.push({
      x:           W + 20,
      w:           plantilla.w,
      h:           plantilla.h,
      color:       plantilla.color,
      tipo:        plantilla.tipo,
      y:           plantilla.floatY ?? (SUELO_Y - plantilla.h),
      floatY:      plantilla.floatY,
      anguloFloat: Math.random() * Math.PI * 2,
    });
  } catch (error) {
    console.error("Error al generar un obstáculo:", error);
  }
}

/**
 * Comprueba colisión AABB entre el fantasma y un obstáculo con margen de tolerancia.
 * Retorna false directamente si el fantasma es invulnerable.
 * @param {{ x: number, y: number, w: number, h: number }} obs - Obstáculo a comprobar.
 * @returns {boolean} `true` si hay colisión efectiva.
 */
function hayColision(obs) {
  try {
    if (invulnerable) return false;
    const margen = 6;
    const fx1 = FANTASMA_X + margen;
    const fy1 = fantasmaY  + margen;
    const fx2 = FANTASMA_X + FANTASMA_ANCHO - margen;
    const fy2 = fantasmaY  + FANTASMA_ALTO  - margen;
    return fx1 < obs.x + obs.w && fx2 > obs.x && fy1 < obs.y + obs.h && fy2 > obs.y;
  } catch (error) {
    console.error("Error al comprobar colisión:", error);
    return false;
  }
}

/* ════════════════════════════════════════════════════════════════
   PARTÍCULAS
═══════════════════════════════════════════════════════════════ */

/**
 * Emite partículas hacia abajo al saltar.
 * @returns {void}
 */
function generarParticulasSalto() {
  try {
    for (let i = 0; i < 10; i++) {
      particulas.push({
        x:     FANTASMA_X + FANTASMA_ANCHO / 2,
        y:     fantasmaY  + FANTASMA_ALTO,
        vx:    (Math.random() - 0.5) * 3,
        vy:    Math.random() * 2 + 1,
        vida:  1,
        decay: Math.random() * 0.04 + 0.03,
        r:     Math.random() * 4 + 2,
        color: COLOR.primario,
      });
    }
  } catch (error) {
    console.error("Error al generar partículas de salto:", error);
  }
}

/**
 * Emite una explosión de partículas al perder una vida.
 * @returns {void}
 */
function generarParticulasMuerte() {
  try {
    const colores = [COLOR.primario, COLOR.acento, COLOR.blanco, COLOR.cyan];
    for (let i = 0; i < 30; i++) {
      const angulo = Math.random() * Math.PI * 2;
      const spd    = Math.random() * 5 + 2;
      particulas.push({
        x:     FANTASMA_X + FANTASMA_ANCHO / 2,
        y:     fantasmaY  + FANTASMA_ALTO  / 2,
        vx:    Math.cos(angulo) * spd,
        vy:    Math.sin(angulo) * spd,
        vida:  1,
        decay: Math.random() * 0.02 + 0.015,
        r:     Math.random() * 6 + 3,
        color: colores[Math.floor(Math.random() * colores.length)],
      });
    }
  } catch (error) {
    console.error("Error al generar partículas de muerte:", error);
  }
}

/* ════════════════════════════════════════════════════════════════
   UPDATE
═══════════════════════════════════════════════════════════════ */

/**
 * Actualiza toda la lógica del juego en cada frame.
 * @returns {void}
 */
function actualizar() {
  try {
    if (!enJuego || muerto) return;

    anguloFlotacion += 0.07;
    offsetSuelo      = (offsetSuelo + velocidad) % 40;

    /* Puntaje y nivel */
    puntos++;
    nivel        = 1 + Math.floor(puntos / 400);
    velocidad    = 5 + (nivel - 1) * 0.8 + puntos * 0.001;
    intervaloObs = Math.max(55, 110 - nivel * 8);

    /* Física del fantasma */
    fantasmaVY += GRAVEDAD;
    fantasmaY  += fantasmaVY;
    if (fantasmaY >= SUELO_Y - FANTASMA_ALTO) {
      fantasmaY  = SUELO_Y - FANTASMA_ALTO;
      fantasmaVY = 0;
      saltosDisp = MAX_SALTOS;
    }

    /* Trail */
    trailFrames.unshift({ x: FANTASMA_X, y: fantasmaY, a: 0.35 });
    if (trailFrames.length > 6) trailFrames.pop();

    /* Obstáculos */
    temporizadorObs++;
    if (temporizadorObs >= intervaloObs) {
      generarObstaculo();
      temporizadorObs = 0;
    }

    for (const obs of obstaculos) {
      obs.x -= velocidad;
      if (obs.tipo === "orbe") {
        obs.anguloFloat += 0.05;
        obs.y = (obs.floatY ?? SUELO_Y - 80) + Math.sin(obs.anguloFloat) * 12;
      }
      if (hayColision(obs)) {
        perderVida();
        return;
      }
    }
    obstaculos = obstaculos.filter(o => o.x + o.w > -10);

    /* Partículas */
    for (const p of particulas) {
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.15;
      p.vida -= p.decay;
    }
    particulas = particulas.filter(p => p.vida > 0);

    /* HUD */
    actualizarHud();

  } catch (error) {
    console.error("Error en el ciclo de actualización:", error);
  }
}

/**
 * Actualiza los valores numéricos del HUD en el DOM.
 * @returns {void}
 */
function actualizarHud() {
  try {
    displayPuntos.textContent = puntos;
    displayMejor.textContent  = mejorPuntos;
    displayNivel.textContent  = nivel;
    actualizarCorazones();
  } catch (error) {
    console.error("Error al actualizar el HUD:", error);
  }
}

/* ════════════════════════════════════════════════════════════════
   DIBUJO
═══════════════════════════════════════════════════════════════ */

/**
 * Dibuja el fondo degradado del canvas.
 * @returns {void}
 */
function dibujarFondo() {
  try {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#0d0d2b");
    grad.addColorStop(1, "#1a1040");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  } catch (error) {
    console.error("Error al dibujar el fondo:", error);
  }
}

/**
 * Dibuja las estrellas parpadeantes del fondo.
 * @returns {void}
 */
function dibujarEstrellas() {
  try {
    for (const s of estrellas) {
      s.a += s.da;
      if (s.a > 1 || s.a < 0) s.da *= -1;
      ctx.globalAlpha = s.a * 0.8 + 0.1;
      ctx.fillStyle   = COLOR.secundario;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } catch (error) {
    console.error("Error al dibujar las estrellas:", error);
    ctx.globalAlpha = 1;
  }
}

/**
 * Dibuja el suelo con línea neón y rejilla de perspectiva.
 * @returns {void}
 */
function dibujarSuelo() {
  try {
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(0, SUELO_Y, W, H - SUELO_Y);

    const grad = ctx.createLinearGradient(0, SUELO_Y, 0, SUELO_Y + 4);
    grad.addColorStop(0, COLOR.secundario);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, SUELO_Y, W, 4);

    ctx.strokeStyle = "#2e2a6e";
    ctx.lineWidth   = 1;
    for (let x = -offsetSuelo; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, SUELO_Y + 8);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
  } catch (error) {
    console.error("Error al dibujar el suelo:", error);
  }
}

/**
 * Dibuja el fantasma de Kiro en la posición indicada.
 * Cuando es invulnerable, parpadea alternando opacidad cada 120 ms.
 * @param {number} x      - Posición horizontal.
 * @param {number} y      - Posición vertical.
 * @param {number} alpha  - Opacidad base (0–1).
 * @param {number} escala - Factor de escala.
 * @returns {void}
 */
function dibujarFantasma(x, y, alpha = 1, escala = 1) {
  try {
    ctx.save();
    // Parpadeo durante invulnerabilidad: alterna entre 0.25 y 1 cada 120 ms
    const alphaEfectivo = invulnerable
      ? (Math.floor(Date.now() / 120) % 2 === 0 ? 0.25 : 1) * alpha
      : alpha;
    ctx.globalAlpha = alphaEfectivo;
    ctx.translate(x + FANTASMA_ANCHO / 2, y + FANTASMA_ALTO / 2);
    ctx.scale(escala, escala);

    const hw = FANTASMA_ANCHO / 2;
    const hh = FANTASMA_ALTO  / 2;

    /* Cuerpo */
    ctx.fillStyle   = COLOR.primario;
    ctx.shadowColor = COLOR.secundario;
    ctx.shadowBlur  = 18;

    ctx.beginPath();
    ctx.arc(0, -hh * 0.3, hw, Math.PI, 0);
    ctx.lineTo(hw, hh * 0.6);

    const bumpW = FANTASMA_ANCHO / 3;
    ctx.quadraticCurveTo( hw - bumpW * 0.5,  hh * 0.9,  hw - bumpW,     hh * 0.6);
    ctx.quadraticCurveTo( hw - bumpW * 1.5,  hh * 0.3,  hw - bumpW * 2, hh * 0.6);
    ctx.quadraticCurveTo(-hw + bumpW * 0.5,  hh * 0.9, -hw,             hh * 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;

    /* Ojos */
    const ojosY = -hh * 0.15;

    ctx.fillStyle = COLOR.blanco;
    ctx.beginPath(); ctx.ellipse(-hw * 0.35, ojosY, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COLOR.oscuro;
    ctx.beginPath(); ctx.arc(-hw * 0.35 + 1, ojosY + 1, 3, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = COLOR.blanco;
    ctx.beginPath(); ctx.ellipse( hw * 0.35, ojosY, 5, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = COLOR.oscuro;
    ctx.beginPath(); ctx.arc( hw * 0.35 + 1, ojosY + 1, 3, 0, Math.PI * 2); ctx.fill();

    /* Letra K de Kiro */
    ctx.fillStyle    = "#e9d5ff";
    ctx.font         = "bold 11px 'Roboto', sans-serif";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor  = COLOR.secundario;
    ctx.shadowBlur   = 8;
    ctx.fillText("K", 0, hh * 0.28);
    ctx.shadowBlur = 0;

    ctx.restore();
  } catch (error) {
    console.error("Error al dibujar el fantasma:", error);
    ctx.restore();
  }
}

/**
 * Dibuja un obstáculo según su tipo (pico, roca u orbe).
 * @param {{ x: number, y: number, w: number, h: number, color: string, tipo: string }} obs
 * @returns {void}
 */
function dibujarObstaculo(obs) {
  try {
    ctx.save();
    ctx.shadowColor = obs.color;
    ctx.shadowBlur  = 12;

    if (obs.tipo === "orbe") {
      const cx = obs.x + obs.w / 2;
      const cy = obs.y + obs.h / 2;
      const r  = obs.w / 2;
      const g  = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
      g.addColorStop(0, "#f0e6ff");
      g.addColorStop(0.5, obs.color);
      g.addColorStop(1, COLOR.oscuro);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = obs.color;
      ctx.lineWidth   = 2;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

    } else if (obs.tipo === "pico") {
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w / 2, obs.y);
      ctx.lineTo(obs.x + obs.w,     obs.y + obs.h);
      ctx.lineTo(obs.x,             obs.y + obs.h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w / 2,    obs.y + 4);
      ctx.lineTo(obs.x + obs.w * 0.65, obs.y + obs.h * 0.5);
      ctx.lineTo(obs.x + obs.w * 0.35, obs.y + obs.h * 0.5);
      ctx.closePath();
      ctx.fill();

    } else {
      /* roca */
      ctx.fillStyle = obs.color;
      ctx.beginPath();
      ctx.moveTo(obs.x + obs.w * 0.2, obs.y);
      ctx.lineTo(obs.x + obs.w * 0.8, obs.y);
      ctx.lineTo(obs.x + obs.w,       obs.y + obs.h * 0.5);
      ctx.lineTo(obs.x + obs.w * 0.9, obs.y + obs.h);
      ctx.lineTo(obs.x + obs.w * 0.1, obs.y + obs.h);
      ctx.lineTo(obs.x,               obs.y + obs.h * 0.5);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  } catch (error) {
    console.error("Error al dibujar un obstáculo:", error);
    ctx.restore();
  }
}

/**
 * Dibuja todas las partículas activas.
 * @returns {void}
 */
function dibujarParticulas() {
  try {
    for (const p of particulas) {
      ctx.save();
      ctx.globalAlpha = p.vida;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * p.vida, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } catch (error) {
    console.error("Error al dibujar las partículas:", error);
  }
}

/**
 * Dibuja líneas de velocidad cuando el juego va rápido.
 * @returns {void}
 */
function dibujarLineasVelocidad() {
  try {
    if (velocidad <= 8) return;
    ctx.globalAlpha = Math.min((velocidad - 8) / 6, 0.25);
    ctx.strokeStyle = COLOR.secundario;
    ctx.lineWidth   = 1;
    for (let i = 0; i < 6; i++) {
      const sy  = 20 + i * 30;
      const len = 30 + i * 10;
      ctx.beginPath();
      ctx.moveTo(W * 0.3 - offsetSuelo % 80,       sy);
      ctx.lineTo(W * 0.3 - offsetSuelo % 80 - len, sy);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  } catch (error) {
    console.error("Error al dibujar las líneas de velocidad:", error);
    ctx.globalAlpha = 1;
  }
}

/**
 * Renderiza el frame completo: fondo, suelo, fantasma, obstáculos y partículas.
 * @returns {void}
 */
function dibujar() {
  try {
    ctx.clearRect(0, 0, W, H);
    dibujarFondo();
    dibujarEstrellas();
    dibujarSuelo();

    /* Trail del fantasma */
    trailFrames.forEach((f, i) => {
      const a = f.a * (1 - i / trailFrames.length);
      const s = 0.85 - i * 0.06;
      dibujarFantasma(f.x, f.y, a, s);
    });

    /* Fantasma principal con flotación al estar en el suelo */
    const enSuelo   = fantasmaY >= SUELO_Y - FANTASMA_ALTO - 1;
    const flotacion = enSuelo ? Math.sin(anguloFlotacion) * 2 : 0;
    dibujarFantasma(FANTASMA_X, fantasmaY + flotacion, 1, 1);

    obstaculos.forEach(dibujarObstaculo);
    dibujarParticulas();
    dibujarLineasVelocidad();

  } catch (error) {
    console.error("Error al renderizar el frame:", error);
  }
}

/* ════════════════════════════════════════════════════════════════
   LOOP PRINCIPAL
═══════════════════════════════════════════════════════════════ */

/**
 * Loop principal del juego: actualiza lógica y renderiza cada frame.
 * @returns {void}
 */
function loop() {
  try {
    actualizar();
    dibujar();
    frameId = requestAnimationFrame(loop);
  } catch (error) {
    console.error("Error en el loop principal del juego:", error);
  }
}

/* ════════════════════════════════════════════════════════════════
   EVENTOS
═══════════════════════════════════════════════════════════════ */

window.addEventListener("keydown", (e) => {
  try {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      saltar();
    }
  } catch (error) {
    console.error("Error al procesar la tecla:", error);
  }
});

canvas.addEventListener("pointerdown", () => {
  try {
    saltar();
  } catch (error) {
    console.error("Error al procesar el toque en el canvas:", error);
  }
});

btnJugar.addEventListener("click", () => {
  try {
    iniciarPartida();
  } catch (error) {
    console.error("Error al iniciar la partida desde el botón:", error);
  }
});

/* ─── Frame estático inicial (pantalla de inicio) ────────────── */
reiniciar();
dibujar();
