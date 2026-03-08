import { describe, expect, it } from "vitest";
import { normalizeToolOutput } from "../src";

describe("table normalizer", () => {
  it("detects table payload and summarizes shape", () => {
    const result = normalizeToolOutput({
      headers: ["name", "score"],
      rows: [["a", 1], ["b", 2], ["", null]]
    });

    expect(result.meta.detected_type).toBe("table");
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.important_fields).toHaveProperty("row_count");
    expect(result.meta.token_after).toBeLessThanOrEqual(result.meta.token_before);
  });

  it("warns for empty table", () => {
    const result = normalizeToolOutput({ headers: [], rows: [] });
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
