/**
 * BUREAU magnetic — subtle pointer attraction for buttons/links.
 * Mark [data-magnetic] and optionally data-strength (default 0.18).
 * Pointer-fine only; disabled for touch and reduced motion.
 */
(() => {
  const fine = matchMedia("(pointer: fine)");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (!fine.matches || reduce.matches) return;

  for (const el of document.querySelectorAll("[data-magnetic]")) {
    const strength = Number(el.dataset.strength || 0.18);
    const max = 12;
    let raf = 0;
    let tx = 0, ty = 0, cx = 0, cy = 0;

    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(tick);
    };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-max, Math.min(max, (e.clientX - (r.left + r.width / 2)) * strength));
      ty = Math.max(-max, Math.min(max, (e.clientY - (r.top + r.height / 2)) * strength));
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const reset = () => {
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", reset);
    el.addEventListener("blur", reset);
  }
})();
