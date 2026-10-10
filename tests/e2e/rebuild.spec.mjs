import { test, expect } from '@playwright/test';

test('rebuild: immersive pavilion replaces the old poster grid', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hero-poster')).toHaveCount(0);
  await expect(page.locator('#world-canvas')).toBeVisible();
  await expect(page.locator('.world-fallback')).toHaveCount(1);
  await expect(page.locator('.hero-bottom')).toHaveCount(0);
  await expect(page.locator('.hero-solid')).toHaveText('BIG PRESENCE.');
  if (page.viewportSize().width >= 1440) {
    const size = await page.locator('#hero-title').evaluate(el => parseFloat(getComputedStyle(el).fontSize));
    expect(size).toBeGreaterThan(135);
  }
  await expect(page.locator('main > section').nth(1)).toHaveAttribute('id', 'projects');
});

test('rebuild: client project rail browses without moving the whole page sideways', async ({ page }) => {
  await page.goto('/');
  const rail = page.locator('#project-rail');
  await rail.scrollIntoViewIfNeeded();
  expect(await rail.evaluate(el => el.scrollWidth > el.clientWidth + 10)).toBe(true);
  await page.getByRole('button', { name: 'Next client projects' }).click();
  await expect.poll(() => rail.evaluate(el => el.scrollLeft)).toBeGreaterThan(20);
  await page.locator('.project-card').last().focus();
  await expect(page.locator('.project-card').last()).toBeFocused();
  const edges = await page.locator('.project-card').last().evaluate(el => {
    const a = el.getBoundingClientRect(), b = el.parentElement.getBoundingClientRect();
    return { right: a.right, railRight: b.right };
  });
  expect(edges.right).toBeLessThanOrEqual(edges.railRight + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});

test('rebuild: close menu stays on-screen when opened further down the page', async ({ page }) => {
  await page.goto('/');
  await page.locator('#projects').scrollIntoViewIfNeeded();
  // Exercise the menu state without Playwright scrolling the header into view first.
  await page.locator('.menu-toggle').evaluate(button => button.click());
  const box = await page.locator('#mobile-menu .menu-close').boundingBox();
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.y + box.height).toBeLessThanOrEqual(page.viewportSize().height);
  await page.locator('#mobile-menu .menu-close').click();
  await expect(page.locator('main')).not.toHaveAttribute('inert', '');
});

test('rebuild: closing surfaces keep contrasting keyboard focus', async ({ page }) => {
  await page.goto('/');
  for (const selector of ['.contact .project-open', '.footer .privacy-open']) {
    await page.locator(selector).focus();
    await expect(page.locator(selector)).toHaveCSS('outline-color', selector.startsWith('.contact') ? 'rgb(23, 70, 58)' : 'rgb(212, 231, 81)');
  }
});

test('rebuild: image spot controls retain touch-sized targets', async ({ page }) => {
  await page.goto('/');
  for (const button of await page.locator('.spotlight-button').all()) {
    const box = await button.boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
});

test('rebuild: menu hands focus to the native planner and restores the close control', async ({ page }) => {
  await page.goto('/');
  await page.locator('.menu-toggle').click();
  await page.locator('#mobile-menu .project-open').click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  expect(await page.locator('main').evaluate(el => el.inert)).toBe(false);
  await page.keyboard.press('Tab');
  expect(await page.locator('#project-dialog').evaluate(el => el.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-toggle')).toBeFocused();
});

test('rebuild: all-screen menu isolates background and contains keyboard focus', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  expect(await page.locator('main').evaluate(el => el.inert)).toBe(true);
  await expect(page.locator('#mobile-menu a').first()).toBeFocused();
  await expect(page.locator('#mobile-menu').getByRole('button', { name: 'Close menu', exact: true })).toBeVisible();
  expect(await page.locator('.header').evaluate(el => el.inert)).toBe(true);
  for (const key of ['Tab', 'Shift+Tab']) {
    for (let i = 0; i < 9; i++) {
      await page.keyboard.press(key);
      expect(await page.evaluate(() => document.querySelector('#mobile-menu').contains(document.activeElement))).toBe(true);
    }
  }
  await page.keyboard.press('Escape');
  expect(await page.locator('main').evaluate(el => el.inert)).toBe(false);
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.locator('#mobile-menu a[href="#services"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(await page.locator('main').evaluate(el => el.inert)).toBe(false);
});


test('rebuild: simultaneous process stages do not advertise a false current step', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: 'html { scroll-behavior:auto!important }' });
  expect(await page.evaluate(() => window.ScrollTrigger.getAll().filter(t => t.trigger?.matches('.process-step')).length)).toBe(0);
  await expect(page.locator('.process-step.active')).toHaveCount(0);
  await expect(page.locator('.process-step')).toHaveCount(5);
  if (page.viewportSize().width < 1000) return;
  const move = progress => page.evaluate(p => {
    const t = window.ScrollTrigger.getAll().find(t => t.vars.trigger === '.process-track');
    window.scrollTo(0, t.start + (t.end - t.start) * p);
    window.ScrollTrigger.update();
  }, progress);
  const scale = () => page.locator('.process-rail > span').evaluate(el => Number(window.gsap.getProperty(el, 'scaleX')));
  await move(.1);
  await expect.poll(scale).toBeLessThan(.3);
  await move(.9);
  await expect.poll(scale).toBeGreaterThan(.7);
  const heightScale = await page.locator('.process-rail > span').evaluate(el => Number(window.gsap.getProperty(el, 'scaleY')));
  expect(heightScale).toBeCloseTo(1, 2);
  await expect(page.locator('.process-step.active')).toHaveCount(0);
});
