# Installers

BUREAU is a standard Agent Skill. These installers copy the same `skill/` folder into each host's discovery path and add the host-specific command/rule.

| Host | User install | Project install |
|---|---|---|
| **Claude Code** | `~/.claude/skills/bureau` + `~/.claude/commands/bureau.md` | `.claude/skills/bureau` + `.claude/commands/bureau.md` |
| **Codex** | `~/.codex/skills/bureau` | `.codex/skills/bureau` (+ optional `AGENTS.md` block) |
| **Antigravity** | `~/.gemini/config/skills/bureau` + rule | `.agents/skills/bureau` + `.agents/rules/bureau.md` |
| **Hermes** | `~/.hermes/skills/creative/bureau` | `.hermes/skills/bureau` (trusted project) |

## Quick start

```bash
# Always preview first
./installers/install.sh --agent all --scope user --dry-run

# Install everywhere (user scope)
./installers/install.sh --agent all --scope user

# One host
./installers/install.sh --agent claude --scope user
./installers/install.sh --agent codex --scope project --with-agents
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

## Options

| Flag | Meaning |
|---|---|
| `--agent claude\|codex\|antigravity\|hermes\|all` | target host(s) |
| `--scope user\|project` | machine-wide or current repo |
| `--dry-run` | print actions, change nothing |
| `--link` | symlink the skill (development; Unix) |
| `--force` | overwrite an unmarked install or command |
| `--uninstall` | remove only BUREAU-managed files |
| `--no-command` | skip the host slash command |
| `--with-agents` | append the Codex `AGENTS.md` block (project scope) |

## Safety

- Every install writes `.bureau-installed` inside the skill folder.
- Uninstall refuses to delete a folder without that marker, unless `--force`.
- The installer never touches your project's `.bureau/` review state.
- The skill does not phone home. Scripts read local files and a URL you pass.
- Review `installers/install.sh` and `skill/scripts/*.mjs` before running in a sensitive repository.

## Verify

```bash
node skill/scripts/doctor.mjs
```

Then restart the host agent and run `/bureau` or ask: *"Use BUREAU to review this page."*

## Uninstall

```bash
./installers/install.sh --agent all --scope user --uninstall
```

## Troubleshooting

| Symptom | Fix |
|---|---|
| Skill not listed | Confirm `SKILL.md` is at the root of the installed folder; restart the host |
| `/bureau` unknown | Reinstall with the command enabled; check the host's commands path |
| Codex ignores it | Add the `AGENTS.md` block or mention "use bureau" explicitly |
| Antigravity ignores the rule | Use `.agents/rules/*.md` with valid `trigger` frontmatter |
| Hermes ignores the project | Install at user scope or trust the project |
| Scripts fail | Node 20+; `npm install`; `npx playwright install chromium` |

Full detail: [`skill/references/22-installers.md`](../skill/references/22-installers.md).
