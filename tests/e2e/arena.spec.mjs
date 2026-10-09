import { test, expect } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';

const origin = 'http://127.0.0.1:4173';

test('existing behavior: local page loads without application errors', async ({ page }) => {
  const errors = [];
  const badResponses = [];
  const externalRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push(response.status() + ' ' + response.url());
  });
  page.on('request', request => {
    if (/^https?:/.test(request.url()) && new URL(request.url()).origin !== origin) {
      externalRequests.push(request.url());
    }
  });
  await page.goto('/');
  await expect(page.locator('#hero-title')).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.footer').scrollIntoViewIfNeeded();
  await page.locator('#main').scrollIntoViewIfNeeded();
  expect(errors).toEqual([]);
  expect(badResponses).toEqual([]);
  expect(externalRequests).toEqual([]);
});

test('existing behavior: five services keep keyboard selection and brief goals', async ({ page }) => {
  await page.goto('/');
  const ids = ['tab-web', 'tab-presence', 'tab-strategy', 'tab-automation', 'tab-seo'];
  await expect(page.locator('.service-tab')).toHaveCount(5);
  await page.locator('#tab-web').focus();
  await page.keyboard.press('End');
  await expect(page.locator('#tab-seo')).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#tab-web')).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(page.locator('#tab-seo')).toBeFocused();
  await page.keyboard.press('Home');
  for (const [index, id] of ids.entries()) {
    if (index) await page.keyboard.press('ArrowDown');
    await expect(page.locator('#' + id)).toBeFocused();
    await expect(page.locator('#' + id)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#service-panel')).toHaveAttribute('aria-labelledby', id);
    await expect(page.locator('.service-tab[aria-selected="true"]')).toHaveCount(1);
    await expect(page.locator('.service-tab[tabindex="0"]')).toHaveCount(1);
  }
  for (const id of ids) {
    await page.locator('#' + id).click();
    const goal = await page.locator('.service-project').getAttribute('data-goal');
    await page.locator('.service-project').click();
    await expect(page.locator('#project-dialog')).toBeVisible();
    expect(await page.locator('#project-form input[name="goals"]:checked').evaluateAll(inputs => inputs.map(input => input.value))).toContain(goal);
    await page.keyboard.press('Escape');
    await expect(page.locator('.service-project')).toBeFocused();
    await page.locator('#' + id).focus();
  }
});

test('existing behavior: hero keyboard concept changes and comparison yields to input', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero-stage').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#hero-demo-number')).toHaveText('02');
  await page.keyboard.press('Space');
  await expect(page.locator('#hero-demo-number')).toHaveText('03');
  await page.keyboard.press('Enter');
  await expect(page.locator('#hero-demo-number')).toHaveText('01');
  await page.locator('#compare-range').focus();
  await page.locator('#compare-range').evaluate(input => {
    input.value = '35';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await expect(page.locator('.comparison')).toHaveCSS('--split', '35%');
  await page.locator('.footer').scrollIntoViewIfNeeded();
  await expect(page.locator('#compare-range')).toHaveValue('35');
});

test('existing behavior: concept image spot buttons and tabs select real local images', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.spotlight-button')).toHaveCount(2);
  for (const index of [2, 0]) {
    const button = page.locator('.spotlight-button[data-explore="' + index + '"]');
    await button.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#concept-panel')).toBeFocused();
    await expect(page.locator('#concept-panel')).toHaveAttribute('aria-labelledby', 'concept-tab-' + index);
    await expect(page.locator('#concept-number')).toHaveText(String(index + 1).padStart(2, '0'));
  }
  await page.locator('#concept-tab-0').focus();
  const images = ['coffee.jpg', 'flowers.jpg', 'interior.jpg'];
  for (const [index, image] of images.entries()) {
    if (index) await page.keyboard.press('ArrowRight');
    await expect(page.locator('#concept-tab-' + index)).toBeFocused();
    await expect(page.locator('#concept-tab-' + index)).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#concept-panel')).toHaveAttribute('aria-labelledby', 'concept-tab-' + index);
    await expect(page.locator('#concept-photo')).toHaveAttribute('src', 'assets/' + image);
    await expect.poll(() => page.locator('#concept-photo').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  }
  await page.locator('#concept-next').click();
  await expect(page.locator('#concept-number')).toHaveText('01');
});

