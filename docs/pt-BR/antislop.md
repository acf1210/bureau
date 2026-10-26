# Anti-AI-slop

Slop não é "feito por IA". É **a média da internet reproduzida sem uma decisão**. O antídoto não é mais design; é especificidade.

![Do sinal ao portão](../assets/diagrams/antislop.svg)

## O teste de três segundos

Mostre o primeiro viewport por três segundos. Pergunte:

1. Isso poderia ser qualquer startup de IA de 2023–2026?
2. A marca é identificável sem o logo?
3. Existe um elemento que só poderia pertencer a este assunto?
4. A copy diz algo falsificável ou específico?
5. O motion faz um trabalho ou apenas performa "premium"?

Três ou mais "não" → é slop, independentemente do polimento.

---

## Taxonomia

| ID | Sinal | Correção |
|---|---|---|
| **BS-C01** | hero centralizado: pill + H1 + subtítulo cinza + dois botões + gradiente | escolha uma composição: objeto, palco, argumento dividido, índice ou prova ao vivo |
| **BS-C02** | três cards iguais com ícone | hierarquia, comparação, ledger, sequência ou uma prova profunda |
| **BS-C03** | seções 01/02/03 sem sequência real | numere só quando a ordem importa |
| **BS-C04** | bento por moda | use só se o conteúdo for modular e desigual |
| **BS-C05** | todas as seções com a mesma altura | mapa de densidade |
| **BS-C06** | cards dentro de cards | achate; use linhas, espaço e tipografia |
| **BS-C07** | raio de 24px em tudo | família de raio ligada ao mundo |
| **BS-C08** | tudo centralizado | coluna dominante + peso assimétrico |
| **BS-C09** | footer com wordmark gigante + quatro colunas | footer como argumento final |
| **BS-T01** | Space Grotesk + Inter | display com voz própria |
| **BS-T02** | display na fonte padrão de UI | papel e face próprios |
| **BS-T03** | micro-label maiúsculo em toda seção | label só quando informa |
| **BS-T04** | corpo em 11–12px | 16px para prosa |
| **BS-T05** | 8 tamanhos sem escala | use a escala |
| **BS-T06** | texto em gradiente | nunca |
| **BS-T07** | parágrafo de 100ch | 65–75ch |
| **BS-K01** | gradiente roxo/índigo como marca | material e história primeiro |
| **BS-K02** | gradiente no texto | nunca |
| **BS-K03** | #000 e #fff puros | tinte ambos |
| **BS-K04** | glass + glow + grain como receita | escolha um material |
| **BS-K05** | seis accents sem papéis | 5–7 papéis semânticos |
| **BS-K06** | accent 10× acima da dobra | ≤ 3 usos intencionais |
| **BS-M01** | fade-up em tudo | uma entrada, depois silêncio |
| **BS-M02** | `transition: all` | propriedades nomeadas |
| **BS-M03** | hover scale 1.05 em todo card | uma assinatura de interação |
| **BS-M04** | loops infinitos sem pausa | um loop, pausa, reduced motion |
| **BS-M05** | parallax em todas as camadas | uma história de profundidade |
| **BS-M06** | scroll hijack | sticky com scroll livre |
| **BS-M07** | reduced motion ignorado | modo desenhado |
| **BS-M08** | vídeo com áudio automático | mudo, inline, pausável |
| **BS-W01** | empower, seamless, elevate, unlock, supercharge | outcome concreto + número |
| **BS-W02** | lorem ipsum | nunca em produção |
| **BS-W03** | "99,9% uptime" sem fonte | link da prova ou corte |
| **BS-W04** | logoipsum / placeholder | asset licenciado e art-directed |
| **BS-W05** | depoimento com rosto de stock | depoimento real com consentimento |
| **BS-W06** | "estamos animados em anunciar" | diga o que mudou e por quê |
| **BS-W07** | três adjetivos seguidos | um claim + prova |
| **BS-W08** | "Get started" em tudo | nomeie a ação |
| **BS-W09** | copy que descreve a categoria | descreva o mecanismo e o resultado |
| **BS-W10** | emoji como bullet | ícone com sistema |
| **BS-I01** | emoji como ícone de produto | conjunto customizado |
| **BS-I02** | Unsplash aleatório | asset dirigido e licenciado |
| **BS-I03** | pele plástica, mãos impossíveis, texto falso | regenere, corte ou componha |
| **BS-I04** | dashboard falso com o mesmo gráfico | produto real ou diagrama |
| **BS-I05** | logos de empresas inventadas | clientes reais com permissão |
| **BS-B01** | cursor nativo escondido | mantenha o cursor |
| **BS-B02** | scroll do body travado | só em modal com escape |
| **BS-B04** | `div onclick` como botão | `<button>` |
| **BS-B05** | marquee sem pausa | pausa + reduced motion |
| **BS-E01** | `console.log` em produção | remova |
| **BS-E06** | sem viewport meta | adicione |
| **BS-E07** | sem `lang` | adicione o locale |
| **BS-E08** | imagem sem dimensões | reserve espaço |

