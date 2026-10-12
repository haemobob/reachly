import test from "node:test";
import assert from "node:assert/strict";
test("the shared motion score makes a continuous reading hold for dense handoffs", async () => {
  const { worldPose } = await import("../../src/lib/world-state.ts");
  for (const k of [0, 1, 2, 4.2, 5])
    assert.equal(worldPose(k).readingOpacity, 1);
  for (const k of [3, 3.35, 3.7])
    assert.ok(worldPose(k).readingOpacity <= 0.33);
  for (let k = 0; k <= 5; k += 0.01) {
    const a = worldPose(k).readingOpacity,
      b = worldPose(k + 0.001).readingOpacity;
    assert.ok(a >= 0.3 && a <= 1);
    assert.ok(Math.abs(a - b) < 0.01);
  }
});
test("world pose and SVG topology morph continuously without an integer-boundary reset", async () => {
  const { worldPose } = await import("../../src/lib/world-state.ts");
  for (let k = 0; k <= 5; k += 0.05) {
    const p = worldPose(k);
    assert.ok(p.coords.every(Number.isFinite));
    assert.equal(p.coords.length, 26);
    assert.equal((p.path.match(/C/g) || []).length, 4);
  }
  for (const k of [1, 2, 3, 4]) {
    const a = worldPose(k - 0.0001),
      b = worldPose(k + 0.0001);
    assert.ok(a.coords.every((v, i) => Math.abs(v - b.coords[i]) < 0.5));
  }
  assert.notEqual(worldPose(0).path, worldPose(2).path);
  assert.equal(worldPose(-4).path, worldPose(0).path);
  assert.equal(worldPose(20).path, worldPose(5).path);
});
test("one scroll phase is clamped, reversible and continuous across uneven chapter landmarks", async () => {
  let world;
  try {
    world = await import("../../src/lib/world-state.ts");
  } catch {
    assert.fail("continuous world model must exist");
  }
  const { worldPhase } = world;
  const landmarks = [0, 900, 2400, 3600, 4400, 5300];
  assert.equal(worldPhase(-10, landmarks), 0);
  assert.equal(worldPhase(900, landmarks), 1);
  assert.equal(worldPhase(99999, landmarks), 5);
  assert.ok(
    Math.abs(worldPhase(2399.9, landmarks) - worldPhase(2400.1, landmarks)) <
      0.001,
  );
  assert.equal(worldPhase(1650, landmarks), 1.5);
  assert.equal(worldPhase(0, [0]), 0);
  for (const y of [0, 100, 1500, 4000, 2000, 900])
    assert.ok(Number.isFinite(worldPhase(y, landmarks)));
});
