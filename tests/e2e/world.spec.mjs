import { test, expect } from '@playwright/test';

async function settle(page) {
  await page.goto('/'); await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content:'html{scroll-behavior:auto!important}' });
}
async function atProgress(page, id, progress) {
  await page.evaluate(({id,progress}) => {
    const t = window.ScrollTrigger.getById(id);
    if (!t) throw new Error('Missing motion: '+id);
    window.scrollTo(0,t.start+(t.end-t.start)*progress); window.ScrollTrigger.update();
  }, {id,progress});
}

test('world: immersive pavilion renders with proportionate devices and no page overflow', async ({page}) => {
  const errors=[], failed=[];
  page.on('pageerror', e=>errors.push(e.message));
  page.on('response', r=>{if(r.status()>=400)failed.push(r.url());});
  await settle(page);
  await expect(page.locator('#world-canvas')).toBeVisible();
  await expect(page.locator('.hero-poster')).toHaveCount(0);
  await expect(page.locator('.signal-track')).toHaveCount(2);
  const geometry=await page.evaluate(()=>{
    const p=document.querySelector('.phone'),s=document.querySelector('.hero-stage').getBoundingClientRect(),r=p.getBoundingClientRect();
    const lines=[...document.querySelectorAll('.hero-line')].map(el=>{
      const t=document.createRange();t.selectNodeContents(el);const a=t.getBoundingClientRect(),b=el.getBoundingClientRect();
      return {left:a.left,right:a.right,height:a.height,lineHeight:parseFloat(getComputedStyle(el).lineHeight),container:b.width};
    });
    return {ratio:p.offsetWidth/p.offsetHeight,left:r.left,right:r.right,stageLeft:s.left,stageRight:s.right,bottom:r.bottom,stageBottom:s.bottom,lines,overflow:document.documentElement.scrollWidth>innerWidth+1};
  });
  expect(geometry.ratio).toBeGreaterThan(.42);expect(geometry.ratio).toBeLessThan(.48);
  expect(geometry.left).toBeGreaterThanOrEqual(geometry.stageLeft);
  expect(geometry.right).toBeLessThanOrEqual(geometry.stageRight);
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.stageBottom);
  for(const l of geometry.lines){expect(l.left).toBeGreaterThanOrEqual(0);expect(l.right).toBeLessThanOrEqual(page.viewportSize().width);expect(l.height).toBeLessThan(l.lineHeight*1.6);}
  expect(geometry.overflow).toBe(false);
  await page.locator('.footer').scrollIntoViewIfNeeded();
  expect(errors).toEqual([]);expect(failed).toEqual([]);
});

test('world: scroll gallery traverses real work and yields to direct navigation', async ({page}) => {
  test.skip(page.viewportSize().width<1000,'Desktop pin; smaller screens use native rail');
  await page.emulateMedia({reducedMotion:'no-preference'});await settle(page);
  await atProgress(page,'client-gallery',.15);
  const rail=page.locator('#project-rail');const left=await rail.evaluate(el=>el.scrollLeft);
  await atProgress(page,'client-gallery',.8);
  await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeGreaterThan(left+100);
  const automatic=await rail.evaluate(el=>el.scrollLeft);
  await page.getByRole('button',{name:'Previous client projects'}).evaluate(el=>el.click());
  await expect.poll(()=>rail.evaluate(el=>el.scrollLeft)).toBeLessThan(automatic-100);
  await page.waitForTimeout(700);
  const chosen=await rail.evaluate(el=>el.scrollLeft);
  await atProgress(page,'client-gallery',.85);
  await expect.poll(()=>rail.evaluate((el, selected)=>Math.abs(el.scrollLeft-selected),chosen)).toBeLessThan(2);
  await page.locator('.project-card').last().focus();
  await expect(page.locator('.project-card').last()).toBeFocused();
});

test('world: pause removes pins and blinds without hiding the last process stage', async ({page}) => {
  await page.emulateMedia({reducedMotion:'no-preference'});await settle(page);
  expect(await page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBeGreaterThan(0);
  await page.locator('#motion-toggle').evaluate(el=>el.click());
  expect(await page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBe(0);
  await expect(page.locator('.pin-spacer')).toHaveCount(0);
  await expect(page.locator('.image-blinds')).not.toBeVisible();
  const last=page.locator('.process-step').last();await last.scrollIntoViewIfNeeded();
  const visible=await last.evaluate(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth;});
  expect(visible).toBe(true);
  await page.locator('#motion-toggle').evaluate(el=>el.click());
  expect(await page.evaluate(()=>window.ScrollTrigger.getAll().length)).toBeGreaterThan(0);
});

test('world: canvas failure leaves a visible pavilion and functional concepts', async ({page}) => {
  await page.addInitScript(()=>{const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl'?null:get.call(this,type,...args);};});
  await settle(page);await expect(page.locator('.world-fallback')).toBeVisible();
  await page.locator('.hero-stage').press('Enter');await expect(page.locator('#hero-demo-number')).toHaveText('02');
});

test('world: lime invitation uses a contrasting keyboard focus ring', async ({page}) => {
  await settle(page);const c=page.locator('.contact .project-open');await c.focus();
  await expect(c).toHaveCSS('outline-color','rgb(23, 70, 58)');
});
