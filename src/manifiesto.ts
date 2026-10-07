/**
 * Lectura de `latest.json` (el manifiesto del updater de Tauri) desde R2, con
 * caché y tolerancia a fallos: si R2 no responde, se devuelve la última copia
 * buena que se tenga o `null`, nunca una excepción.
 */

export interface Plataforma {
  url: string;
  signature?: string;
}

export interface Manifiesto {
  version: string;
  notes: string;
  pub_date: string;
  platforms: Record<string, Plataforma>;
}

export interface EntornoManifiesto {
  RELEASES: R2Bucket;
}

export const CLAVE_MANIFIESTO = "latest.json";
/** Cuánto vale una copia leída: unos minutos, para que un release se vea enseguida. */
export const TTL_SEGUNDOS = 300;
/** Tras un fallo, cuánto se espera antes de volver a pedirle a R2. */
export const TTL_FALLO_SEGUNDOS = 30;
/** Tope de espera a R2: la página no puede quedar colgada de un bucket lento. */
export const TIEMPO_MAXIMO_MS = 2500;

/** Clave sintética de la Cache API (no es una URL que se sirva). */
const CLAVE_CACHE = "https://manifiesto.mycelium.invalid/latest.json";

const RE_VERSION = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

/** Valida la forma del manifiesto; devuelve `null` si no sirve. */
export function validarManifiesto(datos: unknown): Manifiesto | null {
  if (!datos || typeof datos !== "object") return null;
  const d = datos as Record<string, unknown>;
  if (typeof d.version !== "string" || !RE_VERSION.test(d.version)) return null;
  if (!d.platforms || typeof d.platforms !== "object") return null;
  const platforms: Record<string, Plataforma> = {};
  for (const [clave, valor] of Object.entries(d.platforms as Record<string, unknown>)) {
    const url = (valor as { url?: unknown } | null)?.url;
    if (typeof url === "string" && url.startsWith("https://")) platforms[clave] = { url };
  }
  const fecha = typeof d.pub_date === "string" && !Number.isNaN(Date.parse(d.pub_date)) ? d.pub_date : "";
  return {
    version: d.version,
    notes: typeof d.notes === "string" ? d.notes : "",
    pub_date: fecha,
    platforms,
  };
}

interface Memoria {
  valor: Manifiesto | null;
  vence: number;
  /** Última copia buena, para servir algo si R2 cae después. */
  ultimaBuena: Manifiesto | null;
}

// Caché por aislamiento. La Cache API no funciona en *.workers.dev, así que
// esta es la que realmente evita leer R2 en cada visita ahí.
let memoria: Memoria = { valor: null, vence: 0, ultimaBuena: null };

/** Solo para tests. */
export async function olvidarManifiesto(): Promise<void> {
  memoria = { valor: null, vence: 0, ultimaBuena: null };
  await caches.default.delete(CLAVE_CACHE).catch(() => false);
}

/** Solo para tests: vence la memoria sin perder la última copia buena. */
export async function vencerManifiesto(): Promise<void> {
  memoria = { ...memoria, vence: 0 };
  await caches.default.delete(CLAVE_CACHE).catch(() => false);
}

function conTiempoMaximo<T>(promesa: Promise<T>, ms: number): Promise<T> {
  let temporizador: ReturnType<typeof setTimeout> | undefined;
  const limite = new Promise<never>((_, rechazar) => {
    temporizador = setTimeout(() => rechazar(new Error(`R2 no respondió en ${ms} ms`)), ms);
  });
  return Promise.race([promesa, limite]).finally(() => {
    if (temporizador !== undefined) clearTimeout(temporizador);
  });
}

async function leerDeCache(): Promise<Manifiesto | null> {
  try {
    const r = await caches.default.match(CLAVE_CACHE);
    return r ? validarManifiesto(await r.json()) : null;
  } catch {
    return null;
  }
}

async function guardarEnCache(m: Manifiesto, ctx?: ExecutionContext): Promise<void> {
  const respuesta = new Response(JSON.stringify(m), {
    headers: {
      "content-type": "application/json",
      "cache-control": `public, max-age=${TTL_SEGUNDOS}`,
    },
  });
  const p = caches.default.put(CLAVE_CACHE, respuesta).catch(() => {});
  // Con contexto, no demora la respuesta; sin él, se espera.
  if (ctx) ctx.waitUntil(p);
  else await p;
}

async function leerDeR2(env: EntornoManifiesto): Promise<Manifiesto | null> {
  const objeto = await conTiempoMaximo(env.RELEASES.get(CLAVE_MANIFIESTO), TIEMPO_MAXIMO_MS);
  if (!objeto) return null;
  return validarManifiesto(await objeto.json());
}

/**
 * El manifiesto vigente, o `null` si no hay forma de saberlo. No lanza.
 * Orden: memoria → Cache API → R2. Si R2 falla, la última copia buena.
 */
export async function leerManifiesto(
  env: EntornoManifiesto,
  ctx?: ExecutionContext,
  ahora: number = Date.now(),
): Promise<Manifiesto | null> {
  if (ahora < memoria.vence) return memoria.valor;

  const enCache = await leerDeCache();
  if (enCache) {
    memoria = { valor: enCache, vence: ahora + TTL_SEGUNDOS * 1000, ultimaBuena: enCache };
    return enCache;
  }

  try {
    const m = await leerDeR2(env);
    if (m) {
      memoria = { valor: m, vence: ahora + TTL_SEGUNDOS * 1000, ultimaBuena: m };
      await guardarEnCache(m, ctx);
      return m;
    }
  } catch (e) {
    console.warn("No pude leer latest.json de R2:", e instanceof Error ? e.message : e);
  }
  const respaldo = memoria.ultimaBuena;
  memoria = { valor: respaldo, vence: ahora + TTL_FALLO_SEGUNDOS * 1000, ultimaBuena: respaldo };
  return respaldo;
}
