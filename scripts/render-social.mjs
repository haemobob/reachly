import { readFile } from "node:fs/promises";
import { chromium } from "playwright";
// Raster social previews are widely supported; the SVG remains editable.
const logo = await readFile(
  new URL("../public/brand/reachly-logo-black.svg", import.meta.url),
);
const source = (
  await readFile(new URL("../public/og.svg", import.meta.url), "utf8")
).replace(
  "/brand/reachly-logo-black.svg",
  `data:image/svg+xml;base64,${logo.toString("base64")}`,
);
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  });
  await page.setContent(`<html><body style="margin:0">${source}</body></html>`);
  await page.locator("svg").waitFor();
  await page.screenshot({
    path: new URL("../public/og.png", import.meta.url).pathname.replace(
      /^\/(\w:)/,
      "$1",
    ),
  });
  console.log(
    "Rendered public/og.png at 1200 × 630 using the intact official logo.",
  );
} finally {
  await browser.close();
}