test('existing behavior: mobile menu closes accessibly with Escape', async ({ page }) => {
  test.skip(page.viewportSize().width > 740, 'mobile-only control');
  await page.goto('/');
  const menu = page.locator('#mobile-menu');
  expect(await menu.evaluate(element => element.inert)).toBe(true);
  await page.locator('.menu-toggle').click();
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');
  expect(await menu.evaluate(element => element.inert)).toBe(false);
  await page.locator('#mobile-menu a').first().focus();
  await page.keyboard.press('Escape');
  await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.menu-toggle')).toBeFocused();
  expect(await menu.evaluate(element => element.inert)).toBe(true);
  await page.locator('#mobile-menu a').first().evaluate(link => link.focus());
  await expect(page.locator('.menu-toggle')).toBeFocused();
});

test('existing behavior: native planner validation, local draft recovery, copy and download', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin });
  const submissions = [];
  // These journeys must never submit data, even if a later implementation regresses.
  await page.route('**/*', route => {
    const request = route.request();
    if (/^https?:/.test(request.url()) && (new URL(request.url()).origin !== origin || !['GET', 'HEAD'].includes(request.method()))) {
      submissions.push(request.method() + ' ' + request.url());
      return route.abort();
    }
    return route.continue();
  });
  await page.goto('/');
  await page.locator('.hero-intro .project-open').click();
  const form = page.locator('#project-form');
  await form.locator('[type="submit"]').click();
  await expect(form).toBeVisible();
  await expect(page.locator('#brief-result')).not.toBeVisible();
  expect(await form.locator('[name="name"]').evaluate(input => input.validity.valueMissing)).toBe(true);
  await form.locator('[name="name"]').fill('Alex');
  await form.locator('[name="business"]').fill('Example Café');
  await form.locator('[name="email"]').fill('not-an-email');
  const message = 'Please plan a café website. <img src=x onerror=alert(1)> is literal brief text.';
  await form.locator('[name="message"]').fill(message);
  await form.locator('[type="submit"]').click();
  expect(await form.locator('[name="email"]').evaluate(input => input.validity.typeMismatch)).toBe(true);
  await expect(page.locator('#brief-result')).not.toBeVisible();
  await form.locator('[name="email"]').fill('alex@example.com');
  await form.locator('[name="goals"][value="Digital presence"]').check();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('reachly-project-draft-v1')))).toMatchObject({ name: 'Alex', business: 'Example Café', email: 'alex@example.com', message });
  await page.reload();
  await page.locator('.hero-intro .project-open').click();
  await expect(form.locator('[name="name"]')).toHaveValue('Alex');
  await expect(form.locator('[name="business"]')).toHaveValue('Example Café');
  await expect(form.locator('[name="email"]')).toHaveValue('alex@example.com');
  await expect(form.locator('[name="message"]')).toHaveValue(message);
  await expect(form.locator('[name="goals"][value="Digital presence"]')).toBeChecked();
  await form.locator('[type="submit"]').click();
  await expect(form).not.toBeVisible();
  await expect(page.locator('#brief-result')).toBeVisible();
  await expect(page.locator('#download-brief')).toBeFocused();
  const brief = await page.locator('#brief-text').textContent();
  expect(brief).toContain('Name: Alex');
  expect(brief).toContain('Business: Example Café');
  expect(brief).toContain('Email: alex@example.com');
  expect(brief).toContain('Digital presence');
  expect(brief).toContain(message);
  expect(brief).toContain('This brief has not been submitted.');
  await expect(page.locator('#brief-text img')).toHaveCount(0);
  await page.locator('#copy-brief').click();
  await expect(page.locator('#copy-status')).toHaveText('Copied. Your brief is ready to share.');
  // The native Windows clipboard converts LF to CRLF; content must otherwise match exactly.
  expect((await page.evaluate(() => navigator.clipboard.readText())).replace(/\r\n/g, '\n')).toBe(brief);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download-brief').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('reachly-project-brief.txt');
  expect(readFileSync(await download.path(), 'utf8')).toBe(brief);
  await page.locator('#edit-brief').click();
  await expect(form.locator('[name="name"]')).toBeFocused();
  await expect(form.locator('[name="message"]')).toHaveValue(message);
  expect(submissions).toEqual([]);
});

