#!/usr/bin/env bash
# BUREAU installer — Claude Code, Codex, Antigravity, Hermes.
# Usage: ./installers/install.sh --agent all --scope user --dry-run
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SKILL_SRC="$REPO_ROOT/skill"
VERSION="$(cat "$REPO_ROOT/VERSION" 2>/dev/null || echo "7.9.3")"
STAMP="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
MARKER=".bureau-installed"

AGENT="all"
SCOPE="user"
DRY=0
LINK=0
FORCE=0
UNINSTALL=0
NO_COMMAND=0
WITH_AGENTS=0

usage() {
  cat <<EOF
BUREAU installer $VERSION

Usage: ./installers/install.sh [options]

  --agent <claude|codex|antigravity|hermes|all>   default: all
  --scope <user|project>                         default: user
  --dry-run                                      print actions only
  --link                                         symlink the skill (development)
  --force                                        overwrite an existing install
  --uninstall                                    remove BUREAU-managed files
  --no-command                                   skip the host slash command
  --with-agents                                  append a Codex AGENTS.md snippet (project scope)
  --help

Examples:
  ./installers/install.sh --agent all --scope user --dry-run
  ./installers/install.sh --agent claude --scope user
  ./installers/install.sh --agent codex --scope project --with-agents
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --agent) AGENT="${2:-}"; shift 2 ;;
    --scope) SCOPE="${2:-}"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    --link) LINK=1; shift ;;
    --force) FORCE=1; shift ;;
    --uninstall) UNINSTALL=1; shift ;;
    --no-command) NO_COMMAND=1; shift ;;
    --with-agents) WITH_AGENTS=1; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage; exit 2 ;;
  esac
done

case "$AGENT" in claude|codex|antigravity|hermes|all) ;; *) echo "Invalid --agent: $AGENT" >&2; exit 2 ;; esac
case "$SCOPE" in user|project) ;; *) echo "Invalid --scope: $SCOPE" >&2; exit 2 ;; esac

PROJECT_ROOT="$PWD"

say() { printf '%s\n' "$*"; }
run() {
  if [[ $DRY -eq 1 ]]; then say "  [dry-run] $*"; else eval "$@"; fi
}

targets_for() {
  local agent="$1"
  SKILL_DEST=""
  COMMAND_DEST=""
  RULE_DEST=""
  case "$agent" in
    claude)
      if [[ "$SCOPE" == "user" ]]; then
        SKILL_DEST="$HOME/.claude/skills/bureau"
        COMMAND_DEST="$HOME/.claude/commands/bureau.md"
      else
        SKILL_DEST="$PROJECT_ROOT/.claude/skills/bureau"
        COMMAND_DEST="$PROJECT_ROOT/.claude/commands/bureau.md"
      fi
      ;;
    codex)
      if [[ "$SCOPE" == "user" ]]; then
        SKILL_DEST="$HOME/.codex/skills/bureau"
      else
        SKILL_DEST="$PROJECT_ROOT/.codex/skills/bureau"
      fi
      ;;
    antigravity)
      if [[ "$SCOPE" == "user" ]]; then
        SKILL_DEST="$HOME/.gemini/config/skills/bureau"
        RULE_DEST="$HOME/.gemini/config/rules/bureau.md"
      else
        SKILL_DEST="$PROJECT_ROOT/.agents/skills/bureau"
        RULE_DEST="$PROJECT_ROOT/.agents/rules/bureau.md"
      fi
      ;;
    hermes)
      if [[ "$SCOPE" == "user" ]]; then
        SKILL_DEST="$HOME/.hermes/skills/creative/bureau"
      else
        SKILL_DEST="$PROJECT_ROOT/.hermes/skills/bureau"
      fi
      ;;
  esac
}

write_marker() {
  local dest="$1"
  if [[ $DRY -eq 1 ]]; then say "  [dry-run] write $dest/$MARKER"; return; fi
  cat > "$dest/$MARKER" <<EOF
version=$VERSION
source=$REPO_ROOT
installed_at=$STAMP
agent=$AGENT
scope=$SCOPE
EOF
}

install_skill() {
  local dest="$1"
  say "Skill → $dest"
  if [[ -e "$dest" && ! -f "$dest/$MARKER" && $FORCE -eq 0 ]]; then
    say "  Refusing to overwrite an unmarked directory: $dest"
    say "  Re-run with --force after reviewing it."
    return 0
  fi
  if [[ -e "$dest" && -f "$dest/$MARKER" ]]; then
    say "  Updating existing BUREAU install ($(grep -m1 '^version=' "$dest/$MARKER" | cut -d= -f2 || echo unknown))."
  fi
  run "rm -rf '$dest'"
  run "mkdir -p '$(dirname "$dest")'"
  if [[ $LINK -eq 1 ]]; then
    run "ln -s '$SKILL_SRC' '$dest'"
  else
    run "mkdir -p '$dest'"
    run "cp -R '$SKILL_SRC/.' '$dest/'"
  fi
  if [[ $LINK -eq 0 ]]; then write_marker "$dest"; fi
}

