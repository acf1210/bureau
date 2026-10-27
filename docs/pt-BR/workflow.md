# Fluxo de trabalho

O BUREAU trabalha em **passes**, não em um único disparo. Cada passe deixa um artefato e uma decisão.

![Fluxo de trabalho](../assets/diagrams/workflow.svg)

## Visão geral

Para trabalho colaborativo, use os papéis, o contrato de transferência, as verificações de ilustração técnica e os limites de fontes em `skill/references/25-collaborative-studio.md`. Um agente pode executar os papéis em sequência; não declare revisão independente se ela não ocorreu. Ferramentas e skills externas são opcionais e exigem verificação de licença e procedência.

Para comparar versões por qualidade de design ou taxa de aprovação, use o protocolo pareado com briefs reais em `skill/references/26-outcome-evaluation.md`. A rubrica de qualidade usa categorias inspiradas no Awwwards, mas não é uma nota oficial do prêmio. Registre resultados da versão anterior e da nova, vereditos independentes e incerteza; pontuações de auditoria automatizada não demonstram, por si só, uma melhora.

Para uma aferição independente de rubricas de premiação e do circuito de revisão, use `skill/references/28-independent-design-assessment.md` e `skill/assets/studio-templates/independent-assessment.md`. Avaliadores independentes pontuam cinco dimensões com evidências; sem evidência, o total permanece não avaliado.

Para briefs aprofundados, pesquisa de referências e avaliação opcional de candidatos, use `skill/references/27-design-intelligence.md` e `skill/assets/studio-templates/qualification.md`. O motor de design parte de um levantamento de cinco fontes (`skill/references/30-reference-survey.md`): `survey.mjs` ordena as 25 entradas pela necessidade do brief, a fonte que não puder ser verificada é pulada com o motivo e a próxima é usada até cinco verificadas, com o padrão comum e a ruptura criativa registrados. As 25 entradas incluem nomes ainda não identificados; a rubrica exige evidência para cada nota. Para capturar cada página de referência (screenshot, Markdown, campos), `skill/references/33-reference-acquisition.md` escolhe entre Playwright, Crawl4AI, Firecrawl, ScrapeGraphAI, Crawlee e Scrapy, e exclui ferramentas que contornam bloqueios, como o Scrapling. Indexação contínua e previsão de tendências não estão implementadas.

`node skill/scripts/source-monitor.mjs --out source-report.json` registra a disponibilidade dos endpoints `robots.txt` das fontes identificadas. O workflow do repositório o agenda diariamente às 09:00 UTC e guarda relatórios por 30 dias quando o GitHub Actions está ativado. Ele não indexa projetos nem classifica designs e não sobrescreve relatórios.

| Fase | Portões | Entregável | Tempo típico |
|---|---|---|---|
| A. Intake | G0 | `BUREAU.md`, `config.json` | 1–2 h |
| B. Conceito | G1 | 3 direções + decisão | 4–8 h |
| C. Direção | G2–G4 | `DESIGN.md`, tipografia, cor, composição | 1–2 dias |
| D. Build | G4, G6 | página real, componentes, tokens | 2–5 dias |
| E. Motion | G5 | `MOTION.md`, assinatura, vídeo/3D | 1–3 dias |
| F. QA | G6–G7 | screenshots, métricas, correções | 4–8 h |
| G. Review | G8–G9 | scorecard, Tribunal, launch | 3–6 h |

Um site de campanha cabe em 5–7 dias. Um produto com CMS e múltiplas superfícies, em 2–4 semanas.

---

## A. Intake (G0)

**Faça:**

- Leia o pedido, o repositório, os assets e a verdade existente.
- Escreva `BUREAU.md` com público, oferta, prova, non-goals e métrica.
- Declare o modo por superfície.
- Escreva `.bureau/config.json` com viewports e budgets.
- Faça o inventário de evidência: o que existe, o que falta, quem aprova.

**Não faça:**

- Abrir o Figma antes de saber o que a página precisa provar.
- Escolher a paleta antes de escolher o mundo.
- Inventar uma métrica porque falta prova.

**Saída:** brief de uma página, config, lista de riscos.

---

## B. Conceito (G1)

**Faça:**

- Gere três direções com lentes diferentes (material, editorial, sistêmico, espacial, temporal, instrumental, documental, lúdico).
- Para cada uma: tese, tensão, emoção, ground/voice/light/motion, *signature move*, *technological proof*, risco.
- Produza três comps no mesmo viewport com conteúdo real.
- Pontue com a matriz de 6 critérios.
- Registre a decisão e as direções rejeitadas.

**Não faça:**

- Três variações da mesma ideia.
- Aprovar uma direção a partir de uma imagem gerada sem layout.
- Deixar o comp virar o build por acidente.

**Saída:** `.bureau/comps/` com três comps + `decision.md` + `blend.md` (linhagem: dominante × contraponto × acento).

---

## C. Direção (G2–G4)

**Faça:**

- Escreva o *world sheet*: ground, light, voice, palette, material, motion, imagem, proibições.
- Gere tokens (OKLCH + hex) e valide contraste.
- Produza um espécime tipográfico e uma folha de cor em contexto.
- Componha o primeiro viewport como uma tese.
- Teste 320, 390, 768, 1440, 1920.
- Quebre a grade uma vez, no *signature move*.

