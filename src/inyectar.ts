/**
 * Inyecta la versión vigente en el HTML estático con HTMLRewriter.
 *
 * El HTML de `public/index.html` trae valores por defecto (la última versión
 * conocida al escribirlo) para funcionar abierto sin el Worker. Las marcas que
 * se reemplazan son atributos `data-mic`:
 *
 * - `data-mic="version"`: el número de versión (texto).
 * - `data-mic="fecha"`: un `<time>` con la fecha de publicación.
 * - `data-mic="titular"`: el titular de la tapa, el primer título de las notas
 *   (o `TITULAR_GENERICO` si no traen uno).
 * - `data-mic="novedades"`: el sumario de las notas del release (HTML).
 * - `data-mic="con-version"`: se quita entero si no se sabe la versión.
 * - `data-mic="sin-version"`: lleva `hidden`; se muestra si no se sabe.
 * - `a[data-plataforma]`: su `href` pasa a `/descargar/<plataforma>`.
 * - `meta[property="og:image"]`: su `content` pasa a URL absoluta con el
 *   origen de la request (los lectores de Open Graph no resuelven relativas).
 */
import type { Manifiesto } from "./manifiesto";
import { type Novedades, partirNovedades } from "./markdown";

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

const CHEVRON =
  '<svg class="icono" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

/** El titular de la tapa cuando las notas no traen uno. */
export const TITULAR_GENERICO = "Lo que creció en esta versión";

/**
 * El sumario de la tapa: la entrada (si la hay) y una lista numerada con un
 * ítem por grupo de las notas. El título de cada grupo es el `<summary>` de su
 * `<details>`, con el detalle plegado; un grupo sin cuerpo queda como título
 * solo, nunca un `<details>` vacío. La numeración la pone el CSS (el `<ol>` ya
 * la da a los lectores de pantalla).
 */
export function sumarioHtml(n: Novedades): string {
  const partes: string[] = [];
  if (n.entrada) partes.push(n.entrada);
  if (n.grupos.length > 0) {
    const items = n.grupos.map((g) =>
      g.cuerpo.trim()
        ? `<li><details><summary><span>${g.titulo}</span>${CHEVRON}</summary>\n${g.cuerpo}\n</details></li>`
        : `<li><span class="sumario-solo">${g.titulo}</span></li>`,
    );
    partes.push(`<ol class="sumario-lista">\n${items.join("\n")}\n</ol>`);
  }
  return partes.join("\n");
}

/** `relativa` resuelta contra `origen`; vacío si no se puede. */
function absoluta(relativa: string, origen: string): string {
  try {
    return new URL(relativa, origen).href;
  } catch {
    return "";
  }
}

export function inyectar(respuesta: Response, m: Manifiesto | null, origen?: string): Response {
  const reescritor = new HTMLRewriter().on("a[data-plataforma]", {
    element(el) {
      const p = el.getAttribute("data-plataforma");
      if (p) el.setAttribute("href", `/descargar/${encodeURIComponent(p)}`);
    },
  });
  if (origen) {
    reescritor.on('meta[property="og:image"]', {
      element(el) {
        const url = absoluta(el.getAttribute("content") ?? "", origen);
        if (url) el.setAttribute("content", url);
      },
    });
  }

  if (!m) {
    return reescritor
      .on('[data-mic="con-version"]', { element: (el) => void el.remove() })
      .on('[data-mic="sin-version"]', { element: (el) => void el.removeAttribute("hidden") })
      .on('[data-mic="novedades"]', { element: (el) => void el.remove() })
      .transform(respuesta);
  }

  const fecha = fechaLegible(m.pub_date);
  const partes = partirNovedades(m.notes);
  const novedades = sumarioHtml(partes);

  return reescritor
    .on('[data-mic="version"]', { element: (el) => void el.setInnerContent(m.version) })
    .on('[data-mic="fecha"]', {
      element(el) {
        if (!fecha) return void el.remove();
        el.setInnerContent(fecha);
        el.setAttribute("datetime", fechaIso(m.pub_date));
      },
    })
    .on('[data-mic="titular"]', {
      element: (el) => void el.setInnerContent(partes.titular ?? TITULAR_GENERICO, { html: partes.titular !== null }),
    })
    .on('[data-mic="novedades"]', {
      element(el) {
        if (novedades) el.setInnerContent(novedades, { html: true });
        else el.remove();
      },
    })
    .transform(respuesta);
}
