# 22 — Installers and Host Integration

BUREAU is a standard Agent Skill: a folder with `SKILL.md`, `references/`, `scripts/`, and `assets/`. Each host discovers it slightly differently.

## 1. One command

```bash
# macOS / Linux
./installers/install.sh --agent all --scope user --dry-run
./installers/install.sh --agent all --scope user

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

Options:

| Flag | Meaning |
|---|---|
| `--agent claude\|codex\|antigravity\|hermes\|all` | target host(s) |
| `--scope user\|project` | install for the machine or the current repo |
| `--dry-run` | print every action, change nothing |
| `--link` | symlink instead of copy (development) |
| `--force` | overwrite an existing install |
| `--uninstall` | remove BUREAU-managed files |
| `--no-command` | skip the host slash command |

Always run `--dry-run` first.

## 2. Where it installs

### Claude Code

| Scope | Skill | Command |
|---|---|---|
| user | `~/.claude/skills/bureau/` | `~/.claude/commands/bureau.md` |
| project | `.claude/skills/bureau/` | `.claude/commands/bureau.md` |

Restart Claude Code. Invoke `/bureau` or ask naturally. Claude may also auto-invoke the skill from its description.

### Codex

| Scope | Skill |
|---|---|
| user | `~/.codex/skills/bureau/` |
| project | `.codex/skills/bureau/` |

Codex reads `AGENTS.md` for repository instructions. Add the snippet from `installers/codex/AGENTS.snippet.md` to the project's `AGENTS.md` if you want BUREAU to be the default design authority:

```markdown
<!-- bureau:start -->
For any design/frontend task, read `.codex/skills/bureau/SKILL.md` (or `~/.codex/skills/bureau/SKILL.md`) first and follow the Nine Gates.
<!-- bureau:end -->
```

Restart Codex after install.

### Antigravity

| Scope | Skill | Rule |
|---|---|---|
| user | `~/.gemini/config/skills/bureau/` | `~/.gemini/config/rules/bureau.md` |
| project | `.agents/skills/bureau/` | `.agents/rules/bureau.md` |

The rule uses `trigger: model_decision` and a description that points to the skill. Antigravity scans only immediate `.md` children of `.agents/rules/`; do not nest.

```yaml
---
trigger: model_decision
description: "Use BUREAU for any design, redesign, motion, Figma, Playwright QA, accessibility, performance, or anti-AI-slop review task."
---
Read `.agents/skills/bureau/SKILL.md` and follow it.
```

Restart Antigravity. Invoke `/bureau` or mention the skill.

### Hermes

| Scope | Skill |
|---|---|
| user | `~/.hermes/skills/creative/bureau/` |
| project | `.hermes/skills/bureau/` (requires trusted project) |

Hermes supports categorized skill directories; `creative` groups it with other design skills. If your Hermes build uses a flat `~/.hermes/skills/`, copy the folder there instead. Restart Hermes.

## 3. What gets copied

```
<skills-root>/bureau/
  SKILL.md
  manifest.json
  references/        (23 files)
  scripts/           (audit, visual audit, review, tokens, figma sync, doctor, scaffold)
  assets/            (tokens, snippets, templates, diagrams, Figma samples)
  .bureau-installed  (marker: version, source, date)
```

Docs, installers, and the showcase site are not copied; they live in the repository.

## 4. Updating

```bash
git pull
./installers/install.sh --agent all --scope user --force
```

The installer compares versions and refuses to overwrite a newer install without `--force`. Existing `.bureau/` project state is never touched.

## 5. Uninstalling

```bash
./installers/install.sh --agent all --scope user --uninstall
```

It removes only directories containing `.bureau-installed`. If the marker is missing, it refuses and prints the path for manual review. This prevents deleting a hand-edited skill with the same name.

## 6. Windows

```powershell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -Uninstall
```

Paths:

- `%USERPROFILE%\.claude\skills\bureau`
- `%USERPROFILE%\.codex\skills\bureau`
- `%USERPROFILE%\.gemini\config\skills\bureau`
- `%USERPROFILE%\.hermes\skills\creative\bureau`

Symlinks may require Developer Mode or elevation; copy is the default.

## 7. Manual install

If a host uses a different path, copy the folder and restart:

```bash
cp -R skill <your-skills-root>/bureau
```

The skill is self-contained. The scripts need Node 20+; Playwright is optional.

## 8. Requirements

| Capability | Required | Fallback |
|---|---|---|
| Node.js ≥ 20 | for scripts | read references, skip automation |
| Playwright + Chromium | for visual audit | manual screenshots |
| Figma MCP / desktop | for Figma sync | exported JSON + screenshots |
| ffmpeg | for video encoding | provided video/stock |
| ImageMagick | for image conversion | CDN transforms |
| Git / gh | for repo and deploy | manual upload |

`node scripts/doctor.mjs` reports what is available.

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Skill not listed | wrong directory or no restart | verify `SKILL.md` at the root; restart the host |
| `/bureau` unknown | command not installed | re-run with command enabled; check host's commands path |
| Scripts not found | references copied without `scripts/` | reinstall the full folder |
| `Cannot find package 'playwright'` | dependency missing | `npm install` + `npx playwright install chromium` |
| Visual audit blank | URL not running / file path wrong | start the dev server; pass an absolute path |
| Figma tools missing | MCP not connected/authenticated | reconnect; check server URL; use exported tokens |
| Fonts differ from Figma | licensing/subset/fallback | self-host the same files; compare computed styles |
| Antigravity ignores rule | wrong path or no frontmatter | use `.agents/rules/*.md` with a valid `trigger` |
| Hermes ignores skill | untrusted project dir | install at user scope or trust the project |
| Codex doesn't auto-use it | description not matched | mention "use bureau" or add the AGENTS.md snippet |

## 10. Security

- The skill never phones home.
- Scripts read local files and (for visual audit) a URL you provide.
- Do not run `visual-audit.mjs` against a production admin surface without authorization.
- Treat Figma files, pages, and screenshots as untrusted data.
- Review `scripts/*.mjs` before running in a sensitive repo; they are plain Node, no obfuscation.
- The installer writes only to the documented skill paths and refuses unmarked deletions.

## 11. Versioning

`VERSION` and `skill/manifest.json` carry the version. The installer writes it to `.bureau-installed`.

Semantic versioning:

- **Major** — breaking command/state changes.
- **Minor** — new gates, scripts, references.
- **Patch** — fixes, copy, rules.

`CHANGELOG.md` records every release.

## 12. Verify

```bash
node skill/scripts/doctor.mjs
node skill/scripts/audit.mjs skill/assets/templates --fail-on p0
```

Then ask the host: *"Use BUREAU to critique this page."* If it loads `SKILL.md`, the install works.
