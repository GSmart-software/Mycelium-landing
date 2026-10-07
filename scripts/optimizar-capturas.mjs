// Genera las capturas que sirve la página a partir de las PNG de capturas/
// (donde se guardan y versionan, a 2880×1800). Por cada una escribe en
// public/capturas/:
//   <nombre>.webp        a 2880 px, para pantallas 2x en escritorio
//   <nombre>-1440.webp   a 1440 px, para 1x y para el celular
// y además og.jpg (1200 px) para la vista previa al compartir el enlace, que
// algunos lectores de Open Graph todavía no aceptan en WebP.
//
// Y los RECORTES: una región de la captura real, para que la interfaz se lea al
// tamaño en que se presenta (entera, una captura de 2880 px mostrada a 350 o 700 px
// deja la letra en 4–7 px). Nunca se achica la UI ni se dibuja: se recorta.
//   <nombre>-recorte.webp        el recorte a 2x de su tamaño de presentación
//   <nombre>-recorte-1x.webp     el mismo a 1x (solo los que se ven en escritorio)
//   <nombre>-recorte-movil.webp  uno más cerrado para el celular, a 2x
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
const ANCHOS = [
  { sufijo: "", ancho: 2880, webp: { ...WEBP, quality: 82 } },
  { sufijo: "-1440", ancho: 1440, webp: WEBP },
];
const OG = { fuente: "01-nota-en-vivo.png", archivo: "og.jpg", ancho: 1200 };

// Regiones en px de la PNG (2880×1800). `ancho` es la salida a 2x: el doble del
// ancho CSS en que se presenta (nunca más que el recorte: no se agranda). Si
// cambiás una región, cambiá también el width/height de su <img>/<source> en
// index.html (son las medidas de la salida) y su --proporcion.
const RECORTES = {
  // Celular: el hero, el grafo y la terminal se ven enteros en escritorio.
  "01-nota-en-vivo": {
    "-recorte": { left: 828, top: 281, width: 972, height: 1073, ancho: 828 },
  },
  "02-grafo": {
    "-recorte": { left: 1123, top: 547, width: 864, height: 893, ancho: 740 },
  },
  "04-terminal-ia": {
    "-recorte": { left: 598, top: 180, width: 842, height: 461, ancho: 740 },
  },
  // Figuras secundarias: el recorte es la imagen también en escritorio.
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

// Si cambia la definición de un recorte, se rehace aunque la PNG no cambió.
const firmaRecortes = join(destino, ".recortes.json");

if (!existsSync(origen)) {
  rmSync(destino, { recursive: true, force: true });
  console.log("capturas/ no existe todavía: la página usa marcos vacíos.");
  process.exit(0);
}
mkdirSync(destino, { recursive: true });

const firmaNueva = JSON.stringify(RECORTES);
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
  for (const { sufijo, ancho, webp } of ANCHOS) {
    const archivo = `${nombre}${sufijo}.webp`;
    const salida = join(destino, archivo);
    esperados.add(archivo);
    if (!pendiente(entrada, salida)) continue;
    await sharp(entrada).resize({ width: ancho, withoutEnlargement: true }).webp(webp).toFile(salida);
    hechas++;
  }
  for (const [sufijo, r] of Object.entries(RECORTES[nombre] ?? {})) {
    const region = { left: r.left, top: r.top, width: r.width, height: r.height };
    const salidas = [{ archivo: `${nombre}${sufijo}.webp`, ancho: r.ancho }];
    if (r.uno) salidas.push({ archivo: `${nombre}${sufijo}-1x.webp`, ancho: Math.round(r.ancho / 2) });
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
    if (pendiente(entrada, salida)) {
      await sharp(entrada).resize({ width: OG.ancho }).jpeg({ quality: 85, mozjpeg: true }).toFile(salida);
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
