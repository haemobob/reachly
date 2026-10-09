import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
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
test('CI installs Chromium and runs real browser checks', () => {
  const workflow = readFileSync(new URL('../.github/workflows/validate.yml', import.meta.url), 'utf8');
  assert.ok(workflow.includes('npx --no-install playwright install --with-deps chromium'));
  assert.ok(workflow.includes('npm run test:browser'));
  assert.ok(workflow.includes('actions/upload-artifact@v4'));
});
test('approved artwork is exempt from Git newline conversion', () => {
  const path = new URL('../.gitattributes', import.meta.url);
  assert.ok(existsSync(path), 'brand Git attributes missing');
  const attributes = readFileSync(path, 'utf8');
  assert.ok(attributes.includes('brand/Reachly-Brand-Kit/** -text'));
  assert.ok(attributes.includes('dist/assets/brand/** -text'));
});
