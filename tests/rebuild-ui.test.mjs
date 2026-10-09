import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');

test('rebuilt landing follows proof-first editorial journey rather than the previous section stack', () => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  assert.deepEqual([...doc.querySelectorAll('main > section')].map(el => el.id || el.classList[0]), ['hero', 'projects', 'manifesto', 'services', 'work', 'approach', 'process', 'faq', 'contact']);
  assert.ok(doc.querySelector('.hero-poster'));
  assert.equal(doc.querySelector('.hero-bottom'), null);
  assert.equal(doc.querySelectorAll('.hero-photo').length, 2);
  assert.ok(doc.querySelector('.manifesto-photo'));
  assert.equal(doc.querySelector('.project-grid').getAttribute('aria-label'), 'Selected client websites');
  assert.equal(doc.querySelectorAll('[data-rail-dir]').length, 2);
  assert.equal(doc.querySelector('#mobile-menu').getAttribute('role'), 'dialog');
  dom.window.close();
});
