import { test, expect } from "@playwright/test";
test("pausing the opening world still gives dense handoffs a readable lighting hold", async ({
  page,
}) => {
  await page.goto("/possibilities/");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.locator("[data-chapter=connect]").click();
  await expect
    .poll(() =>
      page
        .locator(".ribbon-world")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(0.4);
  await expect(page.locator(".world-stage")).toHaveAttribute(
    "data-phase",
    "0.000",
  );
});
test("handoff text stays in the world instead of cutting opaque blocks out of it", async ({
  page,
}) => {
  await page.goto("/possibilities/#connect");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(() =>
      page
        .locator(".ribbon-world")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(0.4);
  expect(
    await page
      .locator(".flow-node")
      .evaluateAll((els) =>
        els.every(
          (el) =>
            getComputedStyle(el).backgroundColor === "rgba(0, 0, 0, 0)" &&
            getComputedStyle(el).backgroundImage === "none",
        ),
      ),
  ).toBe(true);
});
test("Flow and Reach produce distinct rendered perspectives, not just selected labels", async ({
  page,
}) => {
  await page.goto("/possibilities/");
  await expect(page.locator("#signal-art")).toHaveAttribute(
    "data-rendered",
    "true",
    { timeout: 10000 },
  );
  await page.evaluate(() => {
    document.documentElement.dataset.motion = "paused";
    document
      .querySelectorAll(
        ".journey-content,.world-vector,.world-atmosphere,.world-grain,.world-hud",
      )
      .forEach((el) => (el.style.visibility = "hidden"));
  });
  await page.locator('[data-perspective="1"]').evaluate((el) => {
    if (el instanceof HTMLElement) el.click();
  });
  const flow = await page.locator(".ribbon-world canvas").screenshot();
  await page.locator('[data-perspective="2"]').evaluate((el) => {
    if (el instanceof HTMLElement) el.click();
  });
  const reach = await page.locator(".ribbon-world canvas").screenshot();
  expect(reach.equals(flow)).toBe(false);
});
test("Studio hands its opening artwork to the living ribbon without double-image ghosting", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".world-stage canvas")).toHaveCount(1, {
    timeout: 10000,
  });
  await expect(page.locator(".ribbon-world")).toHaveCSS("opacity", "0");
  await expect(page.locator(".world-path--face")).toHaveCSS("opacity", "0");
  await page.locator("#selected").evaluate((el) =>
    window.scrollTo({
      top: (el.getBoundingClientRect().top + scrollY) * 0.65,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      page
        .locator(".ribbon-world")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeGreaterThan(0.4);
  await expect
    .poll(() =>
      page
        .locator(".world-plate--atelier")
        .evaluate((el) => Number(getComputedStyle(el).opacity)),
    )
    .toBeLessThan(0.6);
});
test("one living world survives chapter travel and reverses its authored path", async ({
  page,
}) => {
  for (const route of ["/", "/possibilities/"]) {
    await page.goto(route);
    await expect(page.locator(".world-stage")).toHaveCount(1);
    await expect(page.locator(".world-stage canvas")).toHaveCount(1, {
      timeout: 10000,
    });
    await page.evaluate(() => {
      window.originalWorld = document.querySelector(".world-stage");
      window.originalCanvas = document.querySelector(".world-stage canvas");
    });
    const first = await page.locator(".world-path").first().getAttribute("d");
    await page.locator('[data-scene="2"]').evaluate((el) =>
      window.scrollTo({
        top: el.getBoundingClientRect().top + scrollY,
        behavior: "instant",
      }),
    );
    await expect
      .poll(() => page.locator(".world-stage").getAttribute("data-phase"))
      .not.toBe("0.000");
    await expect
      .poll(() => page.locator(".world-path").first().getAttribute("d"))
      .not.toBe(first);
    expect(
      await page.evaluate(
        () =>
          window.originalWorld === document.querySelector(".world-stage") &&
          window.originalCanvas ===
            document.querySelector(".world-stage canvas"),
      ),
    ).toBe(true);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect
      .poll(() => page.locator(".world-stage").getAttribute("data-phase"))
      .toBe("0.000");
  }
});
