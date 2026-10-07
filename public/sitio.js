// Landing de Mycelium: detección del sistema, regla del día, tono del día y
// entrada de las capturas. Todo es progresivo: sin este archivo la página se
// lee entera, con las tres descargas a la vista.
(() => {
  "use strict";

  const raiz = document.documentElement;
  const sinMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)");

  // ---------- Sistema del visitante ----------

  const NOMBRES = { windows: "Windows", mac: "macOS", "linux-appimage": "Linux" };

  function detectarSistema() {
    const ua = navigator.userAgent || "";
    const plataforma = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    if (/Android|iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(plataforma) && navigator.maxTouchPoints > 1)) {
      return "movil";
    }
    if (/Win/i.test(plataforma) || /Windows/i.test(ua)) return "windows";
    if (/Mac/i.test(plataforma) || /Mac OS X/i.test(ua)) return "mac";
    if (/Linux|X11|CrOS/i.test(plataforma) || /Linux/i.test(ua)) return "linux-appimage";
    return null;
  }

  function prepararDescarga() {
    const sistema = detectarSistema();
    if (sistema === "movil") {
      raiz.classList.add("movil");
      return;
    }
    // Sin sistema reconocido: las tres descargas, como sin JS.
    if (!sistema) {
      raiz.classList.remove("js");
      return;
    }
    const fuente = document.querySelector(`.descarga-tres a[data-plataforma="${sistema}"]`);
    const boton = document.querySelector("[data-cta]");
    const texto = document.querySelector("[data-cta-texto]");
    if (fuente && boton && texto) {
      boton.href = fuente.href;
      texto.textContent = `Descargar para ${NOMBRES[sistema]}`;
    }
    // La nota breve de esa descarga, pegada al botón (la misma de su tarjeta en
    // #descargas). En macOS dice que es solo Apple Silicon: el user agent de un
    // Mac Intel y el de uno Apple Silicon son iguales.
    const nota = document.querySelector(`.cta-nota[data-nota="${sistema}"]`);
    if (nota) nota.hidden = false;
    const columna = document.querySelector(`.sistema[data-sistema="${sistema.split("-")[0]}"]`);
    if (columna) columna.classList.add("es-tuyo");
  }

  // ---------- Capturas que todavía no existen ----------

  function marcosVacios() {
    for (const img of document.querySelectorAll(".marco img")) {
      const marcar = () => img.parentElement.classList.add("sin-imagen");
      if (img.complete && img.naturalWidth === 0) marcar();
      else img.addEventListener("error", marcar, { once: true });
    }
  }

  // ---------- La regla del día ----------

  const regla = document.querySelector(".regla");
  const lectura = document.querySelector(".regla-lectura");
  const tramos = Array.from(document.querySelectorAll("main > .tramo"));
  const enlaces = new Map(
    Array.from(document.querySelectorAll(".regla-horas a")).map((a) => [a.dataset.estacion, a]),
  );

  // Posición en la escala (06–24 h) de cada estación, en %.
  function posicion(hora) {
    const m = /^(\d{2}):(\d{2})$/.exec(hora);
    if (!m) return null;
    return ((Number(m[1]) + Number(m[2]) / 60 - 6) / 18) * 100;
  }

  // Inversa de posicion(): la hora en una posición de la escala, redondeada a 5 min.
  function horaDe(pos) {
    const minutos = Math.round(((pos / 100) * 18 * 60 + 6 * 60) / 5) * 5;
    const h = Math.floor(minutos / 60) % 24;
    const m = minutos % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  let horaMostrada = lectura ? lectura.textContent.trim() : "";

  function girarHora(nueva) {
    if (!lectura || nueva === horaMostrada) return;
    horaMostrada = nueva;
    const vieja = lectura.querySelector("span:not(.sale)");
    const span = document.createElement("span");
    span.textContent = nueva;
    if (sinMovimiento.matches || !vieja) {
      lectura.replaceChildren(span);
      return;
    }
    span.className = "entra";
    lectura.append(span);
    // Forzar el estilo inicial antes de animar.
    void span.offsetWidth;
    span.className = "";
    vieja.className = "sale";
    vieja.addEventListener("transitionend", () => vieja.remove(), { once: true });
    setTimeout(() => vieja.remove(), 400);
  }

  function marcarActiva(id) {
    for (const [estacion, a] of enlaces) {
      if (estacion === id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    }
  }

  // El avance del día y el tono salen del centro de la pantalla: dentro de
  // cada tramo se interpola hacia el siguiente.
  function medir() {
    const centro = window.innerHeight * 0.45;
    let i = tramos.findIndex((t) => t.getBoundingClientRect().bottom > centro);
    if (i === -1) i = tramos.length - 1;
    const tramo = tramos[i];
    const caja = tramo.getBoundingClientRect();
    const progreso = Math.min(1, Math.max(0, (centro - caja.top) / Math.max(1, caja.height)));
    const siguiente = tramos[i + 1];

    const tono = Number(tramo.style.getPropertyValue("--t")) || 0;
    const tonoSig = siguiente ? Number(siguiente.style.getPropertyValue("--t")) || 0 : tono;
    raiz.style.setProperty("--hundimiento", String(tono + (tonoSig - tono) * progreso));

    const hora = tramo.dataset.hora || "";
    const p = posicion(hora);
    if (regla) {
      if (hora === "mañana") {
        // El día siguiente: la lectura dice «mañana» y el indicador vuelve al
        // principio de la escala, como el fondo vuelve a la luz del día.
        regla.dataset.dia = "manana";
        regla.style.setProperty("--avance", "0");
      } else if (p === null) {
        regla.dataset.dia = "terminado";
      } else {
        delete regla.dataset.dia;
        const pSig = siguiente ? posicion(siguiente.dataset.hora || "") : null;
        const avance = pSig === null ? p : p + (pSig - p) * progreso;
        regla.style.setProperty("--avance", avance.toFixed(2));
        // La lectura da la hora del indicador, de a cinco minutos.
        girarHora(horaDe(avance));
      }
    }
    if (p === null) girarHora(hora);
    marcarActiva(tramo.classList.contains("hero") ? "escribis" : tramo.id);
  }

  let pendiente = false;
  function alDesplazar() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      medir();
    });
  }

  // Un punto marca la hora del visitante, si cae dentro de la escala.
  function marcarAhora() {
    const ahora = document.querySelector(".regla-ahora");
    const texto = document.querySelector(".regla-ahora-hora");
    if (!ahora || !texto) return;
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    const p = posicion(`${hh}:${mm}`);
    if (p === null || p < 0 || p > 100) {
      ahora.hidden = true;
      return;
    }
    ahora.style.setProperty("--ahora", `${p.toFixed(2)}%`);
    ahora.title = `Ahora, en tu reloj: ${hh}:${mm}`;
    texto.textContent = `${hh}:${mm}`;
    ahora.hidden = false;
  }

  // ---------- Entrada de las capturas ----------

  function entradas() {
    if (sinMovimiento.matches || !("IntersectionObserver" in window)) return;
    raiz.classList.add("movimiento");
    const obs = new IntersectionObserver(
      (registros) => {
        for (const r of registros) {
          if (r.isIntersecting) {
            r.target.classList.add("visible");
            obs.unobserve(r.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const f of document.querySelectorAll(".captura:not(.captura-hero)")) obs.observe(f);
  }

  // ---------- Arranque ----------

  prepararDescarga();
  marcosVacios();
  marcarAhora();
  setInterval(marcarAhora, 60_000);
  entradas();

  // El tono atado al scroll es movimiento: con reduced-motion cada tramo
  // conserva su tono fijo (el del CSS) y la regla igual sigue al lector.
  if (!sinMovimiento.matches) raiz.classList.add("tono-vivo");
  medir();
  window.addEventListener("scroll", alDesplazar, { passive: true });
  window.addEventListener("resize", alDesplazar);
})();
