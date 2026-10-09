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
