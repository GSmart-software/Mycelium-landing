// Landing de Mycelium: detección del sistema, la hifa que se enciende con el
// scroll y la entrada de las capturas. Todo es progresivo: sin este archivo la
// página se lee entera, con la hifa encendida y las tres descargas a la vista.
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

    // En el cierre, la descarga del visitante va primera y dice «tu sistema».
    const lista = document.querySelector(".sistemas");
    const suya = document.querySelector(`.sistema[data-sistema="${sistema.split("-")[0]}"]`);
    if (lista && suya) {
      lista.prepend(suya);
      lista.classList.add("hay-tuyo");
      suya.classList.add("es-tuyo");
      const marca = suya.querySelector(".tu-sistema");
      if (marca) marca.hidden = false;
    }
  }

  // ---------- Capturas que todavía no existen ----------

  function marcosVacios() {
    for (const img of document.querySelectorAll(".marco img")) {
      const marcar = () => img.closest(".marco").classList.add("sin-imagen");
      if (img.complete && img.naturalWidth === 0) marcar();
      else img.addEventListener("error", marcar, { once: true });
    }
  }

  // ---------- La hifa ----------

  // Cada nodo dibuja su tramo de punta a punta de su caja (en el cierre, hasta
  // el anillo); el tramo se llena hasta la altura de lectura y el nodo se
  // enciende cuando la línea alcanza su punto.
  const nodos = Array.from(document.querySelectorAll(".nodo, .cierre"));
  const LECTURA = 0.62;

  function medir() {
    const altura = window.innerHeight * LECTURA;
    for (const nodo of nodos) {
      const punto = nodo.querySelector(".punto");
      if (!punto) continue;
      const caja = punto.getBoundingClientRect();
      const y = caja.top + caja.height / 2;
      nodo.classList.toggle("encendido", y <= altura);
      const arriba = nodo.getBoundingClientRect().top;
      const tramo = nodo.classList.contains("cierre") ? y - arriba : nodo.offsetHeight;
      const lleno = Math.min(1, Math.max(0, (altura - arriba) / Math.max(1, tramo)));
      nodo.style.setProperty("--lleno", lleno.toFixed(4));
    }
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

  function hifa() {
    if (sinMovimiento.matches || nodos.length === 0) return;
    raiz.classList.add("hifa-viva");
    medir();
    window.addEventListener("scroll", alDesplazar, { passive: true });
    window.addEventListener("resize", alDesplazar);
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
    for (const f of document.querySelectorAll(".red .captura")) obs.observe(f);
  }

  // ---------- Arranque ----------

  prepararDescarga();
  marcosVacios();
  entradas();
  hifa();
})();
