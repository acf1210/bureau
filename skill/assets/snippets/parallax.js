/**
 * BUREAU parallax — transform-only, capped, reduced-motion safe.
 * Mark layers with [data-parallax] and an optional data-speed (default 0.08).
 * Cap displacement to a fraction of the viewport to avoid the elevator effect.
 */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const layers = [...document.querySelectorAll("[data-parallax]")];
  if (!layers.length || reduce.matches) return;

  let raf = 0;
  const update = () => {
    raf = 0;
    const vh = innerHeight;
    for (const el of layers) {
      const speed = Number(el.dataset.speed || 0.08);
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - vh / 2;
      const max = vh * 0.08;
      const shift = Math.max(-max, Math.min(max, -center * speed));
      el.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    }
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule);
  update();
})();