A taxonomia completa está em `skill/references/17-anti-ai-slop.md`.

---

## P0 — bloqueiam o G8

- **BS-K02** texto em gradiente.
- **BS-W02** lorem ipsum.
- **BS-M07** reduced motion ignorado.
- **BS-M08 / BS-B08** áudio automático.
- **BS-A01** imagem sem alt.
- **BS-A02** foco removido sem substituto.
- **BS-A03** zoom desativado.
- **BS-B04** div como botão.
- **BS-E06** sem viewport.
- Qualquer fabricação de prova.

Um único P0 define a página. Não há média que salve.

---

## Detector

```bash
node skill/scripts/audit.mjs .
node skill/scripts/audit.mjs . --json --out .bureau/evidence/audit.json
node skill/scripts/audit.mjs . --fail-on p0
node skill/scripts/audit.mjs --list-rules
```

O detector cobre o mecânico. Ele não julga:

- composição;
- originalidade;
- verdade;
- talento;
- se a assinatura é memorável.

Para isso existe o circuito.

### Supressão

Só suprima um falso positivo provado:

```html
<!-- bureau-ignore BS-K01: gradiente exigido pela marca, aprovado em DESIGN.md -->
```

O `audit.mjs` respeita a linha atual e a anterior, além de um cabeçalho `bureau-ignore-file`.

---

## Copy: léxico e substituição

| Slop | Escreva |
|---|---|
| Empower your team | Dê ao ops lead um fechamento em 10 minutos |
| Seamless integration | Sincroniza com HubSpot em um OAuth; sem CSV |
| Elevate your brand | Reconstrua a identidade em 6 semanas, com design system |
| Unlock insights | Veja quais 3 contas vão cancelar, hoje de manhã |
| Supercharge workflows | Corte a fatura de 4 horas para 12 minutos |
| Next-generation platform | Roda em Postgres 16; deploy em 90 segundos |
| Cutting-edge AI | Um modelo de retrieval que cita o parágrafo |
| Trusted by industry leaders | Logos reais + um caso nomeado |
| World-class support | Resposta em 2 horas, seg–sex, por um engenheiro |

Regras:

- um claim por frase;
- verbo > adjetivo;
- número com fonte;
- nomeie o mecanismo;
- leia em voz alta.

---

## A cura: especificidade

Pergunte em cada seção:

1. Qual é a única ideia?
2. Por que este layout, e não o default?
3. Qual é a evidência?
4. O que um concorrente teria que mudar para usar isto?
5. O que sairia se cortássemos 30%?

Se as respostas são fracas, a seção não está pronta.

---

## Exceções

Um "sinal" pode ser legítimo quando é o conceito:

- gradiente roxo para uma marca cujo assunto é luz sintética;
- três cards quando há três escolhas realmente iguais;
- tema escuro, desde que iluminado, não invertido;
- cursor customizado, desde que preciso, opcional e acessível;
- hero centralizado, desde que o tipo e o material o sustentem.

A regra não é "nunca use um padrão". É **nunca use sem uma razão defensável em público**.

---

## Evidência do G8

- `audit.json` sem P0 não resolvido.
- `copy-review.md` com claims e fontes.
- screenshots de cada seção.
- lista de exceções com razão.
- leitura final como estranho.

O G8 passa com **≥ 3,5/5** e zero P0.
