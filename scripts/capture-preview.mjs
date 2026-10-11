import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const base = "http://127.0.0.1:4321";
const out = path.resolve(".artifacts/dual");
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const report = [];
try {
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const context = await browser.newContext({
      viewport: { width, height },
      isMobile: device === "mobile",
      hasTouch: device === "mobile",
    });
    for (const [name, route, sections] of [
      [
        "studio",
        "/",
        [
          ".selected-work",
          ".studio-belief",
          ".studio-services",
          ".studio-process",
          ".possibilities-invite",
          ".studio-close",
        ],
      ],
      [
        "possibilities",
        "/possibilities/",
        ["#frame", ".portal", ".exhibit-gallery", "#connect", "#further"],
      ],
    ]) {
      const page = await context.newPage();
      const errors = [],
        failed = [],
        remote = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400)
          failed.push({ url: r.url(), status: r.status() });
      });
      page.on("request", (r) => {
        if (
          !r.url().startsWith(base) &&
          !r.url().startsWith("data:") &&
          !r.url().startsWith("blob:")
        )
          remote.push(r.url());
      });
      await page.addInitScript(() => {
        window.localMetrics = { lcp: 0, cls: 0, longTasks: 0 };
        for (const type of [
          "largest-contentful-paint",
          "layout-shift",
          "longtask",
        ]) {
          new PerformanceObserver((list) => {
            for (const e of list.getEntries()) {
              if (type === "largest-contentful-paint")
                window.localMetrics.lcp = e.startTime;
              if (type === "layout-shift" && !e.hadRecentInput)
                window.localMetrics.cls += e.value;
              if (type === "longtask") window.localMetrics.longTasks++;
            }
          }).observe({ type, buffered: true });
        }
      });
      await page.goto(base + route);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500);
      await page.screenshot({
        path: path.join(out, `${name}-${device}-opening.png`),
      });
      const initial = await page.evaluate(() => ({
        ...window.localMetrics,
        resources: performance
          .getEntriesByType("resource")
          .map((e) => ({ name: e.name, bytes: e.encodedBodySize })),
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      const captures = [];
      for (const [i, selector] of sections.entries()) {
        await page
          .locator(selector)
          .evaluate((el) =>
            window.scrollTo({
              top: el.getBoundingClientRect().top + scrollY - 60,
              behavior: "instant",
            }),
          );
        await page.waitForTimeout(650);
        const filename = `${name}-${device}-${String(i + 1).padStart(2, "0")}.png`;
        await page.screenshot({ path: path.join(out, filename) });
        captures.push({
          selector,
          file: filename,
          y: await page.evaluate(() => Math.round(scrollY)),
        });
      }
      await page.screenshot({
        path: path.join(out, `${name}-${device}-full.png`),
        fullPage: true,
      });
      report.push({
        device,
        name,
        route,
        initial,
        errors,
        failed,
        remote,
        captures,
      });
      await page.close();
    }
    await context.close();
  }
  await writeFile(
    path.join(out, "preview-evidence.json"),
    JSON.stringify(report, null, 2),
  );
  console.log(
    JSON.stringify(
      report.map(
        ({ device, name, initial, errors, failed, remote, captures }) => ({
          device,
          name,
          lcpMs: Math.round(initial.lcp),
          cls: initial.cls,
          longTasks: initial.longTasks,
          resourceBytes: initial.resources.reduce((s, r) => s + r.bytes, 0),
          errors,
          failed,
          remote,
          sectionCaptures: captures.length,
        }),
      ),
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
