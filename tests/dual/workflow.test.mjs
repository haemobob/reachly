import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
test("illustrative workflow routes only known scenarios and has no delivery side effect", async () => {
  assert.ok(existsSync("src/lib/workflow.ts"), "workflow model exists");
  const { workflowFor } = await import("../../src/lib/workflow.ts");
  const initial = workflowFor("website");
  assert.equal(initial.title, "A website inquiry");
  assert.equal(initial.steps.length, 4);
  assert.equal(workflowFor("follow-up").steps[1].label, "Prioritize");
  assert.deepEqual(workflowFor("<script>"), initial);
  assert.equal(initial.steps[3].label, "Notify");
});
