/**
 * Worker de la landing de Mycelium.
 *
 * - `/` (y `/index.html`): sirve `public/index.html` con la versión, la fecha y
 *   las novedades de `latest.json` inyectadas. Si R2 falla, la misma página
 *   sin versión: nunca un 500.
 * - `/descargar/<plataforma>`: 302 al instalador de la última versión.
 * - Todo lo demás lo sirve Static Assets sin pasar por acá.
 */
import { inyectar } from "./inyectar";
import { leerManifiesto } from "./manifiesto";
import { esPlataforma, urlDescarga, urlRespaldo } from "./plataformas";

export interface Env {
  ASSETS: Fetcher;
  RELEASES: R2Bucket;
  URL_PUBLICA: string;
  VERSION_RESPALDO: string;
}

/** Cabeceras de la página. La CSP admite el único script en línea por su hash. */
export const HASH_SCRIPT_EN_LINEA = "sha256-qOhFsq0QMV2REqNwk5hGH5bZE9SkX6gt6yeyKdYPv+U=";

const CABECERAS_PAGINA: Record<string, string> = {
  "content-type": "text/html; charset=utf-8",
  // Corta: un release nuevo tiene que verse en minutos.
  "cache-control": "public, max-age=120",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "content-security-policy": [
    "default-src 'self'",
    `script-src 'self' '${HASH_SCRIPT_EN_LINEA}'`,
    "style-src 'self' https://fonts.googleapis.com",
    // Las posiciones de la regla y el tono de cada tramo van en style="--x".
    "style-src-attr 'unsafe-inline'",
    "font-src https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'none'",
  ].join("; "),
};

async function pagina(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const raiz = new URL("/", request.url);
  // Sin las cabeceras condicionales del visitante: la respuesta final no es el
  // archivo tal cual, así que un 304 del archivo no le serviría.
  const estatica = await env.ASSETS.fetch(new Request(raiz));
  if (!estatica.ok) return estatica;

  const cabeceras = new Headers(estatica.headers);
  for (const [k, v] of Object.entries(CABECERAS_PAGINA)) cabeceras.set(k, v);
  // El contenido cambia con cada release: la ETag del archivo ya no lo describe.
  cabeceras.delete("etag");
  const base = new Response(estatica.body, { status: 200, headers: cabeceras });

  let manifiesto = null;
  try {
    manifiesto = await leerManifiesto(env, ctx);
  } catch {
    manifiesto = null;
  }
  const respuesta = inyectar(base, manifiesto);
  if (request.method === "HEAD") return new Response(null, { status: 200, headers: respuesta.headers });
  return respuesta;
}

async function descargar(plataforma: string, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (!esPlataforma(plataforma)) {
    return new Response(null, { status: 302, headers: { location: "/#descargas" } });
  }
  let destino: string | null = null;
  try {
    const m = await leerManifiesto(env, ctx);
    if (m) destino = urlDescarga(m, plataforma, env.URL_PUBLICA);
  } catch {
    destino = null;
  }
  destino ??= urlRespaldo(plataforma, env.URL_PUBLICA, env.VERSION_RESPALDO);
  return new Response(null, {
    status: 302,
    headers: { location: destino, "cache-control": "no-store" },
  });
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const metodoLectura = request.method === "GET" || request.method === "HEAD";

    if (url.pathname.startsWith("/descargar/") && metodoLectura) {
      return descargar(decodeURIComponent(url.pathname.slice("/descargar/".length)).replace(/\/$/, ""), env, ctx);
    }

    if ((url.pathname === "/" || url.pathname === "/index.html") && metodoLectura) {
      try {
        return await pagina(request, env, ctx);
      } catch (e) {
        // Último recurso: la página tal cual, sin inyectar nada.
        console.error("Falló la inyección; sirvo la página estática:", e);
        return env.ASSETS.fetch(new Request(new URL("/", request.url)));
      }
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
