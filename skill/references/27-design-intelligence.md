# 27 — Design intelligence and qualification

Use this workflow for a substantial design brief, reference research, or an explicitly requested assessment of a designer or team. It is a structured aid to human judgment, not an objective measure of taste or a predictor of business results. Candidate assessment is optional and separate from the BUREAU gates.

## 1. Brief before research

Record the business problem, offer, positioning, audience, current alternative, desired action and non-goals. Specify primary outcome, baseline, target, measurement period, instrumentation and owner; mark unknown values as unknown. Map the key journey, evidence of user needs, accessibility requirements and barriers. Separate observations from hypotheses. Define scope, assets and rights, budget, timeline, approver and acceptance criteria. Ask only questions whose answers materially change the work; record other assumptions and validate them.

## 2. Research with a boundary

Choose sources appropriate to the brief; the 25 requested entries below are a research menu, not a requirement to scan every site or a claim of global coverage. Some names are ambiguous and require identification before use. Record access date, exact project URL, creator attribution, surface and state, reason for selection, observation, source limitations, transferable principle and what must not be copied. Use the project itself where possible, not just a gallery screenshot. If a source is inaccessible or restricted, record that and continue with permitted alternatives.

| Source | Useful starting point | Limitation |
|---|---|---|
| [Awwwards](https://www.awwwards.com/) | Visual direction and published award entries | Awards are not proof of business impact or authorship. |
| [FWA](https://thefwa.com/) | Interactive experiences | Verify access and the behavior in the original project. |
| [CSS Design Awards](https://www.cssdesignawards.com/) | Interaction and jury evaluations | Scores reflect that platform's criteria. |
| [SiteInspire](https://www.siteinspire.com/) | Categorized web compositions | Gallery inclusion does not establish usability. |
| [Godly](https://godly.website/) | Art direction and interaction references | The URL may redirect or be unavailable; verify the destination. |
| [Behance](https://www.behance.net/) | Case studies and process | Access may be restricted; verify each creator's actual contribution. |
| [Dribbble](https://dribbble.com/) | Visual and component studies | A static shot alone does not demonstrate a working flow. |
| [Mobbin](https://mobbin.com/) | Shipped interface patterns and flows | Access and reuse depend on its terms and account. |
| [Landbook](https://land-book.com/) | Page, section, mobile and motion references | A curated example is not proof of conversion. |
| [Minimal Gallery](https://minimal.gallery/) | Composition, restraint and typography | Aesthetic restraint must be evaluated against the actual task. |
| [Lapa Ninja](https://www.lapa.ninja/) | Landing-page examples and page structure | Appearance does not establish conversion performance. |
| [One Page Love](https://onepagelove.com/) | Single-page narratives and sections | Confirm the destination and behavior of each example. |
| [Curated Design](https://curated.design/) | Website sections by style and industry | Verify usage rights and access for each item. |
| [SaaSFrame](https://www.saasframe.io/) | SaaS website and interface examples | Access may depend on account or plan; inspect actual workflows. |
| [SaaS Landing Page](https://saaslandingpage.com/) | SaaS landing-page and pricing patterns | Gallery inclusion is not proof of conversion. |
| [Dark Mode Design](https://www.darkmodedesign.com/) | Dark surface and visual hierarchy | Measure contrast and interaction states independently. |
| [Brutalist Websites](https://brutalistwebsites.com/) | Experimental structure and visual language | Experimental form does not establish accessibility or usability. |
| Pintura / Hover Statues | Potential shader and interaction references | Names or URLs are not sufficiently identified; verify before use. |
| [UI Sources](https://www.uisources.com/) | Interface examples | The checked address redirected to ScreensDesign; verify current identity and terms. |
| [Refero](https://refero.design/) | Product interface examples | Verify access, current coverage and permissions. |
| UX Archive | User-flow references | The intended service and current availability are unverified; identify before use. |
| [Goodbrief](https://goodbrief.io/) | Practice prompts and fictional briefs | Generated challenges are not real-client outcomes or approval-rate evidence. |
| Canvas | Visual experimentation | Name is ambiguous; identify the intended product before use. |
| [Webflow Showcase](https://webflow.com/made-in-webflow) | Community websites and interactions | Verify each project's implementation and reuse permissions. |
| [Layers](https://layers.to/) | Community design work | A gallery image alone does not demonstrate implementation or results. |

Compare examples across four lenses: visual direction; interaction and technical behavior; information architecture and usability; and task flow and conversion. Capture the actual state and viewport and check keyboard, motion and responsive behavior where feasible. A reference is evidence of a design choice, not evidence of its performance. Never reproduce identity, code, imagery or copy without rights.

### Source selection by brief

| Need | Starting points | What to validate separately |
|---|---|---|
| Corporate or SaaS landing | Landbook, Lapa Ninja, SaaSFrame, SaaS Landing Page | Conversion requires project analytics or controlled research, not a gallery listing. |
| Interactive or WebGL experience | FWA, Awwwards, CSS Design Awards | Inspect the live interaction, device performance, fallback and individual contribution. |
| Product flow | Mobbin, Refero, UI Sources | Check complete task states and accessibility; accounts and terms vary. |
| Editorial or experimental | SiteInspire, One Page Love, Brutalist Websites, Minimal Gallery | Check reading, semantics and responsive behavior. |
| Practice exercise | Goodbrief | Label the brief simulated and exclude it from real-client approval measures. |

These are suggested searches, not connections or automatic scoring rules. Findings require a dated, attributable project-level record and a human judgment against the brief.

## 3. Optional candidate assessment

Apply the same job-relevant rubric, evidence requirements and scoring process to every candidate. Evaluate portfolios wherever the work is verifiable; publication in a particular gallery is neither mandatory nor sufficient. Verify the person's role and distinguish individual from team work. Do not infer ability from protected characteristics, appearance or demographic proxies. Obtain permission before collecting non-public information and use human review for consequential decisions.

| Dimension | Weight | Evidence examples |
|---|---:|---|
| Portfolio and execution | 30 | Relevant shipped work, individual contribution, constraints and outcome with sources. |
| Technical and methodological practice | 30 | Navigable prototype, design system, accessibility and implementation decisions. |
| Strategic and analytical thinking | 20 | A decision grounded in a defined business problem, measurement and uncertainty. |
| Operations and communication | 20 | Clear handoff, response to critique, scope and delivery process. |

Score each dimension from 0 to 5: 0 absent or contradicted; 1 limited; 2 partial; 3 competent; 4 strong; 5 exceptional evidence for this brief. Calculate `total = sum(weight × score / 5)`. Record score, rationale, evidence link and reviewer for each dimension. Missing evidence is **unassessed**, not zero: do not compute a total or rank candidates until it is obtained. Apply the same rules to all candidates.

As a starting decision aid, `85–100` supports consideration for a lead role, `70–84.99` suggests supervision or development, and below `70` signals a gap against this rubric. These are project-specific hypotheses, not validated predictions; calibrate them with hiring owners and actual outcomes. Scores cannot override missing evidence, accessibility requirements, conflicts of interest or human review.

## 4. Trend observations and tool capability

Document the sample, dates, selection method, denominators and duplicates before reporting frequency. A curated gallery is a biased sample; an observed increase is not a forecast, a causal finding or a measure of effectiveness. Avoid claims about creator performance unless the creator's role and outcome are independently substantiated. Do not automatically adjust a candidate's score for trend alignment.

The optional `scripts/source-monitor.mjs` checks the availability of the `robots.txt` endpoints of the identified sources. It does not read project pages, interpret permissions, index content or assess designers. The repository workflow `.github/workflows/source-monitor.yml` schedules a daily check at 09:00 UTC and retains each report for 30 days; it runs only when GitHub Actions is enabled for the repository. The script also runs manually, writes a new JSON report and refuses to overwrite an existing file:

```bash
node "$BUREAU_DIR/scripts/source-monitor.mjs" --out source-report.json
```

The BUREAU repository does **not** provide a continuously running content crawler, semantic index, trained visual classifier or forecasting model. When an authorized search, connector or index is available, use it only within its documented access limits, terms, privacy constraints and rate limits; record query, timestamp, retrieved items and omissions. Otherwise perform bounded research manually. Never claim live coverage, neural classification, prediction or real-time recalibration without working tools and reproducible evidence.
