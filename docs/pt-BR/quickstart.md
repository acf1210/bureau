# Primeiros 15 minutos

Este guia leva você de uma instalação limpa a um projeto com brief, três comps, build, QA e o circuito aberto.

## 1. Requisitos

- Node.js 20 ou superior.
- Git.
- Opcional: Playwright + Chromium para QA visual.
- Opcional: Figma Desktop/Dev Mode ou Figma MCP para sincronizar variáveis.
- Opcional: ffmpeg e ImageMagick para mídia.

```bash
node --version
git --version
node skill/scripts/doctor.mjs
```

O `doctor` diz o que está disponível e o que vai degradar.

## 2. Instalar

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

Reinicie o agente. O comando `/bureau` deve aparecer.

## 3. Instalar dependências do toolkit

```bash
npm install --no-bin-links
npx playwright install chromium
```

`--no-bin-links` é necessário apenas em montagens que não suportam symlink (alguns shares SMB). Em disco local, `npm install` basta.

Se o Chromium do Playwright não baixar, o script usa automaticamente um Chromium do sistema. Você também pode apontar:

```bash
BUREAU_CHROMIUM=/usr/bin/chromium node skill/scripts/visual-audit.mjs ...
```

## 4. Criar um projeto

```bash
node skill/scripts/new-project.mjs meu-site --template kinetic-editorial
cd meu-site
```

Templates:

| Template | Uso |
|---|---|
| `kinetic-editorial` | Revista noturna: Tschichold × Lubalin × Bass. Um índice organizado pela hora de Lisboa ao vivo |
| `product-surface` | Mesa de planejamento: Tufte × Vignelli × Aicher. Suba a linha d'água; a ordem de falha acompanha |
| `immersive-experience` | Instalação de luz: Moholy-Nagy × Cooper × Eames. Mude a luz; shader, título e foco acompanham |
| `legal-practice` | Câmara de arbitragem: Sutnar × Rand × Ruder. Cada cláusula em dois registros: jurídico e simples |
| `architecture-studio` | Estúdio de arquitetura: Ando × Mies × Scarpa. Uma fenda de luz que se abre com o scroll |
| `restaurant-table` | Balcão de degustação: Barragán × Wyman × J. Albers. Escolha seus lugares no arco do balcão |
| `private-bank` | Family office: Müller-Brockmann × Crouwel × Tufte. Juros compostos com seus números, fórmula à vista |
| `clinic-care` | Clínica respiratória: Hara × Kare × Tanaka. Um guia de respiração que só começa quando você aperta |
| `developer-api` | API de geocodificação: Gerstner × Weingart × Greiman. Um playground que casa erros de digitação de verdade |
| `fashion-atelier` | Alfaiataria sob medida: Brodovitch × A. Albers × B. Thompson. Um molde desenhado a partir das suas medidas |
| `record-label` | Selo de discos: Reid Miles × Saville × Brody. Capas só de tipo que tocam um esboço sintetizado |
| `museum-archive` | Arquivo fotográfico: Bo Bardi × Lustig × Munari. Cavaletes de vidro com a ficha no verso |
| `hardware-store` | Loja de produto: Rams × Sottsass × Castiglioni. Configure a luminária e veja as peças, com preço |

Cada template é autônomo: HTML, CSS, JS, mídia e tokens.

## 5. Preencher a verdade

Abra `BUREAU.md`. Substitua todos os `TODO`:

- público específico e alternativa atual;
- oferta e prova com fonte;
- o que não pode ser afirmado;
- modo (`PERSUADE`, `EXPERIENCE`, `OPERATE`, `READ`);
- orçamento de performance;
- critério de pronto.

Sem isso, o portão G0 não passa. Não é burocracia: é o que impede o projeto de virar decoração.

## 6. Três direções

Peça ao agente:

```text
/bureau concept
```

Ou faça manualmente:

1. Crie `.bureau/comps/`.
2. Produza três comps no mesmo viewport (1440×900) com conteúdo real.
3. Nomeie cada direção, escreva a tese, o *signature move* e o risco.
4. Pontue com a matriz de `skill/references/02-concept-engine.md`.
5. Registre a decisão em `.bureau/comps/decision.md` e a mescla em `.bureau/comps/blend.md`.

Sem três direções, não há decisão — só o primeiro impulso.

## 7. Construir

```bash
# servir localmente
python3 -m http.server 4173
# ou
npx serve .
```

Construa o primeiro viewport como uma tese completa, não como um cabeçalho. Depois a página inteira.

## 8. QA visual

```bash
node <bureau>/skill/scripts/visual-audit.mjs http://localhost:4173 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Abra os screenshots. O JSON é evidência; o olho é o juiz.

## 9. Abrir o circuito

Crie os arquivos de score. Exemplo para o portão 0:

```json
{
  "gate": "g0-intake",
  "score": 4.5,
  "notes": "Brief completo; prova principal tem fonte; non-goals explícitos.",
  "issues": [],
  "evidence": ["BUREAU.md", ".bureau/config.json"]
}
```

```bash
node <bureau>/skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
node <bureau>/skill/scripts/review.mjs --status
```

O script recusa portões fora de ordem, evidência ausente e scores abaixo de 3,5.

## 10. Tribunal

```bash
node <bureau>/skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
```

O Tribunal exige uma declaração escrita. O resultado sai em `.bureau/review/scorecard.html`.

## O que existe no projeto

```
BUREAU.md              verdade e escopo
DESIGN.md              contrato visual
MOTION.md              gramática de movimento
.bureau/
  config.json          modo, budgets, viewports
  comps/               três direções + decisão
  evidence/            auditorias, contraste, tipografia, copy
  qa/                  screenshots + report.json
  review/              estado, scores, scorecard
```

## Se algo falhar

| Sintoma | Causa provável | Correção |
|---|---|---|
| Skill não aparece | pasta errada ou host não reiniciado | verifique `SKILL.md` na raiz; reinicie |
| `/bureau` desconhecido | comando não instalado | reinstale com o comando habilitado |
| `Cannot find package 'playwright'` | dependência ausente | `npm install` |
| Chromium não abre | browser não baixado | `npx playwright install chromium` |
| Figma sem ferramentas | MCP não conectado | reconecte ou exporte tokens |
| Evidência recusada | arquivo não existe | gere o artefato; não invente o caminho |
| Fonte errada | fallback/licença | self-host e compare estilos computados |

Próximo: [Arquitetura](architecture.md) · [Circuito](review-circuit.md) · [Comandos](commands.md).
