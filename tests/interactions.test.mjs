import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { services, pointerPose, motionLimits, processStages } from '../dist/model.js';
const root = resolve(import.meta.dirname, '..');
const read = p => readFileSync(resolve(root, p), 'utf8');
function load({ enhanced = false, reduced = false, paused = false, draft = null } = {}) {
  const dom = new JSDOM(read('dist/index.html'), { url: 'https://reachly.test/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  const queries = new Map();
  w.matchMedia = query => {
    if (queries.has(query)) return queries.get(query);
    const media = new w.EventTarget();
    media.media = query;
    media.matches = query.includes('no-preference') ? !reduced : query.includes('reduce') ? reduced : query.includes('min-width') || query.includes('hover: hover');
    media.addListener = fn => media.addEventListener('change', fn);
    media.removeListener = fn => media.removeEventListener('change', fn);
    queries.set(query, media); return media;
  };
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = function() { w.lastScrollTarget = this.id; };
  w.HTMLDialogElement.prototype.showModal = function() { this.open = true; };
  w.HTMLDialogElement.prototype.close = function() { this.open = false; this.dispatchEvent(new w.Event('close')); };
  w.HTMLCanvasElement.prototype.getContext = () => null;
  w.HTMLElement.prototype.setPointerCapture = () => {};
  w.IntersectionObserver = class { observe() {} disconnect() {} };
  w.URL.createObjectURL = () => 'blob:test'; w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = function() { w.downloadName = this.download; };
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async text => { w.clipboardText = text; } } });
  if (paused) w.localStorage.setItem('reachly-motion-paused', 'true');
  if (draft) w.localStorage.setItem('reachly-project-draft-v1', JSON.stringify(draft));
  if (enhanced) {
    w.eval(read('dist/vendor/gsap.min.js'));
    w.eval(read('dist/vendor/ScrollTrigger.min.js'));
  }
  const strip = source => source.replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
  w.eval(strip(read('dist/model.js')) + '\n' + strip(read('dist/orb.js')) + '\n' + strip(read('dist/motion.js')) + '\n' + strip(read('dist/app.js')));
  return { w, doc: w.document, queries, close() { w.ScrollTrigger?.killAll(); w.gsap?.ticker.sleep(); w.close(); } };
}

test('all five services update their panel, diagram, tags and brief goal', () => {
  const env = load(); const { w, doc } = env;
  try {
    services.forEach((service, i) => {
      doc.querySelector(`[data-service="${i}"]`).click();
      assert.equal(doc.querySelector('#service-title').textContent, service.title);
      assert.equal(doc.querySelector('#service-description').textContent, service.description);
      assert.equal(doc.querySelector('.service-art').dataset.art, String(i));
      assert.equal(doc.querySelectorAll('.service-tab[aria-selected="true"]').length, 1);
      assert.deepEqual([...doc.querySelectorAll('#service-tags span')].map(x => x.textContent), service.tags);
      doc.querySelector('.service-project').click();
      assert.equal(doc.querySelector('#project-dialog').open, true);
      assert.equal([...doc.querySelectorAll('[name="goals"]')].find(el => el.value === service.goal).checked, true);
      doc.querySelector('#project-dialog').close();
    });
  } finally { env.close(); }
});

