import { describe, expect, it } from "vitest";
import { normalizeToolOutput } from "../src";

describe("web normalizer", () => {
  it("detects web payload and emits warnings when short", () => {
    const result = normalizeToolOutput({ title: "T", url: "https://a.com", content: "Navigation\nshort" });

    expect(result.meta.detected_type).toBe("web");
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.important_fields).toHaveProperty("title");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
