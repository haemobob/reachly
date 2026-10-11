import { shouldAnimate } from "../lib/motion-state";
const root = document.documentElement;
const media = matchMedia("(prefers-reduced-motion: reduce)");
let paused = false;
try {
  paused = localStorage.getItem("reachly-motion") === "paused";
} catch {
  /* Private browsing can block preference storage. */
}
function syncMotion() {
  const animate = shouldAnimate(media.matches, paused);
  root.dataset.motion = animate ? "running" : "paused";
  document
    .querySelectorAll<HTMLButtonElement>(".motion-toggle")
    .forEach((button) => {
      button.setAttribute("aria-pressed", String(!animate));
      button.setAttribute(
        "aria-label",
        media.matches
          ? "Reduced motion enabled by your system"
          : animate
            ? "Pause motion"
            : "Resume motion",
      );
      button.innerHTML = `<span aria-hidden="true">${animate ? "Ⅱ" : "▷"}</span>`;
    });
  window.dispatchEvent(
    new CustomEvent("reachly:motion", { detail: { animate } }),
  );
}
syncMotion();
media.addEventListener("change", syncMotion);
document.querySelectorAll(".motion-toggle").forEach((button) =>
  button.addEventListener("click", () => {
    paused = !paused;
    try {
      localStorage.setItem("reachly-motion", paused ? "paused" : "running");
    } catch {
      /* Motion works without saved preferences. */
    }
    syncMotion();
  }),
);
const menu = document.querySelector<HTMLDialogElement>("#site-menu");
const open = document.querySelector<HTMLButtonElement>(".menu-open");
const close = document.querySelector<HTMLButtonElement>(".menu-close");
let previousOverflow = "";
open?.addEventListener("click", () => {
  if (!menu) return;
  previousOverflow = document.body.style.overflow;
  menu.showModal();
  document.body.style.overflow = "hidden";
  close?.focus();
});
close?.addEventListener("click", () => menu?.close());
menu?.addEventListener("close", () => {
  document.body.style.overflow = previousOverflow;
  open?.focus();
});
menu?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const targets = [
    ...menu.querySelectorAll<HTMLElement>("a[href],button:not([disabled])"),
  ];
  const first = targets[0],
    last = targets.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
});
menu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", () => menu.close()));
