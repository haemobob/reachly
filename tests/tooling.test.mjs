import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
test('reference and browser tooling are pinned development dependencies', () => {
  assert.equal(pkg.devDependencies.skillui, '1.3.4');
  assert.equal(pkg.devDependencies['@playwright/test'], '1.64.0');
  assert.equal(pkg.scripts['test:browser'], 'playwright test');
  assert.equal(pkg.scripts['test:browser:design'], 'playwright test --grep "design:"');
  assert.equal(pkg.dependencies, undefined);
});
test('authoring tools override vulnerable transitive package versions', () => {
  assert.equal(pkg.overrides?.skillui?.['simple-git'], '4.0.2');
  assert.equal(pkg.overrides?.tsup?.esbuild, '0.28.2');
});
