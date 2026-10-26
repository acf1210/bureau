# Comandos

Los comandos se invocan como `/bureau <comando>` cuando el host expone slash commands, o por lenguaje natural. El enrutador de `SKILL.md` también acepta pedidos sin comando.

## Tabla

| Comando | Intención | Lee | Produce |
|---|---|---|---|
| `/bureau` | enrutador | proyecto | próximas 2 acciones con evidencia |
| `/bureau init` | brief y config | pedido, repo, assets | `BUREAU.md`, `.bureau/config.json` |
| `/bureau concept` | tres direcciones | brief, referencias | `.bureau/comps/` + decisión |
| `/bureau direction` | mundo visual | decisión | `DESIGN.md`, tokens, espécimen |
| `/bureau build` | implementación | `DESIGN.md` | página real |
| `/bureau motion` | movimiento | `MOTION.md` | entrada, scroll, interacción |
| `/bureau figma` | Figma → código | variables, frames | tokens, comparación |
| `/bureau qa` | evidencia técnica | URL/build | screenshots, `report.json` |
| `/bureau review` | circuito | scores, evidencia | scorecard, veredicto |
| `/bureau slop` | detector + correcciones | código | `audit.json`, fixes |
| `/bureau ship` | launch | checklist | metadata, monitoreo, deploy |
| `/bureau doctor` | entorno | host, deps | informe de capacidad |

---

## `/bureau`

Sin argumento, inspecciona el proyecto:

- `BUREAU.md` ausente → propone `init`;
- comps ausentes → propone `concept`;
- URL sin QA → propone `qa`;
- QA antiguo → propone `review`;
- todo listo → propone `ship`.

Lidera con **dos** acciones de mayor valor y una línea de evidencia cada una. Nunca ejecuta un paso destructivo por sí solo.

---

## `/bureau init`

1. Hace como máximo tres preguntas bloqueantes por ronda.
2. Propone defaults para el resto.
3. Escribe `BUREAU.md` y `.bureau/config.json`.
4. Declara el modo por superficie.
5. Arma el inventario de evidencia.

Criterio de terminado: oferta, público, prueba con fuente, non-goals y métrica.

---

## `/bureau concept`

1. Genera tres direcciones con lentes diferentes.
2. Crea tres comps en el mismo viewport, con contenido real.
3. Puntúa con la matriz de 6 criterios.
4. Elige y registra la decisión + los rechazados.

Nunca entregar tres variaciones de la misma idea.

---

## `/bureau direction`

1. World sheet: ground, voz, luz, material, motion, imagen, prohibiciones.
2. Tokens OKLCH + hex, escala, espaciado, radios.
3. Espécimen tipográfico + hoja de color en contexto.
4. Primer viewport como tesis.
5. Valida contraste.

```bash
node skill/scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
```

---

## `/bureau build`

1. HTML semántico.
2. CSS en capas.
3. JS mínimo.
4. Estados completos.
5. Contenido real.
6. i18n.

El build no empieza sin `DESIGN.md` y un comp elegido.

---

## `/bureau motion`

1. Escribe `MOTION.md`.
2. Elige un carácter.
3. Implementa una entrada, una narrativa, una firma.
4. Diseña reduced motion.
5. Mide 60 fps.

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 --out .bureau/qa --motion
```

---

## `/bureau figma`

1. Descubre las herramientas MCP disponibles.
2. Lee variables y screenshot del frame.
3. Sincroniza tokens.
4. Compara código vs Figma en el mismo viewport.
5. Registra desviaciones intencionales.

```bash
node skill/scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
node skill/scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
```

Sin MCP: exportar JSON + PNG y registrar la limitación.

---

## `/bureau qa`

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Opciones:

| Flag | Efecto |
|---|---|
| `--full` / `--no-full` | screenshot de página completa |
| `--motion` / `--no-motion` | pasada de reduced motion |
| `--scroll-shots` | frames en 25/50/75% |
| `--dark` | color scheme oscuro |
| `--locale` | locale del navegador |
| `--baseline` | compara hash con baseline |
| `--update-baseline` | graba baseline |
| `--fail-on p0` | exit 1 en P0 |

El informe incluye overflow, contraste, objetivos táctiles, imágenes, fuentes, videos, consola, requests, LCP, CLS, long tasks y reduced motion.

---

## `/bureau review`

```bash
node skill/scripts/review.mjs --status
node skill/scripts/review.mjs --gate g1-concept --scores .bureau/review/g1.json
node skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
node skill/scripts/review.mjs --report
```

- Exige orden.
- Exige evidencia.
- Rechaza score < 3,5 y P0.
- Marca puertas obsoletas por hash.
- Genera `.bureau/review/scorecard.html`.

---

## `/bureau slop`

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --json --out .bureau/evidence/audit.json
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

Detecta el subconjunto mecánico: degradado morado, texto en degradado, fondo puro, fuentes estándar de IA, léxico genérico, placeholder, autoplay, overflow de accesibilidad, `transition: all`, scroll hijack, `div onclick`, etc.

No detecta talento. Leer los hallazgos en contexto.

---

## `/bureau ship`

Checklist:

- afirmaciones con fuente;
- OG 1200×630;
- sitemap/robots;
- 404/500;
- analytics + consentimiento;
- monitoreo;
- rollback;
- redirects;
- headers de seguridad.

---

## `/bureau doctor`

```bash
node skill/scripts/doctor.mjs
node skill/scripts/doctor.mjs --json
```

Verifica Node, Playwright, Chromium, ffmpeg, ImageMagick, git, gh, Figma, artefactos del proyecto e instalaciones por host.

---

## Scaffold

```bash
node skill/scripts/new-project.mjs --list
node skill/scripts/new-project.mjs mi-sitio --template product-surface
```

Crea proyecto + `BUREAU.md`, `DESIGN.md`, `MOTION.md`, config, carpetas de evidencia y README.

---

## Tokens

```bash
node skill/scripts/tokens.mjs \
  --in design/tokens.json \
  --out-dir src/styles \
  --mode light \
  --check
```

Acepta W3C DTCG, Tokens Studio y JSON plano. Genera:

- `tokens.css` (hex + override OKLCH);
- `tokens.tailwind.css` (`@theme`);
- `tokens.normalized.json`;
- `contrast.md`.

`--check` falla en contraste < 4,5:1 y aliases no resueltos.

---

## Figma sync

```bash
node skill/scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
```

Acepta:

- Tokens Studio (`global`/`light`/`dark`);
- W3C DTCG;
- export de Figma Variables (`variables[]` con `valuesByMode`).

Resuelve aliases e informa los no resueltos.

---

## Códigos de salida

| Código | Significado |
|---|---|
| 0 | éxito |
| 1 | falla de calidad (threshold, puerta, contraste) |
| 2 | uso/entrada inválida |
| 3 | precondición (orden de puerta, Tribunal ausente) |
| 4 | evidencia ausente |

---

## Ejemplos de flujo

```bash
# proyecto nuevo
node skill/scripts/new-project.mjs studio --template kinetic-editorial
cd studio
node ../skill/scripts/audit.mjs . --out .bureau/evidence/audit.json

# QA
node ../skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --full --motion

# review
node ../skill/scripts/review.mjs --status
node ../skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
```

Repetir hasta el Tribunal. No saltar el orden.
