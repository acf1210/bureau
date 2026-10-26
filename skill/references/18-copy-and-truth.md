# 18 — Copy, Voice, and Truth

Design is an argument; copy is the argument's spine. A beautiful page with generic words is a beautiful empty room.

## 1. Voice

Define three axes:

| Axis | Range | Example |
|---|---|---|
| **Distance** | intimate ↔ institutional | "We'll answer by 4pm." vs "The organisation responds within one business day." |
| **Temperature** | warm ↔ cold | "Here's the messy part." vs "Technical constraints apply." |
| **Authority** | peer ↔ expert | "We've done this 40 times." vs "The standard specifies..." |

Pick one position per axis. Write it in `BUREAU.md`. Every line of copy must sit inside the triangle.

### Voice test

Read the page aloud. Would the same person say all of it? If the hero sounds like a poet and the pricing sounds like a compliance memo, the voice is broken.

## 2. Headlines

A headline has one job: make the next line inevitable.

### Structures that work

- **Mechanism**: "Every invoice clears in 12 minutes, not 3 days."
- **Contradiction**: "The fastest way to scale is to say no."
- **Specific promise**: "A brand system your engineers will actually use."
- **Enemy**: "Stop shipping dashboards nobody opens."
- **Proof first**: "37,000 shipments. Zero lost pallets."
- **Question with stakes**: "What happens when the auditor asks for the trail?"
- **Instruction**: "Read the contract before you sign it."

### Structures to avoid

- "Empower your business with AI"
- "The future of [category]"
- "Unlock the power of [noun]"
- "Reimagine [noun]"
- "Built for teams who [generic verb]"
- Two abstract nouns joined by "and"

### The specificity ladder

```
Level 0: "We help businesses grow."
Level 1: "We help B2B companies grow."
Level 2: "We help B2B SaaS companies grow revenue."
Level 3: "We help B2B SaaS companies cut churn in the first 90 days."
Level 4: "We cut first-90-day churn for B2B SaaS with a 6-week onboarding rebuild."
Level 5: "We cut first-90-day churn for B2B SaaS by rebuilding onboarding; median result: −31% in 6 weeks (n=24)."
```

Ship at level 4 or 5. Level 0–2 is slop.

## 3. Page structure as an argument

### PERSUADE

1. **Hook** — the specific promise or tension.
2. **Stakes** — what happens if nothing changes.
3. **Mechanism** — how it works, in 3 steps or one diagram.
4. **Proof** — real evidence, named.
5. **Objection** — price, risk, switching cost, security.
6. **Close** — the action, with what happens next.

### OPERATE

1. What this screen is for.
2. The primary task.
3. Context and constraints.
4. Recovery (undo, cancel, help).
5. Exit.

### READ

1. The question the reader came with.
2. The answer in the first paragraph.
3. The reasoning, with evidence.
4. The caveats.
5. What to do next.

### EXPERIENCE

1. Invitation.
2. World.
3. Escalation.
4. Revelation.
5. Return.

## 4. Microcopy

Microcopy is where trust is won or lost.

| Element | Rule | Example |
|---|---|---|
| Button | Verb + object; no "Submit" | "Book the audit", "Send the brief" |
| Form label | What, not "Enter" | "Work email" |
| Hint | Format or consequence | "We'll reply within one business day." |
| Error | What + why + fix | "That email is missing an @. Try name@company.com." |
| Empty | Why + one action | "No invoices yet. Import your first batch." |
| Loading | What is happening | "Checking 3 sources…" |
| Success | What happened + next | "Brief sent. You'll hear from Ana by 4pm." |
| Destructive | Consequence + escape | "Delete 12 files? This cannot be undone." |
| Cookie | Plain language + equal choices | "Accept analytics" / "Reject" (same visual weight) |
| 404 | Where you are + way back | "This page moved. Try the index or search." |

No "Oops!", no "Whoops!", no "Uh oh!". Calm is credible.

## 5. The truth ledger

Every factual claim gets a row:

| Claim | Where | Source | Status |
|---|---|---|---|
| "Median −31% churn" | Hero stat | 2025 cohort report, n=24 | verified |
| "Used by 4,000 teams" | Social proof | internal CRM | needs date |
| "SOC 2 Type II" | Security | audit letter | verified |
| "99.99% uptime" | Footer | status page | unverified → remove |

Rules:

- No source → no claim.
- Date every metric.
- Define the denominator ("4,000 teams" = paying accounts? active? ever?).
- Logos need permission.
- Testimonials need a real person, real words, consent.
- Awards need the exact award and year.
- "AI" claims need a mechanism ("a retrieval model cites the paragraph"), not a vibe.

## 6. SEO without slop

### Title and description

```html
<title>BUREAU — Design bureau for ambitious web experiences</title>
<meta name="description" content="Concept, art direction, motion and engineering for sites that cannot look generic. Nine-gate review, Playwright evidence, accessibility and performance built in.">
```

- Title ≤ 60 characters; description ≤ 155.
- One `<h1>`; headings describe sections, not keywords stuffed.
- URL: short, human, hyphenated.
- Internal links with descriptive anchors.
- Image alt text describes the job.

### Structured data

Use only what is true:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "BUREAU",
  "url": "https://example.com",
  "logo": "https://example.com/logo.svg",
  "sameAs": ["https://github.com/acf1210/bureau"]
}
```

### Multilingual

- `hreflang` for each locale + `x-default`.
- Localized URLs (`/pt-br/`, `/en/`, `/es/`).
- Translated titles/descriptions, not machine dumps.
- `lang` per page and per inline language change.
- Localize dates, numbers, currency, and social proof.

```html
<link rel="alternate" hreflang="pt-BR" href="https://example.com/pt-br/">
<link rel="alternate" hreflang="en-US" href="https://example.com/en/">
<link rel="alternate" hreflang="es-ES" href="https://example.com/es/">
<link rel="alternate" hreflang="x-default" href="https://example.com/en/">
```

## 7. PT-BR, EN-US, ES-ES

Do not translate word-for-word. Rebuild the argument in each language.

- **PT-BR**: direct, warm, slightly conversational. Avoid "empoderar", "solução inovadora", "transformação digital".
- **EN-US**: concrete, active, low-adjective. Avoid "leverage", "seamless", "empower".
- **ES-ES**: clear, formal-but-human. Avoid "potenciar", "solución integral", "revolucionario".
- Keep the same **claims and numbers** across locales. Only the expression changes.
- Test text expansion: ES/PT often run 15–25% longer.
- Use local proof and local spelling (`você` vs `tu`; `ordenador` vs `computadora`).

## 8. CTAs

A CTA names the exchange:

- "Book a 20-minute audit" (time)
- "Get the 12-page teardown" (artifact)
- "Start the 14-day trial — no card" (risk)
- "See the live demo" (proof)
- "Send the brief" (action)

Not: "Learn more", "Get started", "Submit", "Click here".

## 9. Copy review

- [ ] One idea per section.
- [ ] Headline is specific and falsifiable.
- [ ] Every number has a source and a date.
- [ ] No slop lexicon.
- [ ] CTA names the action and the next step.
- [ ] Errors are helpful and calm.
- [ ] Microcopy is consistent ("Sign in" vs "Log in").
- [ ] Locale copy is rebuilt, not machine-translated.
- [ ] Read aloud: it sounds like a person.
- [ ] The page keeps the promise of the brief.

## 10. Gate 8 evidence

- Final copy deck.
- Truth ledger with sources.
- `copy-review.md` with the slop pass.
- Locale screenshots.
- A stranger read: three questions answered.
