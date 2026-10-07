---
name: Mycelium · landing
description: Un día con tu vault, la página de descarga de Mycelium
colors:
  hifa: "#19e6ff"
  brote: "#3dffc4"
  esporo: "#04090e"
  esporo-profundo: "#0b1d27"
  lienzo: "#071219"
  niebla: "#0a1a24"
  humus: "#c6e7e1"
  humus-tenue: "#6e9a99"
  borde: "#16343f"
  info: "#3d8bff"
  hifa-claro: "#0e7c8c"
  brote-claro: "#16b8c9"
  esporo-claro: "#0c4a57"
  esporo-profundo-claro: "#08323d"
  lienzo-claro: "#f1f6f7"
  niebla-claro: "#e3eef1"
  humus-claro: "#1f2d30"
  humus-tenue-claro: "#4f5f62"
  brote-texto-claro: "#1b6c75"
  brote-marco-claro: "#68ced9"
  brote-marco-acento-claro: "#3fc3d1"
  noche-texto-tenue: "#7fa9a8"
typography:
  display:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.6rem, 1.4rem + 3vw, 4.25rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(2.1rem, 1.3rem + 2.4vw, 3.4rem)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.6rem"
    fontWeight: 600
    lineHeight: 1.2
  entrada:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "clamp(1.15rem, 1.05rem + 0.4vw, 1.35rem)"
    fontWeight: 400
    lineHeight: 1.55
  reading:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.7
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "\"ss01\""
  meta:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.5
  hora:
    fontFamily: "JetBrains Mono, Fira Code, ui-monospace, monospace"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1
    fontFeature: "\"tnum\""
rounded:
  sm: "4px"
  md: "8px"
spacing:
  regla: "56px"
  regla-movil: "48px"
  canal: "clamp(1.25rem, 5vw, 5rem)"
  ancho: "78rem"
  sangria-hora: "7rem"
  tramo: "clamp(5rem, 10vw, 9rem)"
  entre-bloques: "clamp(2.5rem, 5vw, 4.5rem)"
components:
  button-primary:
    backgroundColor: "{colors.hifa}"
    textColor: "{colors.lienzo}"
    rounded: "{rounded.sm}"
    padding: "0 1.2rem"
    height: "46px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.humus}"
    rounded: "{rounded.sm}"
    padding: "0 1.2rem"
    height: "46px"
  novedades-toggle:
    backgroundColor: "transparent"
    textColor: "{colors.humus}"
    rounded: "{rounded.sm}"
    padding: "0 1rem"
    height: "44px"
  regla:
    backgroundColor: "{colors.esporo}"
    textColor: "{colors.humus-tenue}"
    width: "{spacing.regla}"
  marco-captura:
    backgroundColor: "{colors.niebla}"
    rounded: "{rounded.md}"
  chip-tu-sistema:
    textColor: "{colors.brote}"
    rounded: "{rounded.sm}"
    padding: "0.25em 0.55em"
---

# Design System: Mycelium · landing

> [!info] Qué es este archivo
> Es el sistema visual de la **landing** (`public/index.html`, `estilos.css`, `sitio.js`)
> tal como quedó construida y revisada el 2026-10-07 (commits `e4b3e91` y `6f25e2e`).
> La landing es una superficie **dentro** del mundo de la app: lo heredado vive en el
> DESIGN.md del producto, `../docs/design/DESIGN.md` («El bosque bioluminiscente»), y
> manda ahí. Este archivo registra solo lo que la landing **agrega** y cómo se apoya en
> esos tokens. Contrato de dirección: `.impeccable/surfaces/public-index-html.md`.
> Ante una diferencia con el producto en algo heredado (color, forma, sombra), vale el
> producto; las diferencias abiertas se listan en *Diferencias con el producto*.

## Overview

**Creative North Star: "Un día con tu vault"**

La página es un día. Cinco horas en orden fijo —08:40 escribís, 11:15 conectás, 15:30
encontrás, 18:00 ordenás, 22:10 le preguntás a tu vault— y después «a la mañana
siguiente», donde viven los temas, las novedades y las descargas. El tiempo es el
material de la página: una **regla del día** fija al borde izquierdo con la escala de
06 a 24 h, la hora de cada tramo dentro de su titular, y un fondo que se **hunde** de la
luz de la mañana hacia Esporo a medida que se baja. La noche es una banda de Esporo con
la terminal; a la mañana siguiente el fondo y la regla vuelven al principio.

