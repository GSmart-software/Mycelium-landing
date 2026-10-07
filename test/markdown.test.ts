import { describe, expect, it } from "vitest";
import { enLinea, escaparHtml, renderizarMarkdown, urlSegura } from "../src/markdown";
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

describe("renderizarMarkdown", () => {
  it("baja los títulos un nivel por defecto", () => {
    expect(renderizarMarkdown("# Uno\n## Dos\n###### Seis")).toBe("<h2>Uno</h2>\n<h3>Dos</h3>\n<h6>Seis</h6>");
  });
  it("une las líneas sangradas al ítem anterior", () => {
    expect(renderizarMarkdown("- uno\n  sigue\n- dos")).toBe("<ul><li>uno sigue</li><li>dos</li></ul>");
  });
  it("listas numeradas y párrafos", () => {
    expect(renderizarMarkdown("1. a\n2. b\n\nUn párrafo\nque sigue.")).toBe(
      "<ol><li>a</li><li>b</li></ol>\n<p>Un párrafo que sigue.</p>",
    );
  });
  it("lo no soportado queda como texto escapado", () => {
    const html = renderizarMarkdown("<script>alert(1)</script>\n\n> cita\n\n![img](https://x.y/a.png)");
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("&gt; cita");
  });
  it("renderiza las notas reales de la 2.4.0", () => {
    const html = renderizarMarkdown(manifiesto.notes);
    expect(html.startsWith("<h3>Tus archivos, al instante</h3>")).toBe(true);
    expect(html).toContain("<h4>Tareas con estados</h4>");
    expect(html).toContain("<code>![[foto.png]]</code>");
    expect(html).toContain("<code>[&gt;]</code>");
    expect(html).toContain("<strong>desde fuera de Mycelium</strong>");
    // La línea partida del ítem quedó unida.
    expect(html).toContain("una\ncarpeta".replace("\n", " "));
    expect(html).not.toMatch(/<(?!\/?(h3|h4|ul|li|strong|em|code|p)>)/);
  });
});
