# Flujo de trabajo

BUREAU trabaja en **pasadas**, no en un único disparo. Cada pasada deja un artefacto y una decisión.

![Flujo de trabajo](../assets/diagrams/workflow.svg)

## Visión general

Para trabajo colaborativo, usa los roles, el contrato de traspaso, las comprobaciones de ilustración técnica y los límites de fuentes en `skill/references/25-collaborative-studio.md`. Un agente puede ejecutar los roles en secuencia; no declares una revisión independiente si no ocurrió. Las herramientas y skills externas son opcionales y requieren verificar licencia y procedencia.

Para comparar versiones por calidad de diseño o tasa de aprobación, usa el protocolo pareado con briefs reales en `skill/references/26-outcome-evaluation.md`. La rúbrica de calidad se inspira en categorías de Awwwards, pero no es una puntuación oficial del premio. Registra resultados de la versión anterior y la nueva, veredictos independientes e incertidumbre; las puntuaciones de auditoría automatizada no demuestran por sí solas una mejora.

Para una evaluación independiente de rúbricas de premios y del circuito de revisión, usa `skill/references/28-independent-design-assessment.md` y `skill/assets/studio-templates/independent-assessment.md`. Evaluadores independientes puntúan cinco dimensiones con evidencia; sin evidencia, el total queda sin evaluar.

Para briefs profundos, investigación de referencias y evaluación opcional de candidatos, usa `skill/references/27-design-intelligence.md` y `skill/assets/studio-templates/qualification.md`. El motor de diseño parte de un relevamiento de cinco fuentes (`skill/references/30-reference-survey.md`): `survey.mjs` ordena las 25 entradas según la necesidad del brief, la fuente que no pueda verificarse se salta con el motivo y se toma la siguiente hasta tener cinco verificadas, con el patrón común y la ruptura creativa registrados. Las 25 entradas incluyen nombres aún no identificados; la rúbrica exige evidencia para cada nota. Para capturar cada página de referencia (captura, Markdown, campos), `skill/references/33-reference-acquisition.md` elige entre Playwright, Crawl4AI, Firecrawl, ScrapeGraphAI, Crawlee y Scrapy, y excluye herramientas que eluden bloqueos, como Scrapling. La indexación continua y la predicción de tendencias no están implementadas.

`node skill/scripts/source-monitor.mjs --out source-report.json` registra la disponibilidad de los endpoints `robots.txt` de las fuentes identificadas. El workflow del repositorio lo programa diariamente a las 09:00 UTC y conserva informes durante 30 días cuando GitHub Actions está activado. No indexa proyectos ni clasifica diseños y no sobrescribe informes.

| Fase | Puertas | Entregable | Tiempo típico |
|---|---|---|---|
| A. Intake | G0 | `BUREAU.md`, `config.json` | 1–2 h |
| B. Concepto | G1 | 3 direcciones + decisión | 4–8 h |
| C. Dirección | G2–G4 | `DESIGN.md`, tipografía, color, composición | 1–2 días |
| D. Build | G4, G6 | página real, componentes, tokens | 2–5 días |
| E. Motion | G5 | `MOTION.md`, firma, video/3D | 1–3 días |
| F. QA | G6–G7 | screenshots, métricas, correcciones | 4–8 h |
| G. Review | G8–G9 | scorecard, Tribunal, launch | 3–6 h |

Un sitio de campaña cabe en 5–7 días. Un producto con CMS y múltiples superficies, en 2–4 semanas.

---

## A. Intake (G0)

**Qué hacer:**

- Leer el pedido, el repositorio, los assets y la verdad existente.
- Escribir `BUREAU.md` con público, oferta, prueba, non-goals y métrica.
- Declarar el modo por superficie.
- Escribir `.bureau/config.json` con viewports y budgets.
- Hacer el inventario de evidencia: qué existe, qué falta, quién aprueba.

**Qué no hacer:**

- Abrir Figma antes de saber qué debe probar la página.
- Elegir la paleta antes de elegir el mundo.
- Inventar una métrica porque falta prueba.

**Salida:** brief de una página, config, lista de riesgos.

---

## B. Concepto (G1)

**Qué hacer:**

- Generar tres direcciones con lentes diferentes (material, editorial, sistémico, espacial, temporal, instrumental, documental, lúdico).
- Para cada una: tesis, tensión, emoción, ground/voice/light/motion, *signature move*, *technological proof*, riesgo.
- Producir tres comps en el mismo viewport con contenido real.
- Puntuar con la matriz de 6 criterios.
- Registrar la decisión y las direcciones rechazadas.

**Qué no hacer:**

- Tres variaciones de la misma idea.
- Aprobar una dirección a partir de una imagen generada sin layout.
- Dejar que el comp se convierta en el build por accidente.

**Salida:** `.bureau/comps/` con tres comps + `decision.md` + `blend.md` (linaje: dominante × contrapunto × acento).

---

## C. Dirección (G2–G4)

**Qué hacer:**

- Escribir el *world sheet*: ground, luz, voz, paleta, material, motion, imagen, prohibiciones.
- Generar tokens (OKLCH + hex) y validar contraste.
- Producir un espécimen tipográfico y una hoja de color en contexto.
- Componer el primer viewport como una tesis.
- Probar 320, 390, 768, 1440, 1920.
- Romper la retícula una vez, en el *signature move*.

**Qué no hacer:**

