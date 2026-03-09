import { NormalizeContext } from "../types";
import { excerpt, normalizeWhitespace } from "../utils/cleanText";

function extractKV(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  const lines = text.split("\n").map((line) => line.trim());
  for (const line of lines) {
    const match = line.match(/^([\w\u4e00-\u9fa5\s]{2,30})[:：]\s*(.+)$/);
    if (!match) continue;
    const key = match[1].trim().replace(/\s+/g, " ");
    const value = match[2].trim();
    if (key && value) result[key] = value;
  }
  return result;
}

export function normalizeOcr(context: NormalizeContext) {
  const record = (context.input && typeof context.input === "object" ? context.input : {}) as Record<string, unknown>;
  const rawText = String(record.text ?? record.ocr ?? record.fullText ?? context.input ?? "");
  const cleaned = normalizeWhitespace(rawText).replace(/\n/g, " ");
  const kv = extractKV(rawText);

  const readableChars = (cleaned.match(/[\u4e00-\u9fa5a-zA-Z0-9]/g) ?? []).length;
  const noiseChars = Math.max(0, cleaned.length - readableChars);

  if (context.config.enableWarnings && cleaned.length < 60) {
    context.warnings.push("OCR text too short; quality may be low.");
  }
  if (context.config.enableWarnings && readableChars < 30) {
    context.warnings.push("Low readable character count in OCR text.");
  }
  if (context.config.enableWarnings && noiseChars > readableChars) {
    context.warnings.push("Possible garbled OCR output detected.");
  }

  return {
    summary: `OCR text normalized (${cleaned.length} chars).`,
    key_points: [
      `Readable chars: ${readableChars}`,
      `Extracted key-value fields: ${Object.keys(kv).length}`
    ],
    important_fields: Object.keys(kv).length ? kv : { text_length: cleaned.length },
    raw_excerpt: excerpt(rawText, context.config.maxExcerptLength),
    warnings: context.warnings
  };
}
