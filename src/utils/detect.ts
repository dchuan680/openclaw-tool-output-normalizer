import { DetectedType } from "../types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function detectType(input: unknown): DetectedType {
  if (Array.isArray(input)) {
    if (input.length > 0 && Array.isArray(input[0])) return "table";
    if (input.length > 0 && isRecord(input[0])) {
      const keys = Object.keys(input[0]);
      if (keys.length > 2) return "table";
    }
    return "json";
  }

  if (isRecord(input)) {
    const keys = Object.keys(input).map((k) => k.toLowerCase());
    const hasWeb = ["url", "title", "content", "html", "text"].filter((k) => keys.includes(k)).length >= 2;
    if (hasWeb) return "web";

    const hasTable = keys.includes("rows") || keys.includes("columns") || keys.includes("headers");
    if (hasTable) return "table";

    const hasOcr = keys.includes("ocr") || keys.includes("recognizedtext") || keys.includes("fulltext") || keys.includes("lines");
    if (hasOcr) return "ocr";

    return "json";
  }

  if (typeof input === "string") {
    const normalized = input.trim();
    if (/\|/.test(normalized) && /\n/.test(normalized)) return "table";
    if (/[\u4e00-\u9fa5a-zA-Z0-9]{20,}/.test(normalized) && /\n/.test(normalized)) return "ocr";
    return "text";
  }

  return "text";
}
