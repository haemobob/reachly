import { worldPhase, worldPose } from "../lib/world-state";
const journey = document.querySelector<HTMLElement>(".continuous-journey");
const stage = journey?.querySelector<HTMLElement>(".world-stage");
const host = stage?.querySelector<HTMLElement>(".ribbon-world");
if (journey && stage && host) {
  const mode =
    journey.dataset.worldMode === "exhibition" ? "exhibition" : "studio";
  const scenes = [...journey.querySelectorAll<HTMLElement>("[data-scene]")];
  const paths = [
    ...stage.querySelectorAll<SVGPathElement>(".world-path,.world-contour"),
  ];
  const point = stage.querySelector<SVGCircleElement>(".world-point");
  const atelier = stage.querySelector<HTMLElement>(".world-plate--atelier");
  const passage = stage.querySelector<HTMLElement>(".world-plate--passage");
  const caption = journey.querySelector<HTMLElement>("[data-world-caption]");
  const hud = journey.querySelector<HTMLElement>(".world-hud");
  const labels =
    mode === "studio"
      ? [
          "Origin",
          "Presence",
          "Connections",
          "Together",
          "Beyond",
          "Your next point",
        ]
      : [
          "Origin",
          "Open the frame",
          "Inside the line",
          "Connect the dots",
          "Reach further",
          "Your next point",
        ];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const state = { phase: 0, perspective: 0, pointerX: 0, pointerY: 0 };
  let landmarks: number[] = [];
  let planes = [
    ...journey.querySelectorAll<HTMLElement>("[data-world-plane]"),
  ].map((el) => ({ el, top: 0 }));
  let renderer: { render: () => void; dispose: () => void } | undefined;
  let pending = false,
    ended = false,
    frame = 0;
  const animated = () =>
    !reduced.matches && document.documentElement.dataset.motion !== "paused";
  function measure() {
    landmarks = scenes.map((e, i) =>
      i === 0
        ? 0
        : e.getBoundingClientRect().top +
          scrollY -
          (mode === "exhibition" ? 140 : 90),
    );
    planes = planes.map(({ el }) => ({
      el,
      top:
        el.getBoundingClientRect().top +
        scrollY -
        (parseFloat(el.style.getPropertyValue("--plane-travel")) || 0),
    }));
    update();
  }
  function update() {
    frame = 0;
    if (ended) return;
    const current = worldPhase(scrollY, landmarks);
    if (animated()) state.phase = current;
    const pose = worldPose(state.phase);
    const readingOpacity = worldPose(current).readingOpacity;
    stage!.style.setProperty("--world-reading-opacity", String(readingOpacity));
    stage!.dataset.phase = state.phase.toFixed(3);
    for (const path of paths) path.setAttribute("d", pose.path);
    point?.setAttribute("cx", String(pose.pointX));
    point?.setAttribute("cy", String(pose.pointY));
    if (atelier) {
      atelier.style.opacity = String(
        pose.plateOpacity *
          (innerWidth < 700 ? 0.72 : 1) *
          (mode === "exhibition" ? 0.28 : 1),
      );
      atelier.style.transform = `translate3d(${state.phase * -15}px,${state.phase * -10}px,0) scale(${1 + state.phase * 0.035})`;
    }
    if (passage)
      passage.style.opacity = String(
        pose.passageOpacity * (mode === "exhibition" ? 0.5 : 1),
      );
    host!.style.opacity = String(
      mode === "studio" ? Math.min(1, state.phase * 0.9) : readingOpacity,
    );
    const index = Math.min(5, Math.floor(current + 0.25));
    if (caption) caption.textContent = `0${index + 1} / ${labels[index]}`;
    for (const { el, top } of planes) {
      const proximity = Math.max(
        -1,
        Math.min(1, (scrollY - top + innerHeight * 0.4) / innerHeight),
      );
      el.style.setProperty(
        "--plane-travel",
        `${animated() ? proximity * (Number(el.dataset.worldPlane) % 2 ? 32 : -32) : 0}px`,
      );
    }
    if (hud) {
      const rect = journey!.getBoundingClientRect();
      hud.style.visibility =
        rect.bottom < 80 || rect.top > innerHeight ? "hidden" : "visible";
    }
    document.querySelectorAll<HTMLElement>("[data-chapter]").forEach((link) => {
      const id = link.dataset.chapter;
      const active = scenes[index]?.id;
      if (
        id === active ||
        (id === "frame" && active === "inside") ||
        (id === "further" && active === "reach")
      )
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    renderer?.render();
  }
  function schedule() {
    if (!frame && !ended) frame = requestAnimationFrame(update);
  }
  async function enhance() {
    if (
      pending ||
      renderer ||
      ended ||
      !host!.isConnected ||
      reduced.matches ||
      new URLSearchParams(location.search).get("renderer") === "off"
    )
      return;
    pending = true;
    try {
      const { mountRibbonWorld } = await import("./ribbon-world");
      if (!ended && !reduced.matches && host!.isConnected)
        renderer = mountRibbonWorld(host!, { mode, state: () => state });
    } catch {
      host!.dataset.rendered = "false";
    } finally {
      pending = false;
      update();
    }
  }
  function policy() {
    if (reduced.matches) {
      renderer?.dispose();
      renderer = undefined;
      host!.dataset.rendered = "false";
    } else enhance();
    schedule();
  }
  document
    .querySelectorAll<HTMLButtonElement>("[data-perspective]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        state.perspective = Number(button.dataset.perspective) || 0;
        document
          .querySelectorAll("[data-perspective]")
          .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        const vector = stage!.querySelector<HTMLElement>(".world-vector");
        if (vector)
          vector.style.transform = `rotate(${state.perspective * 4}deg) scale(${1 - state.perspective * 0.025})`;
        renderer?.render();
      }),
    );
  function pointer(event: PointerEvent) {
    if (!animated() || event.pointerType === "touch") return;
    state.pointerX = (event.clientX / innerWidth - 0.5) * 2;
    state.pointerY = (event.clientY / innerHeight - 0.5) * 2;
    schedule();
  }
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("pointermove", pointer, { passive: true });
  window.addEventListener("reachly:motion", policy);
  reduced.addEventListener("change", policy);
  window.addEventListener("pageshow", measure);
  const observed = new ResizeObserver(measure);
  observed.observe(journey);
  measure();
  document.fonts.ready.then(measure);
  window.addEventListener("load", measure, { once: true });
  if ("requestIdleCallback" in window)
    requestIdleCallback(() => enhance(), { timeout: 1200 });
  else setTimeout(enhance, 100);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) return;
    ended = true;
    cancelAnimationFrame(frame);
    renderer?.dispose();
    observed.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", measure);
    window.removeEventListener("pointermove", pointer);
    window.removeEventListener("reachly:motion", policy);
    window.removeEventListener("pageshow", measure);
    reduced.removeEventListener("change", policy);
  });
}
