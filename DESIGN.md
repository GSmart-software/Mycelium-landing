---
name: Mycelium · landing
description: La red, la página de descarga de Mycelium
colors:
  hifa: "#19e6ff"
  brote: "#3dffc4"
  esporo: "#04090e"
  esporo-profundo: "#0b1d27"
  lienzo: "#071219"
  humus: "#c6e7e1"
  humus-tenue: "#6e9a99"
  placa-tenue: "#8db4b2"
  borde: "#16343f"
  info: "#3d8bff"
  hifa-claro: "#0e7c8c"
  brote-claro: "#16b8c9"
  esporo-profundo-claro: "#08323d"
  lienzo-claro: "#f1f6f7"
  niebla-claro: "#e3eef1"
  humus-claro: "#1f2d30"
  humus-tenue-claro: "#4f5f62"
  brote-texto-claro: "#1b6c75"
  degrade-inicio-claro: "#0f8a66"
  superficie-alta-claro: "color-mix(niebla 55%, lienzo)"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.6rem, 1.2rem + 3.1vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.03
    letterSpacing: "-0.02em"
  numero:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(5rem, 1.5rem + 10vw, 11.5rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2rem, 1.4rem + 1.8vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  titular:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.6rem, 1.1rem + 1.4vw, 2.35rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.6rem, 1.25rem + 0.9vw, 2rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  bajada:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1rem + 0.3vw, 1.1875rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"ss01\""
  sistema:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  meta:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  rotulo:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3
  fecha:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: "4px"
  md: "8px"
spacing:
  canal: "clamp(1rem, 4vw, 3rem)"
  ancho: "76rem"
  riel: "4.5rem"
  riel-angosto: "2.25rem"
  linea-x: "0.75rem"
  columna-nodo: "21rem"
  entre-nodos: "clamp(4.5rem, 8vw, 7.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.hifa}"
    textColor: "{colors.esporo}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0 1.2rem"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.brote}"
    textColor: "{colors.esporo}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.humus}"
    rounded: "{rounded.sm}"
    padding: "0 1.2rem"
    height: "46px"
  cabecera-descarga:
    backgroundColor: "transparent"
    textColor: "{colors.hifa}"
    rounded: "{rounded.sm}"
    padding: "0 0.85rem"
    height: "38px"
  sistema:
    backgroundColor: "{colors.lienzo}"
    rounded: "{rounded.md}"
    padding: "1.25rem 1.375rem 1.3rem"
  sistema-tuyo:
    backgroundColor: "{colors.esporo-profundo}"
    rounded: "{rounded.md}"
    padding: "1.25rem 1.375rem 1.3rem"
  chip-tu-sistema:
    backgroundColor: "{colors.brote}"
    textColor: "{colors.esporo}"
    rounded: "{rounded.sm}"
    padding: "0.25em 0.6em"
  marco-captura:
    backgroundColor: "{colors.esporo-profundo}"
    rounded: "{rounded.md}"
  punto:
    backgroundColor: "{colors.hifa}"
    size: "12px"
  punto-final:
    backgroundColor: "{colors.brote}"
    size: "28px"
---

# Design System: Mycelium · landing

> [!info] Qué es este archivo
> Es el sistema visual de la **landing** (`public/index.html`, `estilos.css`, `sitio.js`,
> con el Worker de `src/` que inyecta versión, fecha, titular y novedades) tal como quedó
> construida y revisada el 2026-10-07 con la dirección **«La red» con cierre «tapa de
> versión»** (commits `3abc09b` a `f7d7edf`). Reemplaza entero al de la dirección
> anterior, «Un día con tu vault», que el usuario descartó ese mismo día.
> La landing es una superficie **dentro** del mundo de la app: lo heredado vive en el
> DESIGN.md del producto, `../docs/design/DESIGN.md` («El bosque bioluminiscente»), y
> manda ahí. Este archivo registra solo lo que la landing **agrega** y cómo se apoya en
> esos tokens. Contrato de dirección: `.impeccable/surfaces/public-index-html.md`.
> Ante una diferencia con el producto en algo heredado, vale el producto; las diferencias
> abiertas se listan en *Diferencias con el producto*.

