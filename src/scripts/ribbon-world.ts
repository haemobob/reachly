import * as THREE from "three";
import { buildRibbonGeometry, sampleRibbon } from "../lib/ribbon-geometry";

type WorldState = {
  phase: number;
  perspective: number;
  pointerX: number;
  pointerY: number;
};
const finite = (value: number, min: number, max: number) =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : 0;
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const chapterValue = (phase: number, values: number[]) => {
  const i = Math.min(4, Math.floor(phase));
  return THREE.MathUtils.lerp(values[i], values[i + 1], ease(phase - i));
};

export function mountRibbonWorld(
  host: HTMLElement,
  options: {
    mode: "studio" | "exhibition";
    state: () => WorldState;
  },
): { render: () => void; dispose: () => void } {
  host.dataset.rendered = "false";
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
  } catch {
    return {
      render() {},
      dispose() {
        host.dataset.rendered = "false";
      },
    };
  }

  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "display:block;width:100%;height:100%;pointer-events:none";
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = options.mode === "studio" ? 1.12 : 1.28;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-7, 7, 4, -4, 0.1, 80);
  camera.position.set(0, 0, 20);
  const world = new THREE.Group();
  scene.add(world);
  const night = options.mode === "exhibition";
  scene.add(
    new THREE.HemisphereLight(
      night ? 0xfaf7f0 : 0xffffff,
      0x17463a,
      night ? 1.7 : 2.4,
    ),
  );
  const key = new THREE.DirectionalLight(0xfff7dd, night ? 4.5 : 3.8);
  key.position.set(-4, 7, 9);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xd4e751, night ? 3 : 1.2);
  rim.position.set(6, 1, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xfaf7f0, 0.8);
  fill.position.set(1, -5, 4);
  scene.add(fill);

  // Original micrograin, generated locally; no image or environment-map requests.
  const grain = new Uint8Array(64 * 64 * 4);
  let seed = 73421;
  for (let i = 0; i < grain.length; i += 4) {
    seed = (Math.imul(seed, 1664525) + 0x3c6ef35f) >>> 0;
    const value = 112 + (seed >>> 27);
    grain[i] = grain[i + 1] = grain[i + 2] = value;
    grain[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(grain, 64, 64);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(14, 3);
  texture.needsUpdate = true;
  const face = new THREE.MeshPhysicalMaterial({
    color: "#D4E751",
    roughness: 0.39,
    metalness: 0.07,
    clearcoat: 0.22,
    clearcoatRoughness: 0.52,
    bumpMap: texture,
    bumpScale: 0.018,
    side: THREE.DoubleSide,
  });
  const edge = new THREE.MeshStandardMaterial({
    color: "#17463A",
    roughness: 0.48,
    metalness: 0.12,
    side: THREE.DoubleSide,
  });
  const data = buildRibbonGeometry(0);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(data.positions, 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  const uv = new Float32Array((data.positions.length / 3) * 2);
  for (let i = 0; i < uv.length / 2; i++) {
    uv[i * 2] = Math.floor(i / 8) / 180;
    uv[i * 2 + 1] = (i % 8) / 8;
  }
  geometry.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geometry.setIndex(new THREE.BufferAttribute(data.indices, 1));
  data.groups.forEach((group) =>
    geometry.addGroup(group.start, group.count, group.materialIndex),
  );
  geometry.computeVertexNormals();
  const ribbon = new THREE.Mesh(geometry, [face, edge]);
  ribbon.frustumCulled = false;
  world.add(ribbon);
  const pointGeometry = new THREE.SphereGeometry(0.19, 24, 16);
  const pointMaterial = new THREE.MeshPhysicalMaterial({
    color: "#D4E751",
    roughness: 0.25,
    clearcoat: 0.45,
    emissive: "#D4E751",
    emissiveIntensity: night ? 0.18 : 0.03,
  });
  const point = new THREE.Mesh(pointGeometry, pointMaterial);
  world.add(point);

  let disposed = false,
    lost = false,
    lastPhase = -1;
  let width = 0,
    height = 0;
  const bounds = host.getBoundingClientRect();
  let visible =
    bounds.bottom > 0 &&
    bounds.right > 0 &&
    bounds.top < window.innerHeight &&
    bounds.left < window.innerWidth;
  let intersection: IntersectionObserver | undefined;
  let resize: ResizeObserver | undefined;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canAnimate = () =>
    !disposed &&
    !lost &&
    visible &&
    !document.hidden &&
    document.documentElement.dataset.motion !== "paused" &&
    !reduced.matches;

  function render() {
    if (disposed || lost || document.hidden || !visible) return;
    try {
      const rect = host.getBoundingClientRect();
      if (rect.width < 1 || rect.height < 1) return;
      if (width !== rect.width || height !== rect.height) {
        width = rect.width;
        height = rect.height;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        const viewWidth = aspect < 1 ? 10.5 : Math.max(10.5, 8.1 * aspect);
        camera.left = -viewWidth / 2;
        camera.right = viewWidth / 2;
        camera.top = viewWidth / aspect / 2;
        camera.bottom = -camera.top;
        camera.updateProjectionMatrix();
      }
      const state = options.state();
      const phase = finite(state.phase, 0, 5);
      if (phase !== lastPhase) {
        const next = buildRibbonGeometry(phase);
        const attribute = geometry.getAttribute(
          "position",
        ) as THREE.BufferAttribute;
        (attribute.array as Float32Array).set(next.positions);
        attribute.needsUpdate = true;
        geometry.computeVertexNormals();
        lastPhase = phase;
      }
      const aspect = width / height,
        viewWidth = camera.right - camera.left;
      world.position.x =
        aspect < 1
          ? 0.35
          : viewWidth *
            chapterValue(phase, [0.23, 0.1, 0.23, 0.09, 0.08, 0.06]);
      world.position.y = aspect < 1 ? -camera.top * 0.27 : -0.1;
      const moving = canAnimate();
      world.rotation.set(
        chapterValue(phase, [-0.12, 0.08, -0.14, 0.1, -0.05, 0.12]) +
          (moving ? finite(state.pointerY, -1, 1) * 0.035 : 0),
        finite(state.perspective, 0, 2) * 0.24 +
          (moving ? finite(state.pointerX, -1, 1) * 0.06 : 0),
        chapterValue(phase, [-0.15, 0.02, 0.13, -0.12, -0.06, 0.06]),
      );
      const reach = sampleRibbon(phase, 0.95);
      point.position.set(reach[0] + 0.38, reach[1] + 0.38, reach[2] + 0.4);
      renderer.render(scene, camera);
      host.dataset.rendered = "true";
    } catch {
      lost = true;
      host.dataset.rendered = "false";
      canvas.style.visibility = "hidden";
    }
  }

  // Scroll/pointer/resize own the motion score; do not render endlessly while a visitor reads.
  function sync() {
    render();
  }
  function contextLost(event: Event) {
    event.preventDefault();
    lost = true;
    host.dataset.rendered = "false";
    canvas.style.visibility = "hidden";
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    intersection?.disconnect();
    resize?.disconnect();
    document.removeEventListener("visibilitychange", sync);
    window.removeEventListener("reachly:motion", sync);
    window.removeEventListener("resize", sync);
    reduced.removeEventListener("change", sync);
    canvas.removeEventListener("webglcontextlost", contextLost);
    geometry.dispose();
    pointGeometry.dispose();
    face.dispose();
    edge.dispose();
    pointMaterial.dispose();
    texture.dispose();
    renderer.dispose();
    canvas.remove();
    host.dataset.rendered = "false";
  }
  try {
    host.append(canvas);
    canvas.addEventListener("webglcontextlost", contextLost);
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("reachly:motion", sync);
    window.addEventListener("resize", sync);
    reduced.addEventListener("change", sync);
    if (typeof IntersectionObserver !== "undefined") {
      intersection = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        sync();
      });
      intersection.observe(host);
    }
    if (typeof ResizeObserver !== "undefined") {
      resize = new ResizeObserver(sync);
      resize.observe(host);
    }
    sync();
  } catch {
    dispose();
  }
  return { render, dispose };
}
