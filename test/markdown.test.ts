import { describe, expect, it } from "vitest";
import { enLinea, escaparHtml, partirNovedades, urlSegura } from "../src/markdown";
import manifiesto from "./fixtures/latest.json";

describe("escaparHtml", () => {
  it("escapa los cinco caracteres peligrosos", () => {
    expect(escaparHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });
});

describe("urlSegura", () => {
  it("acepta http y https", () => {
    expect(urlSegura("https://mycelium.app/x")).toBe("https://mycelium.app/x");
    expect(urlSegura("http://ejemplo.com")).toBe("http://ejemplo.com/");
  });
  it("rechaza javascript:, data: y lo que no es URL", () => {
    expect(urlSegura("javascript:alert(1)")).toBeNull();
    expect(urlSegura("JaVaScRiPt:alert(1)")).toBeNull();
    expect(urlSegura("data:text/html,<script>")).toBeNull();
    expect(urlSegura("/relativa")).toBeNull();
    expect(urlSegura("no es url")).toBeNull();
  });
});

describe("enLinea", () => {
  it("negrita, cursiva y código", () => {
    expect(enLinea("**fuerte** y *suave* y _otra_ y `x < y`")).toBe(
      "<strong>fuerte</strong> y <em>suave</em> y <em>otra</em> y <code>x &lt; y</code>",
    );
  });
  it("no interpreta el contenido de un código", () => {
    expect(enLinea("`**no** [a](https://x.y)`")).toBe("<code>**no** [a](https://x.y)</code>");
  });
  it("enlaces solo http(s), con rel", () => {
    expect(enLinea("[la ayuda](https://mycelium.app/ayuda)")).toBe(
      '<a href="https://mycelium.app/ayuda" rel="noopener noreferrer">la ayuda</a>',
    );
    expect(enLinea("[malo](javascript:alert(1))")).not.toContain("href");
  });
  it("no rompe las palabras con guion bajo", () => {
    expect(enLinea("archivo_de_prueba.md")).toBe("archivo_de_prueba.md");
  });
  it("escapa el HTML crudo", () => {
    const html = enLinea('<img src=x onerror="alert(1)"> **<b>hola</b>**');
    expect(html).not.toMatch(/<img|<b>/);
    expect(html).toContain("&lt;img");
    expect(html).toContain("<strong>&lt;b&gt;hola&lt;/b&gt;</strong>");
  });
  it("un atributo no puede escaparse de la URL", () => {
    const html = enLinea('[x](https://a.com/"onmouseover="alert(1))');
    expect(html).not.toContain('" onmouseover');
    expect(html).not.toMatch(/href="[^"]*"[^>]*onmouseover/);
  });
});

describe("partirNovedades", () => {
  it("el único título de arriba es el titular y el nivel siguiente arma los grupos", () => {
    const n = partirNovedades("## Grande\n\n### Uno\n\n- a\n- b\n\n### Dos\n\n- c");
    expect(n.titular).toBe("Grande");
    expect(n.entrada).toBe("");
    expect(n.grupos).toEqual([
      { titulo: "Uno", cuerpo: "<ul><li>a</li><li>b</li></ul>" },
      { titulo: "Dos", cuerpo: "<ul><li>c</li></ul>" },
    ]);
  });
  it("con varios títulos arriba no hay titular: cada uno es un grupo", () => {
    const n = partirNovedades("## Uno\n\n- a\n\n## Dos\n\n- b");
    expect(n.titular).toBeNull();
    expect(n.grupos.map((g) => g.titulo)).toEqual(["Uno", "Dos"]);
  });
  it("un título más profundo dentro de un grupo sale como <h4>", () => {
    const n = partirNovedades("## Uno\n\n### Sub\n\n- a\n\n## Dos\n\n- b");
    expect(n.grupos[0]!.cuerpo).toBe("<h4>Sub</h4>\n<ul><li>a</li></ul>");
  });
  it("lo que va antes del primer grupo es la entrada", () => {
    const n = partirNovedades("## Grande\n\nUn párrafo\nque sigue.\n\n### Uno\n\n- a");
    expect(n.titular).toBe("Grande");
    expect(n.entrada).toBe("<p>Un párrafo que sigue.</p>");
    expect(n.grupos).toHaveLength(1);
  });
  it("sin títulos, todo es entrada; las líneas sangradas siguen el ítem", () => {
    const n = partirNovedades("1. a\n2. b\n\n- uno\n  sigue\n- dos");
    expect(n.titular).toBeNull();
    expect(n.grupos).toEqual([]);
    expect(n.entrada).toBe("<ol><li>a</li><li>b</li></ol>\n<ul><li>uno sigue</li><li>dos</li></ul>");
  });
  it("el titular y los títulos de grupo pasan por el formato en línea, escapados", () => {
    const n = partirNovedades("## Hola <b>`x`</b>\n\n### **Uno**\n\n- a");
    expect(n.titular).toBe("Hola &lt;b&gt;<code>x</code>&lt;/b&gt;");
    expect(n.grupos[0]!.titulo).toBe("<strong>Uno</strong>");
  });
  it("lo no soportado queda como texto escapado", () => {
    const n = partirNovedades("<script>alert(1)</script>\n\n> cita\n\n![img](https://x.y/a.png)");
    expect(n.entrada).not.toContain("<script");
    expect(n.entrada).toContain("&lt;script&gt;");
    expect(n.entrada).toContain("&gt; cita");
  });
  it("parte las notas reales de la 2.4.0", () => {
    const n = partirNovedades(manifiesto.notes);
    expect(n.titular).toBe("Tus archivos, al instante");
    expect(n.grupos.map((g) => g.titulo)).toEqual([
      "El explorador sigue al disco",
      "Cualquier archivo",
      "Tareas con estados",
      "Más cómodo",
    ]);
    const html = n.grupos.map((g) => g.cuerpo).join("\n");
    expect(html).toContain("<code>![[foto.png]]</code>");
    expect(html).toContain("<code>[&gt;]</code>");
    expect(html).toContain("<strong>desde fuera de Mycelium</strong>");
    // La línea partida del ítem quedó unida.
    expect(html).toContain("una carpeta");
    expect(html).not.toMatch(/<(?!\/?(ul|li|strong|em|code|p)>)/);
  });
});
