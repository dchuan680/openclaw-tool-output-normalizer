import { describe, expect, it } from "vitest";
import { normalizeToolOutput } from "../src";

describe("json normalizer", () => {
  it("detects json and returns compact structure", () => {
    const result = normalizeToolOutput({
      id: "u1",
      name: "Alice",
      status: "ok",
      items: new Array(20).fill({ value: "x".repeat(100) })
    });

    expect(result.meta.detected_type).toBe("json");
    expect(result.summary.length).toBeGreaterThan(0);
    expect(Object.keys(result.important_fields).length).toBeGreaterThan(0);
    expect(result.meta.token_after).toBeLessThanOrEqual(result.meta.token_before);
  });
});
