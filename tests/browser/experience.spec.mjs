import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const routes = [
  "/",
  "/possibilities/",
  "/work/",
  "/work/sellaku/",
  "/work/mac-one-indonesia/",
  "/work/crypto-radius/",
  "/work/crypto-galaxy/",
  "/services/",
  "/services/website-design-development/",
  "/services/digital-presence/",
  "/services/digital-strategy/",
  "/services/business-automation/",
  "/services/seo/",
  "/about/",
  "/contact/",
  "/privacy/",
];
test("every route has readable content, loaded imagery and no page errors", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
      route,
    ).toBe(true);
    expect(
      await page
        .locator("img")
        .evaluateAll((imgs) =>
          imgs
            .filter((i) => i.loading !== "lazy")
            .every((i) => i.complete && i.naturalWidth > 0),
        ),
      route,
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("slashless supporting routes remain navigable", async ({ request }) => {
  for (const route of [
    "/work",
    "/contact",
    "/services",
    "/about",
    "/possibilities",
  ])
    expect((await request.get(route)).status(), route).toBe(200);
});
test("supporting routes never download the ribbon world", async ({ page }) => {
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  await page.goto("/contact/");
  await page.waitForTimeout(800);
  expect(requests.some((url) => /ribbon-world|three/i.test(url))).toBe(false);
});
test("chapter links, perspective and example workflow work", async ({
  page,
}) => {
  await page.goto("/possibilities/");
  await page.getByRole("button", { name: "Flow", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Flow", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.locator("[data-chapter=connect]").click();
  await expect(page).toHaveURL(/#connect$/);
  await page
    .getByRole("button", { name: "Follow-up request", exact: true })
    .click();
  await expect(page.locator('[data-node="1"] h3')).toHaveText("Prioritize");
  await page.getByRole("button", { name: "Run the example" }).click();
  await expect(page.locator("#flow-result")).toContainText(
    "Nothing was sent or stored.",
    { timeout: 8000 },
  );
  await page.locator("[data-chapter=further]").click();
  await expect(page.locator("#further h2")).toBeVisible();
});
test("motion pause and reduced-motion fallback keep the journeys available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/possibilities/?renderer=off#frame");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await expect(page.locator(".portal-image")).toBeVisible();
  expect(await page.locator("#signal-art canvas").count()).toBe(0);
  await page.getByRole("button", { name: "Run the example" }).click();
  await expect(page.locator("#flow-result")).toContainText(
    "Nothing was sent or stored.",
  );
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.getByRole("button", { name: "Pause motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "paused");
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "running");
});
test("mobile menu contains keyboard focus and closes with Escape", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "Mobile menu");
  await page.goto("/");
  await page.getByRole("button", { name: "Menu", exact: false }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() =>
        document.querySelector("dialog").contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(
    page.getByRole("button", { name: "Menu", exact: false }),
  ).toBeFocused();
});
for (const route of ["/", "/possibilities/", "/contact/", "/services/"])
  test(`automated accessibility ${route}`, async ({ page }) => {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
