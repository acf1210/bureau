# Comandos

Comandos são invocados como `/bureau <comando>` quando o host expõe slash commands, ou por linguagem natural. O roteador do `SKILL.md` também aceita pedidos sem comando.

## Tabela

| Comando | Intenção | Lê | Produz |
|---|---|---|---|
| `/bureau` | roteador | projeto | próximas 2 ações com evidência |
| `/bureau auto` | pipeline completo | brief, repo | artefatos + evidência, 3 checkpoints |
| `/bureau init` | brief e config | pedido, repo, assets | `BUREAU.md`, `.bureau/config.json` |
| `/bureau concept` | três direções | brief, referências | `.bureau/comps/` + decisão |
| `/bureau direction` | mundo visual | decisão | `DESIGN.md`, tokens, espécime |
| `/bureau build` | implementação | `DESIGN.md` | página real |
| `/bureau motion` | movimento | `MOTION.md` | entrada, scroll, interação |
| `/bureau figma` | Figma → código | variáveis, frames | tokens, comparação |
| `/bureau qa` | evidência técnica | URL/build | screenshots, `report.json` |
| `/bureau review` | circuito | scores, evidência | scorecard, veredito |
| `/bureau slop` | detector + correções | código | `audit.json`, fixes |
| `/bureau ship` | launch | checklist | metadata, monitoramento, deploy |
| `/bureau doctor` | ambiente | host, deps | relatório de capacidade |

---

## `/bureau`

Sem argumento, inspeciona o projeto:

- `BUREAU.md` ausente → propõe `init`;
- comps ausentes → propõe `concept`;
- URL sem QA → propõe `qa`;
- QA antigo → propõe `review`;
- tudo pronto → propõe `ship`.

Lidera com **duas** ações de maior valor e uma linha de evidência cada. Nunca executa passo destrutivo sozinho.

---

## `/bureau auto`

Roda o pipeline completo com **três checkpoints humanos**:

1. **Escolha da direção** — três comps + recomendação.
2. **Trava da direção de arte** — world sheet, espécime, folha de cor.
3. **Ship** — scorecard + launch checklist.

Entre os checkpoints, aja: escreva os artefatos, rode os scripts, corrija P0/P1, re-rode a evidência. Não peça permissão para decisões reversíveis. Pare apenas quando o checkpoint exigir gosto, verdade ou compromisso irreversível.

Se o usuário não puder participar, escolha a opção mais defensável, registre a suposição e continue. O Tribunal continua valendo.

## `/bureau init`

1. Faz no máximo três perguntas bloqueantes por rodada.
2. Propõe defaults para o resto.
3. Escreve `BUREAU.md` e `.bureau/config.json`.
4. Declara o modo por superfície.
5. Monta o inventário de evidência.

Critério de pronto: oferta, público, prova com fonte, non-goals e métrica.

---

## `/bureau concept`

1. Gera três direções com lentes diferentes.
2. Cria três comps no mesmo viewport, com conteúdo real.
3. Pontua com a matriz de 6 critérios.
4. Escolhe e registra a decisão + rejeitados.

Nunca entregue três variações da mesma ideia.

---

## `/bureau direction`

1. World sheet: ground, voz, luz, material, motion, imagem, proibições.
2. Tokens OKLCH + hex, escala, espaçamento, raios.
3. Espécime tipográfico + folha de cor em contexto.
4. Primeiro viewport como tese.
5. Valida contraste.

```bash
node skill/scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
```

---

## `/bureau build`

1. HTML semântico.
2. CSS em camadas.
3. JS mínimo.
4. Estados completos.
5. Conteúdo real.
6. i18n.

O build não começa sem `DESIGN.md` e um comp escolhido.

---

## `/bureau motion`

