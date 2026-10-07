/**
 * Inyecta la versión vigente en el HTML estático con HTMLRewriter.
 *
 * El HTML de `public/index.html` trae valores por defecto (la última versión
 * conocida al escribirlo) para funcionar abierto sin el Worker. Las marcas que
 * se reemplazan son atributos `data-mic`:
 *
 * - `data-mic="version"`: el número de versión (texto).
 * - `data-mic="fecha"`: un `<time>` con la fecha de publicación.
 * - `data-mic="novedades"`: el contenedor de las notas del release (HTML).
 * - `data-mic="con-version"`: se quita entero si no se sabe la versión.
 * - `data-mic="sin-version"`: lleva `hidden`; se muestra si no se sabe.
 * - `a[data-plataforma]`: su `href` pasa a `/descargar/<plataforma>`.
 */
import type { Manifiesto } from "./manifiesto";
import { renderizarMarkdown } from "./markdown";

const FORMATO_FECHA: Intl.DateTimeFormatOptions = {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Argentina/Buenos_Aires",
};

/** «6 de octubre de 2026». Vacío si la fecha no es válida. */
export function fechaLegible(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  try {
    return new Intl.DateTimeFormat("es-AR", FORMATO_FECHA).format(new Date(t));
  } catch {
    return new Date(t).toISOString().slice(0, 10);
  }
}

/** `YYYY-MM-DD` en la hora de Argentina, para el atributo `datetime`. */
export function fechaIso(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "";
  try {
    // en-CA formatea como AAAA-MM-DD.
    return new Intl.DateTimeFormat("en-CA", { ...FORMATO_FECHA, month: "2-digit", day: "2-digit" }).format(
      new Date(t),
    );
  } catch {
    return new Date(t).toISOString().slice(0, 10);
  }
}

export function inyectar(respuesta: Response, m: Manifiesto | null): Response {
  const reescritor = new HTMLRewriter().on("a[data-plataforma]", {
    element(el) {
      const p = el.getAttribute("data-plataforma");
      if (p) el.setAttribute("href", `/descargar/${encodeURIComponent(p)}`);
    },
  });

  if (!m) {
    return reescritor
      .on('[data-mic="con-version"]', { element: (el) => void el.remove() })
      .on('[data-mic="sin-version"]', { element: (el) => void el.removeAttribute("hidden") })
      .on('[data-mic="novedades"]', { element: (el) => void el.remove() })
      .transform(respuesta);
  }

  const fecha = fechaLegible(m.pub_date);
  const novedades = m.notes.trim() ? renderizarMarkdown(m.notes, { nivelBase: 2 }) : "";

  return reescritor
    .on('[data-mic="version"]', { element: (el) => void el.setInnerContent(m.version) })
    .on('[data-mic="fecha"]', {
      element(el) {
        if (!fecha) return void el.remove();
        el.setInnerContent(fecha);
        el.setAttribute("datetime", fechaIso(m.pub_date));
      },
    })
    .on('[data-mic="novedades"]', {
      element(el) {
        if (novedades) el.setInnerContent(novedades, { html: true });
        else el.remove();
      },
    })
    .transform(respuesta);
}
