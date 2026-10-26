/**
 * BUREAU reveal — IntersectionObserver, reduced-motion safe.
 * Add [data-reveal] to elements. Add .is-visible styles in your CSS.
 */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const items = [...document.querySelectorAll("[data-reveal]")];
  if (!items.length) return;

  if (reduce.matches || !("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });

  items.forEach((el) => io.observe(el));
})();