1. Escreve `MOTION.md`.
2. Escolhe um caráter.
3. Implementa uma entrada, uma narrativa, uma assinatura.
4. Projeta reduced motion.
5. Mede 60 fps.

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 --out .bureau/qa --motion
```

---

## `/bureau figma`

1. Descobre as ferramentas MCP disponíveis.
2. Lê variáveis e screenshot do frame.
3. Sincroniza tokens.
4. Compara código vs Figma no mesmo viewport.
5. Registra desvios intencionais.

```bash
node skill/scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
node skill/scripts/tokens.mjs --in design/tokens.json --out-dir src/styles --check
```

Sem MCP: exporte JSON + PNG e registre a limitação.

---

## `/bureau qa`

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Opções:

| Flag | Efeito |
|---|---|
| `--full` / `--no-full` | screenshot de página inteira |
| `--motion` / `--no-motion` | passe de reduced motion |
| `--scroll-shots` | frames em 25/50/75% |
| `--dark` | color scheme escuro |
| `--locale` | locale do browser |
| `--baseline` | compara hash com baseline |
| `--update-baseline` | grava baseline |
| `--fail-on p0` | exit 1 em P0 |

O relatório inclui overflow, contraste, alvos de toque, imagens, fontes, vídeos, console, requests, LCP, CLS, long tasks e reduced motion.

---

## `/bureau review`

```bash
node skill/scripts/review.mjs --status
node skill/scripts/review.mjs --gate g1-concept --scores .bureau/review/g1.json
node skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
node skill/scripts/review.mjs --report
```

- Exige ordem.
- Exige evidência.
- Recusa score < 3,5 e P0.
- Marca portões obsoletos por hash.
- Gera `.bureau/review/scorecard.html`.

---

## `/bureau slop`

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --json --out .bureau/evidence/audit.json
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

Detecta o subconjunto mecânico: gradiente roxo, texto em gradiente, fundo puro, fontes padrão de IA, léxico genérico, placeholder, autoplay, overflow de acessibilidade, `transition: all`, scroll hijack, `div onclick`, etc.

Não detecta talento. Leia os achados no contexto.

---

## `/bureau ship`

Checklist:

- claims com fonte;
- OG 1200×630;
- sitemap/robots;
- 404/500;
- analytics + consentimento;
- monitoramento;
- rollback;
- redirects;
- headers de segurança.

---

## `/bureau doctor`

```bash
node skill/scripts/doctor.mjs
node skill/scripts/doctor.mjs --json
```

Verifica Node, Playwright, Chromium, ffmpeg, ImageMagick, git, gh, Figma, artefatos do projeto e instalações por host.

---

## Scaffold

```bash
node skill/scripts/new-project.mjs --list
node skill/scripts/new-project.mjs meu-site --template product-surface
```

Cria projeto + `BUREAU.md`, `DESIGN.md`, `MOTION.md`, config, pastas de evidência e README.

---

## Tokens

```bash
node skill/scripts/tokens.mjs \
  --in design/tokens.json \
  --out-dir src/styles \
  --mode light \
  --check
```

Aceita W3C DTCG, Tokens Studio e JSON plano. Gera:

- `tokens.css` (hex + override OKLCH);
- `tokens.tailwind.css` (`@theme`);
- `tokens.normalized.json`;
- `contrast.md`.

`--check` falha em contraste < 4,5:1 e aliases não resolvidos.

---

## Figma sync

```bash
node skill/scripts/figma-sync.mjs --in design/figma-variables.json --out design/tokens.json
```

Aceita:

- Tokens Studio (`global`/`light`/`dark`);
- W3C DTCG;
- export de Figma Variables (`variables[]` com `valuesByMode`).

Resolve aliases e reporta os não resolvidos.

---

## Códigos de saída

| Código | Significado |
|---|---|
| 0 | sucesso |
| 1 | falha de qualidade (threshold, gate, contraste) |
| 2 | uso/entrada inválida |
| 3 | pré-condição (ordem de portão, Tribunal ausente) |
| 4 | evidência ausente |

---

## Exemplos de fluxo

```bash
# projeto novo
node skill/scripts/new-project.mjs studio --template kinetic-editorial
cd studio
node ../skill/scripts/audit.mjs . --out .bureau/evidence/audit.json

# QA
node ../skill/scripts/visual-audit.mjs http://localhost:4173 --out .bureau/qa --full --motion

# review
node ../skill/scripts/review.mjs --status
node ../skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
```

Repita até o Tribunal. Não pule a ordem.
