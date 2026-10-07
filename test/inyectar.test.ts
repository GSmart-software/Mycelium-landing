import { describe, expect, it } from "vitest";
import { plegarNovedades } from "../src/inyectar";
import { renderizarMarkdown } from "../src/markdown";
import manifiesto from "./fixtures/latest.json";

const plegar = (md: string, version = "2.5.0") => plegarNovedades(renderizarMarkdown(md, { nivelBase: 2 }), version);

describe("plegarNovedades", () => {
  it("deja a la vista el primer grupo y pliega el resto", () => {
    const html = plegar("## Grande\n\n### Uno\n\n- a\n- b\n\n### Dos\n\n- c\n\n## Otra\n\n- d");
    const [visible, plegado] = html.split('<details class="novedades-mas">');
    expect(visible).toContain("<h3>Grande</h3>");
    expect(visible).toContain("<h4>Uno</h4>");
    expect(visible).toContain("<li>a</li><li>b</li>");
    expect(visible).not.toContain("Dos");
    expect(plegado).toContain("<h4>Dos</h4>");
    expect(plegado).toContain("<h3>Otra</h3>");
    expect(html.trimEnd().endsWith("</details>")).toBe(true);
  });

  it("el <summary> lleva la versión, escapada", () => {
    expect(plegar("- a\n\n## B\n\n- b", "2.5.0")).toContain("<summary><span>Todo lo nuevo de la 2.5.0</span>");
    expect(plegar("- a\n\n## B\n\n- b", "<b>")).toContain("Todo lo nuevo de la &lt;b&gt;");
  });

  it("con un solo grupo no aparece un <details> vacío", () => {
    expect(plegar("## Algo nuevo\n\n- **uno**\n- dos")).not.toContain("<details");
    expect(plegar("## Algo nuevo\n\n### Sub\n\n- uno")).not.toContain("<details");
  });

  it("sin ninguna lista, queda todo a la vista", () => {
    const html = plegar("## Uno\n\nUn párrafo.\n\n## Dos\n\nOtro.");
    expect(html).not.toContain("<details");
    expect(html).toContain("<h3>Dos</h3>");
  });

  it("con las notas reales de la 2.4.0, el primer grupo es «El explorador sigue al disco»", () => {
    const html = plegar(manifiesto.notes, manifiesto.version);
    const visible = html.slice(0, html.indexOf("<details"));
    expect(visible).toContain("<h3>Tus archivos, al instante</h3>");
    expect(visible).toContain("<h4>El explorador sigue al disco</h4>");
    expect(visible).not.toContain("Cualquier archivo");
    expect(html).toContain("Todo lo nuevo de la 2.4.0");
    expect(html.match(/<details/g)).toHaveLength(1);
  });
});
