/**
 * BUREAU view transitions — progressive enhancement.
 * Use navigate("/next") instead of location.href for same-origin links.
 * Falls back to a normal navigation in browsers without support.
 */
export async function navigate(url) {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !document.startViewTransition) {
    location.href = url;
    return;
  }
  await document.startViewTransition(async () => {
    const res = await fetch(url, { headers: { "X-Requested-With": "bureau-transition" } });
    if (!res.ok) { location.href = url; return; }
    const html = await res.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    document.title = doc.title;
    const next = doc.querySelector("main");
    const current = document.querySelector("main");
    if (next && current) current.replaceWith(next);
    else location.href = url;
    const meta = doc.querySelector('meta[name="description"]');
    if (meta) document.querySelector('meta[name="description"]')?.setAttribute("content", meta.content);
  });
}

/* Optional CSS:
::view-transition-old(root) { animation: bureau-out 180ms ease both; }
::view-transition-new(root) { animation: bureau-in 260ms ease both; }
@keyframes bureau-out { to { opacity: 0; transform: translateY(-8px); } }
@keyframes bureau-in { from { opacity: 0; transform: translateY(8px); } }
*/
