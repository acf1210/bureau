(() => {
  const root = document.documentElement;
  const stored = localStorage.getItem("bureau-theme");
  if (stored) root.dataset.theme = stored;

  const theme = document.getElementById("theme");
  if (theme) {
    theme.setAttribute("aria-pressed", String(root.dataset.theme === "light"));
    theme.addEventListener("click", () => {
      const next = root.dataset.theme === "light" ? "dark" : "light";
      root.dataset.theme = next;
      theme.setAttribute("aria-pressed", String(next === "light"));
      localStorage.setItem("bureau-theme", next);
    });
  }

  const sidebar = document.getElementById("sidebar");
  const menu = document.getElementById("menu");
  if (menu && sidebar) {
    menu.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-controls", "sidebar");
    menu.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      menu.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", (e) => {
      if (window.innerWidth > 860) return;
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !menu.contains(e.target)) sidebar.classList.remove("open");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") sidebar.classList.remove("open");
    });
  }

  const progress = document.getElementById("progress");
  const onScroll = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (scrollY / max) * 100) : 0}%`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Copy code buttons
  for (const pre of document.querySelectorAll("pre")) {
    const btn = document.createElement("button");
    btn.className = "copy-code";
    btn.type = "button";
    btn.textContent = "copy";
    btn.addEventListener("click", async () => {
      const code = pre.querySelector("code")?.textContent || "";
      try {
        await navigator.clipboard.writeText(code);
        btn.textContent = "copied";
        setTimeout(() => (btn.textContent = "copy"), 1400);
      } catch {
        btn.textContent = "select";
      }
    });
    pre.appendChild(btn);
  }

  // Search
  const input = document.getElementById("search-input");
  const results = document.getElementById("search-results");
  let index = null;
  let pending = null;
  const load = () => {
    if (index) return Promise.resolve(index);
    if (!pending) {
      pending = fetch("search.json")
        .then((res) => res.json())
        .catch(() => [])
        .then((items) => (index = items));
    }
    return pending;
  };
  const render = (items) => {
    if (!results) return;
    results.innerHTML = "";
    if (!items.length) {
      results.innerHTML = '<a><strong>No results</strong><small>Try another term.</small></a>';
      results.classList.add("on");
      return;
    }
    for (const item of items.slice(0, 12)) {
      const a = document.createElement("a");
      a.href = item.u;
      a.innerHTML = `<strong>${item.t}</strong><small>${item.h ? item.h + " · " : ""}${item.u}</small>`;
      const li = document.createElement("div");
      li.setAttribute("role", "listitem");
      li.appendChild(a);
      results.appendChild(li);
    }
    results.classList.add("on");
  };
  if (input) {
    input.addEventListener("focus", load);
    input.addEventListener("input", async () => {
      await load();
      const q = input.value.trim().toLowerCase();
      if (!q) { results?.classList.remove("on"); return; }
      const items = (index || []).filter((x) => (x.t + " " + x.x + " " + x.h).toLowerCase().includes(q));
      render(items);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { results?.classList.remove("on"); input.blur(); }
      if (e.key === "Enter" && results?.classList.contains("on")) {
        const first = results.querySelector("a");
        if (first) location.href = first.href;
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
        e.preventDefault();
        input.focus();
      }
    });
    document.addEventListener("click", (e) => {
      if (!results) return;
      if (!input.parentElement.contains(e.target)) results.classList.remove("on");
    });
  }

  // Active TOC
  const links = [...document.querySelectorAll(".toc a")];
  if (links.length && "IntersectionObserver" in window) {
    const map = new Map();
    for (const link of links) {
      const id = decodeURIComponent(link.hash.slice(1));
      const el = document.getElementById(id);
      if (el) map.set(el, link);
    }
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((l) => l.classList.remove("active"));
        map.get(entry.target)?.classList.add("active");
      }
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    for (const el of map.keys()) io.observe(el);
  }
})();
