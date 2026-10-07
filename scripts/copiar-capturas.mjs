// Copia las capturas de capturas/ (donde se guardan y versionan) a
// public/capturas/ (lo que sirve Static Assets). Corre antes de dev, test y
// deploy. Si capturas/ no existe todavía, no hace nada: la página muestra
// marcos vacíos del tamaño correcto.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const origen = join(raiz, "capturas");
const destino = join(raiz, "public", "capturas");

rmSync(destino, { recursive: true, force: true });
if (!existsSync(origen)) {
  console.log("capturas/ no existe todavía: la página usa marcos vacíos.");
  process.exit(0);
}
mkdirSync(destino, { recursive: true });
const imagenes = readdirSync(origen).filter((f) => /\.(png|webp|avif|jpe?g)$/i.test(f));
for (const f of imagenes) cpSync(join(origen, f), join(destino, f));
console.log(`Copiadas ${imagenes.length} capturas a public/capturas/.`);
