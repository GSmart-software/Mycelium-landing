/**
 * Qué archivo baja cada botón. Las claves son las del manifiesto del updater;
 * la de macOS (`darwin-aarch64`) apunta al `.app.tar.gz` del updater, que no
 * sirve para instalar: el `.dmg` se deriva de la versión.
 */
import type { Manifiesto } from "./manifiesto";

export const PLATAFORMAS = ["windows", "mac", "linux-appimage", "linux-deb", "linux-rpm"] as const;
export type Plataforma = (typeof PLATAFORMAS)[number];

const CLAVE_MANIFIESTO: Record<Exclude<Plataforma, "mac">, string> = {
  windows: "windows-x86_64",
  "linux-appimage": "linux-x86_64",
  "linux-deb": "linux-x86_64-deb",
  "linux-rpm": "linux-x86_64-rpm",
};

export function esPlataforma(valor: string): valor is Plataforma {
  return (PLATAFORMAS as readonly string[]).includes(valor);
}

function sinBarraFinal(base: string): string {
  return base.replace(/\/+$/, "");
}

/** El `.dmg` de Apple Silicon de una versión. */
export function urlDmg(base: string, version: string): string {
  return `${sinBarraFinal(base)}/${version}/Mycelium_${version}_aarch64.dmg`;
}

/** URL del instalador de `plataforma` según el manifiesto, o `null` si no lo publica. */
export function urlDescarga(m: Manifiesto, plataforma: Plataforma, base: string): string | null {
  if (plataforma === "mac") {
    // Se ofrece el .dmg solo si esa versión publicó build de macOS.
    return m.platforms["darwin-aarch64"] ? urlDmg(base, m.version) : null;
  }
  return m.platforms[CLAVE_MANIFIESTO[plataforma]]?.url ?? null;
}

/**
 * URLs de una versión conocida, armadas por convención de nombres. Se usan
 * cuando R2 no responde: los archivos de una versión publicada no cambian.
 */
export function urlRespaldo(plataforma: Plataforma, base: string, version: string): string {
  const raiz = `${sinBarraFinal(base)}/${version}`;
  switch (plataforma) {
    case "windows":
      return `${raiz}/Mycelium_${version}_x64-setup.exe`;
    case "mac":
      return urlDmg(base, version);
    case "linux-appimage":
      return `${raiz}/Mycelium_${version}_amd64.AppImage`;
    case "linux-deb":
      return `${raiz}/Mycelium_${version}_amd64.deb`;
    case "linux-rpm":
      return `${raiz}/Mycelium-${version}-1.x86_64.rpm`;
  }
}
