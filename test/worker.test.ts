import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { leerManifiesto, olvidarManifiesto, vencerManifiesto } from "../src/manifiesto";
import worker, { HASH_SCRIPT_EN_LINEA, type Env } from "../src/worker";
import crudo from "./fixtures/latest.json";

// Se llama al handler directo (no a SELF) para compartir el módulo con los
// tests: así olvidarManifiesto() vacía la misma caché en memoria que usa el Worker.
const SELF = {
  async fetch(url: string, init?: RequestInit): Promise<Response> {
    const ctx = createExecutionContext();
    const r = await worker.fetch(new Request(url, init) as Request<unknown, IncomingRequestCfProperties>, env as unknown as Env, ctx);
    await waitOnExecutionContext(ctx);
    return r;
  },
};

const BASE = "https://pub-4a4b6d7b99be4917a2fe0074be9dfa40.r2.dev";

async function sembrar(datos: unknown = crudo) {
  await env.RELEASES.put("latest.json", JSON.stringify(datos));
}

beforeEach(async () => {
  await olvidarManifiesto();
  await env.RELEASES.delete("latest.json");
});

describe("la página", () => {
  it("inyecta versión, fecha y novedades", async () => {
    await sembrar({ ...crudo, version: "2.5.0", notes: "## Algo nuevo\n\n- **uno**" });
    const r = await SELF.fetch("https://landing.test/");
    expect(r.status).toBe(200);
    expect(r.headers.get("content-type")).toContain("text/html");
    const html = await r.text();
    expect(html).toContain('<span data-mic="version">2.5.0</span>');
    expect(html).not.toContain('<span data-mic="version">2.4.0</span>');
    expect(html).toMatch(/<time data-mic="fecha" datetime="2026-10-06">6 de octubre de 2026<\/time>/);
    expect(html).toContain("<h3>Algo nuevo</h3>");
    expect(html).toContain("<li><strong>uno</strong></li>");
    // Las notas por defecto del HTML estático se reemplazaron.
    expect(html).not.toContain("Tus archivos, al instante");
    // El aviso de «sin versión» sigue oculto.
    expect(html).toMatch(/data-mic="sin-version" hidden/);
  });

  it("los botones apuntan a /descargar/<plataforma>", async () => {
    await sembrar();
    const html = await (await SELF.fetch("https://landing.test/")).text();
    for (const p of ["windows", "mac", "linux-appimage", "linux-deb", "linux-rpm"]) {
      expect(html).toContain(`data-plataforma="${p}" href="/descargar/${p}"`);
    }
    expect(html).not.toMatch(/data-plataforma="[^"]+" href="https:/);
  });

  it("las novedades maliciosas llegan escapadas", async () => {
    await sembrar({ ...crudo, notes: '<script>alert(1)</script>\n\n[x](javascript:alert(1))' });
    const html = await (await SELF.fetch("https://landing.test/")).text();
    const novedades = html.slice(html.indexOf('data-mic="novedades"'));
    expect(novedades).not.toContain("<script>alert");
    expect(novedades).not.toContain("javascript:");
  });

  it("si R2 no tiene manifiesto, sirve la página sin versión (nunca un 500)", async () => {
    const r = await SELF.fetch("https://landing.test/");
    expect(r.status).toBe(200);
    const html = await r.text();
    expect(html).not.toContain('data-mic="version"');
    expect(html).not.toContain('data-mic="novedades"');
    expect(html).not.toMatch(/data-mic="sin-version" hidden/);
    expect(html).toContain("Windows, macOS y Linux");
    expect(html).toContain('href="/descargar/windows"');
  });

  it("si el manifiesto está roto, también", async () => {
    await env.RELEASES.put("latest.json", "{esto no es json");
    const r = await SELF.fetch("https://landing.test/");
    expect(r.status).toBe(200);
    expect(await r.text()).not.toContain('data-mic="version"');
  });

  it("lleva la CSP con el hash del script en línea del HTML", async () => {
    await sembrar();
    const r = await SELF.fetch("https://landing.test/");
    const html = await r.text();
    const script = /<script>([^<]*)<\/script>/.exec(html)?.[1] ?? "";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script));
    const hash = `sha256-${btoa(String.fromCharCode(...new Uint8Array(digest)))}`;
    expect(hash).toBe(HASH_SCRIPT_EN_LINEA);
    expect(r.headers.get("content-security-policy")).toContain(`'${hash}'`);
  });

  it("/index.html sirve lo mismo", async () => {
    await sembrar();
    const r = await SELF.fetch("https://landing.test/index.html", { redirect: "manual" });
    expect([200, 307, 308]).toContain(r.status);
    if (r.status === 200) expect(await r.text()).toContain('data-mic="version">2.4.0');
  });

  it("los archivos estáticos pasan sin tocar", async () => {
    const r = await SELF.fetch("https://landing.test/estilos.css");
    expect(r.status).toBe(200);
    expect(await r.text()).toContain("--hifa");
  });
});