## Overview

**Creative North Star: "La red"**

La página es la red misma. Abre con el **grafo real** del vault de demostración «Bosque
de hongos» a sangre, de borde a borde, bajo un velo que lo apaga detrás del texto; desde
ahí baja una **hifa**, una línea vertical de 1px en el margen izquierdo, que une las
funciones como nodos: escribir, conectar, encontrar, agendar, organizar, claude code,
temas. Cada nodo es un punto sobre la línea con su nombre debajo, en mono chico, como los
rótulos del grafo; al lado, su titular serif, dos o tres líneas y un recorte legible de una
captura real. La hifa se **enciende con el scroll** y desemboca en la versión vigente,
impresa como la **tapa de una edición**: el número enorme con el degradé de marca, la
fecha de tapa, el titular del release y el sumario numerado, junto a las descargas.

Es el bosque bioluminiscente de la app (**heredado**: los raw de Bioluminiscencia, Hifa
para lo que se hace y Brote para lo que brilla, las tres familias, los dos radios), en la
densidad de una página: 17px de texto, titulares de marketing en Source Serif. La portada
es una **placa oscura en los dos modos**, porque es la captura del grafo y el grafo se
dibuja siempre sobre oscuro; el resto de la página sigue a `prefers-color-scheme`.

Rechaza la landing de categoría: hero centrado sobre fondo liso, grilla de tarjetas de
funciones, testimonios y métricas. Las funciones se recorren en fila sobre la hifa, nunca
en tarjetas.

**Key Characteristics:**
- El grafo real a sangre en la portada, con velo y viñeteado de Esporo, oscuro en los dos modos.
- La hifa vertical que se enciende con el scroll y une los nodos hasta la tapa.
- Nodos con punto sobre la línea y nombre en mono debajo del punto, como en el grafo.
- Un solo brote en la página: el anillo donde termina la hifa, junto al número de versión.
- La tapa: «2.4.0» enorme en Geist 700 con el degradé, fecha de tapa, titular y sumario plegable.
- Recortes legibles de capturas reales, nunca maquetas.
- Todo progresivo: sin JS la página se lee entera, con la hifa encendida y las tres descargas.

## Colors

Los raw de Bioluminiscencia del producto, sin un color de marca nuevo, con una capa de
**roles propios de la página** (`--texto`, `--accion`, `--brillo-texto`, `--foco`,
`--superficie`, `--linea*`, `--placa-*`, `--degrade`) en `:root` de `estilos.css`,
recalibrada en `prefers-color-scheme: light`. Oscuro por defecto, como la app.

### Primary
- **Hifa** (acción y línea): el botón primario de descarga, los enlaces, el botón
  «Descargar <versión>» de la cabecera, la hifa encendida y el punto de cada nodo. En
  claro baja al teal legible (`hifa-claro`). Heredado del producto.
- **Brote** (lo que brilla): el punto agrandado del nodo `claude code`, el anillo final de
  la hifa, el hover del botón primario, el chip «tu sistema», el foco en oscuro, los
  marcadores de lista del sumario, el hover de los secundarios (14%) y la selección
  (32%). En primer plano va siempre por su rol (`--brillo-texto`, `--foco`,
  `--linea-punta`); en claro, `--brillo-texto` es `brote-texto-claro`.

### Neutral
- **Esporo profundo**: el fondo de la placa de la portada (el lienzo del grafo), el fondo
  del marco de las capturas y la superficie del sistema detectado en oscuro.
- **Esporo**: el fondo de la página en oscuro, el texto sobre el botón primario, la
  sombra y el borde del velo de la portada.
