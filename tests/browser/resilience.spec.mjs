import { test, expect } from "@playwright/test";
for (const finalPreference of ["reduce", "no-preference"]) {
  test(`pending renderer import respects final motion preference: ${finalPreference}`, async ({
    page,
  }) => {
    let release;
    let requested = false;
    const gate = new Promise((resolve) => {
      release = resolve;
    });
    await page.route("**/*ribbon-world*.js", async (route) => {
      requested = true;
      await gate;
      await route.continue();
    });
    await page.goto("/possibilities/", { waitUntil: "domcontentloaded" });
    await expect.poll(() => requested).toBe(true);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
    if (finalPreference === "no-preference") {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await expect(page.locator("html")).toHaveAttribute(
        "data-motion",
        "running",
      );
    }
    const downloaded = page.waitForResponse((response) =>
      /ribbon-world.*\.js/.test(response.url()),
    );
    release();
    await (await downloaded).finished();
    await page.waitForTimeout(500);
    await expect(page.locator("#signal-art canvas")).toHaveCount(
      finalPreference === "reduce" ? 0 : 1,
    );
  });
}
test("intrinsic screenshot attributes match the supplied capture", async ({
  page,
}) => {
  await page.goto("/");
  const image = page.locator(".hero-project img");
  await expect(image).toHaveAttribute("height", "845");
});
test("chapter entry aligns the section below its sticky navigation", async ({
  page,
}) => {
  await page.goto("/possibilities/#frame");
  await page.evaluate(() => document.fonts.ready);
  const gap = () =>
    page.evaluate(
      () =>
        document.querySelector("#frame").getBoundingClientRect().top -
        document.querySelector(".chapter-nav").getBoundingClientRect().bottom,
    );
  await expect.poll(gap).toBeGreaterThanOrEqual(0);
  await expect.poll(gap).toBeLessThanOrEqual(26);
});
test("renderer failure preserves the exhibition and controls", async ({
  page,
}) => {
  await page.route("**/*ribbon-world*", (route) => route.abort());
  await page.goto("/possibilities/");
  await expect(page.locator("#signal-art canvas")).toHaveCount(0);
  await expect(page.locator(".signal-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Reach", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Reach", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Run the example" }).click();
  await expect(page.locator("#flow-result")).toContainText(
    "Nothing was sent or stored.",
    { timeout: 8000 },
  );
});
test("loss of WebGL returns to visible artwork after perspective changes", async ({
  page,
}) => {
  await page.goto("/possibilities/");
  await expect(page.locator("#signal-art canvas")).toHaveCount(1, {
    timeout: 10000,
  });
  await expect(page.locator("#signal-art")).toHaveAttribute(
    "data-rendered",
    "true",
  );
  await page
    .locator("#signal-art canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.locator("#signal-art")).toHaveAttribute(
    "data-rendered",
    "false",
  );
  await page.getByRole("button", { name: "Flow", exact: true }).click();
  await expect(page.locator("#signal-art")).toHaveAttribute(
    "data-rendered",
    "false",
  );
  await expect(page.locator(".signal-fallback")).toHaveCSS("opacity", "1");
});
test("pagehide to the back-forward cache does not dispose the exhibition", async ({
  page,
}) => {
  await page.goto("/possibilities/");
  await expect(page.locator("#signal-art canvas")).toHaveCount(1, {
    timeout: 10000,
  });
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent("pagehide", { persisted: true }),
    ),
  );
  await page.evaluate(() =>
    window.dispatchEvent(
      new PageTransitionEvent("pageshow", { persisted: true }),
    ),
  );
  await expect(page.locator("#signal-art canvas")).toHaveCount(1);
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
});
test("chapter history returns through browser Back and supports direct entry", async ({
  page,
}) => {
  await page.goto("/possibilities/#frame");
  await expect(page.locator("#frame h2")).toBeVisible();
  await page.locator("[data-chapter=connect]").click();
  await expect(page).toHaveURL(/#connect$/);
  await page.goBack();
  await expect(page).toHaveURL(/#frame$/);
  await expect(page.locator("#frame h2")).toBeVisible();
  await page.goto("/contact/?interest=seo");
  await page.goBack();
  await expect(page).toHaveURL(/#frame$/);
  await expect(page.locator(".portal-image")).toBeVisible();
});
test("all local links in built HTML resolve", async ({ page, request }) => {
  const paths = new Set([
    "/",
    "/possibilities/",
    "/work/",
    "/services/",
    "/contact/",
    "/about/",
    "/privacy/",
  ]);
  const tested = new Set();
  for (const path of paths) {
    await page.goto(path);
    for (const href of await page
      .locator("a[href]")
      .evaluateAll((els) => els.map((a) => a.getAttribute("href")))) {
      if (!href.startsWith("/") || href.startsWith("//")) continue;
      const target = href.split("#")[0];
      if (tested.has(target)) continue;
      tested.add(target);
      expect((await request.get(target)).status(), target).toBe(200);
    }
  }
});
test("main content and ordinary links remain usable without JavaScript", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL: testInfo.project.use.baseURL,
  });
  const page = await context.newPage();
  for (const path of ["/", "/possibilities/", "/contact/"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('footer a[href="/work/"]')).toBeVisible();
  }
  await context.close();
});