- Empezar por componentes.
- Usar radio de 24 px en todo.
- Confundir "minimalista" con "vacío".
- Dejar que el accent aparezca 12 veces sobre el pliegue.

**Salida:** `DESIGN.md`, tokens, espécimen, primeros viewports.

---

## D. Build (G4, G6)

**Qué hacer:**

- HTML semántico primero.
- CSS en capas (`reset, tokens, base, layout, components, utilities, motion`).
- JS mínimo; code-split para escenas pesadas.
- Contenido real en todos los estados.
- Estados: default, hover, focus, active, disabled, loading, empty, error, success.
- i18n desde el inicio (PT/EN/ES), con `lang` y `hreflang`.

**Qué no hacer:**

- Ocultar contenido esencial detrás de hover.
- Renderizar el hero en el cliente.
- Cargar 6 pesos de 3 familias.
- Dejar un `div onclick` en lugar de un botón.

**Salida:** página navegable, build reproducible, sin errores de consola.

**Después refina:** siete pasadas de la estructura al detalle (`skill/references/24-refinement-passes.md`), registradas en `.bureau/evidence/refinement.md`.

---

## E. Motion (G5)

Documenta cinco referencias premiadas de motion distintas con `node skill/scripts/motion-research.mjs --init` y `node skill/scripts/motion-research.mjs --check`. Usa `node skill/scripts/motion-research.mjs --plan` para generar un plan de producción inicial. Registra fuentes de los premios y evidencia local de observación; `skill/references/31-motion-production.md` explica el proceso y las herramientas opcionales. G5 exige el registro completo.

**Qué hacer:**

- Escribir `MOTION.md` antes del efecto.
- Elegir un carácter: preciso, viscoso, mecánico, orgánico o cinematográfico.
- Una secuencia de entrada, una narrativa de scroll, una firma de interacción.
- Animar `transform` y `opacity`.
- Diseñar el modo `prefers-reduced-motion`.
- Medir 60 fps con CPU 4×.

**Qué no hacer:**

- Fade-up en todas las secciones.
- Scroll hijack.
- Parallax en texto de lectura.
- Audio automático.
- Shader a pantalla completa en móvil sin fallback.

**Salida:** `MOTION.md`, grabación corta, screenshots normal + reduced.

---

## F. QA (G6–G7)

**Qué hacer:**

- Ejecutar `visual-audit.mjs` en 4 viewports.
- Abrir cada screenshot y clasificar: defecto real, trade-off aceptable, falso positivo.
- Corregir en la fuente, no en el screenshot.
- Ejecutar de nuevo con el mismo comando y guardar antes/después.
- Hacer el recorrido solo con teclado.
- Probar 200% y 400% de zoom.
- Probar con lector de pantalla.

**Qué no hacer:**

- Pasar porque el JSON está en verde.
- Ignorar contraste sobre imagen.
- Aceptar overflow horizontal.
- Dejar que un P1 se convierta en media.

**Salida:** `.bureau/qa/` + `.bureau/evidence/`.

---

## G. Review (G8–G9)

**Qué hacer:**

- Ejecutar el audit estático y leer los hallazgos en contexto.
- Completar un `scores.json` por puerta con evidencia real.
- Ejecutar `review.mjs --gate` en orden.
- Escribir la declaración del Tribunal.
- Generar el scorecard y adjuntarlo a la entrega.
- Hacer ship solo con PASS o CONDITIONAL aceptado por escrito.

**Qué no hacer:**

- Revisar de memoria.
- Reutilizar evidencia de otro build.
- Redondear un P0.
- Pasar porque llegó la fecha límite.

**Salida:** `scorecard.html`, veredicto, blockers, próximo paso.

---

## Loop Figma → código

```
frame en Figma
  → screenshot de referencia
  → variables/tokens
  → código real
  → screenshot en el mismo viewport
  → comparación lado a lado
  → corregir la mayor desviación
  → repetir
```

Reglas:

- Mismo viewport, DPR, contenido y estado.
- Comparar primero el hero y el *signature moment*.
- La diferencia de píxel es evidencia, no objetivo.
- Si código y Figma discrepan, decidir la fuente de verdad y actualizar la otra.

Detalles: `skill/references/14-figma-workflow.md`.

---

## Loop Playwright

```
servidor local
  → visual-audit (4 viewports + reduced motion)
  → screenshots + JSON
  → inspección humana
  → corrección
  → re-run idéntico
  → baseline
```

Comandos:

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Detalles: `skill/references/15-playwright-qa.md`.

---

## Sprint de 5 días (ejemplo)

| Día | Mañana | Tarde |
|---|---|---|
| 1 | intake, verdad, inventario | tres direcciones + comps |
| 2 | elección, world sheet, tokens | hero + firma |
| 3 | página completa, responsive | motion + reduced motion |
| 4 | QA, a11y, performance | correcciones P0/P1 |
| 5 | G2–G9, Tribunal | launch checklist, ship |

Si el día 5 se convierte en día 9, el alcance estaba mal el día 1. Revisar el brief, no el CSS.

---

## Handoff

Entregar siempre:

1. la idea en una frase;
2. el mundo en 3–5 líneas;
3. archivos, stack y comandos;
4. evidencia: screenshots, métricas, audit, veredicto;
5. limitaciones honestas;
6. el siguiente movimiento de mayor valor.

Sin eso, no es una entrega; es un volcado de archivos.
