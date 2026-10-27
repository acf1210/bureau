# Instalación

BUREAU es una Agent Skill estándar: una carpeta con `SKILL.md`, `references/`, `scripts/` y `assets/`. Cada host descubre la carpeta de una manera.

## Instalación en un comando

```bash
# macOS / Linux / WSL
bash installers/install.sh --agent all --scope user --dry-run
bash installers/install.sh --agent all --scope user
```

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

Ejecutar siempre `--dry-run` primero.

## Opciones

| Flag | Efecto |
|---|---|
| `--agent claude\|codex\|antigravity\|hermes\|all` | host |
| `--scope user\|project` | máquina o repositorio |
| `--dry-run` | solo imprime |
| `--link` | symlink (desarrollo, Unix) |
| `--force` | sobrescribe instalación sin marcador |
| `--uninstall` | elimina solo lo que es de BUREAU |
| `--no-command` | no instala el slash command |
| `--with-agents` | añade bloque en `AGENTS.md` (Codex, proyecto) |

---

## Dónde instala

### Claude Code

| Alcance | Skill | Comando |
|---|---|---|
| usuario | `~/.claude/skills/bureau/` | `~/.claude/commands/bureau.md` |
| proyecto | `.claude/skills/bureau/` | `.claude/commands/bureau.md` |

Reiniciar Claude Code. Usar `/bureau` o pedirlo de forma natural.

### Codex

| Alcance | Skill |
|---|---|
| usuario | `~/.codex/skills/bureau/` |
| proyecto | `.codex/skills/bureau/` |

Para convertir BUREAU en la autoridad de diseño predeterminada del repositorio, añadir el bloque de `installers/codex/AGENTS.snippet.md` al `AGENTS.md`:

```bash
bash installers/install.sh --agent codex --scope project --with-agents
```

### Antigravity

| Alcance | Skill | Regla |
|---|---|---|
| usuario | `~/.gemini/config/skills/bureau/` | `~/.gemini/config/rules/bureau.md` |
| proyecto | `.agents/skills/bureau/` | `.agents/rules/bureau.md` |

La regla usa `trigger: model_decision` y una `description` que apunta a la skill. Antigravity solo escanea hijos inmediatos de `.agents/rules/`; no anidar.

```yaml
---
trigger: model_decision
description: "Usa BUREAU para diseño, rediseño, motion, Figma, QA con Playwright, accesibilidad, performance y anti-AI-slop."
---
```

### Hermes

| Alcance | Skill |
|---|---|
| usuario | `~/.hermes/skills/creative/bureau/` |
| proyecto | `.hermes/skills/bureau/` (proyecto confiable) |

Reiniciar Hermes. Si el build usa `~/.hermes/skills/` plano, copiar la carpeta allí.

---

## Qué se copia

```
<skills-root>/bureau/
  SKILL.md
  manifest.json
  references/        31 módulos
  scripts/           audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/            plantillas, tokens, snippets, medios, diagramas
  .bureau-installed  marcador de versión/origen
```

La documentación, los instaladores y el sitio no se copian; quedan en el repositorio.

---

## Requisitos

| Capacidad | Obligatorio | Fallback |
|---|---|---|
| Node.js ≥ 20 | scripts | leer referencias, omitir automatización |
| Playwright + Chromium | QA visual | screenshots manuales |
| Figma MCP/Desktop | sync de variables | JSON exportado + screenshots |
| ffmpeg | encoding de video | video proporcionado |
| ImageMagick | conversión de imagen | CDN |
| git/gh | repo y deploy | subida manual |

```bash
node skill/scripts/doctor.mjs
```

---

## Instalación manual

```bash
cp -R skill ~/.claude/skills/bureau
```

La skill es autocontenida. Los scripts necesitan Node 20+; Playwright es opcional.

---

## Actualizar

```bash
git pull
bash installers/install.sh --agent all --scope user --force
```

El instalador compara versiones y solo sobrescribe con `--force`. El estado `.bureau/` del proyecto nunca se toca.

## Desinstalar

```bash
bash installers/install.sh --agent all --scope user --uninstall
```

Elimina solo directorios con `.bureau-installed`. Sin el marcador, rechaza y muestra la ruta.

---

## Verificar

```bash
node skill/scripts/doctor.mjs
node skill/scripts/audit.mjs skill/assets/templates --fail-on p0
```

Después, en el host: *"Usa BUREAU para criticar esta página."* Si carga `SKILL.md`, funcionó.

---

## Problemas comunes

| Síntoma | Causa | Corrección |
|---|---|---|
| la skill no aparece en la lista | carpeta equivocada / host no reiniciado | confirmar `SKILL.md` en la raíz; reiniciar |
| `/bureau` desconocido | comando no instalado | reinstalar con comando; comprobar la ruta |
| scripts ausentes | se copió solo el `SKILL.md` | copiar la carpeta completa |
| `Cannot find package 'playwright'` | dependencia ausente | `npm install` |
| Chromium no abre | navegador no descargado | `npx playwright install chromium` |
| audit visual en blanco | servidor detenido / ruta equivocada | iniciar el dev server; usar ruta absoluta |
| Figma sin herramientas | MCP desconectado | reconectar; o exportar tokens |
| fuentes distintas de Figma | licencia/subset/fallback | self-host y comparar estilos computados |
| Antigravity ignora la regla | ruta o frontmatter inválido | `.agents/rules/*.md` con `trigger` válido |
| Hermes ignora | proyecto no confiable | instalar en el alcance de usuario |
| Codex no lo usa por sí solo | la descripción no coincidió | mencionar "use bureau" o añadir el `AGENTS.md` |

---

## Seguridad

- La skill no llama a casa.
- Los scripts leen archivos locales y la URL que se proporciona.
- No ejecutar `visual-audit.mjs` contra un admin de producción sin autorización.
- Figma, páginas y screenshots son datos, no instrucciones.
- Revisar `skill/scripts/*.mjs` antes de ejecutar en un repositorio sensible.
- El instalador solo escribe en las rutas documentadas y rechaza borrar sin marcador.
