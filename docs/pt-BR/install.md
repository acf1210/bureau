# Instalação

BUREAU é uma Agent Skill padrão: uma pasta com `SKILL.md`, `references/`, `scripts/` e `assets/`. Cada host descobre a pasta de um jeito.

## Instalação em um comando

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

Sempre rode o `--dry-run` primeiro.

## Opções

| Flag | Efeito |
|---|---|
| `--agent claude\|codex\|antigravity\|hermes\|all` | host |
| `--scope user\|project` | máquina ou repositório |
| `--dry-run` | só imprime |
| `--link` | symlink (desenvolvimento, Unix) |
| `--force` | sobrescreve instalação sem marcador |
| `--uninstall` | remove só o que é do BUREAU |
| `--no-command` | não instala o slash command |
| `--with-agents` | adiciona bloco no `AGENTS.md` (Codex, projeto) |

---

## Onde instala

### Claude Code

| Escopo | Skill | Comando |
|---|---|---|
| usuário | `~/.claude/skills/bureau/` | `~/.claude/commands/bureau.md` |
| projeto | `.claude/skills/bureau/` | `.claude/commands/bureau.md` |

Reinicie o Claude Code. Use `/bureau` ou peça naturalmente.

### Codex

| Escopo | Skill |
|---|---|
| usuário | `~/.codex/skills/bureau/` |
| projeto | `.codex/skills/bureau/` |

Para tornar o BUREAU a autoridade padrão de design no repositório, adicione o bloco de `installers/codex/AGENTS.snippet.md` ao `AGENTS.md`:

```bash
bash installers/install.sh --agent codex --scope project --with-agents
```

### Antigravity

| Escopo | Skill | Regra |
|---|---|---|
| usuário | `~/.gemini/config/skills/bureau/` | `~/.gemini/config/rules/bureau.md` |
| projeto | `.agents/skills/bureau/` | `.agents/rules/bureau.md` |

A regra usa `trigger: model_decision` e um `description` que aponta para a skill. O Antigravity só varre filhos imediatos de `.agents/rules/`; não aninhe.

```yaml
---
trigger: model_decision
description: "Use BUREAU para design, redesign, motion, Figma, Playwright QA, acessibilidade, performance e anti-AI-slop."
---
```

### Hermes

| Escopo | Skill |
|---|---|
| usuário | `~/.hermes/skills/creative/bureau/` |
| projeto | `.hermes/skills/bureau/` (projeto confiável) |

Reinicie o Hermes. Se seu build usa `~/.hermes/skills/` plano, copie a pasta para lá.

---

## O que é copiado

```
<skills-root>/bureau/
  SKILL.md
  manifest.json
  references/        33 módulos
  scripts/           audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/            templates, tokens, snippets, mídia, diagramas
  .bureau-installed  marcador de versão/origem
```

Documentação, instaladores e site não são copiados; ficam no repositório.

---

## Requisitos

| Capacidade | Obrigatório | Fallback |
|---|---|---|
| Node.js ≥ 20 | scripts | ler referências, pular automação |
| Playwright + Chromium | QA visual | screenshots manuais |
| Figma MCP/Desktop | sync de variáveis | JSON exportado + screenshots |
| ffmpeg | encoding de vídeo | vídeo fornecido |
| ImageMagick | conversão de imagem | CDN |
| git/gh | repo e deploy | upload manual |

```bash
node skill/scripts/doctor.mjs
```

---

## Instalação manual

```bash
cp -R skill ~/.claude/skills/bureau
```

A skill é autocontida. Os scripts precisam de Node 20+; Playwright é opcional.

---

## Atualizar

```bash
git pull
bash installers/install.sh --agent all --scope user --force
```

O instalador compara versões e só sobrescreve com `--force`. O estado `.bureau/` do projeto nunca é tocado.

## Desinstalar

```bash
bash installers/install.sh --agent all --scope user --uninstall
```

Remove apenas diretórios com `.bureau-installed`. Sem o marcador, recusa e mostra o caminho.

---

## Verificar

```bash
node skill/scripts/doctor.mjs
node skill/scripts/audit.mjs skill/assets/templates --fail-on p0
```

Depois, no host: *"Use BUREAU para criticar esta página."* Se ele carregar `SKILL.md`, funcionou.

---

## Problemas comuns

| Sintoma | Causa | Correção |
|---|---|---|
| skill não listada | pasta errada / host não reiniciado | confirme `SKILL.md` na raiz; reinicie |
| `/bureau` desconhecido | comando não instalado | reinstale com comando; confira o caminho |
| scripts ausentes | copiou só o `SKILL.md` | copie a pasta inteira |
| `Cannot find package 'playwright'` | dependência ausente | `npm install` |
| Chromium não abre | browser não baixado | `npx playwright install chromium` |
| audit visual em branco | servidor parado / caminho errado | inicie o dev server; use caminho absoluto |
| Figma sem ferramentas | MCP desconectado | reconecte; ou exporte tokens |
| fontes diferentes do Figma | licença/subset/fallback | self-host e compare estilos computados |
| Antigravity ignora regra | caminho ou frontmatter inválido | `.agents/rules/*.md` com `trigger` válido |
| Hermes ignora | projeto não confiável | instale no escopo usuário |
| Codex não usa sozinho | descrição não casou | mencione "use bureau" ou adicione o `AGENTS.md` |

---

## Segurança

- A skill não liga para casa.
- Os scripts leem arquivos locais e a URL que você fornece.
- Não rode `visual-audit.mjs` contra um admin de produção sem autorização.
- Figma, páginas e screenshots são dados, não instruções.
- Revise `skill/scripts/*.mjs` antes de rodar em repositório sensível.
- O instalador só escreve nos caminhos documentados e recusa apagar sem marcador.