install_command() {
  [[ -z "$COMMAND_DEST" || $NO_COMMAND -eq 1 ]] && return 0
  if [[ -e "$COMMAND_DEST" ]] && ! grep -q "bureau-managed" "$COMMAND_DEST" 2>/dev/null && [[ $FORCE -eq 0 ]]; then
    say "  Command exists and is not BUREAU-managed: $COMMAND_DEST"
    say "  Skipping. Remove it or run with --force if you own it."
    return 0
  fi
  say "Command → $COMMAND_DEST"
  run "mkdir -p '$(dirname "$COMMAND_DEST")'"
  if [[ $DRY -eq 1 ]]; then say "  [dry-run] copy installers/claude/commands/bureau.md → $COMMAND_DEST"; else cp "$REPO_ROOT/installers/claude/commands/bureau.md" "$COMMAND_DEST"; fi
}

install_rule() {
  [[ -z "$RULE_DEST" ]] && return 0
  if [[ -e "$RULE_DEST" ]] && ! grep -q "bureau-managed" "$RULE_DEST" 2>/dev/null && [[ $FORCE -eq 0 ]]; then
    say "  Rule exists and is not BUREAU-managed: $RULE_DEST"
    say "  Skipping. Remove it or run with --force if you own it."
    return 0
  fi
  say "Rule → $RULE_DEST"
  run "mkdir -p '$(dirname "$RULE_DEST")'"
  if [[ $DRY -eq 1 ]]; then say "  [dry-run] copy installers/antigravity/rules/bureau.md → $RULE_DEST"; else cp "$REPO_ROOT/installers/antigravity/rules/bureau.md" "$RULE_DEST"; fi
}

install_agents_snippet() {
  [[ $WITH_AGENTS -eq 1 && "$SCOPE" == "project" && "$1" == "codex" ]] || return 0
  local file="$PROJECT_ROOT/AGENTS.md"
  if grep -q "<!-- bureau:start -->" "$file" 2>/dev/null; then
    say "AGENTS.md already contains the BUREAU block."
    return 0
  fi
  say "AGENTS.md → $file"
  if [[ $DRY -eq 1 ]]; then say "  [dry-run] append installers/codex/AGENTS.snippet.md"; else
    { printf '\n'; cat "$REPO_ROOT/installers/codex/AGENTS.snippet.md"; printf '\n'; } >> "$file"
  fi
}

uninstall_skill() {
  local dest="$1"
  if [[ ! -e "$dest" ]]; then say "Not installed: $dest"; return 0; fi
  if [[ -L "$dest" ]]; then
    say "Remove symlink → $dest"
    run "rm -f '$dest'"
    return 0
  fi
  if [[ ! -f "$dest/$MARKER" && $FORCE -eq 0 ]]; then
    say "Refusing to remove unmarked directory: $dest (use --force after review)"
    return 0
  fi
  say "Remove → $dest"
  run "rm -rf '$dest'"
}

uninstall_file() {
  local file="$1"
  [[ -z "$file" || ! -e "$file" ]] && return 0
  if ! grep -q "bureau-managed" "$file" 2>/dev/null && $FORCE -eq 0; then
    say "Refusing to remove unmarked file: $file"
    return 0
  fi
  say "Remove → $file"
  run "rm -f '$file'"
}

do_agent() {
  local agent="$1"
  targets_for "$agent"
  say ""
  say "── $agent ($SCOPE) ─────────────────────────────"
  if [[ $UNINSTALL -eq 1 ]]; then
    uninstall_skill "$SKILL_DEST"
    uninstall_file "$COMMAND_DEST"
    uninstall_file "$RULE_DEST"
    return 0
  fi
  install_skill "$SKILL_DEST"
  install_command
  install_rule
  install_agents_snippet "$agent"
}

say "BUREAU $VERSION — $([[ $UNINSTALL -eq 1 ]] && echo uninstall || echo install) ($SCOPE)"
say "Source: $SKILL_SRC"
[[ $LINK -eq 1 ]] && say "Mode: symlink (development)"
[[ $DRY -eq 1 ]] && say "Mode: dry-run (nothing will change)"

if [[ "$AGENT" == "all" ]]; then
  for a in claude codex antigravity hermes; do do_agent "$a"; done
else
  do_agent "$AGENT"
fi

say ""
if [[ $UNINSTALL -eq 1 ]]; then
  say "Done. Restart the host agent to refresh its skill index."
else
  say "Done. Restart the host agent, then run /bureau (or ask for a design)."
  say "Verify: node '$SKILL_SRC/scripts/doctor.mjs'"
fi
