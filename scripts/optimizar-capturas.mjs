// Genera las capturas que sirve la página a partir de las PNG de capturas/
// (donde se guardan y versionan, a 2880×1800). La página nunca muestra una
// captura entera: muestra RECORTES, regiones de la captura real, para que la
// interfaz se lea al tamaño en que se presenta (entera, una captura de 2880 px
// mostrada a 350 o 700 px deja la letra en 4–7 px). Nunca se achica la UI ni se
// dibuja: se recorta. En public/capturas/ escribe:
//   <nombre>-recorte.webp        el recorte a 2x de su tamaño de presentación
//   <nombre>-recorte-1x.webp     el mismo a 1x (solo los que se ven en escritorio)
//   <nombre>-recorte-movil.webp  uno más cerrado para el celular, a 2x
// Un recorte puede pedir anchos de más (`mas`): <nombre><sufijo>-<ancho>.webp.
// La portada es el lienzo del grafo sin el cromo de la app (barra, rail, botones):
//   02-grafo-portada.webp (+ -1440)  a sangre en escritorio
//   02-grafo-portada-movil.webp      vertical, centrado en la red, para el celular
// y og.jpg (1200×750, también del grafo) para la vista previa al compartir el
// enlace, que algunos lectores de Open Graph todavía no aceptan en WebP.
//
// Corre antes de dev, test y deploy. Es incremental: solo rehace lo que falta o
// quedó más viejo que su PNG. Si capturas/ no existe, la página muestra marcos
// vacíos del tamaño correcto.
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origen = join(raiz, "capturas");
const destino = join(raiz, "public", "capturas");

// Calidad alta y conversión RGB→YUV «sharp» (smartSubsample): el texto de la UI
// (letras chicas, enlaces de color sobre fondo oscuro) no se emborrona en los bordes.
const WEBP = { quality: 88, smartSubsample: true, effort: 6 };
// La vista previa al compartir es la portada: el grafo, a 1200×750.
const OG = {
  fuente: "02-grafo.png",
  archivo: "og.jpg",
  region: { left: 168, top: 176, width: 2464, height: 1540 },
  ancho: 1200,
};

// Regiones en px de la PNG (2880×1800). `ancho` es la salida a 2x: el doble del
// ancho CSS en que se presenta (nunca más que el recorte: no se agranda). Si
// cambiás una región, cambiá también el width/height de su <img>/<source> en
// index.html (son las medidas de la salida: de ahí sale la proporción del marco).
const RECORTES = {
  // El nodo «escribir»: la nota en vivo, también en escritorio.
  "01-nota-en-vivo": {
    "-recorte": { left: 828, top: 281, width: 972, height: 1073, ancho: 828 },
  },
  // La portada: solo el lienzo del grafo (#0b1d27), sin barra de título, rail ni
  // los botones de arriba a la derecha.
  "02-grafo": {
    "-portada": { left: 120, top: 176, width: 2560, height: 1540, ancho: 2560, mas: [1440] },
    "-portada-movil": { left: 1000, top: 200, width: 1100, height: 1500, ancho: 1000 },
  },
  // El nodo «claude code»: en escritorio, la respuesta de la terminal a lo ancho;
  // en el celular, su principio.
  "04-terminal-ia": {
    "-salida": { left: 592, top: 172, width: 2288, height: 520, ancho: 2288, uno: true },
    "-recorte": { left: 598, top: 180, width: 842, height: 461, ancho: 740 },
  },
  "03-paleta": {
    "-recorte": { left: 806, top: 101, width: 1267, height: 706, ancho: 1267, uno: true },
    "-recorte-movil": { left: 847, top: 124, width: 608, height: 452, ancho: 608 },
  },
  "05-lectura-enlaces": {
    "-recorte": { left: 1531, top: 259, width: 1342, height: 1123, ancho: 1342, uno: true },
    "-recorte-movil": { left: 2210, top: 274, width: 662, height: 763, ancho: 662 },
  },
  "06-calendario": {
    "-recorte": { left: 1668, top: 180, width: 1205, height: 986, ancho: 980, uno: true },
    "-recorte-movil": { left: 2290, top: 281, width: 583, height: 727, ancho: 583 },
  },
  "07-lienzo-o-base": {
    "-recorte": { left: 677, top: 353, width: 1325, height: 1202, ancho: 1325, uno: true },
    "-recorte-movil": { left: 1282, top: 806, width: 734, height: 763, ancho: 720 },
  },
  "08-temas-bio-claro": {
    "-recorte": { left: 158, top: 252, width: 1627, height: 1102, ancho: 1627, uno: true },
    "-recorte-movil": { left: 828, top: 274, width: 700, height: 806, ancho: 700 },
  },
  "09-temas-cantarela": {
    "-recorte": { left: 158, top: 252, width: 1627, height: 1102, ancho: 1627, uno: true },
    "-recorte-movil": { left: 828, top: 274, width: 700, height: 806, ancho: 700 },
  },
};