test('service and concept tabs support roving focus, arrows, Home and End', () => {
  const env = load(); const { w, doc } = env;
  try {
    const first = doc.querySelector('.service-tab'); first.focus();
    first.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    assert.equal(doc.activeElement.id, 'tab-seo');
    doc.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    assert.equal(doc.activeElement.id, 'tab-web');
    doc.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    assert.equal(doc.activeElement.id, 'tab-seo');
    doc.querySelector('#concept-tab-0').dispatchEvent(new w.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    assert.equal(doc.activeElement.id, 'concept-tab-2');
    doc.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    assert.equal(doc.activeElement.id, 'concept-tab-0');
  } finally { env.close(); }
});

test('both image spots open the matching concept on click and focus its panel', () => {
  const env = load(); const { doc, w } = env;
  try {
    for (const button of doc.querySelectorAll('.spotlight-button')) {
      button.click();
      assert.equal(doc.querySelector('#concept-panel').dataset.theme, button.dataset.explore);
      assert.equal(doc.activeElement.id, 'concept-panel');
      assert.equal(w.lastScrollTarget, 'work');
    }
  } finally { env.close(); }
});

test('brief submission, copy, download, recovery and clear preserve honest local behavior', async () => {
  const env = load(); const { w, doc } = env;
  try {
    const form = doc.querySelector('#project-form');
    for (const [name, value] of Object.entries({ name: 'Alex', business: '<img src=x onerror=alert(1)>', email: 'a@example.com', message: 'Connect forms\nand customer records.' })) form.elements[name].value = value;
    doc.querySelector('[value="Business automation"]').checked = true;
    form.dispatchEvent(new w.Event('input', { bubbles: true }));
    const saved = JSON.parse(w.localStorage.getItem('reachly-project-draft-v1'));
    assert.equal(saved.business, '<img src=x onerror=alert(1)>');
    form.dispatchEvent(new w.Event('submit', { cancelable: true }));
    const output = doc.querySelector('#brief-text');
    assert.ok(output.textContent.includes(saved.business));
    assert.ok(output.textContent.includes('This brief has not been submitted.'));
    assert.equal(output.querySelector('img'), null);
    assert.equal(form.hidden, true);
    doc.querySelector('#copy-brief').click(); await Promise.resolve();
    assert.equal(w.clipboardText, output.textContent);
    doc.querySelector('#download-brief').click(); assert.equal(w.downloadName, 'reachly-project-brief.txt');
    const recovered = load({ draft: saved });
    try { assert.equal(recovered.doc.querySelector('[name="business"]').value, saved.business); assert.equal(recovered.doc.querySelector('[value="Business automation"]').checked, true); } finally { recovered.close(); }
    doc.querySelector('#clear-draft').click();
    assert.equal(w.localStorage.getItem('reachly-project-draft-v1'), null);
    assert.equal(output.textContent, ''); assert.equal(form.hidden, false);
  } finally { env.close(); }
});

test('mobile menu Escape restores its inert state and collapsed semantics', () => {
  const env = load(); const { w, doc } = env;
  try {
    doc.querySelector('.menu-toggle').click();
    assert.equal(doc.querySelector('.menu-toggle').getAttribute('aria-expanded'), 'true');
    assert.equal(doc.querySelector('#mobile-menu').inert, false);
    doc.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(doc.querySelector('.menu-toggle').getAttribute('aria-expanded'), 'false');
    assert.equal(doc.querySelector('#mobile-menu').inert, true);
  } finally { env.close(); }
});

test('system reduced motion wins over site preferences and content stays readable', () => {
  const env = load({ reduced: true, enhanced: true });
  try {
    assert.equal(env.doc.querySelector('#motion-toggle').disabled, true);
    assert.equal(env.doc.querySelector('#motion-toggle').getAttribute('aria-pressed'), 'true');
    assert.equal(env.doc.querySelectorAll('.process-step').length, processStages.length);
    assert.equal(env.w.ScrollTrigger.getAll().length, 0);
    assert.equal(env.doc.querySelector('.goo-inner').style.filter, '');
  } finally { env.close(); }
});

test('GSAP registers effects, yields comparison to input, and cleans up on pause/resume', () => {
  const env = load({ enhanced: true }); const { w, doc } = env;
  try {
    assert.ok(doc.body.classList.contains('gsap-active'));
    assert.ok(w.ScrollTrigger.getAll().length >= 9);
    const range = doc.querySelector('#compare-range');
    range.value = '35'; range.dispatchEvent(new w.Event('input'));
    const comparison = w.ScrollTrigger.getAll().find(t => t.vars.trigger === '.comparison');
    comparison.vars.onUpdate({ progress: 1 });
    assert.equal(range.value, '35');
    doc.querySelector('#motion-toggle').click();
    assert.equal(w.ScrollTrigger.getAll().length, 0);
    assert.equal(doc.querySelector('.concept-image').style.clipPath, '');
    assert.equal(doc.querySelector('.goo-inner').style.filter, '');
    assert.equal(w.localStorage.getItem('reachly-motion-paused'), 'true');
    doc.querySelector('#motion-toggle').click();
    assert.ok(w.ScrollTrigger.getAll().length >= 9);
  } finally { env.close(); }
});

test('hover poses stay bounded across large mouse movements', () => {
  for (const [x, y] of [[0, 0], [1e6, -1e6], [-20, 20], [100, 0], [0, -100]]) {
    const pose = pointerPose(x, y);
    assert.ok(Math.hypot(pose.x, pose.y) <= motionLimits.drift + 1e-10);
    assert.ok(Math.abs(pose.rotateX) <= motionLimits.tilt);
    assert.ok(Math.abs(pose.rotateY) <= motionLimits.tilt);
    for (const value of Object.values(pose)) assert.ok(Number.isFinite(value));
  }
});

test('company source retains approved scope and does not invent operating facts', () => {
  const profile = read('COMPANY_PROFILE.md'); const html = read('dist/index.html');
  for (const name of ['Website Design & Development', 'Digital Presence', 'Digital Strategy', 'Business Automation', 'SEO']) assert.ok(profile.includes(name));
  assert.ok(profile.includes('Primary target market | Indonesia'));
  assert.ok(profile.includes('TBD'));
  assert.ok(html.includes('Indonesian SMEs'));
  assert.ok(html.includes('FUTURE DIRECTIONS'));
  assert.ok(html.includes('not delivered client projects'));
  assert.ok(!html.includes('EST. 2026'));
});

test('hero caption stays outside the draggable artwork and tracks keyboard concept changes', () => {
  const env = load(); const { w, doc } = env;
  try {
    const stage = doc.querySelector('.hero-stage');
    const caption = doc.querySelector('.hero-demo-caption');
    assert.equal(stage.contains(caption), false);
    assert.equal(stage.parentElement, caption.parentElement);
    assert.equal(caption.previousElementSibling, stage);
    stage.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert.equal(doc.querySelector('#hero-demo-number').textContent, '02');
    stage.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert.equal(doc.querySelector('#hero-demo-number').textContent, '03');
    stage.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert.equal(doc.querySelector('#hero-demo-number').textContent, '01');
  } finally { env.close(); }
});

test('comparison headline, image and footer have separate layout slots', () => {
  const dom = new JSDOM(read('dist/index.html'));
  try {
    const doc = dom.window.document;
    const style = doc.createElement('style'); style.textContent = read('dist/style.css'); doc.head.append(style);
    const site = doc.querySelector('.after-site');
    const content = doc.querySelector('.after-content');
    const title = doc.querySelector('.after-title');
    assert.equal(site.children[1], content);
    assert.equal(content.children[0], title);
    assert.equal(content.children[1].tagName, 'IMG');
    assert.equal(site.children[2].className, 'after-footer');
    assert.equal(dom.window.getComputedStyle(site).display, 'grid');
    assert.equal(dom.window.getComputedStyle(content).display, 'grid');
    assert.equal(dom.window.getComputedStyle(title).position, 'static');
    assert.ok(Number(dom.window.getComputedStyle(title).lineHeight) >= 1.1);
    for (const name of ['hero-concept-label', 'drag-hint']) assert.equal(dom.window.getComputedStyle(doc.querySelector('.' + name)).position, 'static');
  } finally { dom.window.close(); }
});

test('hero clips transformed artwork while keeping instructions outside its paint boundary', () => {
  const dom = new JSDOM(read('dist/index.html'));
  try {
    const doc = dom.window.document; const style = doc.createElement('style');
    style.textContent = read('dist/style.css'); doc.head.append(style);
    const computed = e => dom.window.getComputedStyle(e);
    const stage = doc.querySelector('.hero-stage');
    assert.equal(computed(stage).overflow, 'clip');
    assert.equal(computed(stage).contain, 'paint');
    assert.equal(stage.contains(doc.querySelector('.hero-demo-caption')), false);
    assert.equal(computed(doc.querySelector('.hero-browser')).position, 'absolute');
    assert.equal(computed(doc.querySelector('.hero-collage')).display, 'block');
    assert.equal(computed(doc.querySelector('.header')).position, 'relative');
    assert.ok(doc.querySelector('.browser-chrome'));
    assert.ok(doc.querySelector('.phone .phone-notch'));
    assert.equal(doc.querySelectorAll('.project-browser-bar').length, 4);
  } finally { dom.window.close(); }
});

test('distinct section transitions register, revert on pause and resume without duplicates', () => {
  const env = load({ enhanced: true });
  try {
    const { w, doc } = env;
    const boundaries = ['.portfolio', '.project-grid'];
    const count = name => w.ScrollTrigger.getAll().filter(t => t.vars.trigger === name).length;
    assert.equal(doc.querySelector('.section-handoff'), null);
    boundaries.forEach(name => assert.equal(count(name), 1));
    doc.querySelector('#motion-toggle').click();
    boundaries.forEach(name => assert.equal(count(name), 0));
    assert.equal(doc.querySelector('.portfolio').style.clipPath, '');
    assert.equal(doc.querySelector('.project-visual').style.clipPath, '');
    doc.querySelector('#motion-toggle').click();
    boundaries.forEach(name => assert.equal(count(name), 1));
  } finally { env.close(); }
});

test('services retain readable text contrast on the cream surface', () => {
  const css = read('dist/style.css');
  const tokens = new Map([...css.matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map(m => [m[1], m[2]]));
  const luminance = hex => {
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
    return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
  };
  const bg = luminance(tokens.get('--paper'));
  const dom = new JSDOM(read('dist/index.html'));
  try {
    const doc = dom.window.document; const style = doc.createElement('style');style.textContent = css;doc.head.append(style);
    for (const selector of ['.services', '.services-heading > p', '.service-tab', '.service-num', '.service-panel h3', '.service-panel p', '.service-caption', '.service-project', '.future-strip .micro', '.future-copy']) {
      const el = doc.querySelector(selector); const color = dom.window.getComputedStyle(el).color;
      const token = color.match(/var\((--[\w-]+)\)/)?.[1];
      assert.ok(tokens.has(token), selector + ': known text token');
      const fg = luminance(tokens.get(token));
      assert.ok((Math.max(bg, fg) + .05) / (Math.min(bg, fg) + .05) >= 4.5, selector + ': normal text contrast');
    }
  } finally { dom.window.close(); }
});
