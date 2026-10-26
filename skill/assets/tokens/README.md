# Tokens

`tokens.json` is the BUREAU reference system: Cloud Dancer-inspired ground, warm ink, vermilion accent, OKLCH conversion, fluid type, spacing, radius, duration and easing.

## Generate

```bash
node scripts/tokens.mjs --in skill/assets/tokens/tokens.json --out-dir src/styles --check
```

Outputs:

- `tokens.css` — CSS custom properties, hex plus OKLCH override;
- `tokens.tailwind.css` — Tailwind CSS v4 `@theme` block;
- `tokens.normalized.json` — DTCG normalized;
- `contrast.md` — role-based contrast report.

## Shape

W3C DTCG:

```json
{
  "color": {
    "ground": { "$type": "color", "$value": "#F0EEE9" }
  },
  "space": {
    "4": { "$type": "dimension", "$value": 16 }
  }
}
```

Tokens Studio (`value`/`type`) and flat JSON are also accepted. Aliases use `{color.ground}`.

## Rules

- Name by role, not by value.
- Keep 5–7 color roles; no orphan hex in components.
- Contrast must pass AA in every state.
- Dark mode is recomputed, not inverted.
- Prefer OKLCH for scales; keep hex fallbacks for critical colors.
