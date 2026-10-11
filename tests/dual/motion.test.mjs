import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
test("system reduced motion always overrides animation preference", async () => {
  assert.ok(existsSync("src/lib/motion-state.ts"), "motion policy exists");
  const { shouldAnimate } = await import("../../src/lib/motion-state.ts");
  assert.equal(shouldAnimate(true, false, true), false);
  assert.equal(shouldAnimate(false, true, true), false);
  assert.equal(shouldAnimate(false, false, false), false);
  assert.equal(shouldAnimate(false, false, true), true);
});