- **Lienzo**: la superficie de cada descarga en oscuro; en claro (`lienzo-claro`), el
  fondo de la página y el texto sobre el primario.
- **Niebla claro**: mezclada al 60% con el Lienzo claro, la superficie de las descargas en claro.
- **Humus / Humus tenue**: la tinta y el texto secundario (bajadas de nodo, notas,
  epígrafes, nombres de nodo).
- **Placa tenue**: el texto secundario sobre la placa de la portada (el pie de foto),
  más claro que el Humus tenue porque va sobre una imagen.
- **Borde**: los filetes de 1px del sumario, del pie, de la lista de la IA y de las descargas.
- **Info**: solo el tercer nodo del isotipo.

### Named Rules
**The Dark Plate Rule.** La portada redefine los roles con la paleta `--placa-*` en los
dos modos: es la captura del grafo y su lienzo es Esporo profundo. Sobre la placa, el
texto usa `--placa-humus` y `--placa-tenue`, nunca un rol calibrado para el fondo claro.

**The One Sprout Rule.** La hifa termina en un único anillo Brote (aro al 45% y núcleo
de 4.5px) a media altura del número de la tapa. Es el único brote de la página; el nodo
`claude code` es el único otro punto que pasa de Hifa a Brote.

**The Two Gradients Rule.** El degradé Brote → Hifa (en claro, `degrade-inicio-claro`
→ `hifa-claro`, para que las dos puntas pasen 3:1 sobre el Lienzo claro) vive en dos
lugares y solo dos: la palabra del logo y el número de versión de la tapa. El H1 de la
portada va en Humus liso: está sobre una imagen cargada y necesita todo el contraste.

## Typography

**Titulares:** Source Serif 4 (con Georgia)
**Texto, botones y número de versión:** Geist (con system-ui), con `ss01`
**Rótulos literales:** JetBrains Mono (con Fira Code)

**Character:** la serif lleva los titulares de la página; la sans, todo lo que se lee y
se toca, y también el número de la tapa y toda mención de la versión, en cifras
tabulares; la mono, lo que en la app es literal: nombres de nodo, sintaxis, atajos y la
fecha de tapa.

### Hierarchy
- **Numero** (Geist 700, `clamp(5rem…11.5rem)`, 0.86, -0.04em; en el celular
  `clamp(4.25rem, 24vw, 7rem)`): el «2.4.0» de la tapa, con el degradé. Es el H2 del
  cierre; el lector de pantalla oye «Mycelium 2.4.0».
- **Display** (serif 700, `clamp(2.6rem…4.5rem)`, 1.03, -0.02em, máx. 14ch): el H1 de la
  portada, en Humus, con una sombra de texto de la placa al 90%.
- **Headline** (serif 600, `clamp(2rem…2.75rem)`, 1.1): el H2 del recorrido, el de la
  tapa sin versión y el de la 404.
- **Titular** (serif 600, `clamp(1.6rem…2.35rem)`, 1.15, máx. 22ch): el titular de la
  tapa, el primer título de las notas del release.
- **Title** (serif 600, `clamp(1.6rem…2rem)`, 1.15): el H3 de cada nodo. Su altura fija
  la del punto (`--punto-y`, 0.6 del tamaño).
- **Bajada** (Geist 400, `clamp(1.0625rem…1.1875rem)`, 1.6, máx. 31rem): la bajada de la portada.
- **Body** (Geist 400, 1.0625rem, 1.6): el texto de la página.
- **Sistema** (Geist 600, 1.2rem; 1.25rem en «Descargá Mycelium <versión>»): los
  títulos de la columna de descargas.
- **Meta** (Geist 400, 0.875–0.9rem, 1.5): la línea de versión, las notas de cada
  descarga, los epígrafes, el pie.
- **Rótulo** (mono 400, 0.75rem): el nombre de cada nodo y el pie de foto del grafo.
- **Fecha** (mono 400, 0.875rem): la fecha de tapa, debajo del número.