Es el bosque bioluminiscente de la app (**heredado**: los mismos raw Esporo, Lienzo,
Niebla, Humus, Hifa para la acción y Brote para lo que brilla; las mismas familias; los
mismos radios), pero en otra densidad: la app habla en 13px y la landing en 17px, con
titulares de marketing en Source Serif. La regla del día es el rail de la app traducido
a la página: 56px, Esporo, el isotipo arriba, el indicador de 2px que marca dónde estás.
La prueba son **capturas reales** de la app con el vault de demostración «Huerta del
barrio», recortadas para que se lean; nada de ilustraciones ni maquetas.

Lo que la landing rechaza es la landing de categoría: hero centrado, grilla de tarjetas
de funciones y testimonios. Las funciones se dicen como momentos del día, en pares de
captura y texto, en listas con filetes finos, nunca en tarjetas.

**Key Characteristics:**
- La regla del día, fija: escala 06–24 h, indicador que recorre el día con el scroll,
  la hora que gira, un punto en la hora del visitante, clic en una hora salta a su tramo.
- El tono atado al scroll: el fondo se hunde de `--fondo-dia` a `--fondo-tarde`.
- La noche es oscura en los dos modos; la mañana siguiente vuelve a la luz.
- Capturas reales en un marco de ventana, que sangran por el borde derecho.
- Titulares en Source Serif con la hora en mono como primera columna.
- Todo progresivo: sin JS la página se lee entera, con las tres descargas a la vista.

## Colors

Los colores son **los raw de Bioluminiscencia del producto**, sin un color nuevo; la
landing agrega una capa de **roles propios de la página** (`--texto`, `--accion`,
`--brillo-texto`, `--marco-*`, `--titulo-*`, `--fondo-dia`, `--fondo-tarde`,
`--noche-fondo`) definida en `:root` de `estilos.css` y recalibrada en
`prefers-color-scheme: light`. Oscuro por defecto, como en la app.

### Primary
- **Hifa** (acción): el botón primario de descarga, los enlaces, el segundo nodo del
  isotipo. En claro baja al teal legible (`hifa-claro`). Heredado del producto.
- **Brote** (lo que brilla): la hora de cada tramo, la versión inyectada, los marcadores
  de lista de las novedades, el anillo de foco en oscuro, el hover de los botones
  secundarios (14%), la selección (32%). En primer plano siempre va por su rol
  (`--brillo-texto`, `--foco`, `--marco-glow`), como pide la Role Rule del producto.

### Neutral
- **Esporo**: la regla del día y la banda nocturna en oscuro; el marco de la regla
  también en claro (`esporo-claro`), como el rail de la app.
- **Esporo profundo**: el fondo de la noche en claro (`esporo-profundo-claro`) y el
  fondo del código en oscuro.
- **Niebla**: el fondo de la mañana en oscuro y el relleno del marco de las capturas.
- **Lienzo**: el fondo de la mañana en claro y el texto sobre el botón primario.
- **Humus / Humus tenue**: la tinta y el texto secundario (epígrafes, notas de
  descarga, definiciones). En claro, la landing usa un Humus tenue más oscuro que la
  app (ver *Diferencias con el producto*).
- **Borde**: los filetes de 1px que separan ítems de lista, columnas de descarga y el pie.
- **Info**: solo el tercer nodo del isotipo.

### Named Rules
**The Sinking Day Rule.** El fondo de la página es uno solo y se hunde con el scroll:
cada tramo declara su tono `--t` (0 en la mañana, 0.08, 0.3, 0.55, 0.8, 1 en la noche, 0
otra vez a la mañana siguiente) y el JS interpola `--hundimiento` entre tramos, mezclando
`--fondo-dia` con `--fondo-tarde` en oklab. En oscuro va de Niebla a Esporo; en claro,
de Lienzo a Niebla teñida de Esporo al 9%. Con movimiento reducido cada tramo conserva su
tono fijo. Ningún tramo lleva un fondo propio salvo la noche.

**The Night Is Always Dark Rule.** La banda de las 22:10 usa la paleta oscura en los
dos modos: Esporo en oscuro, Esporo profundo en claro, con la tinta, el foco y los
títulos del modo oscuro y un filete de Brote al 10% arriba y abajo. Es el único tramo
oscuro en modo claro.

**The Frame Rule (heredada).** Sobre la regla del día, el texto y el foco usan
`--marco-texto` y `--marco-glow`, nunca un color calibrado para el fondo de la página.
El anillo de foco de la regla va hacia adentro (`outline-offset: -2px`).

