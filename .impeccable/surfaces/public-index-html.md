---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: ["public/estilos.css", "public/sitio.js", "src/inyectar.ts", "src/markdown.ts"]
---

# Landing de Mycelium

Modo: **persuade**. Visitante: quien toma notas y llega a ver qué es Mycelium y a bajarlo. Acción: descargar el instalador de la última versión para su sistema. Prueba: capturas reales de la app (vault de demostración «Huerta del barrio»), novedades de la versión inyectadas desde `latest.json`. Restricciones: sin mencionar a Obsidian; sin testimonios ni métricas; español rioplatense; oscuro (Bioluminiscencia) por defecto, claro por `prefers-color-scheme`; HTML/CSS/JS puros servidos por un Worker que inyecta versión, fecha, titular y novedades.

> [!info] Cambio de dirección (2026-10-07)
> La dirección anterior, «Un día con tu vault» (estructura 6 del seed `f55ffbfc`: regla del
> día fija con la escala 06–24 h, banda de horas y fondo que se hundía con el scroll), quedó
> **reemplazada por decisión del usuario** el 2026-10-07, después de comparar cinco
> direcciones en un lienzo (A–E). Eligió la **D · «La red»** y pidió que el final —versión y
> descargas— sea **la primera parte de la B · «La versión en tapa»**. Las maquetas aprobadas
> (code-led, sin comp de imagen) son `D-La-red.dc.html` y `B-Version-en-tapa.dc.html`. La
> regla del día, la banda de horas y el tono atado al scroll se retiraron.

## Direction contract

THESIS: La página es la red misma. Abre con el grafo real del vault a sangre y baja por una hifa: cada función es un nodo con nombre (escribir, conectar, encontrar, agendar, organizar, claude code, temas) y la hifa desemboca en la versión vigente, impresa como la tapa de una edición, al lado de las descargas. Rechaza la landing de categoría: hero centrado sobre fondo liso, grilla de tarjetas de funciones, testimonios.

OWN-WORLD: Bioluminiscencia: Esporo, Esporo profundo (el lienzo del grafo), Lienzo, Niebla, Humus; Hifa para la acción y la línea, Brote para lo que brilla (el nodo de Claude Code, el final de la hifa). Source Serif 4 para titulares, Geist para el texto y para el número de versión, JetBrains Mono solo para nombres de nodo, sintaxis real, atajos y la fecha. La portada es una placa oscura en los dos modos (es la captura del grafo); el resto de la página sigue a `prefers-color-scheme`. El degradé brote→hifa vive en el logo y en UN titular: el «2.4.0» del cierre.

STORY: Entiende que Mycelium es notas Markdown enlazadas en una carpeta propia que se recorren como una red; sigue la hifa nodo por nodo y ve cada función en una captura legible; llega a Claude Code como un nodo más (opcional, el vault como memoria); termina en la versión vigente y lo que trae, y descarga para su sistema.

FIRST VIEWPORT: El grafo real de «Huerta del barrio» a sangre en todo el ancho (`object-fit: cover`, recorte del lienzo del grafo sin el cromo de la app), con viñeteado radial hacia Esporo y una sombra que oscurece la zona del texto. Encima, arriba: logo con degradé y navegación (Recorrido, Claude Code, Novedades, Descargar <versión>). A la izquierda: H1 «Tu red de conocimiento, viva y conectada» en Source Serif (Humus, sin degradé: va sobre una imagen cargada y necesita todo el contraste), la bajada nodo/hifa, el botón Hifa «Descargar para <sistema>» con su nota pegada y «Otras plataformas», y la línea de versión inyectada. Al pie, el pie de foto en mono: el grafo real del vault de ejemplo.

FORM: Después de la portada, una hifa vertical en el margen izquierdo une los nodos; cada nodo es su punto en la línea, su nombre en mono (`nodo · escribir`) pegado al punto, un titular serif, dos o tres líneas y su recorte de captura legible al costado. El nodo `claude code` es el único resaltado (punto Brote más grande, terminal a lo ancho con marco Brote). La hifa entra al cierre y termina en un nodo Brote junto al número. Cierre (de la Opción B): 7/12 con «2.4.0» enorme en Geist 700 con el degradé, la fecha en mono, el titular breve (el primer título de las notas del release, inyectado) y el sumario numerado de novedades (los grupos de las notas, cada uno con su detalle plegado); 5/12 con las tres descargas apiladas, cada una con su nota breve, la del sistema detectado arriba y marcada «tu sistema». Después, el pie. Interacción insignia, una sola: la hifa se enciende con el scroll (cada tramo se llena hasta la altura de lectura) y cada nodo se ilumina cuando la línea lo alcanza; con `prefers-reduced-motion` o sin JS, todo encendido y estático. Además, solo las entradas de 160 ms / 4 px de las capturas.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