### Named Rules
**The Version In Geist Rule.** Toda mención de la versión —la cabecera, la línea de la
portada, el título de las descargas, el pie y la tapa— va en Geist con cifras
tabulares, nunca en mono.

**The Literal Mono Rule.** La mono es para lo que en la app es literal: nombres de nodo,
`code`, `kbd`, la fecha de tapa y el pie de foto del grafo. Nunca para titulares ni para
la versión.

## Layout

**Portada.** Alto `min(100svh, 60rem)`, grilla de tres filas: cabecera, texto y pie de
foto. El grafo ocupa toda la placa con `object-fit: cover` y el centro de la red corrido
a la derecha (62% 50%). El velo apila tres degradados: una banda lisa de 4.75rem para la
navegación, una cortina de la placa al 88–92% detrás de la columna de texto (hasta
32rem pasada la línea del contenido, para que el H1 y la bajada pasen 4,5:1 sobre el
nodo más claro) y un viñeteado radial hacia Esporo.

**La hifa.** Contenido de hasta 76rem con canales `clamp(1rem, 4vw, 3rem)`. La hifa va
a 0.75rem del borde del contenido y todo se corre un **riel** de 4.5rem. Cada nodo es
una grilla de texto (hasta 21rem) y captura, separados `clamp(2rem, 5vw, 5rem)`, con el
texto centrado verticalmente contra la captura, y `clamp(4.5rem, 8vw, 7.5rem)` hasta el
siguiente. Cada nodo dibuja su tramo de hifa de punta a punta de su caja, así los tramos
se tocan sin importar dónde caiga el punto. Cada captura declara su ancho máximo
(`--ancho-max`, de 26rem a 40rem) según lo que hace falta para leerla.

**El nodo `claude code`.** Texto y la lista de la IA arriba, la terminal a todo el ancho
debajo y una nota al pie que dice que es opcional.

**Cierre.** Grilla 7/5: a la izquierda la tapa (número, fecha, titular, sumario de hasta
40rem); a la derecha las descargas apiladas. La hifa del cierre llega solo hasta el anillo.

**Responsivo.** A 1020px el cierre pasa a una columna y las descargas bajan. A 860px el
riel baja a 2.25rem y la hifa a 0.45rem, los nodos se apilan (texto, captura, pie),
**desaparece el nombre del nodo** (no hay canal al costado de la línea; queda el punto)
y la navegación deja solo «Descargar <versión>». A 760px el grafo deja de ir detrás del
texto: es una banda de 26rem debajo, enmascarada arriba y abajo, con el pie de foto
debajo; las capturas usan su recorte móvil y las dos luces se apilan.

**Movimiento.** Una sola interacción insignia: la hifa se enciende con el scroll. Cada
tramo se llena (`--lleno`, `scaleY`) hasta la altura de lectura (62% de la ventana) y el
nodo se enciende cuando la línea alcanza su punto (280ms, `--salida`). Además, solo la
entrada de las capturas: fundido desde 4px en 160ms, una vez. Hover de 120ms, chevron del
sumario 200ms. Curva `cubic-bezier(0.16, 1, 0.3, 1)`. Con `prefers-reduced-motion` o sin
JS, todo encendido y estático.

## Elevation & Depth

Plana, como la app: los nodos no son tarjetas y se separan por aire y por la hifa. La
profundidad la dan la placa de la portada (la imagen bajo su velo) y tres cosas con
sombra, todas teñidas con `--sombra` (Esporo al 85% en oscuro, Esporo profundo al 24%
en claro).

### Shadow Vocabulary
- **Ventana** (`0 28px 64px -28px var(--sombra), 0 2px 6px -2px var(--sombra)`): el marco
  de una captura; la terminal, un poco más larga (`0 30px 70px -30px …`).
