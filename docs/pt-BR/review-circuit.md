# O circuito de revisão

A finalização também exige o júri independente de 10–15 membros e a revisão completa das Laws of UX descritos em `skill/references/29-jury-and-ux.md`. Todos votam em todos os portões e princípios; achados não resolvidos exigem correção e uma nova revisão completa. Sem avaliadores independentes, o veredito permanece pendente.

Dez portões independentes e um Tribunal. O objetivo não é produzir uma nota bonita; é impedir que o bureau aprove um trabalho por apego.

![Circuito de revisão](../assets/diagrams/circuit.svg)

## Como a nota funciona

Cada portão vale de **0 a 5**, em passos de 0,5. O peso converte:

```
pontos do portão = (nota / 5) × peso
total            = soma dos pontos
```

| Veredito | Total | Significado |
|---|---:|---|
| **Award Track** | ≥ 90 | nível de submissão a júri sério |
| **Pass** | 82–89 | pode publicar |
| **Conditional** | 72–81 | publica só com P1s nomeados e prazo |
| **Fail** | < 72 | não publica |

## Falhas duras

- Qualquer portão abaixo de **3,5/5**.
- Qualquer **P0** não resolvido.
- Evidência obrigatória ausente.
- Claim, logo, métrica, depoimento ou prêmio inventado.
- Revisão feita sobre código que mudou depois (hash diferente).
- Veto do Tribunal.

Uma média de 95 com um P0 de acessibilidade é **Fail**. É esse o ponto.

---

## Três regras de honestidade

1. **Julgue antes de medir.** Escreva a revisão de design antes de ler a saída do detector.
2. **Quem construiu é o revisor mais fraco.** O Tribunal roda em contexto novo, ou o run é declarado `degraded` e não alcança Award Track.
3. **Regra checada se mantém; regra em prosa se perde.** Toda regra mecânica tem um fixture que falha e um que passa.

## Os portões

| Portão | Persona | Peso | Pergunta |
|---|---|---:|---|
| **G0 Intake** | The Producer | 5 | O brief é verdadeiro, limitado e evidenciado? |
| **G1 Concept** | The Creative Director | 14 | Existe uma ideia que só esta marca poderia ter? |
| **G2 Direction** | The Art Director | 15 | O mundo visual parece inevitável e vivo? |
| **G3 Type & Color** | The Type Director | 12 | A tipografia tem voz e a cor tem narrativa? |
| **G4 Composition** | The Layout Architect | 12 | A composição dirige a atenção em todos os viewports? |
| **G5 Motion** | The Motion Director | 12 | O movimento é coreografado, útil e performático? |
| **G6 Engineering** | The Tech Lead | 10 | É rápido, resiliente e mantenível? |
| **G7 Access** | The Access Lead | 9 | Todas as pessoas conseguem usar, inclusive por teclado? |
| **G8 Truth** | The Editor-in-Chief | 8 | Cada palavra é verdadeira e livre de sinais de IA? |
| **G9 Launch** | The Release Engineer | 3 | Dá para publicar, encontrar, medir e recuperar? |

### G0 — Intake

**Critérios:** público, oferta, prova com fonte, non-goals, métrica, constraints, inventário honesto.

**Falhas duras:** prova inventada; público vago; escopo impossível sem trade-off registrado.

**Evidência:** `BUREAU.md`, `.bureau/config.json`.

### G1 — Concept

**Critérios:** três direções distintas; a escolhida é possuível, legível, generativa e construível; *signature move* nomeado e testável.

**Falhas duras:** a ideia serviria a qualquer concorrente; não há assinatura; depende de assets inexistentes.

**Evidência:** três comps no mesmo viewport + `decision.md` + `blend.md` (três linhagens em três eixos). Falha dura se um revisor nomear uma fonte única.

**Crítica pré-build:** philosophy, hierarchy, execution, specificity, restraint, variety, 1–5 cada, mais o eixo mais fraco e a correção. Qualquer eixo abaixo de 3 reprova o G1.

### G2 — Direction

**Critérios:** ground, voz, luz e movimento contam uma história; toda seção pertence; uma assinatura; disciplina de accent; reconhecível em miniatura cinza.

**Falhas duras:** template com logo trocado; duas assinaturas competindo; seção de outro mundo.

**Evidência:** `DESIGN.md`, espécime tipográfico, folha de cor, viewports 1440/768/390, `divergence.json`. Falha dura acima de 0.35 contra o scaffold ou qualquer template.

### G3 — Type & Color

**Critérios:** display com voz; corpo confortável; escala e medida compostas; paleta com papéis; contraste em todos os estados; dark/light desenhados.

**Falhas duras:** corpo < 4,5:1; gradiente no texto; > 3 famílias sem razão; accent > 3 vezes acima da dobra; acentos PT/ES quebram a display.

**Evidência:** tokens, relatório de contraste, espécime, folha de cor.

### G4 — Composition

**Critérios:** spine claro; ritmo de densidade; uma quebra de grade; dobra completa; 320 px recompondo; sem overflow.

**Falhas duras:** scroll horizontal em 320; CTA inalcançável; conteúdo cortado em 200%; fixos sobrepondo interação.

**Evidência:** screenshots 390/768/1440/1920 + full page + notas de zoom.

### G5 — Motion

**Critérios:** uma entrada, uma narrativa de scroll, uma assinatura de interação; caráter consistente; reduced motion desenhado; 60 fps; sem sequestro de scroll.

**Falhas duras:** reduced motion ignorado; scroll hijack; áudio automático; P0 de performance; flash > 3 Hz.

**Evidência:** `MOTION.md`, gravação curta, screenshot reduced, notas de FPS.

### G6 — Engineering