## Typography

**Titulares y entrada:** Source Serif 4 (con Georgia)
**Texto:** Geist (con system-ui), con el juego estilístico `ss01`
**Horas, atajos y sintaxis:** JetBrains Mono (con Fira Code)

**Character:** las tres familias de la app con los papeles corridos hacia la lectura: la
serif lleva los titulares y la entrada de cada tramo, la sans el texto corrido a 17px, y
la mono **solo** lo que en la app es literal —una hora, una tecla, un fragmento de
Markdown, el número de versión—.

### Hierarchy
- **Display** (700, `clamp(2.6rem…4.25rem)`, 1.02, -0.02em): el H1 del hero, uno por
  página, con el degradé de marca recortado al texto.
- **Headline** (600, `clamp(2.1rem…3.4rem)`, 1.08, -0.015em): el H2 de cada tramo, de
  las novedades y de las descargas, en `--titulo-2` (Brote mezclado con la tinta).
- **Title** (600, 1.6rem, 1.2): el H3 de un par de captura y texto, en `--titulo-3`
  (Hifa mezclado). Variantes del mismo papel: 1.9rem en la columna de cada sistema,
  1.3rem en los ítems de «Ordenás» y de la noche.
- **Entrada** (serif 400, `clamp(1.15rem…1.35rem)`, 1.55, máx. 40rem): el párrafo de
  apertura de cada tramo y la bajada del hero (1.5, máx. 28rem).
- **Reading** (serif 400, 1.0625rem, 1.7, máx. 42rem): el cuerpo de las novedades, que
  es Markdown del release y se lee como una nota de la app.
- **Body** (400, 1.0625rem, 1.6): el texto de la página.
- **Meta** (400, 0.9rem): la línea de versión, las notas de cada descarga, los epígrafes
  (0.95rem).
- **Hora** (mono 500, 1rem, cifras tabulares, en `--brillo-texto`): la hora de un tramo.
  En la regla, 11–12px.

### Named Rules
**The Hour Column Rule.** La hora de un tramo va **dentro** de su H2, como primera
columna de una grilla de 7rem (5.5rem en ventana mediana; `auto` con 0.85rem de
separación en el celular, siempre en la primera línea). La entrada, la sintaxis, la
lista de la IA y la nota al pie se sangran esos mismos 7rem para alinearse con el
título. La hora no es un rótulo suelto encima del título: es el dato que conecta el
tramo con la regla.

**The Literal Mono Rule.** La mono es para lo que se teclea o se lee en un reloj:
horas, `kbd`, sintaxis, versión. Nunca para rótulos o adornos.

## Layout

**La regla y los tramos.** La regla del día ocupa 56px fijos a la izquierda (`--regla`)
y `main` y el pie se corren ese ancho. Cada sección es un **tramo**: una grilla con
líneas nombradas `full`, `content` y canales laterales `minmax(--canal, 1fr)`, contenido
de hasta 78rem, `padding-block` de `clamp(5rem, 10vw, 9rem)` y `row-gap` de
`clamp(2.5rem, 5vw, 4.5rem)`. La cabecera de un tramo mide como mucho 54rem.

**Sangrado a la derecha.** Las capturas grandes (hero, grafo, terminal) y el par con el
texto a la izquierda van de `content-start` a `full-end`: sangran por el borde derecho y
pierden ese borde y esas esquinas. `main` recorta con `overflow-x: clip`.

**Hero.** Dos columnas: texto en ~31rem y la captura en ~42rem que se estira 14vw más
allá, con la hora «08:40» vertical en su margen. Alto de pantalla completa.

**Pares asimétricos.** Captura y texto en 7:4 (texto a la derecha o a la izquierda), o
7:5 desparejo con la segunda figura bajada `clamp(3rem, 9vw, 8rem)`. «A la mañana
siguiente» superpone dos capturas por una esquina en una grilla de 12 (1–9 y 6–13, la
segunda bajada 58%).

**Novedades.** Desde 1100px, la cabecera queda fija (`sticky`, 3rem) en una columna de
22rem y el cuerpo corre al lado en hasta 52rem.

**Descargas.** Tres columnas iguales separadas por filetes verticales; la del sistema
detectado suma el chip «tu sistema».