- **Tu sistema** (`0 22px 50px -26px var(--sombra)`): la descarga del sistema detectado.
- **Halo del punto** (`0 0 0 4px` Hifa al 14% y `0 2px 14px` Hifa al 55%): el brillo de un
  nodo encendido, como los nodos con halo del grafo; 6px y 24px en Brote para `claude code`.

### Named Rules
**The Lit Node Rule.** Un nodo apagado es un aro de Hifa al 45% sobre el fondo, sin halo;
encendido, se rellena y gana el halo. El anillo final no lleva halo: es aro y núcleo.

## Shapes

Heredadas del producto: **suave** (4px) para botones, `code`, `kbd`, el chip «tu
sistema» y el anillo de foco; **redondeado** (8px) para el marco de las capturas y cada
descarga. Los puntos son círculos (12px, 16px el de `claude code`, 28px el anillo final).
La hifa es una línea de 1px. Las listas se separan con filetes de 1px en `--borde`. Los
`kbd` llevan el borde inferior de 2px.

## Components

### Buttons
Grandes y directos: es el único lugar donde se actúa.
- **Shape:** esquina suave (4px), al menos 46px de alto, `0 1.2rem`, Geist 600 a 1rem,
  ícono SVG de trazo de 18px.
- **Primario:** Hifa con texto Esporo (Lienzo claro en claro). Hover: `--brillo-texto`.
  Uno por contexto: el de la portada y el del sistema detectado.
- **Secundario:** transparente, borde de la tinta al 30%, texto en la tinta. Hover:
  Brote al 14% de fondo y borde al 50%. «Otras plataformas», `.deb`, `.rpm`.
- **Descarga de la cabecera:** 38px, borde Hifa al 45%, texto Hifa, «Descargar
  <versión>»; con hover se rellena.
- **Focus:** el anillo global de 2px en `--foco`, separado 3px.

### La descarga detectada (signature)
La portada ofrece **un** botón «Descargar para <sistema>» más «Otras plataformas», con
**la nota de esa descarga pegada debajo** (qué baja, el requisito, el primer arranque en
macOS) y la línea de versión inyectada. Sin JS o sin sistema reconocido, tres botones y
una nota de una línea; en el teléfono, un aviso de que Mycelium es para la computadora.

### Nodo de la hifa (signature)
Punto sobre la línea a la altura de la primera línea del H3; el nombre del nodo debajo,
centrado sobre la hifa, en Rótulo y Humus tenue, con un fondo del color de la página que
tapa la línea detrás (solo desde 861px). Al lado, H3 serif, dos o tres líneas en Humus
tenue (con `code` y `kbd` en la tinta) y el recorte de su captura.

### Marco de captura (signature)
Una captura real de la app recortada a la región que se lee, en un marco de 8px con
borde de 1px (`--marco-borde`), fondo Esporo profundo y sombra de ventana. `<picture>`
sirve el recorte móvil y `srcset` 1x/2x. Si la imagen falla, queda el marco vacío. El
epígrafe, en 0.9rem y Humus tenue, dice lo que se ve. El de la terminal lleva el borde en
Brote al 38%.

### La tapa (signature)
El número de versión enorme con el degradé, la fecha de tapa en mono debajo, el titular
serif y el **sumario numerado**: cada grupo de las notas del release es un `<details>`
con su número de orden (`01`, `02`… en `--nodo-texto`), el título en Geist 600 y un
chevron que gira 180° al abrir; el detalle va sangrado 2.75rem en Humus tenue, con los
marcadores de lista en `--brillo-texto`. Todo lo pone el Worker; sin versión, la tapa
cambia por un H2 «Descargá Mycelium» y una línea que lo explica.

### Descargas apiladas
Bajo «Descargá Mycelium <versión>», tres bloques apilados (Windows, macOS, Linux) con
borde de 1px, 8px de radio y relleno `1.25rem 1.375rem`: título, requisito, botón y una
nota breve. El del sistema detectado sube primero, suma el chip **«tu sistema»** (Brote
con texto Esporo, 0.72rem), el borde Hifa al 70%, la superficie alta y la sombra, y
es el **único con botón relleno**, a todo el ancho. Sin sistema detectado, los tres
botones van en secundario.

