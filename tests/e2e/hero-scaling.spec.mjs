import { test, expect } from '@playwright/test';
import { mkdirSync } from 'node:fs';

for (const motion of ['reduce', 'no-preference']) {
  test(`hero scaling: stable device proportions through ultra-wide widths (${motion})`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium-1440', 'Wide regression runs once, not once per viewport project.');
    await page.emulateMedia({ reducedMotion: motion });
    for (const width of [1024, 1440, 1920, 2560, 3840]) {
      await page.setViewportSize({ width, height: 1280 });
      await page.goto('/');
      await page.evaluate(() => document.fonts.ready);
      if (motion === 'no-preference') {
        // Settle the entrance without removing the normal interactive 3D transform.
        await page.waitForTimeout(1800);
      }
      const geometry = await page.evaluate(() => {
        const hero = document.querySelector('.hero');
        const phone = hero.querySelector('.phone');
        const stage = hero.querySelector('.hero-stage').getBoundingClientRect();
        const device = phone.getBoundingClientRect();
        const css = getComputedStyle(hero);
        return {
          ratio: phone.offsetWidth / phone.offsetHeight,
          contentWidth: hero.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight),
          deviceRight: device.right, stageRight: stage.right,
          deviceBottom: device.bottom, stageBottom: stage.bottom,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          // Three visual lines: the second span deliberately contains a block em.
          lines: [hero.querySelector('.hero-line').firstChild,
            hero.querySelector('.hero-second').firstChild,
            hero.querySelector('.hero-second em').firstChild].map(text => {
            const range = document.createRange();
            range.selectNode(text);
            return { height: range.getBoundingClientRect().height, lineHeight: parseFloat(getComputedStyle(text.parentElement).lineHeight) };
          }),
          heroWidth: hero.getBoundingClientRect().width,
          heroLeft: hero.getBoundingClientRect().left,
          heroRight: hero.getBoundingClientRect().right,
          stageLeft: stage.left
        };
      });
      expect.soft(geometry.ratio, `${width}px phone ratio`).toBeGreaterThan(0.42);
      expect.soft(geometry.ratio, `${width}px phone ratio`).toBeLessThan(0.48);
      expect.soft(geometry.heroWidth, `${width}px bounded poster frame`).toBeLessThanOrEqual(1761);
      expect.soft(geometry.heroLeft).toBeGreaterThanOrEqual(0);
      expect.soft(geometry.heroRight).toBeLessThanOrEqual(width);
      expect.soft(geometry.stageLeft).toBeGreaterThanOrEqual(geometry.heroLeft);
      expect.soft(geometry.stageRight).toBeLessThanOrEqual(geometry.heroRight);
      expect(geometry.lines).toHaveLength(3);
      expect.soft(geometry.deviceRight, `${width}px phone right edge`).toBeLessThanOrEqual(geometry.stageRight - 1);
      expect.soft(geometry.deviceBottom, `${width}px phone bottom edge`).toBeLessThanOrEqual(geometry.stageBottom - 1);
      expect.soft(geometry.overflow, `${width}px page overflow`).toBe(false);
      for (const line of geometry.lines) {
        expect.soft(line.height, `${width}px headline line must not wrap`).toBeLessThan(line.lineHeight * 1.5);
      }
      mkdirSync('.artifacts/arena', { recursive: true });
      await page.locator('.hero').screenshot({ path: `.artifacts/arena/hero-scaling-${width}-${motion}.png` });
    }
  });
}
