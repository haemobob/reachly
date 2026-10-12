import test from 'node:test';
import assert from 'node:assert/strict';
import { buildRibbonGeometry, sampleRibbon } from '../../src/lib/ribbon-geometry.ts';

test('one authored ribbon keeps finite, identical topology throughout all six phases', () => {
  const reference = buildRibbonGeometry(0, 96);
  for (let phase = 0; phase <= 5; phase += 0.125) {
    const geometry = buildRibbonGeometry(phase, 96);
    assert.equal(geometry.positions.length, reference.positions.length);
    assert.deepEqual(geometry.indices, reference.indices);
    assert.ok(geometry.positions.every(Number.isFinite), `finite phase ${phase}`);
    assert.ok(geometry.indices.every(index => index < geometry.positions.length / 3));
    const point = sampleRibbon(phase, 0.82);
    assert.ok(point.every(Number.isFinite));
  }
  assert.ok(Math.max(...reference.positions) - Math.min(...reference.positions) > 5, 'sculpture is not a miniature torus');
});

test('morphs are reversible and continuous with flat velocity at chapter seams', () => {
  const maximumDifference = (a, b) => Math.max(...a.map((v, i) => Math.abs(v - b[i])));
  for (let seam = 1; seam < 5; seam++) {
    const at = buildRibbonGeometry(seam, 48).positions;
    for (const offset of [-0.0001, 0.0001]) {
      assert.ok(maximumDifference(at, buildRibbonGeometry(seam + offset, 48).positions) < 0.001);
    }
  }
  const forward = [0, 0.6, 1.4, 2.8, 4.3, 5].map(p => buildRibbonGeometry(p, 48).positions);
  const reverse = [5, 4.3, 2.8, 1.4, 0.6, 0].map(p => buildRibbonGeometry(p, 48).positions).reverse();
  assert.deepEqual(forward, reverse);
});

test('invalid phase and sampling bounds are clamped without corrupting geometry', () => {
  assert.deepEqual(buildRibbonGeometry(-10), buildRibbonGeometry(0));
  assert.deepEqual(buildRibbonGeometry(99), buildRibbonGeometry(5));
  for (const phase of [NaN, Infinity, -Infinity]) {
    assert.ok(buildRibbonGeometry(phase, NaN).positions.every(Number.isFinite));
  }
  assert.deepEqual(sampleRibbon(0, -1), sampleRibbon(0, 0));
  assert.deepEqual(sampleRibbon(5, 2), sampleRibbon(5, 1));
});