test('existing behavior: privacy disclosure erases local draft and rendered brief', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero-intro .project-open').click();
  const form = page.locator('#project-form');
  for (const [name, value] of Object.entries({ name: 'Alex', business: 'Example Café', email: 'alex@example.com', message: 'A local test brief.' })) {
    await form.locator('[name="' + name + '"]').fill(value);
  }
  await form.locator('[type="submit"]').click();
  await expect(page.locator('#brief-result')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('.privacy-open').click();
  await expect(page.locator('#privacy-dialog')).toBeVisible();
  await expect(page.locator('#privacy-dialog')).toContainText('no analytics or advertising trackers');
  await expect(page.locator('#privacy-dialog')).toContainText('Nothing is submitted to Reachly.');
  await page.locator('#clear-draft').click();
  await expect(page.locator('#privacy-status')).toHaveText('Your saved project draft has been cleared from this browser.');
  expect(await page.evaluate(() => localStorage.getItem('reachly-project-draft-v1'))).toBeNull();
  await page.keyboard.press('Escape');
  await expect(page.locator('.privacy-open')).toBeFocused();
  await page.locator('.hero-intro .project-open').click();
  await expect(form).toBeVisible();
  await expect(page.locator('#brief-text')).toHaveText('');
  for (const name of ['name', 'business', 'email', 'message']) await expect(form.locator('[name="' + name + '"]')).toHaveValue('');
  await page.reload();
  await page.locator('.hero-intro .project-open').click();
  await expect(form.locator('[name="name"]')).toHaveValue('');
});

test('existing behavior: reduced motion exposes content without triggers', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#motion-toggle')).toBeDisabled();
  expect(await page.evaluate(() => window.ScrollTrigger.getAll().length)).toBe(0);
  await expect(page.locator('.process-step')).toHaveCount(5);
  for (const selector of ['#services-title', '#projects-title', '#work-title', '#process-title']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(selector)).toBeVisible();
    await expect(page.locator(selector)).toHaveCSS('opacity', '1');
  }
});

test('existing behavior: no JavaScript leaves primary content usable', async ({ browser }, testInfo) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: testInfo.project.use.viewport });
  try {
    const page = await context.newPage();
    await page.goto(origin + '/');
    await expect(page.locator('#hero-title')).toBeVisible();
    await expect(page.locator('.project-card')).toHaveCount(4);
    await expect(page.locator('.service-tab')).toHaveCount(5);
    await expect(page.locator('.process-step')).toHaveCount(5);
    await page.locator('#projects').scrollIntoViewIfNeeded();
    await expect(page.locator('#projects-title')).toBeVisible();
  } finally { await context.close(); }
});

test('existing behavior: missing GSAP does not hide essential content', async ({ page }) => {
  await page.route('**/vendor/*.js', route => route.abort());
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  expect(await page.evaluate(() => typeof window.gsap)).toBe('undefined');
  expect(await page.evaluate(() => typeof window.ScrollTrigger)).toBe('undefined');
  for (const selector of ['#hero-title', '#services-title', '#projects-title', '#process-title']) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await expect(page.locator(selector)).toBeVisible();
  }
  await page.locator('#tab-seo').click();
  await expect(page.locator('#service-panel')).toHaveAttribute('aria-labelledby', 'tab-seo');
  await page.locator('.service-project').click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  expect(errors).toEqual([]);
});

