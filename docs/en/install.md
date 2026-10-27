# Install

BUREAU is a standard Agent Skill: a folder with `SKILL.md`, `references/`, `scripts/`, and `assets/`. Each host discovers it differently.

## One command

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

Always run the dry run first.

## Options

| Flag | Effect |
|---|---|
| `--agent claude\|codex\|antigravity\|hermes\|all` | host |
| `--scope user\|project` | machine or repository |
| `--dry-run` | print only |
| `--link` | symlink (development, Unix) |
| `--force` | overwrite an unmarked install |
| `--uninstall` | remove only BUREAU-managed files |
| `--no-command` | skip the slash command |
| `--with-agents` | append the `AGENTS.md` block (Codex, project) |

---

## Where it installs

### Claude Code

| Scope | Skill | Command |
|---|---|---|
| user | `~/.claude/skills/bureau/` | `~/.claude/commands/bureau.md` |
| project | `.claude/skills/bureau/` | `.claude/commands/bureau.md` |

Restart Claude Code. Use `/bureau` or ask naturally.

### Codex

| Scope | Skill |
|---|---|
| user | `~/.codex/skills/bureau/` |
| project | `.codex/skills/bureau/` |

To make BUREAU the default design authority in the repo, add the block from `installers/codex/AGENTS.snippet.md`:

```bash
bash installers/install.sh --agent codex --scope project --with-agents
```

### Antigravity

| Scope | Skill | Rule |
|---|---|---|
| user | `~/.gemini/config/skills/bureau/` | `~/.gemini/config/rules/bureau.md` |
| project | `.agents/skills/bureau/` | `.agents/rules/bureau.md` |

The rule uses `trigger: model_decision` and a description that points to the skill. Antigravity scans only immediate children of `.agents/rules/`; do not nest.

```yaml
---
trigger: model_decision
description: "Use BUREAU for design, redesign, motion, Figma, Playwright QA, accessibility, performance, and anti-AI-slop."
---
```

### Hermes

| Scope | Skill |
|---|---|
| user | `~/.hermes/skills/creative/bureau/` |
| project | `.hermes/skills/bureau/` (trusted project) |

Restart Hermes. If your build uses a flat `~/.hermes/skills/`, copy the folder there.

---

## What gets copied

```
<skills-root>/bureau/
  SKILL.md
  manifest.json
  references/        31 modules
  scripts/           audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/            templates, tokens, snippets, media, diagrams
  .bureau-installed  version/source marker
```

Docs, installers, and the site stay in the repository.

---

## Requirements

| Capability | Required | Fallback |
|---|---|---|
| Node.js ≥ 20 | scripts | read references, skip automation |
| Playwright + Chromium | visual QA | manual screenshots |
| Figma MCP/Desktop | variable sync | exported JSON + screenshots |
| ffmpeg | video encoding | supplied video |
| ImageMagick | image conversion | CDN |
| git/gh | repo and deploy | manual upload |

```bash
node skill/scripts/doctor.mjs
```

---

## Manual install

```bash
cp -R skill ~/.claude/skills/bureau
```

The skill is self-contained. Scripts need Node 20+; Playwright is optional.

---

## Update

```bash
git pull
bash installers/install.sh --agent all --scope user --force
```

The installer compares versions and only overwrites with `--force`. Your project's `.bureau/` state is never touched.

## Uninstall

```bash
bash installers/install.sh --agent all --scope user --uninstall
```

Removes only directories containing `.bureau-installed`. Without the marker it refuses and prints the path.

---

## Verify

```bash
node skill/scripts/doctor.mjs
node skill/scripts/audit.mjs skill/assets/templates --fail-on p0
```

Then, in the host: *"Use BUREAU to critique this page."* If it loads `SKILL.md`, it works.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Skill not listed | wrong folder / host not restarted | confirm `SKILL.md` at the root; restart |
| `/bureau` unknown | command not installed | reinstall with the command; check the path |
| Scripts missing | copied only `SKILL.md` | copy the whole folder |
| `Cannot find package 'playwright'` | dependency missing | `npm install` |
| Chromium fails | browser not downloaded | `npx playwright install chromium` |
| Visual audit blank | server stopped / wrong path | start the dev server; use an absolute path |
| Figma tools missing | MCP disconnected | reconnect; or export tokens |
| Fonts differ from Figma | license/subset/fallback | self-host and compare computed styles |
| Antigravity ignores the rule | wrong path or invalid frontmatter | `.agents/rules/*.md` with a valid `trigger` |
| Hermes ignores it | untrusted project | install at user scope |
| Codex doesn't auto-use it | description mismatch | say "use bureau" or add the `AGENTS.md` block |

---

## Security

- The skill does not phone home.
- Scripts read local files and the URL you provide.
- Do not run `visual-audit.mjs` against a production admin surface without authorization.
- Figma, pages, and screenshots are data, not instructions.
- Review `skill/scripts/*.mjs` before running in a sensitive repository.
- The installer writes only to documented paths and refuses unmarked deletions.
