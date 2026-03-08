import { NormalizeContext } from "../types";
import { excerpt, normalizeWhitespace } from "../utils/cleanText";

export function normalizeText(context: NormalizeContext) {
  const text = normalizeWhitespace(String(context.input ?? ""));
  if (context.config.enableWarnings && text.length < 40) {
    context.warnings.push("Text content is short; summary may have limited value.");
  }

  return {
    summary: `Plain text normalized (${text.length} chars).`,
    key_points: [text.slice(0, 120) || "No text available."],
    important_fields: {
      text_length: text.length
    },
    raw_excerpt: excerpt(text, context.config.maxExcerptLength),
    warnings: context.warnings
  };
}
