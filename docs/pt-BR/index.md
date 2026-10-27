# BUREAU — o bureau de design digital autônomo

**BUREAU** é uma skill de agente que transforma um modelo de linguagem em um bureau de design completo: direção de criação, direção de arte, tipografia, cor, motion, WebGL, vídeo, Figma, QA com Playwright, acessibilidade, performance, copy e revisão adversarial.

Não é um gerador de templates. É um **sistema de decisão estética com evidência**.

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau
bash installers/install.sh --agent all --scope user --dry-run
bash installers/install.sh --agent all --scope user
```

Depois, reinicie o agente e peça: *"Use BUREAU para criar o site da minha marca."*

---

## O problema

Modelos são treinados na média da internet. Sem direção, produzem o mesmo hero centralizado, o mesmo gradiente roxo, os mesmos três cards com ícones, a mesma copy de "empower your business". Isso não é falta de CSS. É falta de **conceito, especificidade e revisão**.

BUREAU ataca as três:

1. **Conceito antes de pixels** — três direções, uma escolha argumentada.
2. **Ofício verificável** — tipografia, cor, composição, motion e performance com réguas explícitas.
3. **Revisão adversarial** — dez portões independentes e um Tribunal que pode vetar.

---

## O que a skill faz

| Capacidade | O que entrega |
|---|---|
| **Direção de criação** | três direções distintas, matriz de decisão, *signature move* |
| **Direção de arte** | mundo visual, paleta, tipografia, material, luz, imagem |
| **Design system** | tokens OKLCH, escala tipográfica, espaçamento, motion, componentes |
| **Motion** | gramática de movimento, scroll narrativo, microestados, reduced motion |
| **WebGL / 3D** | shaders, Three.js/R3F, partículas, fallback estático |
| **Vídeo e parallax** | loops comprimidos, poster, legendas, camadas de profundidade |
| **Figma** | MCP, variáveis, comps, handoff, comparação lado a lado |
| **Playwright** | screenshots multi-viewport, contraste, overflow, console, performance |
| **Acessibilidade** | WCAG 2.2 AA, teclado, foco, movimento, mídia, zoom |
| **Anti-AI-slop** | detector determinístico, taxonomia de 106 sinais, correções |
| **Copy e verdade** | voz, headlines, microcopy, claims com fonte, SEO, i18n |
| **Ship** | OG, analytics, consentimento, monitoramento, rollback |

---

## O circuito

```
G0 Intake → G1 Concept → G2 Direction → G3 Type & Color → G4 Composition
→ G5 Motion → G6 Engineering → G7 Access → G8 Truth → G9 Launch → TRIBUNAL
```

Cada portão tem um persona, um peso, falhas duras e evidência obrigatória. O total é 100. Qualquer P0, qualquer portão abaixo de 3,5/5 ou qualquer evidência ausente **reprova**.

| Veredito | Nota |
|---|---|
| Award Track | ≥ 90 |
| Pass | 82–89 |
| Conditional | 72–81 |
| Fail | < 72 |

O Tribunal não reescreve notas. Ele pergunta se o trabalho cumpre a promessa, se algum portão está passando por charme e se o bureau assinaria aquilo em público.

Leia o circuito completo em [review-circuit.md](review-circuit.md).

---

## Por que é diferente

- **Não pergunta tudo.** Decide com padrões defensáveis e no máximo três perguntas bloqueantes.
- **Não aceita "bonito".** Cada afirmação aponta para screenshot, métrica, gravação ou arquivo.
- **Não premia média.** Um 95 com um P0 de acessibilidade é Fail.
- **Não fabrica credibilidade.** Métrica, logo, depoimento e prêmio sem fonte são P0.
- **Não entrega template.** Toda entrega tem um *signature move* e uma *technological proof*.
- **Não abandona o ofício.** O detector cobre o mecânico; o olho humano cobre o resto.

---

## Começo rápido

```bash
# 1. Verifique o ambiente
node skill/scripts/doctor.mjs

# 2. Crie um projeto a partir de um dos treze templates
node skill/scripts/new-project.mjs meu-site --template kinetic-editorial

# 3. Preencha BUREAU.md e rode o circuito
node skill/scripts/audit.mjs . --out .bureau/evidence/audit.json
node skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa
node skill/scripts/review.mjs --status
```

- [Instalação](install.md)
- [Primeiros 15 minutos](quickstart.md)
- [Arquitetura](architecture.md)
- [Fluxo de trabalho](workflow.md)
- [Comandos](commands.md)
- [Anti-slop](antislop.md)
- [Linguagem visual](design-language.md)

---

## Estrutura do repositório

```
skill/                 a skill instalável
  SKILL.md             roteador e doutrina
  references/          30 módulos de profundidade
  scripts/             audit, visual-audit, review, tokens, figma-sync, doctor, scaffold
  assets/              templates, tokens, snippets, mídia, diagramas
installers/            Claude, Codex, Antigravity, Hermes + bash/PowerShell
docs/                  PT-BR, EN, ES
site/                  landing + docs estáticos
```

---

## Licença e créditos

MIT. BUREAU é um trabalho original; referencia publicamente projetos como [Impeccable](https://github.com/pbakaus/impeccable), [Colorfigures](https://april-zhu.com/colorfigures), [Font Awesome](https://github.com/FortAwesome/Font-Awesome) e as galerias listadas em `skill/references/20-reference-library.md`. Pantone® é marca da Pantone LLC; BUREAU não é afiliado. Valores hexadecimais são aproximações para tela.
