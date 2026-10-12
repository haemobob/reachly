import { workflowFor } from "../lib/workflow";
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
  if (!event.persisted) clearRun();
});
