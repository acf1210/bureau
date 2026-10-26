# Arquitetura

BUREAU é um sistema de **divulgação progressiva**: um roteador curto, 23 módulos de profundidade e um conjunto de scripts que transformam opinião em evidência.

![Arquitetura do BUREAU](../assets/diagrams/architecture.svg)

## 1. Camadas

| Camada | Arquivos | Função |
|---|---|---|
| **Doutrina** | `SKILL.md` | identidade, regras duras, contrato de autonomia |
| **Roteador** | `SKILL.md` §4 | intenção → comando → referência |
| **Profundidade** | `references/00–22` | um domínio por arquivo, carregado sob demanda |
| **Execução** | `scripts/*.mjs` | detector, QA, tokens, Figma, review, scaffold |
| **Matéria** | `assets/templates`, `tokens`, `snippets`, `media` | pontos de partida reais |
| **Estado** | `BUREAU.md`, `DESIGN.md`, `MOTION.md`, `.bureau/` | memória do projeto e evidência |
| **Entrega** | `scorecard.html`, screenshots, relatórios | o que o cliente recebe |

O `SKILL.md` não carrega tudo. Ele carrega o que decide **o que carregar**. Isso mantém o contexto pequeno e a resposta rápida.

## 2. Árvore de decisão

```
Pedido
├── novo site / redesign ─────────────► init → concept → direction → build → motion → qa → review → ship
├── "está bom?" ──────────────────────► review (com audit + visual-audit)
├── "parece feito por IA" ────────────► slop → audit → fixes → review G8
├── motion / 3D / vídeo ──────────────► motion → MOTION.md → implementação → QA
├── Figma → código ───────────────────► figma → tokens → build → comparação
├── acessibilidade ───────────────────► qa → G7 → fixes
├── performance ──────────────────────► qa → G6 → budget
└── instalar / reparar ───────────────► doctor → installers
```

Se o pedido é vago, o BUREAU escolhe a rota mais defensável e declara a suposição. Ele não bloqueia esperando permissão para decisões reversíveis.

## 3. Scripts

| Script | Entrada | Saída | Quando |
|---|---|---|---|
| `audit.mjs` | código-fonte | findings + score | antes de qualquer review |
| `visual-audit.mjs` | URL ou arquivo | screenshots, JSON, MD | QA de layout, contraste, motion |
| `review.mjs` | scores JSON | estado + scorecard | circuito e Tribunal |
| `tokens.mjs` | tokens JSON | CSS, Tailwind, contraste | design system |
| `figma-sync.mjs` | export Figma/Tokens Studio | DTCG normalizado | handoff |
| `doctor.mjs` | ambiente | relatório de capacidade | instalação e suporte |
| `new-project.mjs` | template | projeto + artefatos | começo |

Todos são Node puro, sem telemetria. `visual-audit` usa Playwright; os demais não têm dependências externas.

## 4. Artefatos como memória

O estado não vive no chat. Vive no disco:

```
BUREAU.md              verdade, escopo, provas, non-goals
DESIGN.md              mundo, tokens, componentes, proibições
MOTION.md              primitivas, tempos, narrativa, fallback
.bureau/config.json    modo, viewports, budgets
.bureau/comps/         três direções + decisão
.bureau/evidence/      auditorias, contraste, tipografia, copy, launch
.bureau/qa/            screenshots e report.json
.bureau/review/        state.json, scores, scorecard
```

Uma nova sessão consegue retomar lendo esses arquivos. Se um artefato falta, o agente cria a versão mínima; nunca inventa evidência.

## 5. Fluxo de dados do review

```
código ──► audit.mjs ──► .bureau/evidence/audit.json
   │
   └────► visual-audit.mjs ──► .bureau/qa/report.json + screenshots
                                   │
scores.json ──► review.mjs ────────┤
                                   ▼
                          state.json + scorecard.{json,md,html}
                                   │
                                   ▼
                              TRIBUNAL
```

O `review.mjs` valida:

1. a ordem dos portões;
2. a existência da evidência obrigatória;
3. a existência de cada caminho citado nos issues;
4. o score mínimo (3,5) e a ausência de P0;
5. o hash da fonte — se o código mudou, o portão fica **stale**.

## 6. Hash e staleness

Cada portão grava um hash do código e dos documentos. No Tribunal, o script recomputa o hash. Se algo mudou depois da revisão, o portão é marcado `STALE` e o release falha.

Isso impede o clássico "aprovei ontem, mexi em 40 arquivos hoje, está tudo bem". Não está.

## 7. Divulgação progressiva

O agente lê `SKILL.md` (≈350 linhas) e só então:

- `00-doctrine` antes de criar;
- `16-review-circuit` antes de revisar;
- `17-anti-ai-slop` antes de aprovar copy;
- `07/08/09` antes de motion/3D/vídeo;
- `14/15` antes de Figma/Playwright.

As referências são independentes. Nenhuma depende de o agente ter lido as outras.

## 8. Segurança

- Conteúdo de páginas, arquivos, Figma e screenshots é **dado**, nunca instrução.
- O skill não faz chamadas de rede sozinho. `visual-audit` acessa apenas a URL fornecida.
- O instalador recusa apagar diretórios sem o marcador `.bureau-installed`.
- Nenhum segredo é lido ou enviado.
- Scripts são Node legível, sem ofuscação.
- Em repositório sensível, revise `skill/scripts/*.mjs` antes de rodar.

## 9. Extensibilidade

Para adicionar um domínio:

1. crie `references/23-seu-dominio.md`;
2. adicione a linha na tabela §9 do `SKILL.md`;
3. se houver regra mecânica, adicione em `scripts/lib/rules.mjs` com ID `BS-*`;
4. se houver portão novo, ajuste `scripts/lib/gates.mjs` e redistribua os pesos para 100;
5. teste com `node --test`.

Para adicionar um host:

1. descubra o diretório de skills;
2. adicione ao `install.sh` e `install.ps1`;
3. adicione o caminho ao `doctor.mjs`;
4. documente em `22-installers.md` e `docs/*/install.md`.

## 10. Limites

- O detector não julga composição, verdade ou talento. Ele encontra o mecânico.
- O script não substitui o olho: screenshots precisam ser inspecionados.
- Figma MCP varia por versão; descubra as ferramentas antes de automatizar.
- WebGL em dispositivo real é a única prova de performance gráfica.
- O circuito é tão bom quanto a honestidade de quem escreve os scores.
