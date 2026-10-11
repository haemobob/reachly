import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
test("mobile exhibition controls have 44px touch targets", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Touch layout only");
  await page.goto("/possibilities/");
  for (const selector of [
    ".motion-toggle",
    ".chapter-nav a:not(.chapter-brand)",
    "[data-perspective]",
    "[data-scenario]",
  ]) {
    const boxes = await page
      .locator(selector)
      .evaluateAll((els) =>
        els.map((e) => ({
          w: e.getBoundingClientRect().width,
          h: e.getBoundingClientRect().height,
        })),
      );
    expect(
      boxes.every((b) => b.w >= 44 && b.h >= 44),
      selector,
    ).toBe(true);
  }
});
test("brief validation, review, edit, TXT export and clear work in Chromium", async ({
  page,
}) => {
  await page.goto("/contact/?interest=seo");
  await expect(page.locator("#brief-interest")).toHaveValue("seo");
  await page.locator("#brief-prepare").click();
  await expect(page.locator("#brief-errors")).toBeVisible();
  await expect(page.locator("#brief-errors")).toBeFocused();
  await page.locator("#brief-name").fill("Browser QA");
  await page.locator("#brief-business").fill("Example business");
  await page.locator("#brief-reply").fill("qa@example.com");
  await page
    .locator("#brief-message")
    .fill(
      "We need clearer service information and a useful website for our customers.",
    );
  await page.locator("#brief-prepare").click();
  await expect(page.locator("#brief-review")).toBeVisible();
  const expected = await page.locator("#brief-preview").inputValue();
  const download = page.waitForEvent("download");
  await page.locator("#brief-download").click();
  const file = await download;
  expect(await readFile(await file.path(), "utf8")).toBe(expected);
  expect(file.suggestedFilename()).not.toContain("QA");
  await page.locator("#brief-edit").click();
  await expect(page.locator("#brief-name")).toBeFocused();
  await page.locator("#brief-clear").click();
  await expect(page.locator("#brief-name")).toHaveValue("");
  await expect(page.locator("#brief-review")).not.toBeVisible();
});
test("primary journeys fit small phones, tablets and wide screens through the scroll", async ({
  page,
}) => {
  for (const width of [320, 375, 768, 1024, 1920, 2560, 3840]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ["/", "/possibilities/"]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      for (const proportion of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate(
          (p) =>
            window.scrollTo({
              top: p * (document.documentElement.scrollHeight - innerHeight),
              behavior: "instant",
            }),
          proportion,
        );
        await page.waitForTimeout(80);
        expect(
          await page.evaluate(
            (w) => document.documentElement.scrollWidth <= w + 1,
            width,
          ),
          `${route} ${width} ${proportion}`,
        ).toBe(true);
      }
    }
  }
});
