// Genera las capturas que sirve la página a partir de las PNG de capturas/
// (donde se guardan y versionan, a 2880×1800). Por cada una escribe en
// public/capturas/:
//   <nombre>.webp        a 2880 px, para pantallas 2x en escritorio
//   <nombre>-1440.webp   a 1440 px, para 1x y para el celular
// y además og.jpg (1200 px) para la vista previa al compartir el enlace, que
// algunos lectores de Open Graph todavía no aceptan en WebP.
//
// Corre antes de dev, test y deploy. Es incremental: solo rehace lo que falta o
// quedó más viejo que su PNG. Si capturas/ no existe, la página muestra marcos
// vacíos del tamaño correcto.
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
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

if (!existsSync(origen)) {
  rmSync(destino, { recursive: true, force: true });
  console.log("capturas/ no existe todavía: la página usa marcos vacíos.");
  process.exit(0);
}
mkdirSync(destino, { recursive: true });

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
  if (f === OG.fuente) {
    const salida = join(destino, OG.archivo);
    esperados.add(OG.archivo);
    if (pendiente(entrada, salida)) {
      await sharp(entrada).resize({ width: OG.ancho }).jpeg({ quality: 85, mozjpeg: true }).toFile(salida);
      hechas++;
    }
  }
}

// Lo que ya no tiene su PNG (o quedó de una versión anterior del script) sobra.
for (const f of readdirSync(destino)) {
  if (!esperados.has(f)) rmSync(join(destino, f), { force: true });
}

const total = [...esperados].reduce((s, f) => s + statSync(join(destino, f)).size, 0);
console.log(
  `Capturas: ${fuentes.length} PNG → ${esperados.size} archivos en public/capturas/ ` +
    `(${hechas} generados ahora, ${(total / 1024 / 1024).toFixed(2)} MB en total).`,
);
