import { describe, expect, it } from "vitest";
import { sumarioHtml } from "../src/inyectar";
import { partirNovedades } from "../src/markdown";
import manifiesto from "./fixtures/latest.json";

const sumario = (md: string) => sumarioHtml(partirNovedades(md));

describe("sumarioHtml", () => {
  it("un ítem numerado por grupo, con el título como <summary> y el detalle plegado", () => {
    const html = sumario("## Grande\n\n### Uno\n\n- a\n- b\n\n### Dos\n\n- c");
    expect(html.startsWith('<ol class="sumario-lista">')).toBe(true);
    expect(html.match(/<li><details>/g)).toHaveLength(2);
    expect(html).toContain("<summary><span>Uno</span>");
    expect(html).toContain("<ul><li>a</li><li>b</li></ul>");
    expect(html.indexOf("<summary><span>Dos</span>")).toBeGreaterThan(html.indexOf("<li>b</li>"));
    // El titular no se repite en el sumario.
    expect(html).not.toContain("Grande");
  });

  it("un grupo sin cuerpo queda como título solo, nunca un <details> vacío", () => {
    const html = sumario("## Uno\n\n## Dos\n\n- b");
    expect(html).toContain('<li><span class="sumario-solo">Uno</span></li>');
    expect(html.match(/<details>/g)).toHaveLength(1);
  });

  it("la entrada va antes de la lista", () => {
    const html = sumario("## Grande\n\nAntes.\n\n### Uno\n\n- a");
    expect(html.indexOf("<p>Antes.</p>")).toBeLessThan(html.indexOf("<ol"));
  });

  it("sin grupos no hay lista numerada: queda el contenido tal cual", () => {
    expect(sumario("## Algo nuevo\n\n- **uno**\n- dos")).toBe("<ul><li><strong>uno</strong></li><li>dos</li></ul>");
    expect(sumario("")).toBe("");
  });

  it("con las notas reales de la 2.4.0, cuatro grupos plegados", () => {
    const html = sumario(manifiesto.notes);
    expect(html.match(/<li><details>/g)).toHaveLength(4);
    expect(html).toContain("<summary><span>El explorador sigue al disco</span>");
    expect(html).toContain("<summary><span>Más cómodo</span>");
  });
});