test('existing behavior: live motion pauses and resumes without duplicate triggers', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => window.ScrollTrigger?.getAll().length > 0);
  await page.locator('.footer').scrollIntoViewIfNeeded();
  // The once-only statement reveal disposes its trigger after playing; compare settled lifecycles.
  await page.waitForFunction(() => !window.ScrollTrigger.getAll().some(trigger => trigger.vars.once));
  const before = await page.evaluate(() => window.ScrollTrigger.getAll().length);
  for (let cycle = 0; cycle < 2; cycle++) {
    await page.locator('#motion-toggle').click();
    await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'true');
    expect(await page.evaluate(() => window.ScrollTrigger.getAll().length)).toBe(0);
    for (const selector of ['.portfolio', '.project-visual', '.concept-image']) {
      expect(await page.locator(selector).first().evaluate(element => element.style.clipPath)).toBe('');
    }
    await page.locator('#motion-toggle').click();
    await expect(page.locator('#motion-toggle')).toHaveAttribute('aria-pressed', 'false');
    expect(await page.evaluate(() => window.ScrollTrigger.getAll().length)).toBe(before);
  }
  await page.locator('#compare-range').evaluate(input => {
    input.value = '35';
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await page.locator('.footer').scrollIntoViewIfNeeded();
  await expect(page.locator('#compare-range')).toHaveValue('35');
});

test('design: approved brand tokens and proportionate lockups', async ({ page }) => {
  await page.goto('/');
  const tokens = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    return Object.fromEntries(['--paper', '--ink', '--lime', '--green'].map(key => [key, css.getPropertyValue(key).trim().toUpperCase()]));
  });
  expect(tokens).toEqual({ '--paper': '#FAF7F0', '--ink': '#05100E', '--lime': '#D4E751', '--green': '#17463A' });
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(250, 247, 240)');
  for (const selector of ['.header .logo img', '.footer .logo img']) {
    const ratioError = await page.locator(selector).evaluate(img => {
      const rect = img.getBoundingClientRect();
      // SVG natural dimensions can round fractional default heights; use the exact viewBox dimensions.
      return Math.abs(rect.width / rect.height - Number(img.getAttribute('width')) / Number(img.getAttribute('height')));
    });
    expect(ratioError).toBeLessThan(0.02);
    const width = page.viewportSize().width;
    await expect(page.locator(selector)).toHaveCSS('width', (width <= 380 ? 112 : width <= 740 ? 128 : 172) + 'px');
  }
  await expect(page.locator('.header')).toHaveCSS('position', 'relative');
});

test('design: editorial hero hierarchy with contained device previews', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator('.hero-line').first()).toHaveCSS('-webkit-text-stroke-width', '1px');
  await expect(page.locator('.hero-second em')).toHaveCSS('font-style', 'normal');
  await expect(page.locator('.hero-stage')).toHaveCSS('overflow', 'clip');
  await expect(page.locator('.hero-stage')).toHaveCSS('contain', 'paint');
  await expect(page.locator('.hero-browser .browser-chrome')).toBeVisible();
  await expect(page.locator('.phone .phone-notch')).toBeVisible();
  const stage = await page.locator('.hero-stage').boundingBox();
  const caption = await page.locator('.hero-demo-caption').boundingBox();
  expect(caption.y).toBeGreaterThanOrEqual(stage.y + stage.height);
  if (page.viewportSize().width >= 1000) {
    const title = await page.locator('#hero-title').boundingBox();
    expect(stage.x).toBeGreaterThan(title.x + title.width - 1);
    expect(Math.abs(stage.y - title.y)).toBeLessThan(8);
  }
});

