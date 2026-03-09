import { NormalizeContext } from "../types";
import { cleanWebText, excerpt } from "../utils/cleanText";

export function normalizeWeb(context: NormalizeContext) {
  const record = (context.input && typeof context.input === "object" ? context.input : {}) as Record<string, unknown>;
  const title = String(record.title ?? "Untitled page");
  const url = String(record.url ?? "unknown_url");
  const rawText = String(record.content ?? record.text ?? record.html ?? "");
  const cleaned = cleanWebText(rawText, context.config.webNoisePatterns);

  if (context.config.enableWarnings && cleaned.length < 80) {
    context.warnings.push("Web content is very short; scrape may be incomplete.");
  }

  const paragraphs = cleaned.split("\n").filter(Boolean);
  const keyPoints = paragraphs.slice(0, 3).map((p, i) => `Point ${i + 1}: ${p.slice(0, 120)}`);

  return {
    summary: `Web result normalized for "${title}" (${url}).`,
    key_points: keyPoints.length ? keyPoints : ["No meaningful paragraphs extracted."],
    important_fields: {
      title,
      url,
      content_length: cleaned.length
    },
    raw_excerpt: excerpt(cleaned || rawText, context.config.maxExcerptLength),
    warnings: context.warnings
  };
}
