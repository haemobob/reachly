import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
const root = resolve(import.meta.dirname, '..');
const source = resolve(root, 'brand/Reachly-Brand-Kit');
const runtime = resolve(root, 'dist/assets/brand');
const files = [
  'reachly-logo-black.svg', 'reachly-logo-white.svg', 'reachly-icon.svg',
  'favicon.ico', 'site.webmanifest', 'reachly-icon-180.png',
  'reachly-icon-192.png', 'reachly-icon-512.png'
];
const hash = path => createHash('sha256').update(readFileSync(path)).digest('hex');
test('all approved source kit files and exact runtime copies are present', () => {
  assert.ok(existsSync(source), 'approved source kit backup is missing');
  assert.equal(readdirSync(source).length, 26);
  assert.deepEqual(readdirSync(runtime).sort(), [...files].sort());
  for (const file of files) assert.equal(hash(resolve(runtime, file)), hash(resolve(source, file)), file);
  assert.ok(readFileSync(resolve(source, 'BRAND_GUIDE.md'), 'utf8').includes('#D4E751'));
  const manifest = JSON.parse(readFileSync(resolve(runtime, 'site.webmanifest'), 'utf8'));
  for (const icon of manifest.icons) assert.ok(existsSync(resolve(runtime, icon.src)), icon.src);
  assert.equal(manifest.theme_color, '#05100E');
});
test('header and footer use intact light and dark Reachly SVG lockups', () => {
  const dom = new JSDOM(readFileSync(resolve(root, 'dist/index.html'), 'utf8'));
  try {
    const doc = dom.window.document;
    for (const [selector, file] of [
      ['.header .logo img', 'reachly-logo-black.svg'],
      ['.footer .logo img', 'reachly-logo-white.svg']
    ]) {
      const img = doc.querySelector(selector);
      assert.ok(img, selector + ' missing');
      assert.equal(img.getAttribute('src'), 'assets/brand/' + file);
      assert.equal(img.getAttribute('alt'), 'Reachly');
      const svg = readFileSync(resolve(source, file), 'utf8');
      const viewBox = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
      assert.equal(Number(img.getAttribute('width')), viewBox[2]);
      assert.equal(Number(img.getAttribute('height')), viewBox[3]);
    }
    assert.equal(doc.querySelectorAll('.logo-star').length, 0);
  } finally { dom.window.close(); }
});
test('favicon, touch icon and manifest identify the approved brand', () => {
  const dom = new JSDOM(readFileSync(resolve(root, 'dist/index.html'), 'utf8'));
  try {
    const doc = dom.window.document;
    assert.equal(doc.querySelector('link[rel="icon"]').getAttribute('href'), 'assets/brand/reachly-icon.svg');
    assert.equal(doc.querySelector('link[rel="alternate icon"]').getAttribute('href'), 'assets/brand/favicon.ico');
    assert.equal(doc.querySelector('link[rel="apple-touch-icon"]').getAttribute('href'), 'assets/brand/reachly-icon-180.png');
    assert.equal(doc.querySelector('link[rel="manifest"]').getAttribute('href'), 'assets/brand/site.webmanifest');
    assert.equal(doc.querySelector('meta[name="theme-color"]').getAttribute('content'), '#05100E');
  } finally { dom.window.close(); }
});
