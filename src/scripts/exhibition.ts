import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { workflowFor } from "../lib/workflow";
let motionReady = false;
let context: gsap.Context | undefined;
function motion() {
  if (!motionReady) return;
  context?.revert();
  if (document.documentElement.dataset.motion === "paused") return;
  context = gsap.context(() => {
    gsap.to(".portal-image", {
      clipPath: "circle(78% at 50% 50%)",
      scrollTrigger: {
        trigger: ".portal",
        start: "top 85%",
        end: "bottom 40%",
        scrub: 1,
      },
    });
    gsap.from(".exhibit-project", {
      y: 50,
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".exhibit-gallery",
        start: "top 90%",
        end: "bottom 70%",
        scrub: 1,
      },
    });
    gsap.to(".further-art", {
      rotation: 18,
      scrollTrigger: {
        trigger: ".further-chapter",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  });
}
// Let native fragment navigation and font layout finish before ScrollTrigger
// records scroll positions. Initial refresh must not restore a stale zero.
const loaded = new Promise<void>((resolve) => {
  if (document.readyState === "complete") resolve();
  else window.addEventListener("load", () => resolve(), { once: true });
});
Promise.all([loaded, document.fonts.ready]).then(() => {
  motionReady = true;
  gsap.registerPlugin(ScrollTrigger);
  motion();
});
window.addEventListener("reachly:motion", motion);
const host = document.querySelector<HTMLElement>("#signal-art");
let disposeField: (() => void) | undefined;
let fieldPending = false;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
async function enhance() {
  if (
    !host ||
    disposeField ||
    fieldPending ||
    reduced.matches ||
    new URLSearchParams(location.search).get("renderer") === "off"
  )
    return;
  fieldPending = true;
  try {
    const { mountSignalField } = await import("./signal-field");
    if (!reduced.matches && host.isConnected)
      disposeField = mountSignalField(host);
  } catch {
    if (host) host.dataset.rendered = "false";
  } finally {
    fieldPending = false;
  }
}
if ("requestIdleCallback" in window)
  requestIdleCallback(enhance, { timeout: 1200 });
else setTimeout(enhance, 100);
reduced.addEventListener("change", () => {
  if (reduced.matches) {
    disposeField?.();
    disposeField = undefined;
    if (host) host.dataset.rendered = "false";
  } else enhance();
});
document
  .querySelectorAll<HTMLButtonElement>("[data-perspective]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-perspective]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      const variant = Number(button.dataset.perspective);
      host?.style.setProperty("--perspective", String(variant));
      const fallback = host?.querySelector<HTMLElement>(".signal-fallback");
      if (fallback)
        fallback.style.transform = `rotate(${variant * 18}deg) scale(${1 - variant * 0.08})`;
      window.dispatchEvent(
        new CustomEvent("reachly:perspective", { detail: variant }),
      );
    }),
  );
const chapters = document.querySelectorAll<HTMLElement>("section[id]");
const chapterObserver = new IntersectionObserver(
  (entries) => {
    const current = entries
      .filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
    if (!current) return;
    document.querySelectorAll("[data-chapter]").forEach((link) => {
      if ((link as HTMLElement).dataset.chapter === current.target.id)
        link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  },
  { rootMargin: "-10% 0px -55% 0px", threshold: 0 },
);
chapters.forEach((c) => chapterObserver.observe(c));
let scenario = "website";
let running = false;
let timers: number[] = [];
const run = document.querySelector<HTMLButtonElement>("#run-flow");
const result = document.querySelector<HTMLElement>("#flow-result");
function clearRun() {
  timers.forEach(clearTimeout);
  timers = [];
  running = false;
  if (run) run.disabled = false;
  document
    .querySelectorAll<HTMLElement>("[data-node]")
    .forEach((n) => delete n.dataset.active);
}
function renderScenario() {
  clearRun();
  const plan = workflowFor(scenario);
  document.querySelectorAll<HTMLElement>("[data-node]").forEach((node, i) => {
    node.querySelector("h3")!.textContent = plan.steps[i].label;
    node.querySelector("p")!.textContent = plan.steps[i].text;
  });
  if (result) result.textContent = plan.title + " — ready to explore.";
}
document
  .querySelectorAll<HTMLButtonElement>("[data-scenario]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      scenario = button.dataset.scenario || "website";
      document
        .querySelectorAll("[data-scenario]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      renderScenario();
    }),
  );
run?.addEventListener("click", () => {
  if (running) return;
  running = true;
  run.disabled = true;
  const plan = workflowFor(scenario);
  const paused = document.documentElement.dataset.motion === "paused";
  const interval = paused ? 0 : 650;
  for (let i = 0; i < 4; i++) {
    timers.push(
      window.setTimeout(() => {
        document
          .querySelectorAll<HTMLElement>("[data-node]")
          .forEach((node, n) => {
            node.dataset.active = String(n === i);
          });
        if (result) result.textContent = `${i + 1} / 4 — ${plan.steps[i].text}`;
      }, i * interval),
    );
  }
  timers.push(
    window.setTimeout(() => {
      running = false;
      run.disabled = false;
      if (result)
        result.textContent =
          "Example complete. The handoffs are connected. Nothing was sent or stored.";
    }, 4 * interval),
  );
});
window.addEventListener("reachly:motion", () => {
  if (running) {
    clearRun();
    if (result)
      result.textContent =
        "Example paused. Choose Run the example to start again.";
  }
});
window.addEventListener("pagehide", (event) => {
  if (event.persisted) return;
  clearRun();
  context?.revert();
  disposeField?.();
  chapterObserver.disconnect();
  window.removeEventListener("reachly:motion", motion);
});
