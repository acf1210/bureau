# 36 — Stock photo and video sources

`10-imagery-art.md` and `09-video-parallax.md` decide what an image or a clip must do. This file lists where to find one when the project has no commissioned shoot, and how to keep the result specific and licensed. Stock is a material, not a direction: an image chosen before its brief is stock-photo drift, and a stranger's face presented as a customer is fabricated proof (P0, BS-W05).

## 0. The hierarchy and the record

Stock sits at level 2 of the media hierarchy in `39-realism-engine.md`, below an original shoot and above photoreal generation. Before searching, exhaust the project's own photography: a real, imperfect image of the actual subject beats a perfect stock scene of a fictional one.

Every downloaded file is recorded twice:

- `data-license` on the `<img>` or `<video>` (source, licence, date).
- `.bureau/media/provenance.json`, the machine-readable record the realism audit reads.

The audit checks that the attribute or the record exists (`BS-R05`, `BS-R06`). It cannot judge whether the licence actually covers the use; that is a human check at Gate 8.

## 1. Rules for every asset

| Do | Never |
|---|---|
| Write the image or video brief first (`10` §1, `09` §2), then search | Pick the first result for the category noun ("team", "office", "technology") |
| Download the file, host it with the build, serve responsive sources | Hotlink, or use random endpoints such as `source.unsplash.com` (BS-I02) |
| Record each asset in `BUREAU.md`: source, asset page URL, author, licence name and URL, date, attribution text if required | Assume "free" means no conditions |
| Read the licence on the day you download; keep the asset page URL | Rely on the summary in this file, which is a record of one day |
| Use people images only as scene or atmosphere | Present a stock person as a customer, employee, author or testimonial |
| Check model and property release for commercial use of recognisable people, brands and private places | Use an editorial-only file to sell a product |
| Grade every asset into the palette and crop it to the composition | Ship it as downloaded beside commissioned work |

## 2. Photo sources

Status is what an HTTP request to the source returned on 2026-10-27 (`33-reference-acquisition.md` §1: no content collected, no protection bypassed). "Bot wall" means the site refused an automated request, which says nothing about availability to a person.