**Responsivo.** A 1100px la sangría de la hora baja a 5.5rem y la IA pasa a una
columna. A 900px los pares y las descargas se apilan (las descargas con filete
superior). A 760px **la regla pasa arriba**: barra horizontal de 48px con la escala de
izquierda a derecha, sin la lectura de la hora ni los nombres al pasar; el indicador es
una barra de 30×2px abajo; la sangría desaparece; las capturas usan su recorte móvil
(`--proporcion-movil`); las dos luces se apilan corridas.

**Movimiento.** Corto y de estado, como en la app: 120ms para hover, 160ms para la
entrada de las capturas (fundido desde 4px, una vez, con `IntersectionObserver`), 220ms
para que la hora de la regla gire (sale hacia arriba, entra desde abajo), 320ms para que
el indicador vuelva al principio «a la mañana siguiente». Curva `cubic-bezier(0.16, 1,
0.3, 1)` (`--salida`). Con `prefers-reduced-motion` no hay transiciones, la hora se
reemplaza sin girar, las capturas aparecen enteras y el tono no sigue al scroll; la
regla igual sigue al lector.

## Elevation & Depth

Plana, como la app: los tramos se separan por el tono del día, no por sombras ni
tarjetas. Dos cosas tienen sombra, ambas teñidas con `--sombra` (Esporo al 75% en oscuro,
Esporo profundo al 22% en claro):

### Shadow Vocabulary
- **Ventana** (`0 28px 70px -24px var(--sombra)`): el marco de una captura. Es una
  ventana de la app apoyada sobre la página, no una tarjeta; la sombra es larga y
  recogida para que el borde inferior se despegue sin halo.
- **Nombre de la hora** (`0 8px 24px var(--sombra)`): el rótulo que aparece al costado
  de la regla al pasar o enfocar una hora. Es la sombra de menú del producto.

### Named Rules
**The Only Windows Float Rule.** Solo el marco de una captura y el rótulo flotante de la
regla tienen sombra. Texto, listas, columnas de descarga y novedades son planos.

## Shapes

Heredadas del producto: **suave** (4px) para botones, `code`, `kbd`, el chip «tu
sistema» y el anillo de foco; **redondeado** (8px) para el marco de las capturas. Una
captura que sangra pierde el borde y las esquinas del lado derecho (`8px 0 0 8px`). Los
`kbd` llevan el borde inferior de 2px. La separación entre ítems es siempre un filete
de 1px en `--borde`, horizontal en listas y vertical entre columnas de descarga.

## Components

### Buttons
Grandes y directos, a diferencia de los de la app: es el único lugar donde se actúa.
- **Shape:** esquina suave (4px), al menos 46px de alto, `0 1.2rem`, Geist 600 a 1rem,
  ícono SVG de trazo de 18px.
- **Primario:** Hifa con texto Lienzo. Es la descarga; uno por contexto (hero o columna
  de sistema). Hover: Hifa mezclado al 85% con negro, como en la app.
- **Secundario:** transparente, borde de Humus al 30%, texto Humus. Hover: Brote al 14%
  de fondo y borde al 50%. «Otras plataformas», `.deb`, `.rpm`.
- **Focus:** el anillo global de 2px en `--foco`, separado 2px.

### La descarga detectada (signature)
El hero detecta el sistema y ofrece **un** botón «Descargar para <sistema>» más
«Otras plataformas». Debajo, pegada al botón, **la nota de esa descarga** en Meta y
Humus tenue (qué es el archivo, el requisito, el primer arranque en macOS), la misma de
su columna en *Descargas*. Sin JS o sin sistema reconocido se ven los tres botones con
una nota de una línea; en el celular, un aviso de que Mycelium es para la computadora.
Debajo de todo, la línea de versión inyectada por el Worker, con el número en mono y
`--brillo-texto`.

### Marco de captura (signature)
Una captura real de la app en un marco de 8px, borde de 1px en `--borde`, relleno
Niebla y sombra de ventana. El marco toma la proporción de la imagen que muestra
(`--proporcion`, y en el celular `--proporcion-movil`): la captura entera (2880×1800)
cuando se lee a ese tamaño, o **un recorte legible** de la región que importa cuando
entera quedaría en letra de 4–7px. `<picture>` sirve el recorte móvil; `srcset` a 1x y
2x. Si la imagen falla, queda el marco vacío. El epígrafe, en 0.95rem y Humus tenue, dice
lo que se ve.

