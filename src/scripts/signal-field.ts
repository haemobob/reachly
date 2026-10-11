import * as THREE from "three";
export function mountSignalField(host: HTMLElement) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
  } catch {
    return () => {};
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  host.appendChild(renderer.domElement);
  const uniforms = {
    u_time: { value: 0 },
    u_aspect: { value: 1 },
    u_pointer: { value: new THREE.Vector2(0, 0) },
    u_variant: { value: 0 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
    fragmentShader: `
 precision highp float;varying vec2 vUv;uniform float u_time;uniform float u_aspect;uniform vec2 u_pointer;uniform float u_variant;
 void main(){
  vec2 p=(vUv-.5)*2.;p.x*=u_aspect;
  float rot=-.48+u_variant*.2;mat2 m=mat2(cos(rot),-sin(rot),sin(rot),cos(rot));vec2 q=m*p;
  q.y*=1.33;float r=length(q);float a=atan(q.y,q.x);
  float sway=.024*sin(a*3.+u_time*.28)+.013*cos(a*5.-u_time*.15);
  float local=exp(-length(p-u_pointer)*4.5)*.065;
  float radius=r+sway+local+u_variant*.015*sin(a*4.+u_time*.12);
  float bands=radius*35.;float line=1.-smoothstep(.03,.14,abs(fract(bands)-.5));
  float edge=smoothstep(.14,.22,radius)*(1.-smoothstep(.88,1.02,radius));
  float side=.52+.48*cos(a-.8);float convex=pow(max(0.,1.-abs(radius-.56)*2.7),.45);
  vec3 ink=vec3(.020,.063,.055);vec3 green=vec3(.070,.185,.135);vec3 lime=vec3(.831,.906,.318);
  vec3 color=mix(ink,green,edge*convex*.5);
  color=mix(color,lime,line*edge*(.25+.7*side)*(.5+.5*convex));
  float seed=1.-smoothstep(.039,.049,length(p));color=mix(color,lime,seed);
  gl_FragColor=vec4(color,1.);
 }`,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.Camera();
  let frame = 0;
  let inView = true;
  let disposed = false;
  let contextLost = false;
  let start = performance.now();
  const target = new THREE.Vector2();
  function resize() {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    uniforms.u_aspect.value = r.width / r.height;
    draw();
  }
  function draw() {
    if (disposed || contextLost) return;
    renderer.render(scene, camera);
    host.dataset.rendered = "true";
  }
  function canRun() {
    return (
      !disposed &&
      !contextLost &&
      inView &&
      document.visibilityState === "visible" &&
      document.documentElement.dataset.motion !== "paused"
    );
  }
  function tick(now: number) {
    frame = 0;
    if (!canRun()) return;
    uniforms.u_time.value = (now - start) / 1000;
    uniforms.u_pointer.value.lerp(target, 0.04);
    draw();
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    if (canRun()) frame = requestAnimationFrame(tick);
  }
  function pointer(event: PointerEvent) {
    const r = host.getBoundingClientRect();
    target.set(
      ((event.clientX - r.left) / r.width - 0.5) * 2 * uniforms.u_aspect.value,
      -((event.clientY - r.top) / r.height - 0.5) * 2,
    );
  }
  function perspective(event: Event) {
    uniforms.u_variant.value = (event as CustomEvent<number>).detail;
    draw();
  }
  function lost(event: Event) {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    host.dataset.rendered = "false";
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const intersection = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    sync();
  });
  intersection.observe(host);
  host.addEventListener("pointermove", pointer);
  window.addEventListener("reachly:perspective", perspective);
  window.addEventListener("reachly:motion", sync);
  document.addEventListener("visibilitychange", sync);
  renderer.domElement.addEventListener("webglcontextlost", lost);
  resize();
  sync();
  return () => {
    disposed = true;
    host.dataset.rendered = "false";
    cancelAnimationFrame(frame);
    observer.disconnect();
    intersection.disconnect();
    host.removeEventListener("pointermove", pointer);
    window.removeEventListener("reachly:perspective", perspective);
    window.removeEventListener("reachly:motion", sync);
    document.removeEventListener("visibilitychange", sync);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