| Source | Strength | Licence to check | Status 2026-10-27 |
|---|---|---|---|
| [Unsplash](https://unsplash.com/license) | Art-directed, less staged photography | Unsplash License | Bot wall (401) |
| [Pexels](https://www.pexels.com/license/) | Photos and short videos in one library | Pexels License | Reached |
| [Pixabay](https://pixabay.com/service/license-summary/) | Photos, illustrations and vectors | Pixabay Content License | Bot wall (403) |
| [Freepik](https://www.freepik.com/) | Large volume of vectors, photos and templates | Free tier requires attribution; read the terms | Home: bot wall (403). Its terms URL redirected to magnific.com |
| [Burst](https://www.shopify.com/stock-photos) (Shopify) | Retail and commerce scenes | Burst licence on each page | `burst.shopify.com` redirects to shopify.com/stock-photos; the old licence URL returned 404 |
| [StockSnap](https://stocksnap.io/license) | Sorts by views and downloads | StockSnap licence (CC0-based) | Reached |
| [Rawpixel](https://www.rawpixel.com/services/licenses) | Everyday scenes, diverse people, public-domain collections | Per item: public domain, free or premium | Reached |
| [Canva](https://www.canva.com/policies/content-license-agreement/) | Layout tool with a built-in library | Content License Agreement: media is licensed for use inside designs; read the limits on standalone use | Reached |
| [Kaboompics](https://kaboompics.com/) | Complete shoots with their colour palettes | Kaboompics licence | Home reached; `/license` returned 404, find the current page |
| ~~Reshot~~ | Was: non-cliché photos, icons, illustrations | — | **Retired**: redirects to Envato's "Reshot retiring" notice. Do not use |
| [Picjumbo](https://picjumbo.com/) | Precise categories for articles and long reads | Free and premium tiers | Home reached; `/license/` returned 404 |
| [Gratisography](https://gratisography.com/license/) | Eccentric, humorous images for bold campaigns | Gratisography licence | Reached |
| [Life of Pix](https://www.lifeofpix.com/) | Textures, urban scenes, technical rigour | Life of Pix terms | Reached |
| [ISO Republic](https://isorepublic.com/license/) | Business scenes, plus free videos | ISO Republic licence | Reached |
| [Wikimedia Commons](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia) | Documentary and historical material | Per file: public domain or a CC licence; attribution usually required | Reached |

## 3. Video sources

| Source | Strength | Licence to check | Status 2026-10-27 |
|---|---|---|---|
| [Pexels Video](https://www.pexels.com/videos/) | Curated contemporary clips | Pexels License | Reached |
| [Pixabay Video](https://pixabay.com/videos/) | Large library, 4K, motion graphics | Pixabay Content License | Bot wall (403) |
| [Mixkit](https://mixkit.co/license/) (Envato) | Clips, transitions, effects; no account | Mixkit licences differ by item type | Reached |
| [Coverr](https://coverr.co/license) | Cinematic clips sized for web backgrounds | Coverr licence | Reached |
| Videvo | Was: clips under several licences | — | `videvo.net` redirects to freepik.com/videos; treat as Freepik |
| [Videezy](https://www.videezy.com/) | Aerial and HD footage from a contributor community | Some free items require attribution | Reached |
| Mazwai | Was: narrative clips by independent filmmakers | — | `mazwai.com` redirects to freepik.com/videos; treat as Freepik |
| [Dareful](https://dareful.com/) | 4K landscapes and drone shots | Dareful licence | Reached |
| Life of Vids | Textures, urban and office scenes | — | **No response** (connection failed twice); treat as unavailable |
| [SplitShire](https://www.splitshire.com/) | One author's consistent photos and videos | SplitShire licence | Reached |
| [Vidsplay](https://www.vidsplay.com/) | Generic clips for quick edits | Vidsplay terms | Reached |
| [Clipstill](https://www.clipstill.com/) | Cinemagraphs: one element moves, the rest is still | Clipstill terms | Reached; confirm free items still exist |
| [Vimeo groups](https://vimeo.com/groups/freehd) | Free clips shared by filmmakers | Per video: read the licence on the video page; many are not free for commercial use | Reached |
| [Pond5 public domain](https://www.pond5.com/free) | Historical and public-domain archive | Public domain per item; verify the claim for each file | Bot wall (403) |
| [MotionElements free](https://www.motionelements.com/free) | Post-production elements, UI animations, abstract loops | MotionElements free licence | Reached |

## 4. Pre-production: find

1. Write the brief: job (`10` §1), lens, light, palette, composition, exclusions.
2. Search two or three sources whose strength matches the job; save candidates as comps, labelled `placeholder` until the licence is recorded.
3. Reject clichés on sight (`10` "AI tells", `09` §10, `17` BS-I06): handshake, high-five, laptop on a desk with coffee, a person smiling at the camera.
4. Prefer a series from one shoot (Kaboompics, SplitShire, a Rawpixel collection) over single images from many authors: one light and one lens read as a world.
5. Extract each candidate's palette with Color Thief (`34` §2) and keep only those that sit inside the world or can be graded into it.

## 5. Post-production: verify

| Check | Gate | Pass when |
|---|---|---|
| Every shipped asset has a licence record in `BUREAU.md` and, where required, a visible attribution | G8 | No asset without a source, author and licence URL |
| No stock person stands in for a real customer, team member or quote | G8 | Zero, or the asset is removed (P0) |
| Graded and cropped to the composition | G3, G4 | Colour Thief check in `34` §3; no image looks pasted |
| Encoded and sized | G6 | Responsive sources and dimensions (`10` §4); video ladder, poster and pause (`09` §3–4); hero media ≤ 1.5 MB |
| Accessible | G7 | Purposeful `alt`; decorative video muted, pausable, `aria-hidden` when it carries no meaning |

## Limits

Statuses and licence names above were observed on 2026-10-27 and change without notice: platforms are sold, merged and retired (Reshot, Videvo, Mazwai in this list). A licence summary is not legal advice; the asset page on the day of download is the record. Stock rarely makes a page ownable: when the image is the signature move, commission it or generate it under `10` §2, and say which.
