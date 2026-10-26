# Figma samples

Two export shapes are supported by `scripts/figma-sync.mjs`:

| File | Shape | Source |
|---|---|---|
| `tokens.figma.sample.json` | Tokens Studio sets (`global`, `light`, `dark`) with `{value,type}` leaves | Tokens Studio / Figma Variables plugin |
| `variables.sample.json` | Figma Variables array with `name`, `resolvedType`, `valuesByMode` | Figma REST or plugin export |

## Commands

```bash
# Tokens Studio or DTCG
node scripts/figma-sync.mjs \
  --in skill/assets/figma/tokens.figma.sample.json \
  --out design/tokens.json \
  --mode light

# Figma Variables export
node scripts/figma-sync.mjs \
  --in skill/assets/figma/variables.sample.json \
  --out design/tokens.json \
  --mode light

# Then generate CSS + contrast
node scripts/tokens.mjs \
  --in design/tokens.json \
  --out-dir src/styles \
  --check
```

## Rules

- Map variables by **role** (`color/ground`, `space/4`), not by hex.
- Keep one source of truth per surface. If code is the source after build, update Figma from code.
- Do not export screenshots as tokens. Use the MCP or a variables export.
- Figma Variables REST may require the `file_variables:read` scope and a paid plan; if unavailable, export JSON from the plugin.
- The sync script resolves `{alias.path}` references and reports unresolved aliases.
