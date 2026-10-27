# 37 — Logo sources

`10-imagery-art.md` decides what an image or icon must do; `18-copy-and-truth.md` decides what a page may claim. This file lists where to find third-party logo files (technology marks, social links, integrations) and placeholder marks for comps, and how to keep their use licensed and true. A file licence covers the drawing, not the trademark: a brand's logo stays its owner's mark whatever licence the repository carries. A customer, partner or press logo shown without permission is fabricated proof (BS-I05, G8).

## 1. Rules for every logo

| Do | Never |
|---|---|
| Decide the job first: stack or "works with" row, social links, integration list, docs, or the project's own identity | Add a logo bar because the template had one (BS-C14) |
| Use a third-party mark only to identify that product, as its owner's guidelines allow (clear space, colour, no redrawing) | Recolour, stretch, crop or combine another company's mark beyond its guidelines |
| Show customer, partner or press logos only with written permission, recorded in `BUREAU.md` | Imply endorsement, affiliation or customers you do not have |
| Download the SVG, optimise it and ship it with the build; record source, file URL, licence and date | Hotlink a CDN or badge API at runtime when a static file will do |
| Draw a row of marks from one source, at one optical size and one treatment (all monochrome or all colour) | Mix Simple Icons outlines, Devicon colour tiles and Font Awesome glyphs in one row |
| Use placeholder marks only in comps labelled `placeholder` | Ship a placeholder or invented company logo (BS-W04, BS-I05) |
| Design the project's own logo as part of the concept (`02`, `03`), or claim a free logo made for that purpose (§3) | Use an icon from an icon library as the project's logo |

## 2. Brand and technology collections

Size is what was counted in each repository on 2026-10-27 (SVG files in the named folder). Licence is the repository's licence file on that day; it applies to the files, never to the marks they depict.

| Source | Strength | Size 2026-10-27 | Licence of the files | Note |
|---|---|---|---|---|
| [Simple Icons](https://github.com/simple-icons/simple-icons) | Monochrome single-path brand icons, each with the brand's HEX in its data | 3,467 SVGs in `icons/` | CC0-1.0 | The default for a uniform row of brand marks |
| [Logos Apps](https://github.com/ln-dev7/logos-apps) | Apps, developer tools, cloud and AI brands | 15,017 SVGs in `logos/` | MIT for code and site only | Its licence states the MIT grant does **not** apply to the logo files: read the owner's guidelines |
| [Devicon](https://github.com/devicons/devicon) | Languages, frameworks and tools in colour, plain, line and wordmark variants | 657 technology folders in `icons/` | MIT | Stack and docs pages |
| [gilbarbara/logos](https://github.com/gilbarbara/logos) | Full-colour logos of tech companies, SaaS, databases and web services | 2,045 SVGs in `logos/` | CC0-1.0 | Colour marks for "built with" sections |
| [SVGL](https://github.com/pheralb/svgl) | Modern web ecosystem logos with light and dark variants | 1,115 SVGs in `static/library/` | MIT | Check each mark has the variant your ground needs |
| [Super Tiny Icons](https://github.com/edent/SuperTinyIcons) | Brand and social logos optimised for weight | 479 SVGs in `images/svg/`, largest 1,013 bytes | MIT | Footers and share links where bytes matter |
| [Skill Icons](https://github.com/tandpfun/skill-icons) | Tool logos inside uniform rounded tiles | 402 SVGs in `icons/` | MIT | A strong house style of its own: use it only if the tile fits the world. Download; do not depend on the skillicons.dev API |
| [Cryptocurrency Icons](https://github.com/spothq/cryptocurrency-icons) | Coins and tokens in colour, black, white and icon styles | 483 SVGs in `svg/color/` | CC0-1.0 | Last push 2024-08-19: newer tokens are missing |

## 3. Free logos and placeholders

| Source | Use | Licence to check | Note |
|---|---|---|---|
| [Libre Logos](https://github.com/enjeck/libre-logos) | Original logos an active open-source project or a registered NGO can claim as its identity | CC0 for logos, MIT for the site code | Claimed through an issue; once granted, copyright transfers to the project. Small set: 44 SVG files in the repository on 2026-10-27 |
| [Logoipsum](https://logoipsum.com/license) | Placeholder marks for comps and wireframes before a brand exists | Licence page titled "Fair Use for Placeholder Logos" | Comps only. The detector flags the name in shipped source (BS-W04, P1); a logo bar of invented companies is BS-I05 |
| [Open Source Branding Toolkit](https://github.com/jcklpe/open-source-branding-toolkit) | Guidance on building an open-source project's identity collectively | No licence file | Last push 2019-11-11. Read as background; do not copy its text or files |

## 4. Icon systems and aggregators

| Source | Use | Licence to check | Note |
|---|---|---|---|
| [Iconify](https://github.com/iconify/iconify) | One API and npm packages over many icon sets, Simple Icons among them | MIT for the framework; each icon set keeps its own licence | iconify.design states 300,000 open-source icons on 2026-10-27. Record the set and its licence, not "Iconify". Bundle the icons used instead of fetching them at runtime |
| [Font Awesome Free, Brands](https://github.com/FortAwesome/Font-Awesome) | Social and company glyphs for footers and share links | Icons CC BY 4.0 (SVG, JS), fonts OFL-1.1, code MIT | CC BY needs attribution. Ship only the glyphs used. A fallback, not a concept (`04`) |
| [VectorLogoZone](https://www.vectorlogo.zone/) | Consistently framed SVG logos of companies and B2B tools | Repository: AGPL-3.0; the marks remain their owners' | Read the site's terms per logo |
| [Remix Icon](https://github.com/Remix-Design/RemixIcon) | Neutral UI icons with a brand category drawn in the same stroke | Remix Icon License v1.0 (January 2026): commercial use, attribution optional | Forbids standalone icon sales, competing icon libraries, and use of any icon **as a logo, trademark or brand identifier** |

## 5. Pre-production: find

1. Write the job: which marks, why the reader needs them, where they sit, on which ground.
2. List the products truthfully: the stack you actually use, the integrations that exist, the customers who agreed in writing.
3. Pick one source whose drawing fits the world: Simple Icons for a quiet monochrome row, gilbarbara or Devicon for colour, SVGL when a dark variant is needed.
4. Read each owner's brand guidelines for clear space, minimum size, colour and modification.
5. Record every file in `BUREAU.md` (source, file URL, licence, date, permission where needed); label comps `placeholder` until the record exists.

## 6. Post-production: verify

| Check | Gate | Pass when |
|---|---|---|
| Every customer, partner or press logo has written permission on record | G8 | Zero logos without it; an invented or unapproved logo is removed (P0) |
| No placeholder or invented company mark ships | G8 | `audit.mjs` shows no BS-W04 or BS-I05 |
| A row reads as one set | G4 | One source, one optical size, one treatment; marks aligned by optical centre, not bounding box |
| Marks survive their ground | G3 | Light and dark variants checked; non-text contrast ≥ 3:1 where the mark carries meaning |
| Accessible names | G7 | A logo image has the brand name as `alt`; an icon-only link has an accessible name ("GitHub"); a decorative mark beside its name is `alt=""` |
| Weight | G6 | Inline or sprite only the marks used; SVGs optimised; no runtime icon API on the critical path |
| Licence record and attribution | G8 | Every file recorded; CC BY attribution present where required |

## Limits

Counts, licences and statuses above were read on 2026-10-27 and change without notice. A repository licence is not a trademark licence, and this file is not legal advice; the owner's brand guidelines and the licence on the day of download are the record. A wall of logos rarely makes a page ownable: show the marks the reader needs, and let the work carry the proof.
