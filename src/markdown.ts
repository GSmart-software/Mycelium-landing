/**
 * Renderer de Markdown chico y seguro para las novedades de `latest.json`.
 *
 * Las notas las escribe quien publica, pero terminan dentro del HTML de la
 * página: por eso todo se escapa y solo se reconoce un subconjunto cerrado.
 *
 * - Títulos `#` a `######`: el primero puede ser el titular de la tapa y los
 *   siguientes arman los grupos del sumario (ver `partirNovedades`).
 * - Listas con `-`, `*` o `+` y numeradas (`1.`); las líneas sangradas que
 *   siguen continúan el ítem.
 * - Párrafos (las líneas seguidas se unen).
 * - En línea: `código`, **negrita**, *cursiva* / _cursiva_ y
 *   [enlaces](https://…) solo http(s).
 *
 * Lo demás (HTML crudo, imágenes, tablas, citas) queda como texto escapado.
 */

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escaparHtml(texto: string): string {
  return texto.replace(/[&<>"']/g, (c) => ESCAPES[c] ?? c);
}

/** Devuelve la URL normalizada si es http(s) y válida; si no, `null`. */
export function urlSegura(cruda: string): string | null {
  let url: URL;
  try {
    url = new URL(cruda.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  return url.href;
}

/** Negrita y cursiva sobre texto YA escapado (los marcadores no se escapan). */
function enfasis(escapado: string): string {
  return escapado
    .replace(/\*\*(?=\S)([\s\S]*?\S)\*\*/g, "<strong>$1</strong>")
    .replace(/__(?=\S)([\s\S]*?\S)__/g, "<strong>$1</strong>")
    .replace(/(^|[^\w*])\*(?=\S)([^*]*?\S)\*(?![\w*])/g, "$1<em>$2</em>")
    .replace(/(^|[^\w])_(?=\S)([^_]*?\S)_(?!\w)/g, "$1<em>$2</em>");
}

/**
 * Formato en línea. Primero separa los fragmentos de código y los enlaces
 * (cuyo contenido no debe interpretarse), y escapa todo lo demás.
 */
export function enLinea(texto: string): string {
  const patron = /`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let salida = "";
  let desde = 0;
  for (const m of texto.matchAll(patron)) {
    const inicio = m.index ?? 0;
    salida += enfasis(escaparHtml(texto.slice(desde, inicio)));
    if (m[1] !== undefined) {
      salida += `<code>${escaparHtml(m[1])}</code>`;
    } else {
      const etiqueta = enfasis(escaparHtml(m[2] ?? ""));
      const url = urlSegura(m[3] ?? "");
      salida += url
        ? `<a href="${escaparHtml(url)}" rel="noopener noreferrer">${etiqueta}</a>`
        : etiqueta;
    }
    desde = inicio + m[0].length;
  }
  salida += enfasis(escaparHtml(texto.slice(desde)));
  return salida;
}

type Bloque =
  | { tipo: "titulo"; nivel: number; texto: string }
  | { tipo: "parrafo"; lineas: string[] }
  | { tipo: "lista"; ordenada: boolean; items: string[] };

const RE_TITULO = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const RE_ITEM = /^\s{0,3}([-*+]|\d{1,9}[.)])\s+(.*)$/;

function analizar(markdown: string): Bloque[] {
  const bloques: Bloque[] = [];
  let actual: Bloque | null = null;
  const cerrar = () => {
    if (actual) bloques.push(actual);
    actual = null;
  };

  for (const cruda of markdown.replace(/\r\n?/g, "\n").split("\n")) {
    const linea = cruda.replace(/\s+$/, "");
    if (linea.trim() === "") {
      cerrar();
      continue;
    }
    const titulo = RE_TITULO.exec(linea);
    if (titulo) {
      cerrar();
      bloques.push({ tipo: "titulo", nivel: titulo[1]!.length, texto: titulo[2]! });
      continue;
    }
    const item = RE_ITEM.exec(linea);
    if (item) {
      const ordenada = /\d/.test(item[1]!);
      const enCurso = actual as Bloque | null;
      if (!enCurso || enCurso.tipo !== "lista" || enCurso.ordenada !== ordenada) {
        cerrar();
        actual = { tipo: "lista", ordenada, items: [] };
      }
      (actual as { items: string[] } | null)!.items.push(item[2]!);
      continue;
    }
    const enCurso = actual as Bloque | null;
    if (enCurso?.tipo === "lista" && /^\s+\S/.test(cruda)) {
      // Línea sangrada: continúa el último ítem.
      const ultimo = enCurso.items.length - 1;
      enCurso.items[ultimo] = `${enCurso.items[ultimo]} ${linea.trim()}`;
      continue;
    }
    if (enCurso?.tipo === "parrafo") {
      enCurso.lineas.push(linea.trim());
      continue;
    }
    cerrar();
    actual = { tipo: "parrafo", lineas: [linea.trim()] };
  }
  cerrar();
  return bloques;
}

function renderizarBloques(bloques: Bloque[], desplazamiento: number): string {
  return bloques
    .map((b) => {
      switch (b.tipo) {
        case "titulo": {
          const n = Math.min(6, Math.max(1, b.nivel + desplazamiento));
          return `<h${n}>${enLinea(b.texto)}</h${n}>`;
        }
        case "parrafo":
          return `<p>${enLinea(b.lineas.join(" "))}</p>`;
        case "lista": {
          const etiqueta = b.ordenada ? "ol" : "ul";
          const items = b.items.map((i) => `<li>${enLinea(i)}</li>`).join("");
          return `<${etiqueta}>${items}</${etiqueta}>`;
        }
      }
    })
    .join("\n");
}

/** Las notas de un release partidas para la tapa: todo el HTML ya escapado. */
export interface Novedades {
  /** El título que encabeza las notas, si hay uno solo arriba de todo. */
  titular: string | null;
  /** Lo que viene antes del primer grupo (o todo, si no hay grupos). */
  entrada: string;
  /** Cada grupo: su título y lo que sigue hasta el próximo del mismo nivel. */
  grupos: { titulo: string; cuerpo: string }[];
}

const niveles = (bloques: Bloque[]) => bloques.flatMap((b) => (b.tipo === "titulo" ? [b.nivel] : []));

/**
 * Parte las notas en titular, entrada y grupos.
 *
 * - Si el primer bloque es un título y es el único de su nivel (el menor de
 *   las notas), es el **titular**: «## Tus archivos, al instante».
 * - Los **grupos** son los títulos del menor nivel que queda («### Tareas con
 *   estados»), cada uno con los bloques que lo siguen. Dentro de un grupo, un
 *   título más profundo sale como `<h4>` o menor (el del grupo va en un
 *   `<summary>`, debajo del `<h2>` de la tapa).
 * - Sin títulos, todo es entrada.
 */
export function partirNovedades(markdown: string): Novedades {
  let bloques = analizar(markdown);
  let titular: string | null = null;

  const primero = bloques[0];
  if (primero?.tipo === "titulo") {
    const todos = niveles(bloques);
    const menor = Math.min(...todos);
    if (primero.nivel === menor && todos.filter((n) => n === menor).length === 1) {
      titular = enLinea(primero.texto);
      bloques = bloques.slice(1);
    }
  }

  const resto = niveles(bloques);
  if (resto.length === 0) return { titular, entrada: renderizarBloques(bloques, 0), grupos: [] };

  const nivel = Math.min(...resto);
  const desplazamiento = 3 - nivel;
  const inicio = bloques.findIndex((b) => b.tipo === "titulo" && b.nivel === nivel);
  const grupos: Novedades["grupos"] = [];
  let actual: { titulo: string; bloques: Bloque[] } | null = null;
  const cerrar = () => {
    if (actual) grupos.push({ titulo: actual.titulo, cuerpo: renderizarBloques(actual.bloques, desplazamiento) });
  };
  for (const b of bloques.slice(inicio)) {
    if (b.tipo === "titulo" && b.nivel <= nivel) {
      cerrar();
      actual = { titulo: enLinea(b.texto), bloques: [] };
    } else {
      actual?.bloques.push(b);
    }
  }
  cerrar();
  return { titular, entrada: renderizarBloques(bloques.slice(0, inicio), desplazamiento), grupos };
}
