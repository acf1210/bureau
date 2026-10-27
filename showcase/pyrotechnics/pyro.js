/* Pólvora fireworks engine: one deterministic simulation draws the live show and renders the videos beside this page. */
(function (global) {
  "use strict";

  // The colour of a star is the metal salt burning in it.
  const METALS = {
    strontium: [255, 70, 78],
    sodium: [255, 186, 72],
    barium: [104, 232, 140],
    copper: [86, 136, 255],
    magnesium: [255, 248, 236]
  };
  const TYPES = ["peony", "willow", "ring", "crossette", "chrysanthemum", "salute"];
  const DEFAULT_METAL = { peony: "strontium", willow: "sodium", ring: "barium", crossette: "copper", chrysanthemum: "magnesium", salute: "magnesium" };

  const rng = (seed) => { let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return (s >>> 0) / 4294967296; }; };
  // A shell breaks as a sphere; seen from the ground its stars fill a disc, densest at the rim.
  const sphere = (R) => { const z = R() * 2 - 1, a = R() * 6.283, r = Math.sqrt(1 - z * z); return [Math.cos(a) * r, Math.sin(a) * r]; };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  const spriteCache = new Map();
  const sprite = (rgb) => {
    const key = rgb.map((v) => Math.round(v / 8)).join(",");
    if (spriteCache.has(key)) return spriteCache.get(key);
    const c = document.createElement("canvas"), n = 64;
    c.width = c.height = n;
    const g = c.getContext("2d"), gr = g.createRadialGradient(n / 2, n / 2, 0, n / 2, n / 2, n / 2);
    gr.addColorStop(0, "rgba(255,255,255,1)");
    gr.addColorStop(.18, `rgba(${rgb.map(Math.round)},.95)`);
    gr.addColorStop(.5, `rgba(${rgb.map(Math.round)},.25)`);
    gr.addColorStop(1, `rgba(${rgb.map(Math.round)},0)`);
    g.fillStyle = gr; g.fillRect(0, 0, n, n);
    spriteCache.set(key, c);
    return c;
  };

  class Show {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.seed = opts.seed ?? 7;
      this.rand = rng(this.seed);
      this.scenery = opts.scenery !== false;
      this.water = opts.water !== false;
      this.wind = opts.wind ?? .012;
      this.time = 0;
      this.rockets = []; this.sparks = []; this.smoke = []; this.lights = []; this.queue = [];
      this.flash = 0;
      this.onBurst = opts.onBurst || null;
      this.resize(canvas.width, canvas.height);
    }

    resize(w, h) {
      this.W = w; this.H = h;
      this.canvas.width = w; this.canvas.height = h;
      this.horizon = this.water ? h * .78 : h * .97;
      this.u = Math.min(w, h * 1.4);
      this.buildScenery();
    }

    // A city on the far bank: rooftops, a bell tower, a long arch bridge. Generated, not traced from any skyline.
    buildScenery() {
      const c = document.createElement("canvas"); c.width = this.W; c.height = this.H;
      const g = c.getContext("2d"), r = rng(this.seed * 31 + 5), base = this.horizon;
      if (this.scenery) {
        g.fillStyle = "#06050b";
        let x = 0;
        while (x < this.W) {
          const w = this.u * (.025 + r() * .05), h = this.H * (.025 + r() * .07);
          g.fillRect(x, base - h, w + 1, h);
          for (let i = 0; i < w * h / 260; i++) if (r() > .55) {
            g.fillStyle = `rgba(255,${190 + r() * 40 | 0},120,${.35 + r() * .45})`;
            g.fillRect(x + r() * (w - 2), base - h + 3 + r() * (h - 6), 1.5, 2);
            g.fillStyle = "#06050b";
          }
          x += w;
        }
        const tx = this.W * (.18 + r() * .12), tw = this.u * .018, th = this.H * .2;
        g.fillRect(tx, base - th, tw, th);
        g.beginPath(); g.moveTo(tx - tw * .2, base - th); g.lineTo(tx + tw / 2, base - th - this.H * .05); g.lineTo(tx + tw * 1.2, base - th); g.fill();
        g.strokeStyle = "#06050b"; g.lineWidth = Math.max(2, this.u * .004);
        const bx = this.W * .58, bw = this.W * .36;
        g.beginPath(); g.moveTo(bx, base); g.quadraticCurveTo(bx + bw * .5, base - this.H * .16, bx + bw, base); g.stroke();
        for (let i = 1; i < 12; i++) { const px = bx + bw * i / 12, t = i / 12, py = base - 4 * t * (1 - t) * this.H * .08; g.lineWidth = 1; g.beginPath(); g.moveTo(px, py); g.lineTo(px, base); g.stroke(); }
      }
      this.skyline = c;
    }

    launch(type = "peony", o = {}) {
      const metal = o.metal || DEFAULT_METAL[type];
      const x = (o.x ?? (.15 + this.rand() * .7)) * this.W;
      const apex = this.H * (o.height ?? (.16 + this.rand() * .26));
      this.queue.push({ at: this.time + (o.delay || 0), type, metal, x, apex, from: o.from != null ? o.from * this.H : this.horizon, scale: o.scale ?? (.85 + this.rand() * .4) });
    }

    burst(r) {
      const R = this.rand, rgb = METALS[r.metal], s = this.u * r.scale, add = (p) => this.sparks.push(Object.assign({ trail: [], age: 0, drag: 1.4, grav: .9, w: 1.6, shift: null, split: 0 }, p));
      const flick = () => .6 + R() * .4;
      if (r.type === "peony") for (let i = 0; i < 240; i++) { const [dx, dy] = sphere(R), v = s * (.46 + R() * .06); add({ x: r.x, y: r.y, vx: dx * v, vy: dy * v, life: 1.5 + R() * .7, rgb, tl: 6, f: flick() }); }
      if (r.type === "chrysanthemum") for (let i = 0; i < 260; i++) { const [dx, dy] = sphere(R), v = s * (.5 + R() * .04); add({ x: r.x, y: r.y, vx: dx * v, vy: dy * v, life: 2 + R() * .5, rgb, shift: METALS.sodium, tl: 16, w: 1.1, f: flick() }); }
      if (r.type === "willow") for (let i = 0; i < 170; i++) { const [dx, dy] = sphere(R), v = s * (.4 + R() * .05); add({ x: r.x, y: r.y, vx: dx * v, vy: dy * v, life: 3.6 + R() * .9, rgb, tl: 34, drag: 1.5, grav: .85, w: 1, f: flick() }); }
      if (r.type === "ring") { const tilt = .35 + R() * .5, rot = R() * 3.14; for (let i = 0; i < 120; i++) { const a = i / 120 * 6.283, cx = Math.cos(a), cy = Math.sin(a) * tilt, v = s * .44; add({ x: r.x, y: r.y, vx: (cx * Math.cos(rot) - cy * Math.sin(rot)) * v, vy: (cx * Math.sin(rot) + cy * Math.cos(rot)) * v, life: 1.6, rgb, tl: 6, f: 1 }); } }
      if (r.type === "crossette") for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + R() * .2, v = s * .34; add({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .62, rgb, tl: 8, split: 1, w: 2.2, f: 1 }); }
      if (r.type === "salute") { this.flash = Math.min(1, this.flash + .9); for (let i = 0; i < 70; i++) { const [dx, dy] = sphere(R), v = s * (.6 + R() * .4); add({ x: r.x, y: r.y, vx: dx * v, vy: dy * v, life: .3 + R() * .35, rgb: METALS.magnesium, tl: 5, drag: 3, w: 1.2, f: 1 }); } }
      this.lights.push({ x: r.x, y: r.y, rgb, k: r.type === "salute" ? 1.6 : 1, age: 0 });
      for (let i = 0; i < 4; i++) this.smoke.push({ x: r.x + (R() - .5) * s * .12, y: r.y + (R() - .5) * s * .08, r: s * (.06 + R() * .06), age: 0, rgb });
      if (this.onBurst) this.onBurst(r);
    }

    step(dt) {
      this.time += dt;
      for (let i = this.queue.length - 1; i >= 0; i--) {
        const q = this.queue[i];
        if (q.at > this.time) continue;
        this.queue.splice(i, 1);
        const vy = -Math.sqrt(2 * this.H * .55 * (q.from - q.apex));
        this.rockets.push({ ...q, y: q.from, vy, trail: [] });
      }
      const g = this.H * .55;
      for (let i = this.rockets.length - 1; i >= 0; i--) {
        const r = this.rockets[i];
        r.trail.push(r.x, r.y); if (r.trail.length > 24) r.trail.splice(0, 2);
        r.vy += g * dt; r.y += r.vy * dt; r.x += this.wind * this.W * dt;
        if (r.vy >= 0) { this.rockets.splice(i, 1); this.burst(r); }
      }
      const out = [];
      for (const p of this.sparks) {
        p.age += dt;
        const k = Math.exp(-p.drag * dt);
        p.vx = p.vx * k + this.wind * this.W * .6 * dt; p.vy = p.vy * k + g * .42 * p.grav * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.trail.push(p.x, p.y); if (p.trail.length > p.tl * 2) p.trail.splice(0, 2);
        if (p.split === 1 && p.age > p.life) {
          for (let j = 0; j < 4; j++) { const a = Math.atan2(p.vy, p.vx) + .785 + j * 1.571, v = this.u * .16; out.push({ x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: .9, age: 0, rgb: p.rgb, tl: 7, trail: [], drag: 1.6, grav: .8, w: 1.3, f: 1, split: 0 }); }
          continue;
        }
        if (p.age < p.life) out.push(p);
      }
      this.sparks = out;
      for (const s of this.smoke) { s.age += dt; s.r += this.u * .012 * dt; s.x += this.wind * this.W * .7 * dt; s.y -= this.H * .004 * dt; }
      this.smoke = this.smoke.filter((s) => s.age < 7);
      for (const l of this.lights) l.age += dt;
      this.lights = this.lights.filter((l) => l.age < .9);
      this.flash *= Math.exp(-7 * dt);
    }

    drawSparks(g, mirror) {
      for (const r of this.rockets) {
        const t = r.trail; if (t.length < 4) continue;
        g.strokeStyle = "rgba(255,200,140,.55)"; g.lineWidth = 1.4;
        g.beginPath(); g.moveTo(t[0], t[1]); for (let i = 2; i < t.length; i += 2) g.lineTo(t[i], t[i + 1]); g.stroke();
        const sp = sprite([255, 210, 150]); const s = this.u * .012; g.drawImage(sp, r.x - s, r.y - s, s * 2, s * 2);
      }
      for (const p of this.sparks) {
        const life = p.age / p.life, fade = Math.max(0, 1 - life) ** 1.3;
        const rgb = p.shift ? mix(p.rgb, p.shift, Math.min(1, life * 1.4)) : p.rgb;
        const tw = p.f < 1 ? (Math.sin((this.time + p.f * 9) * 40) > .2 ? 1 : .35) : 1;
        const a = fade * tw * (mirror ? .5 : 1);
        if (a < .02) continue;
        const t = p.trail;
        if (t.length >= 4) {
          g.globalAlpha = a * .55; g.strokeStyle = `rgb(${rgb.map(Math.round)})`; g.lineWidth = p.w;
          g.beginPath(); g.moveTo(t[0], t[1]); for (let i = 2; i < t.length; i += 2) g.lineTo(t[i], t[i + 1]); g.stroke();
        }
        g.globalAlpha = a;
        // The first frames after the break are a bright core, not a solid disc: stars swell in over 0.1 s.
        const s = this.u * .0075 * (1 + (1 - life) * 1.2) * Math.min(1, .35 + p.age * 7);
        g.drawImage(sprite(rgb), p.x - s, p.y - s, s * 2, s * 2);
      }
      g.globalAlpha = 1;
    }

    draw() {
      const g = this.ctx, W = this.W, H = this.H, hz = this.horizon;
      g.globalCompositeOperation = "source-over";
      const sky = g.createLinearGradient(0, 0, 0, hz);
      sky.addColorStop(0, "#05040a"); sky.addColorStop(.7, "#0d0a1a"); sky.addColorStop(1, "#1d1428");
      g.fillStyle = sky; g.fillRect(0, 0, W, hz);
      g.globalCompositeOperation = "lighter";
      for (const l of this.lights) {
        const k = Math.max(0, 1 - l.age / .9) ** 2 * .2 * l.k, R = this.u * .45;
        const gr = g.createRadialGradient(l.x, l.y, 0, l.x, l.y, R);
        gr.addColorStop(0, `rgba(${l.rgb.map(Math.round)},${k})`); gr.addColorStop(1, `rgba(${l.rgb.map(Math.round)},0)`);
        g.fillStyle = gr; g.fillRect(l.x - R, l.y - R, R * 2, R * 2);
      }
      if (this.flash > .01) { g.fillStyle = `rgba(255,244,230,${this.flash * .22})`; g.fillRect(0, 0, W, H); }
      g.globalCompositeOperation = "source-over";
      // Smoke hangs where the shells broke, lit for a moment by their colour.
      for (const s of this.smoke) {
        const lit = Math.max(0, 1 - s.age / .8), a = Math.min(1, s.age * 2) * Math.max(0, 1 - s.age / 7) * .1;
        const c = mix([70, 64, 82], s.rgb, lit * .6);
        const gr = g.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r);
        gr.addColorStop(0, `rgba(${c.map(Math.round)},${a + lit * .12})`); gr.addColorStop(1, `rgba(${c.map(Math.round)},0)`);
        g.fillStyle = gr; g.fillRect(s.x - s.r, s.y - s.r, s.r * 2, s.r * 2);
      }
      g.globalCompositeOperation = "lighter";
      this.drawSparks(g, false);
      g.globalCompositeOperation = "source-over";
      if (this.water) {
        const wa = g.createLinearGradient(0, hz, 0, H);
        wa.addColorStop(0, "#0b0914"); wa.addColorStop(1, "#030207");
        g.fillStyle = wa; g.fillRect(0, hz, W, H - hz);
        // The reflection is drawn at a quarter of the resolution and stretched back: the water softens it for free.
        const q = this.reflection || (this.reflection = document.createElement("canvas"));
        const qw = Math.ceil(W / 4), qh = Math.ceil((H - hz) / 4);
        if (q.width !== qw || q.height !== qh) { q.width = qw; q.height = qh; }
        const rg = q.getContext("2d");
        rg.globalCompositeOperation = "source-over"; rg.clearRect(0, 0, qw, qh);
        rg.save(); rg.scale(.25, -.25); rg.translate(0, -hz);
        rg.globalCompositeOperation = "lighter";
        this.drawSparks(rg, true);
        rg.restore();
        g.globalCompositeOperation = "lighter";
        g.drawImage(q, 0, hz, W, H - hz);
        g.globalCompositeOperation = "source-over";
        // Ripples break the reflection into moving bands.
        for (let y = hz; y < H; y += 3) {
          const k = (y - hz) / (H - hz);
          g.fillStyle = `rgba(3,2,7,${.25 + .35 * (Math.sin(y * .9 + this.time * 3) * .5 + .5) * (1 - k * .5)})`;
          g.fillRect(0, y, W, 1.5);
        }
      }
      g.drawImage(this.skyline, 0, 0);
    }
  }

  global.Pyro = { Show, METALS, TYPES, DEFAULT_METAL };
})(window);
