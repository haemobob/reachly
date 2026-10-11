import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
test("new Studio and exhibition have independent semantic route shells", () => {
  for (const file of [
    "src/layouts/Base.astro",
    "src/pages/index.astro",
    "src/pages/possibilities.astro",
  ])
    assert.ok(existsSync(file), `${file} exists`);
  const base = readFileSync("src/layouts/Base.astro", "utf8");
  assert.match(base, /lang="en"/);
  assert.match(base, /<slot/);
  assert.match(base, /canonical/);
  const studio = readFileSync("src/pages/index.astro", "utf8");
  assert.doesNotMatch(studio, /from ['"]three|import\(['"]three/);
});
