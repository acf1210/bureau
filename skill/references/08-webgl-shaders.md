# 08 — WebGL and Shaders

WebGL is a material, not a personality. Use it when the concept needs real-time light, matter, or space that CSS cannot produce.

## 1. Decide honestly

Use WebGL when:

- The product's form must be inspected in 3D.
- The brand is about systems, fields, particles, or simulation.
- A material (glass, chrome, fabric, liquid) is the idea.
- A generative identity changes per visitor/session.
- Data has a spatial structure that 2D flattens.

Do **not** use WebGL when:

- A video or CSS gradient would communicate the same thing.
- It is only there to signal "tech".
- It cannot hit the performance budget on a mid-tier phone.
- The content is a reading or task surface.
- You cannot provide a static fallback.

## 2. Stack choices

| Need | Choice | Notes |
|---|---|---|
| Simple atmosphere, particles, flow field | **raw WebGL** or **OGL** | smallest payload, full control |
| 3D objects, GLTF, PBR | **Three.js** | ~150 KB gzip; use addons selectively |
| React-declarative 3D | **React Three Fiber** + drei | convenient, heavier; code-split |
| Shader-first art | **raw WebGL / regl / OGL** | fewer abstractions |
| 2D canvas particles | **Canvas 2D** | cheaper than WebGL for < 5k particles |

Load the 3D bundle **only** when the canvas is near the viewport:

```js
const { initScene } = await import("./scene.js");
```

## 3. Raw WebGL: minimal fragment shader

```html
<canvas id="gl" aria-hidden="true"></canvas>
```

```js
const canvas = document.querySelector("#gl");
const gl = canvas.getContext("webgl", { antialias: false, alpha: true, powerPreference: "high-performance" });
if (!gl) fallback();

const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
const fs = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;

// hash + value noise
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x),
             mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5*u_res) / u_res.y;
  float t = u_time * 0.08;
  float n = noise(p*3.0 + t) * noise(p*6.0 - t*1.4);
  float d = length(p - (u_mouse - 0.5) * 0.6);
  vec3 ink = vec3(0.055, 0.06, 0.065);
  vec3 hot = vec3(0.92, 0.36, 0.16);
  vec3 col = mix(ink, hot, smoothstep(0.5, 0.15, d) * (0.25 + n));
  gl_FragColor = vec4(col, 1.0);
}`;
```

Production needs: compile/link error handling, resize with DPR cap, `visibilitychange` pause, `IntersectionObserver` pause, context-loss restore, and a reduced-motion still.

## 4. Shader patterns that read as "designed"

### Flow field
A noise-driven vector field moving thousands of particles. Best for networks, AI, cities, weather. Keep line weight thin and palette restrained.

### Displacement / refraction
Sample a texture and offset UVs with noise or a normal map. Use for glass, water, heat haze. Expensive on mobile; cap the resolution.

### Signed distance fields (SDF)
Draw shapes mathematically (circles, capsules, rounded boxes, type). Great for crisp, scalable marks and morphing. Combine with `smoothstep` for anti-aliasing.

### Instanced geometry
One draw call for thousands of objects. Use for grids, data points, typographic particles. Vary via instance attributes.

### Raymarched volume
Full-screen raymarching for clouds, smoke, metaballs. Beautiful, expensive. Render at 0.5–0.75 DPR and upscale.

### Post-processing
Bloom, grain, chromatic aberration, film grade. Use one, subtly. Stacking three is the shader equivalent of effect salad.

### Data-driven uniforms
Feed real data into `u_progress`, `u_value`, `u_color`. The scene becomes the interface, not a loop.

## 5. Three.js recipe

```js
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(el.clientWidth, el.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 5);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const geometry = new THREE.IcosahedronGeometry(1.2, 64);
const material = new THREE.MeshPhysicalMaterial({
  color: 0x111214,
  roughness: 0.18,
  metalness: 1,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

Rules:

- Use `MeshPhysicalMaterial` sparingly; it is expensive.
- Compress GLTF with Draco/Meshopt; keep hero models < 1.5 MB.
- Use `KHR_texture_basisu` for textures.
- Dispose geometries, materials, textures, and render targets on unmount.
- Cap DPR at 2; on low-end devices use 1.25–1.5.
- Provide a static poster rendered from the scene.

## 6. Interaction

- Pointer movement: normalize to `[-1, 1]`; lerp toward the target (`0.06–0.12`) for weight.
- Scroll: map a bounded progress value to a scene parameter; never bind raw `scrollY` without normalization.
- Drag: support pointer events, capture, and touch; provide a reset.
- Keyboard: if the canvas is interactive, expose controls and a text alternative.
- Reduced motion: freeze at a composed frame; do not run the loop.

```js
let target = new THREE.Vector2();
let current = new THREE.Vector2();
addEventListener("pointermove", (e) => {
  target.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
});
function tick(t) {
  current.lerp(target, 0.08);
  mesh.rotation.y = current.x * 0.35;
  mesh.rotation.x = -current.y * 0.2;
  mesh.material.uniforms.u_time.value = t * 0.001;
  renderer.render(scene, camera);
}
```

## 7. Performance

| Budget | Target |
|---|---|
| Draw calls | < 100 for a hero scene |
| Triangles | < 250k mobile, < 1M desktop |
| Texture memory | < 64 MB mobile |
| Shader passes | 1 full-screen max; post FX only on desktop |
| DPR | ≤ 2 (≤ 1.5 on low-end) |
| Frame time | < 16.6 ms; degrade above 20 ms |

Techniques:

- `renderer.setAnimationLoop` + pause when off-screen/hidden.
- Instancing for repeated geometry.
- Frustum culling, LOD, texture atlases.
- Half-float render targets only when needed.
- Adaptive resolution: measure frame time and drop DPR in steps.
- Avoid `getError()` in the loop.
- Handle `webglcontextlost` and restore.

```js
const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) renderer.setAnimationLoop(tick);
  else renderer.setAnimationLoop(null);
}, { threshold: 0.01 });
io.observe(el);
```

## 8. Fallbacks and access

For shaders, particle fields and 3D scenes, document the visual purpose, inputs, frame budget and static equivalent before implementation. Validate shader compilation and canvas resize, pause on hidden or off-screen surfaces, handle context loss, and dispose geometry, materials, textures, listeners and render loops on teardown. Test repeated mount/unmount and low-power fallback; a successful screenshot alone does not prove resource cleanup.

- `aria-hidden="true"` on decorative canvases; the meaning must exist in text.
- If the canvas is the product (configurator, 3D viewer), provide keyboard controls and a 2D/text alternative.
- Static poster: a high-quality WebP/AVIF of the composed frame.
- No-WebGL: show the poster + a meaningful gradient.
- Reduced motion: poster or a very slow, non-essential drift.
- Seizure safety: no rapid flashing; cap luminance changes.

## 9. Testing

- Screenshot the canvas at 3 scroll positions and 3 viewports.
- Check console for shader compile errors and context loss.
- Measure FPS with `PerformanceObserver` / DevTools at 4× CPU throttle.
- Test on a real mid-tier Android if possible; emulation lies.
- Verify the poster matches the scene's composition.
- Verify no layout shift when the canvas initializes.

## 10. Anti-patterns

- A shader blob behind generic SaaS copy.
- Mouse-following particles with no relation to the product.
- 3D object spinning slowly as the only idea.
- Full-screen raymarching on mobile.
- Bloom + grain + chromatic aberration + vignette on everything.
- A canvas that traps scroll or blocks clicks.
- No fallback, no poster, no reduced motion.
- "Loading 3D..." for 8 seconds.
