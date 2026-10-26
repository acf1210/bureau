# 01 — Intake and the Brief

Gate 0. The brief is not paperwork; it is the constraint system that makes taste possible.

## 1. The interview

Ask at most three blocking questions per round. Everything else gets a defensible default, written down.

**Round 1 — the job**

1. What must this page make someone do, feel, or believe?
2. Who is the specific person, and what do they currently do instead?
3. What is true and provable about the offer that a competitor cannot say?

**Round 2 — the world**

4. Name three references you love and one you hate. Why? (If none: choose a world and defend it.)
5. What must this never look like? (category clichés, competitor, previous brand)
6. What assets exist: logo, photography, video, product UI, data, type license?

**Round 3 — constraints**

7. Stack, hosting, CMS, locales, deadline.
8. Accessibility target and performance budget.
9. Who approves, and what does "done" mean?

If the user cannot answer, do not stall. Propose a default and label it as a working assumption.

## 2. Modes

Declare one mode per surface. It changes the rules.

| Mode | Visitor intent | Design priority | Allowed expression |
|---|---|---|---|
| **PERSUADE** | Decide, buy, sign up | Offer clarity + desire + proof | High. The world may own the page. |
| **EXPERIENCE** | Feel, explore, witness | Immersion + memory | Highest. The work leads. |
| **OPERATE** | Complete a task | Speed, legibility, trust | Low. The world lends type, palette, density and one signature move; never the navigation model. |
| **READ** | Understand something | Comprehension, measure, wayfinding | Medium. The world owns the frame; the reading column stays calm. |

A marketing site can contain OPERATE surfaces (pricing calculator, demo). Declare per surface, not per project.

## 3. The brief: `BUREAU.md`

```markdown
# BUREAU — <project>

## Truth
- Product: <what it is, in one sentence a customer would repeat>
- Audience: <specific segment + current alternative>
- Job to be done: <the progress the user wants>
- Offer: <the exchange: what they give, what they get>
- Proof (sourced): <metric / demo / guarantee / credential + source>
- Claims we cannot make: <list>
- Non-goals: <what this page will not try to do>

## Direction
- Mode: PERSUADE | EXPERIENCE | OPERATE | READ
- Emotional target: <3 adjectives, specific>
- Must never look like: <list>
- Signature move (hypothesis): <one sentence>
- Technological proof (hypothesis): <one sentence>

## Constraints
- Stack: <framework, version>
- Hosting: <provider, region>
- Locales: <pt-BR, en-US, es-ES>
- Accessibility: WCAG 2.2 AA
- Performance: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, JS ≤ 250KB gzip
- Brand assets: <paths / links>
- Legal: <licenses, consent, regulated claims>

## Success
- Primary metric: <conversion, qualified demo, time-to-value>
- Secondary: <scroll completion, return rate, share>
- Instrumentation: <analytics, events, consent mode>
- Definition of done: <review verdict + launch checklist>

## Open questions
- <question> — owner, deadline, default assumption
```

Keep it under one page. If it grows, move detail into `DESIGN.md`.

## 4. Machine config: `.bureau/config.json`

```json
{
  "name": "client-or-project",
  "version": 1,
  "mode": "persuade",
  "stack": "astro",
  "url": "http://localhost:4321",
  "paths": {
    "source": ["src", "public"],
    "design": "DESIGN.md",
    "brief": "BUREAU.md"
  },
  "viewports": [
    { "name": "mobile", "width": 390, "height": 844, "dpr": 3 },
    { "name": "tablet", "width": 768, "height": 1024, "dpr": 2 },
    { "name": "laptop", "width": 1440, "height": 900, "dpr": 1 },
    { "name": "wide", "width": 1920, "height": 1080, "dpr": 1 }
  ],
  "budgets": {
    "lcpMs": 2500,
    "inpMs": 200,
    "cls": 0.1,
    "jsKbGzip": 250,
    "heroMediaKb": 1500
  },
  "review": {
    "pass": 82,
    "award": 90,
    "conditional": 72
  },
  "locales": ["pt-BR", "en-US", "es-ES"],
  "figma": {
    "fileKey": null,
    "mcp": "https://mcp.figma.com/mcp",
    "variablesPath": "design/figma-variables.json"
  }
}
```

The scripts read this file. If it is absent, they use defaults and tell you.

## 5. Evidence inventory

At intake, list what exists and what must be created. Never assume.

| Asset | Status | Owner | Notes |
|---|---|---|---|
| Logo (SVG, mono, inverse) | | | |
| Product UI screenshots | | | |
| Photography / video | | | licensing |
| Real testimonials | | | consent |
| Metrics / certifications | | | source |
| Font licenses | | | web/embedding |
| Brand guidelines | | | |
| Analytics / consent | | | |

Anything missing becomes a **designed placeholder** that is clearly non-credible on staging and removed before launch. Do not invent the missing truth.

## 6. Redesigns

For an existing product:

- Preserve **product truth, content, function, constraints, and explicit brand commitments**.
- Treat the old look as **evidence of what the subject is**, not authority over what it becomes.
- Inventory what users depend on (navigation labels, URLs, forms, keyboard flows) before changing them.
- Distinguish **redesign** (replace the visual world) from **polish** (improve within the world). Do not smuggle a redesign into a polish request.
- Keep a before/after evidence set: same viewport, same content, same state.

## 7. Config for multi-surface projects

If the project has marketing + product, create one config per surface:

```
.bureau/
  config.json            # marketing
  surfaces/
    app.json
    docs.json
```

Each surface declares its own mode, budgets, and review. The Tribunal can pass one and fail another. Never average a login screen and a campaign page into a single score.

## 8. Definition of ready

Gate 0 passes when:

- `BUREAU.md` exists with sourced proof and explicit non-goals.
- Mode, signature move hypothesis, and technological proof hypothesis are named.
- Constraints are concrete.
- The evidence inventory is honest.
- At least one real content source exists (product, founder, data, archive).

If any of these is missing, the right move is to ask one precise question or make one explicit assumption—not to start coding.