// Si cambia la definición de un recorte (o de og.jpg), se rehace aunque la PNG no cambió.
const firmaRecortes = join(destino, ".recortes.json");

if (!existsSync(origen)) {
  rmSync(destino, { recursive: true, force: true });
  console.log("capturas/ no existe todavía: la página usa marcos vacíos.");
  process.exit(0);
}
mkdirSync(destino, { recursive: true });

const firmaNueva = JSON.stringify({ RECORTES, OG });
const recortesCambiaron = !existsSync(firmaRecortes) || readFileSync(firmaRecortes, "utf8") !== firmaNueva;

const fuentes = readdirSync(origen).filter((f) => /\.png$/i.test(f));
const esperados = new Set();

/** true si `salida` falta o es más vieja que `entrada`. */
const pendiente = (entrada, salida) =>
  !existsSync(salida) || statSync(salida).mtimeMs < statSync(entrada).mtimeMs;

let hechas = 0;
for (const f of fuentes) {
  const entrada = join(origen, f);
  const nombre = basename(f, ".png");
  for (const [sufijo, r] of Object.entries(RECORTES[nombre] ?? {})) {
    const region = { left: r.left, top: r.top, width: r.width, height: r.height };
    const salidas = [{ archivo: `${nombre}${sufijo}.webp`, ancho: r.ancho }];
    if (r.uno) salidas.push({ archivo: `${nombre}${sufijo}-1x.webp`, ancho: Math.round(r.ancho / 2) });
    for (const ancho of r.mas ?? []) salidas.push({ archivo: `${nombre}${sufijo}-${ancho}.webp`, ancho });
    for (const { archivo, ancho } of salidas) {
      const salida = join(destino, archivo);
      esperados.add(archivo);
      if (!recortesCambiaron && !pendiente(entrada, salida)) continue;
      await sharp(entrada)
        .extract(region)
        .resize({ width: ancho, withoutEnlargement: true })
        .webp(WEBP)
        .toFile(salida);
      hechas++;
    }
  }
  if (f === OG.fuente) {
    const salida = join(destino, OG.archivo);
    esperados.add(OG.archivo);
    if (recortesCambiaron || pendiente(entrada, salida)) {
      await sharp(entrada).extract(OG.region).resize({ width: OG.ancho }).jpeg({ quality: 85, mozjpeg: true }).toFile(salida);
      hechas++;
    }
  }
}

writeFileSync(firmaRecortes, firmaNueva);
esperados.add(".recortes.json");

// Lo que ya no tiene su PNG (o quedó de una versión anterior del script) sobra.
for (const f of readdirSync(destino)) {
  if (!esperados.has(f)) rmSync(join(destino, f), { force: true });
}

const total = [...esperados].reduce((s, f) => s + statSync(join(destino, f)).size, 0);
console.log(
  `Capturas: ${fuentes.length} PNG → ${esperados.size} archivos en public/capturas/ ` +
    `(${hechas} generados ahora, ${(total / 1024 / 1024).toFixed(2)} MB en total).`,
);