### Lista de la IA
Tres pares término–descripción con filete superior: término en Geist 600, descripción en
Humus tenue a 0.975rem.

## Do's and Don'ts

### Do:
- **Do** usar los raw y los roles de `estilos.css` y, para todo lo heredado, las reglas del DESIGN.md del producto (Two Voices, Role, Tinted Shadow).
- **Do** sumar una función nueva como un nodo más de la hifa: punto, nombre en mono debajo, H3 serif, dos o tres líneas y su recorte.
- **Do** mostrar funciones con capturas reales de la app, recortadas a lo que se lee a su ancho.
- **Do** escribir la versión en Geist con cifras tabulares, en todas sus menciones.
- **Do** dejar un solo botón relleno por contexto: el del sistema detectado, o ninguno si no se detectó.
- **Do** acompañar cada botón de descarga con la nota breve de lo que baja.
- **Do** dejar la página entera y descargable sin JS, y dar a todo movimiento su alternativa con `prefers-reduced-motion`.

### Don't:
- **Don't** armar una grilla de tarjetas de funciones, un hero centrado sobre fondo liso, testimonios o métricas.
- **Don't** poner el degradé en un tercer lugar: el logo y el número de la tapa, nada más.
- **Don't** agregar otro brote: el anillo final es el único, y `claude code` el único nodo resaltado.
- **Don't** usar la mono para titulares, la versión o adornos.
- **Don't** ilustrar con maquetas o capturas inventadas, ni mostrar una captura entera cuando su texto queda ilegible.
- **Don't** aclarar la placa de la portada en modo claro: el grafo es oscuro en los dos modos.

## Diferencias con el producto

Lo que la landing hace distinto de `../docs/design/DESIGN.md`. No son reglas para otras
superficies; quedan anotadas para decidir si se llevan a la app o se corrigen acá.

- **Degradé de marca en el número de versión.** El producto le da tres usos y solo tres
  (logo, título del documento, énfasis triple). La landing usa el del logo y suma el
  número de la tapa, elegido en el contrato de dirección; el H1 no lo lleva. En claro, la
  punta Brote baja a `#0f8a66` (verde oscurecido), que el producto no tiene.
- **Titulares en la tinta lisa.** El producto mezcla los títulos con Hifa o Brote; acá
  los titulares van en Humus.
- **Hover del primario en Brote** (`--brillo-texto`), donde la app oscurece Hifa.
- **Humus tenue en claro:** `#4f5f62` acá contra `#59696C` en el producto.
- **Sombras:** la de la página en oscuro se tiñe con Esporo (85%), no con Esporo
  profundo; y llevan sombra el marco de una captura y la descarga detectada, que no
  flotan.
- **Descarga detectada en claro:** iba en superficie blanca (`#ffffff`) con sombra, contra
  el «Don't» del producto sobre tarjetas blancas elevadas. Corregido (2026-10-07): ahora es
  un velo de Niebla sobre el Lienzo.
- **Densidad:** la página habla en 17px; el producto, en 13px de interfaz y 16px de nota.

> [!success] Deudas del build, corregidas (2026-10-07)
> El número de orden del sumario y el chip «tu sistema» pasaron de JetBrains Mono a Geist
> (la mono queda para lo literal); el fondo del marco de la terminal y el borde de la
> portada pasaron a tokens (`--terminal-fondo`, `--placa-borde`); la nota del CTA de la
> portada dejó la opacidad por el color tenue de la placa; y en claro el punto de Claude
> Code y el anillo final usan `#0f8a66` (3,97:1 sobre el Lienzo) en vez de `#16b8c9`
> (2,4:1).