**Critérios:** budgets atingidos; HTML semântico; console limpo; degradação graciosa; sem JS o conteúdo estático ainda é legível; sem código morto.

**Falhas duras:** LCP > 4 s ou CLS > 0,25; erro que quebra interação; página em branco sem JS; licença incompatível.

**Evidência:** `report.json`, Lighthouse/RUM, console, notas de build.

### G7 — Access

**Critérios:** zero P0/P1; teclado completo; foco visível; semântica; formulários úteis; mídia legendada; zoom 200/400%; teste com leitor de tela.

**Falhas duras:** qualquer barreira P0; label ausente; armadilha de teclado; contraste sobre mídia; sem legenda para fala.

**Evidência:** axe/visual audit, notas de teclado, reduced, tabela de contraste, leitor de tela.

**Heurísticas:** as dez de Nielsen, 0–4 cada, `n/a` com motivo. Abaixo da metade do máximo aplicável reprova o G7. Some uma caminhada de personas: o que quebrou, para quem, em qual elemento.

### G8 — Truth

**Critérios:** claims com fonte; voz específica; zero padrões P0; zero dado falso; microcopy humana; a página soa como uma pessoa com ponto de vista.

**Falhas duras:** qualquer fabricação; lorem ipsum; padrão P0 que define a página; copy que distorce preço, disponibilidade ou capacidade.

**Evidência:** `audit.json`, `copy-review.md`, lista de fontes, deck final.

### G9 — Launch

**Critérios:** metadata/OG; sitemap/robots; 404/500; analytics + consentimento; monitoramento; rollback; locale routing; redirects; DNS/TLS.

**Falhas duras:** ação principal quebrada; segredo exposto; consentimento ausente; sem rollback.

**Evidência:** launch checklist, preview OG, sitemap, plano de analytics, rollback.

---

## Evidência obrigatória

O `review.mjs` verifica caminhos reais. Exemplo de score:

```json
{
  "gate": "g2-direction",
  "score": 4.5,
  "reviewer": "art-director",
  "notes": "O mundo se mantém; a seção de preços escapa para outro sistema de raio.",
  "strengths": ["Tipografia", "Objeto-assinatura", "Disciplina de cor"],
  "issues": [
    {
      "id": "G2-01",
      "severity": "P1",
      "title": "Cards de preço usam raio de 24px e sombra genérica",
      "evidence": ".bureau/qa/screenshots/laptop-1440x900-full.png",
      "fix": "Usar a família de 6px e a estrutura de linhas da seção de produto."
    }
  ],
  "evidence": [
    "DESIGN.md",
    ".bureau/qa/screenshots/laptop-1440x900-fold.png",
    ".bureau/evidence/type-specimen.png"
  ]
}
```

O script recusa:

- portão fora de ordem;
- `notes` com menos de 12 caracteres;
- severidade inválida;
- issue sem `fix`;
- issue com evidência inexistente;
- evidência obrigatória ausente;
- score fora de 0–5.

---

## Estado e staleness

```bash
node skill/scripts/review.mjs --status
node skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
node skill/scripts/review.mjs --delivery-init
node skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
node skill/scripts/review.mjs --report
```

Cada portão grava um hash de fonte e documentos. Se o código mudou, o portão fica `STALE` e o Tribunal falha. Para retomar: re-rode o portão e todos os posteriores.

O estado fica em `.bureau/review/state.json`. O scorecard sai em `.md`, `.json` e `.html`.

---

## Delivery Gate

`node skill/scripts/review.mjs --delivery-init` escreve `.bureau/review/delivery.md`. Toda linha é `[PASS]` ou `[FAIL]` com evidência depois de um travessão.

| Bloco | Itens |
|---|---|
| Floor | DG-F1–F8: prova, controles, contraste, teclado, reduced motion, overflow, dobra em 1280×800, conteúdo sem JS |
| Reflex | DG-R1–R3: renúncias, teste de atribuição, divergência ≤ 0.35 |
| Liveliness | DG-L1–L3: dials, ponto focal e accent, motivo de identidade |
| Finish | DG-C1–C3: superfícies do navegador, acabamento tipográfico, estados |
| Process | DG-P1–P2: julgado antes de medido, Tribunal em contexto novo |

Linha sem marcação, `[PASS]` sem evidência ou `N/A` em Floor recusam o final.

## O Tribunal

O Tribunal lê todos os portões, a evidência e o brief. Ele não reescreve notas. Pergunta:

1. O trabalho cumpre a promessa do `BUREAU.md`?
2. A assinatura é memorável ou apenas presente?
3. Algum portão está passando por charme, não evidência?
4. Assinaríamos isso em público?
5. Qual é a menor correção que sobe um nível?

**Veto:** genérico tecnicamente aprovado; evidência encenada; P1 virando média; vergonha pública.

Um veto exige motivo, menor correção e responsável. "Não gostei" não é veto.

```json
{
  "decision": "conditional",
  "notes": "O trabalho cumpre o brief, mas a assinatura ainda é um efeito, não uma prova do produto.",
  "fix": "Transformar a cena de scroll em uma demonstração do mecanismo real; manter o resto.",
  "reviewer": "The Partner"
}
```

---

**Método:** `tribunal.json` declara `"method": "isolated"` ou `"degraded"`. Degradado limita o veredito a PASS.

## Anti-jogo

- Não revise de memória.
- Não rode todos os portões de uma vez e chame de circuito.
- Não reuse evidência de outro build.
- Não deixe a mesma pessoa ser diretora e Tribunal sem um desafio escrito.
- Não passe porque o prazo chegou.
- Não escreva "está ótimo" como nota.

O circuito só vale se for capaz de dizer **fail**.
