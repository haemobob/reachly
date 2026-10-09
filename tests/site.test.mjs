import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { services, concepts, buildBrief } from '../dist/model.js';
import { frameOrbits } from '../dist/orb.js';
const root = resolve(import.meta.dirname, '..');
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const js = readFileSync(resolve(root, 'dist/app.js'), 'utf8');
const css = readFileSync(resolve(root, 'dist/style.css'), 'utf8');

test('all local page resources exist and have content', () => {
  const refs = [...html.matchAll(/(?:src|href)="([^"#]+)"/g)].map(m => m[1]);
  const fonts = [...readFileSync(resolve(root, 'dist/fonts.css'), 'utf8').matchAll(/url\(([^)]+)\)/g)].map(m => m[1]);
  for (const path of [...refs, ...fonts]) { assert.ok(existsSync(resolve(root, 'dist', path)), path); assert.ok(statSync(resolve(root, 'dist', path)).size > 100, path); }
});
test('every navigation anchor resolves to a unique element', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
});
test('every tab declares a valid accessible panel', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  for (const match of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) assert.ok(ids.includes(match[1]), match[1]);
  assert.equal((html.match(/role="tab"/g) || []).length, 6);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 2);
});
test('concepts contain local assets and deliberately distinct narratives', () => {
  assert.equal(new Set(concepts.map(c => c.brand)).size, 3);
  assert.equal(new Set(concepts.map(c => c.category)).size, 3);
  for (const concept of concepts) assert.ok(existsSync(resolve(root, 'dist', concept.image)));
  assert.equal(services.length, 3);
});
test('project export retains complete visitor data as plain text', () => {
  const result = buildBrief({ name: ' Alex ', business: ' Our café ', email: ' alex@example.com ', goals: ['A new website', 'Brand & online presence'], message: 'Multiline\nproject idea.' });
  for (const text of ['Name: Alex', 'Business: Our café', 'Email: alex@example.com', 'A new website, Brand & online presence', 'Multiline\nproject idea.', 'This brief has not been submitted.']) assert.ok(result.includes(text), text);
});
test('an empty goals selection is handled honestly', () => {
  assert.ok(buildBrief({ name:'A', business:'B', email:'a@b.com', message:'C', goals:[] }).includes('To be discussed'));
});
test('visitor-authored content is rendered as text and never submitted', () => {
  assert.ok(js.includes("$('#brief-text').textContent = brief"));
  assert.ok(!/fetch\(|XMLHttpRequest|sendBeacon/.test(js));
  assert.ok(html.includes('it doesn’t send an inquiry'));
  assert.ok(js.includes('form.reportValidity()'));
});
test('every orbital frame is deterministic, finite, and depth sorted', () => {
  for (const time of [0, 1.2, 100, 3600]) {
    const frame = frameOrbits(64, time, {orbitN:9,ghostN:30,particles:2});
    assert.deepEqual(frame, frameOrbits(64, time, {orbitN:9,ghostN:30,particles:2}));
    assert.ok(frame.dots.length > 200);
    let z = -Infinity;
    for (const d of frame.dots) { for (const key of ['x','y','z','r','white']) assert.ok(Number.isFinite(d[key]), key); assert.ok(d.r > 0); assert.ok(d.z >= z); z = d.z; }
  }
});
test('accessibility and motion fallbacks are present', () => {
  assert.ok(html.includes('class="skip-link"'));
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  for (const image of html.matchAll(/<img\b[^>]+>/g)) assert.match(image[0], /alt="[^"]+"/);
  assert.ok(css.includes('@media(prefers-reduced-motion:reduce)'));
  assert.ok(css.includes('[hidden]{display:none!important}'));
  assert.ok(js.includes("event.key === 'Home'"));
  assert.ok(js.includes("event.key === 'End'"));
  assert.ok(js.includes('comparisonManual = true'));
});
test('photography and fonts have no runtime third-party requests', () => {
  assert.ok(!html.includes('https://'));
  assert.ok(!readFileSync(resolve(root, 'dist/fonts.css'),'utf8').includes('https://'));
  assert.ok(existsSync(resolve(root,'dist/THIRD_PARTY_LICENSES.txt')));
  assert.ok(existsSync(resolve(root,'dist/assets/BarlowCondensed-OFL.txt')));
  assert.ok(existsSync(resolve(root,'dist/assets/Manrope-OFL.txt')));
});