describe("/descargar", () => {
  it.each([
    ["windows", `${BASE}/2.4.0/Mycelium_2.4.0_x64-setup.exe`],
    ["mac", `${BASE}/2.4.0/Mycelium_2.4.0_aarch64.dmg`],
    ["linux-appimage", `${BASE}/2.4.0/Mycelium_2.4.0_amd64.AppImage`],
    ["linux-deb", `${BASE}/2.4.0/Mycelium_2.4.0_amd64.deb`],
    ["linux-rpm", `${BASE}/2.4.0/Mycelium-2.4.0-1.x86_64.rpm`],
  ])("%s redirige con 302 al instalador", async (plataforma, destino) => {
    await sembrar();
    const r = await SELF.fetch(`https://landing.test/descargar/${plataforma}`, { redirect: "manual" });
    expect(r.status).toBe(302);
    expect(r.headers.get("location")).toBe(destino);
  });

  it("sigue a la versión nueva cuando cambia el manifiesto", async () => {
    await sembrar({
      ...crudo,
      version: "2.5.0",
      platforms: { "windows-x86_64": { url: `${BASE}/2.5.0/Mycelium_2.5.0_x64-setup.exe` } },
    });
    const r = await SELF.fetch("https://landing.test/descargar/windows", { redirect: "manual" });
    expect(r.headers.get("location")).toBe(`${BASE}/2.5.0/Mycelium_2.5.0_x64-setup.exe`);
  });

  it("sin manifiesto, baja la versión de respaldo", async () => {
    const r = await SELF.fetch("https://landing.test/descargar/mac", { redirect: "manual" });
    expect(r.status).toBe(302);
    expect(r.headers.get("location")).toBe(`${BASE}/2.4.0/Mycelium_2.4.0_aarch64.dmg`);
  });

  it("una plataforma desconocida vuelve a las descargas", async () => {
    const r = await SELF.fetch("https://landing.test/descargar/amiga", { redirect: "manual" });
    expect(r.status).toBe(302);
    expect(r.headers.get("location")).toBe("/#descargas");
  });
});

describe("leerManifiesto", () => {
  it("cachea: una segunda lectura no vuelve a R2", async () => {
    await sembrar();
    const get = vi.fn(() => env.RELEASES.get("latest.json"));
    const falso = { RELEASES: { get } as unknown as R2Bucket };
    expect((await leerManifiesto(falso))?.version).toBe("2.4.0");
    expect((await leerManifiesto(falso))?.version).toBe("2.4.0");
    expect(get).toHaveBeenCalledTimes(1);
  });

  it("si R2 lanza, devuelve null sin lanzar", async () => {
    const falso = { RELEASES: { get: () => Promise.reject(new Error("caído")) } as unknown as R2Bucket };
    await expect(leerManifiesto(falso)).resolves.toBeNull();
  });

  it("si R2 cae después, sirve la última copia buena", async () => {
    await sembrar();
    const bueno = { RELEASES: env.RELEASES };
    expect((await leerManifiesto(bueno))?.version).toBe("2.4.0");
    await vencerManifiesto();
    const caido = { RELEASES: { get: () => Promise.reject(new Error("caído")) } as unknown as R2Bucket };
    expect((await leerManifiesto(caido))?.version).toBe("2.4.0");
  });

  it("si R2 tarda de más, corta y sigue", async () => {
    vi.useFakeTimers();
    try {
      const lento = { RELEASES: { get: () => new Promise(() => {}) } as unknown as R2Bucket };
      const p = leerManifiesto(lento);
      await vi.advanceTimersByTimeAsync(3000);
      await expect(p).resolves.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
