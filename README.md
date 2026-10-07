# Landing de Mycelium

Página estática (`public/`) servida por un **Cloudflare Worker** con Workers Static Assets.
El Worker corre solo en `/`, `/index.html` y `/descargar/*`; el resto lo sirve Static Assets
directo.

- **`/`**: lee `latest.json` del bucket R2 `mycelium-releases` (binding `RELEASES`), lo cachea
  5 minutos (memoria del aislamiento + Cache API) e inyecta con `HTMLRewriter` la versión, la
  fecha y las novedades (Markdown → HTML con un renderer propio que escapa todo).
- **`/descargar/<plataforma>`**: 302 al instalador de la última versión. Plataformas:
  `windows` (setup.exe), `mac` (`.dmg` de Apple Silicon, derivado de la versión),
  `linux-appimage`, `linux-deb`, `linux-rpm`.
- **Si R2 falla** (no responde en 2,5 s, no está el archivo o no es JSON válido): la página se
  sirve igual, sin versión ni novedades y con un aviso; las descargas usan la última copia buena
  del manifiesto o, si no hay, `VERSION_RESPALDO` (`wrangler.toml`). Nunca un 500.

`public/index.html` trae valores por defecto (la 2.4.0) para funcionar abierto sin el Worker.

## Estructura

```
public/            la página: index.html, estilos.css, sitio.js, favicon.svg, 404.html, _headers
capturas/          capturas de la app (PNG, 2880×1800): la fuente que se versiona
src/worker.ts      rutas
src/manifiesto.ts  lectura de latest.json, caché y respaldo
src/plataformas.ts URL de cada instalador
src/markdown.ts    renderer seguro de las novedades
src/inyectar.ts    HTMLRewriter
src/cabeceras.ts   cabeceras y CSP de la página
test/              vitest dentro de workerd (@cloudflare/vitest-plugin)
```

## Local

```sh
npm install
npm run sembrar        # sube ../installers/v2.4.0/latest.json al R2 local
npm run dev            # wrangler dev en http://localhost:8787
npm test               # tests (renderer, URLs, caché, respaldo, inyección)
npm run typecheck
```

`npm run sembrar -- otra/ruta/latest.json` siembra otro manifiesto. Sin sembrar, la página
muestra el modo de respaldo (sirve para probarlo).

> [!warning] El script en línea y la CSP
> `index.html` tiene un único `<script>` en línea (marca `html.js`). La CSP lo admite por su
> hash, que está en `src/cabeceras.ts`. Si lo cambiás, recalculá el hash: un test lo verifica.

## Capturas

Las PNG de `capturas/` (2880×1800, vault de demostración «Huerta del barrio») son la fuente.
`npm run capturas` (corre solo antes de `dev`, `test` y `deploy`) las convierte con `sharp` en
`public/capturas/`: `<nombre>.webp` a 2880 px y `<nombre>-1440.webp` a 1440 px, que la página
elige con `srcset`/`sizes`, más `og.jpg` (1200 px) para la vista previa al compartir. También
recorta regiones de las capturas (`RECORTES` en el script: `<nombre>-recorte.webp`, `-recorte-1x` y
`-recorte-movil`) para que la interfaz se lea al tamaño en que se presenta: en el celular, y en
escritorio en las figuras chicas. Si cambiás una región, actualizá el `width`/`height` y la
`--proporcion` de su figura en `index.html`. Es
incremental: solo rehace lo que falta o quedó más viejo que su PNG. Para cambiar una captura,
reemplazá la PNG con el mismo nombre; si es nueva, agregá su `<img>` con el mismo patrón y un
`alt` que diga lo que se ve.

## Desplegar

Requiere una cuenta de Cloudflare con acceso al bucket `mycelium-releases`.

```sh
npx wrangler login
npm run deploy         # genera las capturas, typecheck, tests y wrangler deploy
```

Después, en el panel de Cloudflare, asociá el dominio al Worker (Workers → mycelium-landing →
Settings → Domains & Routes). En `*.workers.dev` la Cache API no funciona; la caché en memoria
igual evita leer R2 en cada visita.

Al publicar una versión nueva de la app (`npm run publicar` en el repo principal), la landing
la muestra sola en unos minutos: no hay que redesplegar. Subí `VERSION_RESPALDO` cuando quieras
que el respaldo apunte a una más reciente.