**Não faça:**

- Começar por componentes.
- Usar 24 px de raio em tudo.
- Confundir "minimalista" com "vazio".
- Deixar o accent aparecer 12 vezes acima da dobra.

**Saída:** `DESIGN.md`, tokens, espécime, primeiros viewports.

---

## D. Build (G4, G6)

**Faça:**

- HTML semântico primeiro.
- CSS em camadas (`reset, tokens, base, layout, components, utilities, motion`).
- JS mínimo; code-split para cenas pesadas.
- Conteúdo real em todos os estados.
- Estados: default, hover, focus, active, disabled, loading, empty, error, success.
- i18n desde o início (PT/EN/ES), com `lang` e `hreflang`.

**Não faça:**

- Esconder conteúdo essencial atrás de hover.
- Renderizar o hero no cliente.
- Carregar 6 pesos de 3 famílias.
- Deixar um `div onclick` no lugar de um botão.

**Saída:** página navegável, build reproduzível, sem erros de console.

**Depois refine:** sete passes da estrutura ao detalhe (`skill/references/24-refinement-passes.md`), registrados em `.bureau/evidence/refinement.md`.

---

## E. Motion (G5)

Documente cinco referências premiadas de motion distintas com `node skill/scripts/motion-research.mjs --init` e `node skill/scripts/motion-research.mjs --check`. Use `node skill/scripts/motion-research.mjs --plan` para gerar um plano de produção inicial. Registre fontes dos prêmios e evidências locais de observação; `skill/references/31-motion-production.md` explica o processo e as ferramentas opcionais. G5 exige o registro completo.

**Faça:**

- Escreva `MOTION.md` antes do efeito.
- Escolha um caráter: preciso, viscoso, mecânico, orgânico ou cinematográfico.
- Uma sequência de entrada, uma narrativa de scroll, uma assinatura de interação.
- Anime `transform` e `opacity`.
- Projete o modo `prefers-reduced-motion`.
- Meça 60 fps com CPU 4×.

**Não faça:**

- Fade-up em todas as seções.
- Scroll hijack.
- Parallax em texto de leitura.
- Áudio automático.
- Shader em tela cheia no mobile sem fallback.

**Saída:** `MOTION.md`, gravação curta, screenshots normal + reduced.

---

## F. QA (G6–G7)

**Faça:**

- Rode `visual-audit.mjs` em 4 viewports.
- Abra cada screenshot e classifique: defeito real, trade-off aceitável, falso positivo.
- Corrija na fonte, não no screenshot.
- Rode de novo com o mesmo comando e guarde antes/depois.
- Faça o caminho só de teclado.
- Teste 200% e 400% de zoom.
- Teste com leitor de tela.

**Não faça:**

- Passar porque o JSON está verde.
- Ignorar contraste sobre imagem.
- Aceitar overflow horizontal.
- Deixar um P1 virar média.

**Saída:** `.bureau/qa/` + `.bureau/evidence/`.

---

## G. Review (G8–G9)

**Faça:**

- Rode o audit estático e leia os achados no contexto.
- Preencha um `scores.json` por portão com evidência real.
- Rode `review.mjs --gate` em ordem.
- Escreva a declaração do Tribunal.
- Gere o scorecard e anexe à entrega.
- Só faça ship com PASS ou CONDITIONAL aceito por escrito.

**Não faça:**

- Revisar de memória.
- Reutilizar evidência de outro build.
- Arredondar um P0.
- Passar porque o prazo chegou.

**Saída:** `scorecard.html`, veredito, blockers, próximo passo.

---

## Loop Figma → código

```
frame no Figma
  → screenshot de referência
  → variáveis/tokens
  → código real
  → screenshot no mesmo viewport
  → comparação lado a lado
  → corrige o maior desvio
  → repete
```

Regras:

- Mesmo viewport, DPR, conteúdo e estado.
- Compare primeiro o hero e o *signature moment*.
- Diferença de pixel é evidência, não objetivo.
- Se código e Figma discordam, decida a fonte da verdade e atualize a outra.

Detalhes: `skill/references/14-figma-workflow.md`.

---

## Loop Playwright

```
servidor local
  → visual-audit (4 viewports + reduced motion)
  → screenshots + JSON
  → inspeção humana
  → correção
  → re-run idêntico
  → baseline
```

Comandos:

```bash
node skill/scripts/visual-audit.mjs http://localhost:3000 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Detalhes: `skill/references/15-playwright-qa.md`.

---

## Sprint de 5 dias (exemplo)

| Dia | Manhã | Tarde |
|---|---|---|
| 1 | intake, verdade, inventário | três direções + comps |
| 2 | escolha, world sheet, tokens | hero + assinatura |
| 3 | página completa, responsivo | motion + reduced motion |
| 4 | QA, a11y, performance | correções P0/P1 |
| 5 | G2–G9, Tribunal | launch checklist, ship |

Se o dia 5 vira dia 9, o escopo estava errado no dia 1. Reveja o brief, não o CSS.

---

## Handoff

Entregue sempre:

1. a ideia em uma frase;
2. o mundo em 3–5 linhas;
3. arquivos, stack e comandos;
4. evidência: screenshots, métricas, audit, veredito;
5. limitações honestas;
6. o próximo movimento de maior valor.

Sem isso, não é entrega; é despejo de arquivos.
