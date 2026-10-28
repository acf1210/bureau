# BUREAU — el bureau de diseño digital autónomo

**BUREAU** es una skill de agente que convierte un modelo de lenguaje en un bureau de diseño completo: dirección creativa, dirección de arte, tipografía, color, motion, WebGL, video, Figma, QA con Playwright, accesibilidad, performance, copy y revisión adversarial.

No es un generador de plantillas. Es un **sistema de decisión estética con evidencia**.

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau
bash installers/install.sh --agent all --scope user --dry-run
bash installers/install.sh --agent all --scope user
```

Después, reiniciar el agente y pedir: *"Usa BUREAU para crear el sitio de mi marca."*

---

## El problema

Los modelos se entrenan con la media de internet. Sin dirección, producen el mismo hero centrado, el mismo degradado morado, las mismas tres tarjetas con iconos, el mismo copy de "empower your business". Eso no es falta de CSS. Es falta de **concepto, especificidad y revisión**.

BUREAU ataca las tres:

1. **Concepto antes de píxeles** — tres direcciones, una elección argumentada.
2. **Oficio verificable** — tipografía, color, composición, motion y performance con rúbricas explícitas.
3. **Revisión adversarial** — diez puertas independientes y un Tribunal que puede vetar.

---

## Qué hace la skill

| Capacidad | Qué entrega |
|---|---|
| **Dirección creativa** | tres direcciones distintas, matriz de decisión, *signature move* |
| **Dirección de arte** | mundo visual, paleta, tipografía, material, luz, imagen |
| **Design system** | tokens OKLCH, escala tipográfica, espaciado, motion, componentes |
| **Motion** | gramática de movimiento, scroll narrativo, microestados, reduced motion |
| **WebGL / 3D** | shaders, Three.js/R3F, partículas, fallback estático |
| **Video y parallax** | loops comprimidos, poster, subtítulos, capas de profundidad |
| **Figma** | MCP, variables, comps, handoff, comparación lado a lado |
| **Playwright** | screenshots multi-viewport, contraste, overflow, consola, performance |
| **Accesibilidad** | WCAG 2.2 AA, teclado, foco, movimiento, medios, zoom |
| **Anti-AI-slop** | detector determinista, taxonomía de 106 señales, correcciones |
| **Copy y verdad** | voz, headlines, microcopy, afirmaciones con fuente, SEO, i18n |
| **Ship** | OG, analytics, consentimiento, monitoreo, rollback |

---

## El circuito

```
G0 Intake → G1 Concept → G2 Direction → G3 Type & Color → G4 Composition
→ G5 Motion → G6 Engineering → G7 Access → G8 Truth → G9 Launch → TRIBUNAL
```

Cada puerta tiene una persona, un peso, fallas duras y evidencia obligatoria. El total es 100. Cualquier P0, cualquier puerta por debajo de 3,5/5 o cualquier evidencia ausente **hace fallar el release**.

| Veredicto | Nota |
|---|---|
| Award Track | ≥ 90 |
| Pass | 82–89 |
| Conditional | 72–81 |
| Fail | < 72 |

El Tribunal no reescribe notas. Pregunta si el trabajo cumple la promesa, si alguna puerta está pasando por encanto y si el bureau firmaría eso en público.

Leer el circuito completo en [review-circuit.md](review-circuit.md).

---

## Por qué es diferente

- **No pregunta todo.** Decide con estándares defendibles y como máximo tres preguntas bloqueantes.
- **No acepta "bonito".** Cada afirmación apunta a un screenshot, una métrica, una grabación o un archivo.
- **No premia la media.** Un 95 con un P0 de accesibilidad es Fail.
- **No fabrica credibilidad.** Métrica, logo, testimonio y premio sin fuente son P0.
- **No entrega plantilla.** Toda entrega tiene un *signature move* y una prueba elegida para el tema: fotográfica, cinematográfica o tecnológica.
- **No abandona el oficio.** El detector cubre lo mecánico; el ojo humano cubre el resto.

---

## Inicio rápido

```bash
# 1. Comprobar el entorno
node skill/scripts/doctor.mjs

# 2. Crear un proyecto a partir de una de las trece plantillas
node skill/scripts/new-project.mjs mi-sitio --template kinetic-editorial

# 3. Completar BUREAU.md y ejecutar el circuito
node skill/scripts/audit.mjs . --out .bureau/evidence/audit.json
node skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa
node skill/scripts/review.mjs --status
```

- [Instalación](install.md)
- [Primeros 15 minutos](quickstart.md)
- [Arquitectura](architecture.md)
- [Flujo de trabajo](workflow.md)
- [Comandos](commands.md)
- [Anti-slop](antislop.md)
- [Lenguaje visual](design-language.md)

---

## Estructura del repositorio

```
skill/                 la skill instalable
  SKILL.md             enrutador y doctrina
  references/          33 módulos de profundidad
  scripts/             audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/              plantillas, tokens, snippets, medios, diagramas
installers/            Claude, Codex, Antigravity, Hermes + bash/PowerShell
docs/                  PT-BR, EN, ES
site/                  landing + docs estáticos
```

---

## Licencia y créditos

MIT. BUREAU es un trabajo original; referencia públicamente proyectos como [Impeccable](https://github.com/pbakaus/impeccable), [Colorfigures](https://april-zhu.com/colorfigures), [Font Awesome](https://github.com/FortAwesome/Font-Awesome) y las galerías listadas en `skill/references/20-reference-library.md`. Pantone® es marca de Pantone LLC; BUREAU no está afiliado. Los valores hexadecimales son aproximaciones para pantalla.
