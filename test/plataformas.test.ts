import { describe, expect, it } from "vitest";
import { validarManifiesto } from "../src/manifiesto";
import { esPlataforma, urlDescarga, urlRespaldo } from "../src/plataformas";
import crudo from "./fixtures/latest.json";

const BASE = "https://pub-4a4b6d7b99be4917a2fe0074be9dfa40.r2.dev";
const m = validarManifiesto(crudo)!;

describe("urlDescarga", () => {
  it("toma del manifiesto Windows y los tres de Linux", () => {
    expect(urlDescarga(m, "windows", BASE)).toBe(`${BASE}/2.4.0/Mycelium_2.4.0_x64-setup.exe`);
    expect(urlDescarga(m, "linux-appimage", BASE)).toBe(`${BASE}/2.4.0/Mycelium_2.4.0_amd64.AppImage`);
    expect(urlDescarga(m, "linux-deb", BASE)).toBe(`${BASE}/2.4.0/Mycelium_2.4.0_amd64.deb`);
    expect(urlDescarga(m, "linux-rpm", BASE)).toBe(`${BASE}/2.4.0/Mycelium-2.4.0-1.x86_64.rpm`);
  });

  it("deriva el .dmg de macOS (el manifiesto trae el .app.tar.gz del updater)", () => {
    expect(urlDescarga(m, "mac", BASE)).toBe(`${BASE}/2.4.0/Mycelium_2.4.0_aarch64.dmg`);
    expect(urlDescarga(m, "mac", `${BASE}/`)).toBe(`${BASE}/2.4.0/Mycelium_2.4.0_aarch64.dmg`);
  });

  it("sigue a la versión del manifiesto", () => {
    const nueva = validarManifiesto({
      ...crudo,
      version: "2.5.0",
      platforms: {
        "windows-x86_64": { url: `${BASE}/2.5.0/Mycelium_2.5.0_x64-setup.exe` },
        "darwin-aarch64": { url: `${BASE}/2.5.0/Mycelium_2.5.0_aarch64.app.tar.gz` },
      },
    })!;
    expect(urlDescarga(nueva, "windows", BASE)).toBe(`${BASE}/2.5.0/Mycelium_2.5.0_x64-setup.exe`);
    expect(urlDescarga(nueva, "mac", BASE)).toBe(`${BASE}/2.5.0/Mycelium_2.5.0_aarch64.dmg`);
  });

  it("null si la versión no publicó esa plataforma", () => {
    const soloWindows = validarManifiesto({
      version: "2.5.0",
      platforms: { "windows-x86_64": { url: `${BASE}/2.5.0/x.exe` } },
    })!;
    expect(urlDescarga(soloWindows, "mac", BASE)).toBeNull();
    expect(urlDescarga(soloWindows, "linux-rpm", BASE)).toBeNull();
  });
});

describe("urlRespaldo", () => {
  it("arma los nombres de una versión conocida", () => {
    expect(urlRespaldo("windows", BASE, "2.4.0")).toBe(urlDescarga(m, "windows", BASE));
    expect(urlRespaldo("mac", BASE, "2.4.0")).toBe(urlDescarga(m, "mac", BASE));
    expect(urlRespaldo("linux-appimage", BASE, "2.4.0")).toBe(urlDescarga(m, "linux-appimage", BASE));
    expect(urlRespaldo("linux-deb", BASE, "2.4.0")).toBe(urlDescarga(m, "linux-deb", BASE));
    expect(urlRespaldo("linux-rpm", BASE, "2.4.0")).toBe(urlDescarga(m, "linux-rpm", BASE));
  });
});

describe("esPlataforma", () => {
  it("solo las cinco rutas", () => {
    expect(esPlataforma("mac")).toBe(true);
    expect(esPlataforma("linux")).toBe(false);
    expect(esPlataforma("windows-msi")).toBe(false);
  });
});

describe("validarManifiesto", () => {
  it("rechaza versiones raras y URLs que no son https", () => {
    expect(validarManifiesto({ version: "2.4.0<script>", platforms: {} })).toBeNull();
    expect(validarManifiesto({ version: "../../x", platforms: {} })).toBeNull();
    expect(validarManifiesto(null)).toBeNull();
    const v = validarManifiesto({
      version: "2.4.0",
      platforms: { "windows-x86_64": { url: "javascript:alert(1)" } },
    })!;
    expect(v.platforms["windows-x86_64"]).toBeUndefined();
  });
});