### La regla del día (signature)
`<nav>` fija de 56px en Esporo con filete derecho de Brote del marco al 12%. De arriba
abajo: el isotipo con halo, la **lectura** (la hora del indicador en mono 12px, de a 5
minutos, entre filetes), la **escala** (una marca por hora de 06 a 24 dibujada con
degradados, contra el borde derecho), las cinco horas como enlaces (11px, en
`--marco-texto`; la actual en `--marco-glow` y 600, con `aria-current`), el
**indicador** (barra de 2×26px en `--marco-glow`) y el **punto de ahora** (7px, en
`--marco-acento`, con un anillo de Esporo). Al pasar o enfocar una hora aparece su
nombre al costado. En las secciones del día siguiente la lectura dice «mañana» y el
indicador vuelve al principio. En el celular, ver *Layout*.

### La banda nocturna (signature)
El tramo de las 22:10: fondo `--noche-fondo`, paleta oscura en los dos modos, la captura
de la terminal recortada al tercio con texto (`2880 / 1040`, anclada arriba a la
izquierda), tres ítems de la IA en columnas con filete superior y una nota al pie que
dice que es opcional.

### Lista con filetes
Para enumerar funciones sin tarjetas: ítems apilados (o en dos o tres columnas)
separados por un filete de 1px, con el término en serif 600 y la descripción en Humus
tenue. Así son la sintaxis de las 08:40 (término en `code`), «Ordenás» y la IA.

### Novedades plegadas
El Worker inyecta el Markdown del release como HTML: H3 en `--titulo-3`, H4 en
`--titulo-4`, marcadores de lista en `--brillo-texto`, cuerpo en serif de lectura. Deja a
la vista el primer grupo (hasta la primera lista inclusive) y pliega el resto en un
`<details>` cuyo `summary` tiene la forma del botón secundario (44px) con el texto «Todo
lo nuevo de la <versión>» y un chevron SVG que gira 180° al abrir. Sin versión, una línea
en Humus tenue lo dice.

### Chip «tu sistema»
Generado sobre el H3 del sistema detectado: Geist 500 a 0.75rem, `--brillo-texto` sobre
Brote al 15%, esquina suave.

## Do's and Don'ts

### Do:
- **Do** usar los raw y los roles de `estilos.css` y, para todo lo heredado, las reglas
  del DESIGN.md del producto (Two Voices, Role, Frame, Tinted Shadow).
- **Do** declarar el tono `--t` y la hora `data-hora` de cada tramo nuevo, para que el
  fondo y la regla lo sigan.
- **Do** poner la hora dentro del H2, en mono, como primera columna, y sangrar el
  contenido del tramo la misma medida.
- **Do** mostrar funciones con capturas reales de la app, recortadas a lo que se lee.
- **Do** enumerar con listas de filetes finos y pares asimétricos de captura y texto.
- **Do** dejar la página entera y descargable sin JS, y dar a todo movimiento su
  alternativa con `prefers-reduced-motion`.
- **Do** acompañar cada botón de descarga con la nota breve de lo que baja.

### Don't:
- **Don't** armar una grilla de tarjetas de funciones, un hero centrado ni testimonios
  o métricas.
- **Don't** darle fondo propio a un tramo que no sea la noche: el tono lo da el día.
- **Don't** usar la mono para rótulos o adornos que no sean horas, teclas, sintaxis o
  versión.
- **Don't** ilustrar con maquetas o capturas inventadas, ni mostrar una captura entera
  cuando su texto queda ilegible.
- **Don't** darle sombra a nada que no sea el marco de una captura o un rótulo flotante.

## Diferencias con el producto

Lo que la landing hace distinto de `../docs/design/DESIGN.md`. No son reglas para otras
superficies; quedan anotadas para decidir si se llevan a la app o se corrigen acá.

- **Degradé de marca en el H1 del hero.** El producto le da tres usos y solo tres (logo,
  título del documento, énfasis triple). La landing le suma un cuarto, elegido en el
  contrato de dirección. Vale solo para el H1 del hero.
- **Humus tenue en claro:** `#4f5f62` acá contra `#59696C` en el producto.
- **Sombra de ventana en las capturas:** el producto da sombra solo a lo que flota; acá
  la lleva el marco de una captura, que se lee como una ventana.

Al documentar aparecieron cuatro defectos del build, **ya corregidos** (2026-10-07): la clase
`.noche` redefinía los roles con hex escritos a mano —ahora usa los tokens `--noche-*`
declarados en `:root`, que el modo claro no redefine—; su `--sombra` era `#000` al 55% —ahora
está teñida de Esporo, como pide la regla de sombras—; las etiquetas «06» y «24» de la escala
iban a 9px —ahora a 11px—; y `--ambar` estaba declarado sin uso —se quitó—.
