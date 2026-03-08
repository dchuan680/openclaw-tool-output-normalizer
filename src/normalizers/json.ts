import { NormalizeContext } from "../types";
import { excerpt } from "../utils/cleanText";
import { extractImportantFields, pruneValue, safeJsonStringify } from "../utils/object";

function toRecord(input: unknown): Record<string, unknown> {
  if (input && typeof input === "object" && !Array.isArray(input)) {
    return input as Record<string, unknown>;
  }
  return { value: input };
}

export function normalizeJson(context: NormalizeContext) {
  const record = toRecord(context.input);
  const pruned = pruneValue(record, 0, context.config.maxObjectDepth, context.config.maxArrayItems, context.config.maxStringLength) as Record<string, unknown>;
  const important = extractImportantFields(pruned, context.config.preferredImportantFields);

  const keyPoints = [
    `Top-level keys: ${Object.keys(record).slice(0, 10).join(", ") || "none"}`,
    `Sampled arrays limited to ${context.config.maxArrayItems} items`,
    `Object depth limited to ${context.config.maxObjectDepth}`
  ];

  const serialized = safeJsonStringify(pruned);
  if (context.config.enableWarnings && serialized.length > 2000) {
    context.warnings.push("Large JSON detected; output was aggressively pruned.");
  }

  return {
    summary: `Normalized JSON with ${Object.keys(record).length} top-level field(s).`,
    key_points: keyPoints,
    important_fields: Object.keys(important).length ? important : { preview: pruned },
    raw_excerpt: excerpt(serialized, context.config.maxExcerptLength),
    warnings: context.warnings
  };
}
