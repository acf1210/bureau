# Lenguaje visual

Para cada concepto, registra decisiones de UI, UX e innovación y un plan de evidencias usando `skill/references/16-review-circuit.md`. Son interpretaciones de BUREAU de las [definiciones de CSS Design Awards](https://www.cssdesignawards.com/sites/guidance/43364/), no subcriterios oficiales ni una predicción de premios.

Para un vocabulario práctico de estilos visuales y sus trade-offs, usa `skill/references/32-visual-style-vocabulary.md`. Elige una lente a partir del brief y prueba con contenido real; una etiqueta de estilo no demuestra usabilidad ni conversión.

BUREAU no tiene un estilo fijo. Tiene un **método** para construir un estilo que pertenezca al asunto.

## 1. Pantone como ancla, no como paleta

Pantone es un lenguaje estandarizado de color para impresión, textil y marca. No es un espacio de color CSS.

- **PMS / Solid** — tintas de impresión.
- **TCX / TPG** — textil.
- **Pantone Connect** — bibliotecas licenciadas.
- **Hex/sRGB** — aproximaciones de pantalla.

Usar Pantone para **nombrar y anclar** la paleta en el brief; implementar en OKLCH y verificar contraste. Nunca afirmar que un color de pantalla *es* Pantone. Para impresión, usar bibliotecas licenciadas y prueba física.

### Color of the Year — referencia

| Año | Código | Nombre | Hex aprox. | Carácter |
|---|---|---|---|---|
| 2026 | 11-4201 | Cloud Dancer | `#F0EEE9` | off-white aireado, silencio |
| 2025 | 17-1230 | Mocha Mousse | `#A47864` | marrón comestible, confort |
| 2024 | 13-1023 | Peach Fuzz | `#FFBE98` | melocotón táctil |
| 2023 | 18-1750 | Viva Magenta | `#BE3455` | carmín asertivo |
| 2022 | 17-3938 | Very Peri | `#6667AB` | periwinkle optimista |
| 2021 | 17-5104 | Ultimate Gray | `#939597` | gris estable |
| 2021 | 13-0647 | Illuminating | `#F5DF4D` | amarillo solar |
| 2020 | 19-4052 | Classic Blue | `#0F4C81` | azul confiable |
| 2019 | 16-1546 | Living Coral | `#FF6F61` | coral social |
| 2018 | 18-3838 | Ultra Violet | `#5F4B8B` | violeta cósmico |
| 2017 | 15-0343 | Greenery | `#88B04B` | verde botánico |
| 2016 | 13-1520 / 15-3919 | Rose Quartz / Serenity | `#F7CAC9` / `#92A8D1` | calma suave |

Tabla completa (2000–2026) en `skill/references/05-color-pantone.md`. Los valores son aproximaciones de BUREAU, no conversiones oficiales.

### Dirección 2026: Cloud Dancer como ground

```css
:root{
  --ground: oklch(95.2% 0.008 85);
  --surface: oklch(97.5% 0.006 85);
  --ink: oklch(18% 0.012 70);
  --muted: oklch(52% 0.014 70);
  --line: oklch(30% 0.01 70 / .14);
  --accent: oklch(56% 0.19 32);      /* terracota */
  --accent-ink: oklch(97% 0.01 80);
  --signal: oklch(78% 0.16 92);
}
```

Cloud Dancer no es "blanco". Es material: papel, yeso, lino, luz difusa. Usar con una sección oscura dura y un accent saturado para evitar la monotonía.

---

## 2. Color como sistema

- **60/30/10** con intención: ground, ink/superficies, accent/signal.
- **5–7 roles semánticos**, no 30 hex sueltos.
- **OKLCH** para escala perceptualmente uniforme.
- **Contraste** AA en todos los estados.
- **Dark mode** recalculado, no invertido.
- **Degradado** solo cuando representa luz, calor, profundidad o material. Nunca en texto.
- **Datos** con paleta colorblind-safe y rótulos; el color nunca solo.

Paletas de partida:

| Nombre | Ground | Ink | Accent | Uso |
|---|---|---|---|---|
| Quiet Precision | `#F0EEE9` | `#161616` | `#C8402A` | editorial, cultura |
| Night Archive | `#0C0D0C` | `#EDE7DA` | `#B7791F` | archivo, cine |
| Cold Signal | `#E7E9E6` | `#1B2226` | `#C6F04A` | ingeniería, datos |
| Warm Instrument | `#E9DFD0` | `#2A1F1A` | `#B4553A` | producto, artesanía |
| Botanical Modern | `#10251C` | `#E8E5D8` | `#89A85C` | ciencia, clima |
| Chrome Bloom | `#111214` | `#D9D9D6` | `#B98BC4` | moda, música |

---

## 3. Tipografía

- Máximo 2 familias + 1 mono.
- Display con voz; cuerpo con legibilidad.
- Escala fluida con `clamp`, probada en 320–2560.
- Display: leading 0.9–0.98, tracking -0.02 a -0.04em.
- Cuerpo: 55–75ch, leading 1.55–1.7.
- Números tabulares en datos.
- Acentos PT/ES probados: ã, ç, é, ñ, ü.
- Fuentes self-hosted, subset, `font-display: swap`.

Pares que funcionan:

1. Bodoni Moda + Archivo + JetBrains Mono
2. Instrument Serif + Libre Franklin + IBM Plex Mono
3. Fraunces + Public Sans + Space Mono
4. Newsreader + Archivo + IBM Plex Mono
5. Syne + Archivo + Space Mono
6. Cormorant Garamond + Work Sans + JetBrains Mono

Evitar Inter + Space Grotesk como identidad completa.

---

## 4. Motion

Un carácter por proyecto:

| Carácter | Tiempo | Easing | Uso |
|---|---|---|---|
| Preciso | 120–220 ms | `.2 .7 .2 1` | producto, datos |
| Viscoso | 600–1200 ms | `.22 1 .36 1` | editorial, lujo |
| Mecánico | stepped/linear | linear | instrumento, terminal |
| Orgánico | irregular | noise | naturaleza, salud |
| Cinematográfico | 800–1600 ms | in-out largo | experiencia |

Reglas:

- una secuencia de entrada;
- una narrativa de scroll;
- una firma de interacción;
- `transform` y `opacity`;
- reduced motion diseñado;
- 60 fps con CPU 4×;
- nada de scroll hijack.

---

## 5. Prueba tecnológica

Elegir **una** por proyecto:

| Prueba | Cuándo | Costo |
|---|---|---|
| Scroll-driven choreography | narrativa, producto | bajo |
| WebGL/shader | atmósfera, generativo, espacial | medio–alto |
| 3D real | producto, configurador | alto |
| Video como material | moda, lugar, cine | medio |
| Identidad generativa | marca variable | medio |
| Datos en vivo | fintech, clima, deporte | medio |
| View Transitions | flujo multipágina | bajo |
| Instrumento interactivo | audio, configuración | medio |

La prueba sirve al argumento. Un shader en una panadería no es ambición; es confusión.

---

## 6. Firma

Un *signature move* es lo único que alguien le describiría a un amigo. Necesita ser:

- legible sin explicación;
- poseíble por la marca;
- repetible en otros viewports;
- performático;
- accesible.

Ejemplos de **tipo**, nunca de copia:

- producto que se arma en el scroll con piezas rotuladas;
- hero tipográfico que se comporta como una impresora;
- datos en vivo como escultura;
- video que se convierte en UI en el momento de la historia;
- navegación como mapa del argumento;
- sistema de color que cambia con la hora, dentro de un rango diseñado.

---

## 7. Biblioteca de referencia

Usar para calibrar, no para montar:

- **land-book.com** — estructura de landing;
- **minimal.gallery** — contención;
- **godly.website** — ambición;
- **mobbin.com** — flujos reales de app;
- **refero.design** — patrones de producto;
- **60fps.design** — timing de motion;
- **vibrant.design** — UI e interacción;
- **recent.design** — radar diario;
- **backgrounds.supply** — material;
- **footer.design** — cierre;
- **promptmotionsite.com** — vocabulario de motion;
- **april-zhu.com/colorfigures** — objetos isométricos con corte;
- **Font Awesome** — fallback de iconos;
- **Impeccable** — detección y disciplina de artefactos.

Protocolo de extracción: impresión → estructura → oficio → comportamiento → principio transferible. Nunca abrir una referencia y programar de inmediato.

Lista completa y ética en `skill/references/20-reference-library.md`.

---

## 8. Linaje y mezcla

BUREAU nunca copia una sola fuente. Toda dirección es una **mezcla** de tres linajes documentados, cada uno dueño de un eje distinto, pasada por el tema hasta que ninguna fuente aislada pueda nombrarse.

| Designer | Obra documentada | Principio | Eje |
|---|---|---|---|
| Josef Müller-Brockmann | *Grid Systems in Graphic Design* (1981) | la retícula modular como orden objetivo | grid |
| Jan Tschichold | *Die neue Typographie* (1928) | jerarquía asimétrica y funcional | composición |
| Massimo Vignelli | NYC subway diagram (1972) | pocas tipografías, el diagrama sobre la imagen | tipo, navegación |
| Otl Aicher | Munich 1972 | paleta restringida, pictogramas en una sola retícula | color, iconos |
| Edward Tufte | *The Visual Display of Quantitative Information* (1983) | data-ink, small multiples, etiquetas directas | datos |
| Herb Lubalin | *Avant Garde* (1968–71) | letras apretadas hasta que la palabra es imagen | voz |
| Saul Bass | *Vertigo* (1958), *Anatomy of a Murder* (1959) | movimiento que corta en lugar de desvanecer | motion |
| Muriel Cooper | *Information Landscapes* (1994) | tipo en el espacio; profundidad como navegación | profundidad |
| László Moholy-Nagy | *Light Prop for an Electric Stage* (1930) | la luz es el medio | luz |
| Charles and Ray Eames | *Powers of Ten* (1977) | un movimiento por la escala con un factor constante | scroll |

Receta: **dominante** 50–60% (estructura) × **contrapunto** 25–35% (expresión, tirando en contra) × **acento** 10–20% (un comportamiento), más un ingrediente que solo el tema tiene. Escríbela en `.bureau/comps/blend.md` (Gate 1).

Las trece plantillas son ejemplos resueltos, cada una con un `LINEAGE.md`. También cuentan como fuentes:

| Template | Dominant | Counter | Accent |
|---|---|---|---|
| `kinetic-editorial` | Tschichold | Lubalin | Bass |
| `product-surface` | Tufte | Vignelli | Aicher |
| `immersive-experience` | Moholy-Nagy | Cooper | Eames |
| `legal-practice` | Sutnar | Rand | Ruder |
| `architecture-studio` | Ando | Mies | Scarpa |
| `restaurant-table` | Barragán | Wyman | J. Albers |
| `private-bank` | Müller-Brockmann | Crouwel | Tufte |
| `clinic-care` | Hara | Kare | Tanaka |
| `developer-api` | Gerstner | Weingart | Greiman |
| `fashion-atelier` | Brodovitch | A. Albers | B. Thompson |
| `record-label` | Reid Miles | Saville | Brody |
| `museum-archive` | Bo Bardi | Lustig | Munari |
| `hardware-store` | Rams | Sottsass | Castiglioni |

Un proyecto creado desde una plantilla empieza como copia. Antes del Gate 2 debe estar en 0.35 o menos contra todas las plantillas:

```bash
node skill/scripts/divergence.mjs index.html --templates --out .bureau/evidence/divergence.json
```

Canon, reglas y pruebas de originalidad en `skill/references/23-lineage-and-blend.md`.

---

## 9. Pasadas de refinamiento

Entre el primer build y el QA, siete pasadas de la estructura al detalle. Una a la vez; nueva captura tras cada una.

| Pasada | Mira |
|---|---|
| P1 | estructura: columna, densidad, pliegue, una ruptura de retícula |
| P2 | tipo: tamaño óptico, tracking por tamaño, glifos en tamaño display, rag |
| P3 | color y luz: roles, conteo del accent, todos los estados |
| P4 | espacio: una escala, proximidad, objetivos |
| P5 | motion: un carácter, una entrada, reduced mode diseñado |
| P6 | estados y bordes: foco, errores, vacío, controles de medios |
| P7 | distinción: pruebas de linaje y divergencia |

Umbrales y evidencias en `skill/references/24-refinement-passes.md`.
