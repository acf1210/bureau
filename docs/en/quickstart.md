# First 15 minutes

From a clean install to a project with a brief, three comps, a build, QA, and an open circuit.

## 1. Requirements

- Node.js 20+.
- Git.
- Optional: Playwright + Chromium for visual QA.
- Optional: Figma Desktop/Dev Mode or Figma MCP for variables.
- Optional: ffmpeg and ImageMagick for media.

```bash
node --version
git --version
node skill/scripts/doctor.mjs
```

`doctor` reports what is available and what will degrade.

## 2. Install

```bash
git clone https://github.com/acf1210/bureau.git
cd bureau

bash installers/install.sh --agent all --scope user --dry-run
bash installers/install.sh --agent all --scope user
```

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user -DryRun
powershell -ExecutionPolicy Bypass -File installers/install.ps1 -Agent all -Scope user
```

Restart the agent. `/bureau` should appear.

## 3. Toolkit dependencies

```bash
npm install --no-bin-links
npx playwright install chromium
```

`--no-bin-links` is only needed on mounts that do not support symlinks (some SMB shares). On a local disk, `npm install` is enough.

If Playwright's Chromium cannot download, the script automatically falls back to a system Chromium. You can also point it:

```bash
BUREAU_CHROMIUM=/usr/bin/chromium node skill/scripts/visual-audit.mjs ...
```

## 4. Create a project

```bash
node skill/scripts/new-project.mjs my-site --template kinetic-editorial
cd my-site
```

| Template | Use |
|---|---|
| `kinetic-editorial` | Night journal: Tschichold × Lubalin × Bass. An index filed by the live Lisbon hour |
| `product-surface` | Planning desk: Tufte × Vignelli × Aicher. Raise the waterline; the order of failure follows |
| `immersive-experience` | Light installation: Moholy-Nagy × Cooper × Eames. Shift the light; shader, title and focus follow |
| `legal-practice` | Arbitration chambers: Sutnar × Rand × Ruder. Every clause in two registers: legal and plain |
| `architecture-studio` | Architecture studio: Ando × Mies × Scarpa. A slit of daylight that opens as you scroll |
| `restaurant-table` | Tasting counter: Barragán × Wyman × J. Albers. Choose your seats on the counter arc |
| `private-bank` | Family office: Müller-Brockmann × Crouwel × Tufte. Compounding with your numbers, formula shown |
| `clinic-care` | Respiratory clinic: Hara × Kare × Tanaka. A breathing guide that starts only when pressed |
| `developer-api` | Geocoding API: Gerstner × Weingart × Greiman. A playground that really matches typos |
| `fashion-atelier` | Tailoring atelier: Brodovitch × A. Albers × B. Thompson. A pattern drafted from your measurements |
| `record-label` | Record label: Reid Miles × Saville × Brody. Type-only sleeves that play a synthesised sketch |
| `museum-archive` | Photographic archive: Bo Bardi × Lustig × Munari. Glass easels with the record on the back |
| `hardware-store` | Product shop: Rams × Sottsass × Castiglioni. Configure the lamp, then see it apart, priced |

Each template is self-contained: HTML, CSS, JS, media, tokens.

## 5. Fill in the truth

Open `BUREAU.md`. Replace every `TODO`:

- specific audience and current alternative;
- offer and sourced proof;
- claims you cannot make;
- mode (`PERSUADE`, `EXPERIENCE`, `OPERATE`, `READ`);
- performance budget;
- definition of done.

Without this, Gate 0 does not pass. It is not paperwork; it is what stops the project from becoming decoration.

## 6. Three directions

Ask the agent:

```text
/bureau concept
```

Or do it manually:

1. Create `.bureau/comps/`.
2. Produce three comps at the same viewport (1440×900) with real content.
3. Name each direction; write the thesis, signature move, and risk.
4. Score with the matrix in `skill/references/02-concept-engine.md`.
5. Record the decision in `.bureau/comps/decision.md` and the blend in `.bureau/comps/blend.md`.

Without three directions there is no decision — only the first impulse.

## 7. Build

```bash
python3 -m http.server 4173
# or
npx serve .
```

Build the first viewport as a complete thesis, not a header. Then the whole page.

## 8. Visual QA

```bash
node <bureau>/skill/scripts/visual-audit.mjs http://localhost:4173 \
  --out .bureau/qa \
  --viewports 390x844,768x1024,1440x900,1920x1080 \
  --full --motion
```

Open the screenshots. The JSON is evidence; the eye is the judge.

## 9. Open the circuit

Create a score file. Gate 0 example:

```json
{
  "gate": "g0-intake",
  "score": 4.5,
  "notes": "Brief complete; main proof sourced; non-goals explicit.",
  "issues": [],
  "evidence": ["BUREAU.md", ".bureau/config.json"]
}
```

```bash
node <bureau>/skill/scripts/review.mjs --gate g0-intake --scores .bureau/review/g0.json
node <bureau>/skill/scripts/review.mjs --status
```

The script refuses out-of-order gates, missing evidence, and scores below 3.5.

## 10. Tribunal

```bash
node <bureau>/skill/scripts/review.mjs --final --tribunal .bureau/review/tribunal.json
```

The Tribunal requires a written statement. The result lands in `.bureau/review/scorecard.html`.

## Project artifacts

```
BUREAU.md              truth and scope
DESIGN.md              visual contract
MOTION.md              motion grammar
.bureau/
  config.json          mode, budgets, viewports
  comps/               three directions + decision
  evidence/            audits, contrast, type, copy
  qa/                  screenshots + report.json
  review/              state, scores, scorecard
```

## If something breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| Skill not listed | wrong folder / host not restarted | verify `SKILL.md` at root; restart |
| `/bureau` unknown | command not installed | reinstall with the command |
| `Cannot find package 'playwright'` | dependency missing | `npm install` |
| Chromium fails | browser not downloaded | `npx playwright install chromium` |
| Figma tools missing | MCP not connected | reconnect or export tokens |
| Evidence rejected | file does not exist | generate the artifact; never invent the path |
| Wrong font | fallback/license | self-host and compare computed styles |

Next: [Architecture](architecture.md) · [Circuit](review-circuit.md) · [Commands](commands.md).
