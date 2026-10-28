/* @bureau-internal — excluded from design audits */
/**
 * BUREAU realism checks.
 *
 * The mechanical subset of "Realism First": media presence, media provenance,
 * poster frames, stock-media licences and decorative vector/gradient/blur
 * habits. Photographic quality itself is judged by a human on rendered
 * screenshots and frames (references/41-media-validation.md); no regex is
 * allowed to pretend it can see.
 */

import fs from "node:fs";
import path from "node:path";

export const REALISM_RULE_IDS = ["BS-R01", "BS-R02", "BS-R03", "BS-R04", "BS-R05", "BS-R06"];

export const STOCK_HOSTS = [
  "images.unsplash.com",
  "images.pexels.com",
  "cdn.pixabay.com",
  "media.istockphoto.com",
  "images.gettyimages.com",
  "cdn.shopify.com",
  "videos.pexels.com",
  "cdn.coverr.co"
];

const MEDIA_TAG = /<(img|video|picture|source)\b[^>]*>/gi;

function tagAttr(tag, name) {
  const re = new RegExp(`\\b${name}\\s*=\\s*("[^"]*"|'[^']*'|[^\\s>]+)`, "i");
  const m = tag.match(re);
  return m ? m[1].replace(/^["']|["']$/g, "") : null;
}

function lineOf(source, index) {
  return String(source).slice(0, Math.max(0, index)).split(/\r?\n/).length;
}

function isScaffold(html) {
  return /<html\b[^>]*\bdata-scaffold\s*=\s*["']true["']/i.test(html);
}

function cssSource(scanned) {
  return scanned
    .filter((s) => s.ext === ".css" || /<style\b/i.test(s.content || ""))
    .map((s) => s.content || "")
    .join("\n");
}

function mediaTags(html) {
  return [...html.matchAll(MEDIA_TAG)].map((m) => ({ tag: m[0], index: m.index || 0, name: m[1].toLowerCase() }));
}

function hasRasterMedia(html) {
  return /<(?:img|video|picture)\b/i.test(html);
}

function largeVector(html) {
  for (const m of html.matchAll(/<svg\b[^>]*>/gi)) {
    const tag = m[0];
    const width = Number(tagAttr(tag, "width") || 0);
    const height = Number(tagAttr(tag, "height") || 0);
    const viewBox = tagAttr(tag, "viewBox");
    const decorative = tagAttr(tag, "aria-hidden") === "true" || /role\s*=\s*["']presentation["']/i.test(tag);
    const labelled = tagAttr(tag, "aria-label") || tagAttr(tag, "aria-labelledby");
    const functional = /role\s*=\s*["'](?:img|graphics-(?:document|symbol))["']/i.test(tag) && labelled;
    const hasTitle = /<title\b/i.test(html.slice(m.index || 0, (m.index || 0) + 600));
    if (decorative || functional || hasTitle) continue;
    if (width >= 200 || height >= 200 || (viewBox && width === 0 && height === 0)) return m.index || 0;
  }
  return -1;
}

function provenanceMap(root) {
  const file = path.join(root, ".bureau", "media", "provenance.json");
  try {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    if (!Array.isArray(data.media)) return null;
    return new Map(data.media.map((m) => [m.src, m]));
  } catch {
    return null;
  }
}

function requiresProvenance(root) {
  try {
    const config = JSON.parse(fs.readFileSync(path.join(root, ".bureau", "config.json"), "utf8"));
    return config?.visual_direction?.media_provenance === "required" || config?.creative_execution?.media_provenance === "required";
  } catch {
    return false;
  }
}

/**
 * @param {{file:string, content:string, isHtml:boolean, ext:string}[]} scanned
 * @param {{root?:string}} options
 * @returns {object[]} findings in the audit.mjs shape
 */
export function realismFindings(scanned, options = {}) {
  const root = options.root || process.cwd();
  const findings = [];
  const htmlFiles = scanned.filter((s) => s.content && s.isHtml);
  const css = cssSource(scanned);
  const provenance = provenanceMap(root);
  const provenanceRequired = requiresProvenance(root);

  // R02 and R03 are page-level CSS habits; report once, on the first HTML file.
  // Bundled scaffolds carry data-scaffold and are exempt: they are composition
  // skeletons, and new-project removes the attribute on install.
  const scaffoldProject = htmlFiles.length > 0 && htmlFiles.every((s) => isScaffold(s.content));
  const first = htmlFiles[0];
  if (first && !scaffoldProject) {
    const rel = path.relative(root, first.file) || path.basename(first.file);
    const gradientHero = /(?:^|[},])\s*(?:\.hero|#hero|\[data-hero\])[^{}]*\{[^}]*background(?:-image)?\s*:[^;}]*gradient\(/i.test(css);
    const pageMedia = htmlFiles.some((s) => hasRasterMedia(s.content));
    if (gradientHero && !pageMedia) {
      findings.push({
        id: "BS-R02", severity: "p2", category: "realism",
        title: "Gradient standing in for imagery",
        why: "A hero background gradient with no photograph or film is decorative colour pretending to be art direction.",
        fix: "Art-direct a photograph or film for the hero, or commit to a typographic hero with no image slot.",
        file: rel, line: 1, column: 1, match: "hero background gradient, no media"
      });
    }
    const blurOrb = /(?:^|[},])\s*[^{}]*\{[^}]*filter\s*:\s*blur\(\s*(?:[4-9]\d|\d{3,})px\s*\)[^}]*\}/i.test(css)
      && /border-radius\s*:\s*(?:50|9999)px|border-radius\s*:\s*50%|clip-path\s*:\s*circle/i.test(css);
    if (blurOrb) {
      findings.push({
        id: "BS-R03", severity: "p2", category: "realism",
        title: "Blurred orb as decoration",
        why: "A large blurred circle is the stock substitute for lighting, material or a subject.",
        fix: "Replace it with a lit subject, a real material or a typographic composition that needs no prop.",
        file: rel, line: 1, column: 1, match: "filter:blur + circular element"
      });
    }
  }

  for (const s of htmlFiles) {
    const html = s.content;
    const rel = path.relative(root, s.file) || path.basename(s.file);
    const scaffold = isScaffold(html);

    // BS-R01: a finished page whose only imagery is a large inline vector.
    if (!scaffold && !hasRasterMedia(html)) {
      const index = largeVector(html);
      if (index >= 0) {
        findings.push({
          id: "BS-R01", severity: "p2", category: "realism",
          title: "Vector illustration carrying the page",
          why: "There is no photograph or film, and a large inline SVG is doing the work of imagery.",
          fix: "Commission or license a photograph or film. Keep SVG for logos, icons and diagrams.",
          file: rel, line: lineOf(html, index), column: 1, match: "<svg> with no raster media"
        });
      }
    }

    // BS-R04: a film with no poster frame starts as a black rectangle.
    for (const { tag, index } of mediaTags(html)) {
      if (tag.toLowerCase().startsWith("<video") && /\bautoplay\b/i.test(tag) && tagAttr(tag, "poster") === null) {
        findings.push({
          id: "BS-R04", severity: "p1", category: "realism",
          title: "Autoplaying film without a poster frame",
          why: "Before the first frame decodes the hero is a black or transparent rectangle; the first paint is not art-directed.",
          fix: "Add a poster frame from the film itself (or a still from the same setup) and preload it.",
          file: rel, line: lineOf(html, index), column: 1, match: tag.slice(0, 120)
        });
      }

      // BS-R05: stock media without a recorded licence.
      if (tagAttr(tag, "data-license") === null) {
        const src = tagAttr(tag, "src") || "";
        const host = STOCK_HOSTS.find((h) => src.includes(h));
        if (host) {
          findings.push({
            id: "BS-R05", severity: "p1", category: "realism",
            title: "Stock media without a licence record",
            why: `${host} media ships without data-license, so the right to publish it is unrecorded.`,
            fix: "Record the licence (source, licence, URL, date) in data-license and .bureau/media/provenance.json.",
            file: rel, line: lineOf(html, index), column: 1, match: src.slice(0, 120)
          });
        }
      }

      // BS-R06: provenance required by the project config.
      if (provenanceRequired) {
        const src = tagAttr(tag, "src") || "";
        const inline = tagAttr(tag, "data-provenance");
        const recorded = inline || (provenance && provenance.has(src));
        if (src && !recorded) {
          findings.push({
            id: "BS-R06", severity: "p2", category: "realism",
            title: "Media without provenance",
            why: "The project requires provenance for every image and film, and this source has none.",
            fix: "Add data-provenance, or list the source in .bureau/media/provenance.json with owner and licence.",
            file: rel, line: lineOf(html, index), column: 1, match: src.slice(0, 120)
          });
        }
      }
    }
  }

  return findings;
}
