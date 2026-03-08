import { describe, expect, it } from "vitest";
import { normalizeToolOutput } from "../src";

describe("ocr normalizer", () => {
  it("detects ocr style payload and extracts key values", () => {
    const result = normalizeToolOutput({ ocr: "Invoice: INV-1\nDate: 2026-01-01\nAmt: 20" });

    expect(result.meta.detected_type).toBe("ocr");
    expect(result.summary.length).toBeGreaterThan(0);
    expect(Object.keys(result.important_fields).length).toBeGreaterThan(0);
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
