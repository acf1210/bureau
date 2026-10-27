# 38 — Open font sources

`04-typography.md` decides the pairing, the roles and the scale. This file lists where to find open-licence type, which foundries publish it, and how to check a file before it ships. A typeface is chosen for its voice in the concept, never because it was first in a directory; Inter as display (BS-T02) and the default AI pairing (BS-T01) are the tells this list should help you avoid.

## 1. Rules for every font

| Do | Never |
|---|---|
| Choose the face from the concept and the specimen test in `04` §1, then look for a source | Pick by popularity or a directory's front page |
| Read the licence in the downloaded files (OFL, Apache, UFL or the foundry's own) on the day of download | Assume "free" means open, or that a web font may be self-hosted |
| Self-host WOFF2, subset to the languages you publish, preload the display face, `font-display: swap` | Hotlink a third-party font CDN on the critical path |
| Record each family in `BUREAU.md`: source, version, licence, files shipped | Ship weights and scripts the page does not use |
| Keep the licence text beside the fonts in the build (`site/assets/fonts/*-OFL.txt` is the pattern here) | Rename or modify an OFL font and keep its Reserved Font Name |
| Test PT-BR and ES accents, figures, italics and small caps the design uses | Discover a missing glyph in production |

## 2. Platforms and libraries

Status is what an HTTP request returned on 2026-10-27 (`33` §1: no content collected).

| Source | Strength | Licence to check | Status 2026-10-27 |
|---|---|---|---|
| [Google Fonts](https://fonts.google.com/) ([google/fonts](https://github.com/google/fonts)) | Largest open catalogue, with sources and build files | Per family: 2,016 family folders under `ofl/`, plus `apache/` and `ufl/` | Reached; repository active |
| [Open Foundry](https://open-foundry.com/) | Curated open-source families with in-browser testing | Per family | Reached |
| [Font Library](https://fontlibrary.org/) | Community catalogue of freely licensed fonts | Per family, as each page lists it | Reached |
| [Use & Modify](https://usemodify.com/) | Raphaël Bastide's selection of contemporary, unusual open faces | Per family; follow each link to its own licence | Reached |

## 3. Open-source foundries

| Foundry | Strength | Licence to check | Status 2026-10-27 |
|---|---|---|---|
| [The League of Moveable Type](https://www.theleagueofmoveabletype.com/) | Early open-source foundry; League Gothic, Raleway's first release | OFL per family ([theleagueof](https://github.com/theleagueof) on GitHub) | Reached; League Gothic last pushed 2023-11-24 |
| [Velvetyne Type Foundry](https://velvetyne.fr/) | Experimental and artistic open faces | Per family | Home and `/fonts/` redirected to a strike-support page; catalogue not reached |
| [Collletttivo](https://www.collletttivo.it/) | Open collective publishing free families | Per family | Reached |
| [Omnibus-Type](https://www.omnibus-type.com/) | Latin American foundry: Archivo (this site's face), Chivo, Asap | OFL-1.1 on GitHub ([Omnibus-Type](https://github.com/Omnibus-Type)) | Reached |
| [Tunera Type Foundry](https://www.tunera.xyz/) | Small collaborative catalogue | OFL stated by the foundry; confirm in each download | Reached |

Montserrat is often credited to Omnibus-Type; its repository is [JulietaUla/Montserrat](https://github.com/JulietaUla/Montserrat) (Julieta Ulanovsky, OFL-1.1).

## 4. Individual families

| Family | Use | Licence | Note |
|---|---|---|---|
| [Inter](https://github.com/rsms/inter) (Rasmus Andersson) | Screen UI text, tabular figures, many OpenType features | OFL-1.1 | Body or UI only when justified; as display it is BS-T02 |
| [Fira Code](https://github.com/tonsky/FiraCode) | Code with programming ligatures (`=>`, `!=`) | OFL-1.1 | Ligatures change how code reads; offer them, do not force them in tutorials |
| [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono) | Code and labels; this site's mono | OFL-1.1 | Last pushed 2025-01-31 |
| [Source Sans 3](https://github.com/adobe-fonts/source-sans), [Source Serif 4](https://github.com/adobe-fonts/source-serif), [Source Code Pro](https://github.com/adobe-fonts/source-code-pro) (Adobe) | A sans, serif and mono designed together | OFL-1.1 | Source Sans Pro and Source Serif Pro were renamed to Source Sans 3 and Source Serif 4 |
| [Gentium](https://github.com/silnrsi/font-gentium), [Charis](https://github.com/silnrsi/font-charis) (SIL) | Extended Latin, Greek and Cyrillic for multilingual text | OFL-1.1 | SIL also maintains the OFL itself (§5) |

## 5. Licence and quality tools

| Tool | Use | Note |
|---|---|---|
| [SIL Open Font License](https://openfontlicense.org/) | The licence text and FAQ: use, embed, modify and redistribute; no selling the font alone; Reserved Font Names | Read the FAQ before modifying or subsetting under a new name. SIL's own families: [software.sil.org/fonts](https://software.sil.org/fonts/) |
| [FontBakery](https://github.com/fonttools/fontbakery) | Command-line quality checks on font files: metadata, outlines, licence fields, vertical metrics | Moved from `googlefonts/fontbakery` to `fonttools/fontbakery`; Apache-2.0. Run it before publishing a font of your own or patching one |

## 6. Pre-production: find

1. Write the voice in one line from the concept (`02`) and the role of each face (`04` §2).
2. Shortlist three candidates from two sources; set the `04` §1 test (96 px headline, 16 px paragraph, 12 px label, figures, accents) in each.
3. Check the files for the axes and features the design uses: weights, width, italic, small caps, tabular figures.
4. Read the licence in the download; record it in `BUREAU.md`.

## 7. Post-production: verify

| Check | Gate | Pass when |
|---|---|---|
| Licence on record and licence file shipped beside the fonts | G8 | Every family recorded; OFL text present |
| Only used weights, axes and subsets ship | G6 | WOFF2, subsets match the published languages, display face preloaded |
| No reflow when the face arrives | G6 | Metric-matched fallback (`size-adjust`, ascent and descent overrides); CLS ≤ 0.1 |
| Glyph coverage | G3 | PT-BR, EN and ES text renders without fallback glyphs |
| Readability at the real sizes | G7 | 16 px minimum for prose, 12 px for labels; 200 % zoom holds |
| No default-pairing tell | G3 | `audit.mjs` shows no BS-T01 or BS-T02 |

## Limits

Catalogues, licences and statuses above were read on 2026-10-27; families are renamed, moved and relicensed (Source Sans, FontBakery in this list). The licence in the downloaded files is the record, not this summary, and this file is not legal advice. An open font is a material: the voice comes from how it is set.
