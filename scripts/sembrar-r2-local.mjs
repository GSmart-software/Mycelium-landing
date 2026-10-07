// Siembra el R2 local de `wrangler dev` con un latest.json, para probar la
// inyección sin tocar el bucket real.
//
//   npm run sembrar                       # usa ../installers/v2.4.0/latest.json
//   npm run sembrar -- ruta/latest.json   # otro manifiesto
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const archivo = resolve(process.argv[2] ?? join(raiz, "..", "installers", "v2.4.0", "latest.json"));
if (!existsSync(archivo)) {
  console.error(`No encuentro ${archivo}. Pasá la ruta de un latest.json.`);
  process.exit(1);
}
const r = spawnSync(
  "npx",
  ["wrangler", "r2", "object", "put", "mycelium-releases/latest.json", "--local", "--file", archivo, "--content-type", "application/json"],
  { cwd: raiz, stdio: "inherit", shell: process.platform === "win32" },
);
process.exit(r.status ?? 1);