test('design: intentional surface rhythm and offset client work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.services')).toHaveCSS('background-color', 'rgb(250, 247, 240)');
  await expect(page.locator('.portfolio')).toHaveCSS('background-color', 'rgb(5, 16, 14)');
  await expect(page.locator('.process')).toHaveCSS('background-color', 'rgb(23, 70, 58)');
  await expect(page.locator('.contact')).toHaveCSS('background-color', 'rgb(212, 231, 81)');
  await expect(page.locator('.footer')).toHaveCSS('background-color', 'rgb(5, 16, 14)');
  await expect(page.locator('.project-card')).toHaveCount(4);
  await expect(page.locator('.project-browser-bar')).toHaveCount(4);
  const first = await page.locator('.project-card').nth(0).boundingBox();
  const second = await page.locator('.project-card').nth(1).boundingBox();
  if (page.viewportSize().width > 740) {
    expect(second.x).toBeGreaterThan(first.x + first.width - 1);
    expect(Math.round(second.y - first.y)).toBe(88);
  } else {
    expect(Math.abs(second.x - first.x)).toBeLessThan(1);
    expect(second.y).toBeGreaterThan(first.y + first.height);
  }
});

test('design: planner uses brand surfaces and usable close targets', async ({ page }) => {
  await page.goto('/');
  await page.locator('.hero-intro .project-open').click();
  await expect(page.locator('#project-dialog')).toBeVisible();
  await expect(page.locator('#project-dialog')).toHaveCSS('background-color', 'rgb(250, 247, 240)');
  await expect(page.locator('#project-dialog')).toHaveCSS('border-radius', '0px');
  await expect(page.locator('#project-dialog')).toHaveCSS('padding-top', '64px');
  if (page.viewportSize().width <= 740) await expect(page.locator('#mobile-menu')).toHaveCSS('visibility', 'hidden');
  const close = page.locator('#project-dialog .dialog-close');
  const rect = await close.boundingBox();
  expect(rect.width).toBeGreaterThanOrEqual(44);
  expect(rect.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press('Escape');
  await expect(page.locator('#project-dialog')).not.toBeVisible();
  await expect(page.locator('.hero-intro .project-open')).toBeFocused();
});

test('design: unselected services and process numbers remain readable', async ({ page }) => {
  await page.goto('/');
  for (const tab of await page.locator('.service-tab:not(.active)').all()) {
    await expect(tab).toHaveCSS('color', 'rgb(5, 16, 14)');
  }
  for (const number of await page.locator('.process-step:not(.active) .step-number').all()) {
    await expect(number).toHaveCSS('color', 'rgb(250, 247, 240)');
  }
});

test('design: miniature browser footer does not overlap its action', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const gap = await page.locator('.coffee-site').evaluate(site => {
    const pill = site.querySelector('.mock-pill').getBoundingClientRect();
    const footer = site.querySelector('.mock-footer').getBoundingClientRect();
    return footer.top - pill.bottom;
  });
  expect(gap).toBeGreaterThanOrEqual(3);
});

test('visual evidence: no page overflow and section screenshots', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  const sections = ['.header', '.hero', '.manifesto', '.approach', '.services', '.portfolio', '.work', '.process', '.faq', '.contact', '.footer'];
  mkdirSync('.artifacts/arena', { recursive: true });
  for (const selector of sections) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    // Keep all evidence even when an earlier section exposes overflow.
    expect.soft(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), selector + ' document overflow').toBe(true);
    const rect = await section.boundingBox();
    expect.soft(rect.x, selector + ' left edge').toBeGreaterThanOrEqual(-1);
    expect.soft(rect.x + rect.width, selector + ' right edge').toBeLessThanOrEqual(page.viewportSize().width + 1);
    await section.screenshot({ path: '.artifacts/arena/' + testInfo.project.name + '-' + selector.slice(1) + '.png', animations: 'disabled', style: '.skip-link:not(:focus) { visibility: hidden; }' });
  }
  await page.locator('.hero-intro .project-open').click();
  await page.locator('#project-dialog').screenshot({ path: '.artifacts/arena/' + testInfo.project.name + '-planner.png', animations: 'disabled' });
  await page.keyboard.press('Escape');
  await page.locator('.privacy-open').click();
  await page.locator('#privacy-dialog').screenshot({ path: '.artifacts/arena/' + testInfo.project.name + '-privacy.png', animations: 'disabled' });
});
