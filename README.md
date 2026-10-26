# BUREAU

**O bureau de design digital autônomo.** Uma skill de agente que transforma um modelo de linguagem em direção de criação, direção de arte, motion design, creative technology, acessibilidade, performance e revisão adversarial.

[![Versão](https://img.shields.io/badge/version-1.0.0-D6FF3E?style=flat-square&labelColor=0B0B0C)](VERSION)
[![Licença](https://img.shields.io/badge/license-MIT-FF4A1C?style=flat-square&labelColor=0B0B0C)](LICENSE)
[![Hosts](https://img.shields.io/badge/hosts-Claude%20%7C%20Codex%20%7C%20Antigravity%20%7C%20Hermes-F1EDE6?style=flat-square&labelColor=0B0B0C)](#instalação)

[Português](README.md) · [English](README.en.md) · [Español](README.es.md) · [Docs](https://acf1210.github.io/bureau/pt-BR/index.html)

![BUREAU](site/assets/img/og.png)

---

## O problema

Modelos são treinados na média da internet. Sem direção, entregam o mesmo hero centralizado, o mesmo gradiente roxo, os mesmos três cards com ícones e a mesma copy vazia. Isso não é um problema de CSS. É falta de **conceito, especificidade e revisão**.

BUREAU ataca os três.

- **Conceito antes de pixels.** Três direções distintas, uma escolha argumentada, um *signature move*.
- **Ofício verificável.** Tipografia, cor, composição, motion, acessibilidade e performance com réguas explícitas.
- **Revisão adversarial.** Dez portões independentes e um Tribunal com poder de veto.
- **Zero fabricação.** Métrica, logo, depoimento ou prêmio sem fonte é P0.

---

## O circuito

```
G0 Intake → G1 Concept → G2 Direction → G3 Type & Color → G4 Composition
→ G5 Motion → G6 Engineering → G7 Access → G8 Truth → G9 Launch → TRIBUNAL
```

| Veredito | Nota |
|---|---:|
| Award Track | ≥ 90 |
| Pass | 82–89 |
| Conditional | 72–81 |
| Fail | < 72 |

Qualquer P0, qualquer portão abaixo de 3,5/5, evidência ausente ou fonte alterada depois da revisão **reprova**. Um 95 com um P0 de acessibilidade é Fail.

[Leia o circuito completo →](docs/pt-BR/review-circuit.md)

---

## O que está incluído

| Camada | Conteúdo |
|---|---|
| **Skill** | `SKILL.md` com doutrina, contrato de autonomia, roteador, regras duras e protocolo de ferramentas |
| **Profundidade** | 23 referências: conceito, direção, tipografia, Pantone/OKLCH, layout, motion, WebGL, vídeo, imagem, interação, acessibilidade, performance, Figma, Playwright, circuito, anti-slop, copy, stack, referências, ship, instaladores |
| **Scripts** | detector anti-slop, auditoria visual Playwright, circuito de revisão com estado, gerador de tokens, sync Figma, doctor, scaffold |
| **Templates** | 3 projetos autônomos: editorial cinético, superfície de produto com demo ao vivo, experiência WebGL |
| **Assets** | tokens DTCG, snippets de motion, mídia gerada, diagramas SVG detalhados |
| **Docs** | 9 páginas × 3 idiomas (PT-BR, EN, ES) |
| **Installers** | Claude Code, Codex, Antigravity, Hermes; bash e PowerShell |

---

## Instalação

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau

# sempre visualize primeiro
bash installers/install.sh --agent all --scope user --dry-run

# instale
bash installers/install.sh --agent all --scope user
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

Reinicie o agente e invoque `/bureau` ou peça naturalmente: *"Use BUREAU para criar o site da minha marca."*

### Caminhos

| Host | Skill | Extra |
|---|---|---|
| Claude Code | `~/.claude/skills/bureau` | `~/.claude/commands/bureau.md` |
| Codex | `~/.codex/skills/bureau` | bloco opcional em `AGENTS.md` |
| Antigravity | `~/.gemini/config/skills/bureau` | regra `model_decision` |
| Hermes | `~/.hermes/skills/creative/bureau` | — |

[Guia de instalação completo →](docs/pt-BR/install.md)

---

## Primeiro uso

```bash
node skill/scripts/doctor.mjs
node skill/scripts/new-project.mjs meu-site --template kinetic-editorial
cd meu-site

node ../skill/scripts/audit.mjs . --out .bureau/evidence/audit.json
node ../skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --full --motion
node ../skill/scripts/review.mjs --status
```

O template cria `BUREAU.md`, `DESIGN.md`, `MOTION.md`, `.bureau/config.json` e as pastas de evidência. Preencha a verdade antes de desenhar.

[Primeiros 15 minutos →](docs/pt-BR/quickstart.md)

---

## Demos

| Demo | O que demonstra |
|---|---|
| [Kinetic Editorial](https://acf1210.github.io/bureau/demos/kinetic-editorial/index.html) | tipografia editorial, índice como argumento, scroll narrativo, vídeo, rail de tempo |
| [Product Surface](https://acf1210.github.io/bureau/demos/product-surface/index.html) | produto técnico, modelo de cenário ao vivo, SVG, formulário e motion preciso |
| [Immersive Experience](https://acf1210.github.io/bureau/demos/immersive-experience/index.html) | WebGL bruto, resposta a ponteiro, paleta por fase, fallback estático |

Cada demo é autocontido: HTML, CSS, JS, mídia e tokens locais.

---

## Comandos

| Comando | Função |
|---|---|
| `/bureau` | roteador contextual |
| `/bureau auto` | pipeline completo com três checkpoints |
| `/bureau init` | brief, config, inventário de evidência |
| `/bureau concept` | três direções + decisão |
| `/bureau direction` | mundo visual, tokens, tipografia |
| `/bureau build` | implementação |
| `/bureau motion` | gramática de movimento e assinatura |
| `/bureau figma` | Figma → código |
| `/bureau qa` | screenshots, contraste, console, performance |
| `/bureau review` | dez portões + Tribunal |
| `/bureau slop` | detector + correções |
| `/bureau ship` | metadata, analytics, monitoramento, rollback |
| `/bureau doctor` | ambiente e instalação |

[Referência de comandos →](docs/pt-BR/commands.md)

---

## Anti-AI-slop

O detector cobre o subconjunto mecânico: gradiente roxo, texto em gradiente, fundo puro, fontes padrão, léxico genérico, lorem ipsum, placeholder, autoplay, overflow de acessibilidade, `transition: all`, scroll hijack, `div onclick` e mais.

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

O detector não julga talento, composição ou verdade. Para isso existe o circuito.

[Taxonomia anti-slop →](docs/pt-BR/antislop.md)

---

## Estrutura

```
skill/                  a skill instalável
  SKILL.md              roteador + doutrina + contrato
  references/           23 módulos
  scripts/              audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/               templates, tokens, snippets, mídia, diagramas
installers/             Claude, Codex, Antigravity, Hermes + bash/PowerShell
docs/                   PT-BR, EN, ES
  assets/diagrams/      arquitetura, circuito, workflow, anti-slop
site/                   landing e docs estáticos
scripts/                build-docs, capture-demos, og, serve
tests/                  node --test
```

---

## Referências e créditos

BUREAU é um trabalho original. Ele referencia publicamente:

- [Impeccable](https://github.com/pbakaus/impeccable) — detecção determinística e disciplina de artefatos;
- [Colorfigures](https://april-zhu.com/colorfigures) — objetos isométricos com corte e interação;
- [Font Awesome](https://github.com/FortAwesome/Font-Awesome) — fallback de ícones;
- [land-book](https://land-book.com), [minimal.gallery](https://minimal.gallery), [godly.website](https://godly.website), [mobbin](https://mobbin.com), [refero.design](https://refero.design), [60fps.design](https://60fps.design), [recent.design](https://recent.design), [vibrant.design](https://vibrant.design), [backgrounds.supply](https://backgrounds.supply), [footer.design](https://footer.design), [promptmotionsite](https://promptmotionsite.com), [daoho.dev](https://daoho.dev) e as demais galerias da biblioteca de referência.

PANTONE® é marca da Pantone LLC. BUREAU não é afiliado; valores hexadecimais são aproximações para tela. Fontes: Archivo, Bodoni Moda e JetBrains Mono, sob OFL. O loop de vídeo foi gerado para este repositório.

MIT. Veja [LICENSE](LICENSE) e [NOTICE](NOTICE.md).
