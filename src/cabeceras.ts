/**
 * Cabeceras de la página inyectada. Viven fuera de worker.ts porque el módulo
 * principal de un Worker solo puede exportar handlers.
 */

/** Cabeceras de la página. La CSP admite el único script en línea por su hash. */
export const HASH_SCRIPT_EN_LINEA = "sha256-qOhFsq0QMV2REqNwk5hGH5bZE9SkX6gt6yeyKdYPv+U=";

export const CABECERAS_PAGINA: Record<string, string> = {
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
