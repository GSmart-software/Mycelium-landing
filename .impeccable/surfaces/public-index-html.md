---
version: 1
slug: "public-index-html"
primary_target: "public/index.html"
related_targets: []
---

# Landing de Mycelium

Modo: **persuade**. Visitante: quien toma notas y llega a ver qué es Mycelium y a bajarlo. Acción: descargar el instalador de la última versión para su sistema. Prueba: capturas reales de la app (vault de demostración «Huerta del barrio»), novedades de la versión inyectadas desde `latest.json`. Restricciones: sin mencionar a Obsidian; sin testimonios ni métricas; español rioplatense; oscuro (Bioluminiscencia) por defecto, claro por `prefers-color-scheme`; HTML/CSS/JS puros servidos por un Worker que inyecta versión, fecha y novedades.

## Direction contract

THESIS: La página es un día con tu vault: cinco horas en orden fijo (08:40 escribís, 11:15 conectás, 15:30 encontrás, 18:00 ordenás, 22:10 le preguntás a tu vault), cada una con una función concreta. Rechaza la landing de categoría: hero centrado + grilla de tarjetas de funciones + testimonios.

OWN-WORLD: Bioluminiscencia: Esporo, Lienzo, Niebla, Humus; Hifa para la acción, Brote para lo que brilla. Source Serif 4 para titulares, Geist para el texto, JetBrains Mono solo para horas, atajos y sintaxis real. Una regla vertical de 56px en Esporo (como el rail) con la escala 06–24 h. El fondo se hunde de Lienzo hacia Esporo a medida que avanza el día; la noche es una banda de Esporo con la terminal.

STORY: Entiende que Mycelium es notas Markdown enlazadas en una carpeta propia, con grafo y edición en vivo; cree que le sirve todo el día y que la IA (Claude Code) es un plus opcional que usa el vault como memoria; descarga para su sistema.

FIRST VIEWPORT: Regla del día pegada al borde izquierdo. Columna izquierda ~5/12: H1 «Tu red de conocimiento, viva y conectada» en Source Serif con el degradé brote→hifa, una línea de subtítulo, botón Hifa «Descargar para <sistema>» + «Otras plataformas», y la línea de versión inyectada (Mycelium 2.4.0 · Windows · macOS · Linux). Derecha ~7/12: la captura de la nota en vivo, grande y sangrando por el borde derecho, con «08:40» en el margen.

FORM: «Un día con tu vault», estructura 6 de mi lista ordenada (la que repartió el dado como líder), seed f55ffbfc. Interacción insignia: regla fija; el indicador recorre la escala con el scroll y la hora gira al valor siguiente; clic en una hora salta a su sección; un punto marca la hora local del visitante. Movimiento: capturas con fundido de 160ms y 4px; tono atado al scroll; con reduced-motion todo estático.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
