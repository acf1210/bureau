/* @bureau-internal — the landing's proof: the detector's own regex rules, applied to a page source the way audit.mjs applies them */
const HTML_TEXT_RULES = true;

const maskHtml = (content) => {
  const blank = (s) => s.replace(/[^\n]/g, " ");
  return content
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, blank)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, blank)
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

const lineOf = (text, index) => { let n = 1; for (let i = 0; i < index; i++) if (text.charCodeAt(i) === 10) n++; return n; };

// One finding per rule: its first match and line, as the CLI reports them.
export function proof(source, rules) {
  const masked = HTML_TEXT_RULES ? maskHtml(source) : source;
  const marks = [];
  for (const rule of rules) {
    const target = rule.textOnly ? masked : source;
    const flags = rule.pattern.flags.includes("g") ? rule.pattern.flags : rule.pattern.flags + "g";
    const m = new RegExp(rule.pattern.source, flags).exec(target);
    if (m) marks.push({ id: rule.id, severity: rule.severity, title: rule.title, category: rule.category, line: lineOf(target, m.index) });
  }
  const order = { p0: 0, p1: 1, p2: 2 };
  return marks.sort((a, b) => order[a.severity] - order[b.severity] || a.line - b.line);
}
