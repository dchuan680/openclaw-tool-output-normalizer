import { truncateText } from "./truncate";

export function safeJsonStringify(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function pruneValue(value: unknown, depth: number, maxDepth: number, maxArrayItems: number, maxStringLength: number): unknown {
  if (depth >= maxDepth) return "[Truncated: max depth reached]";

  if (typeof value === "string") return truncateText(value, maxStringLength);
  if (Array.isArray(value)) {
    return value.slice(0, maxArrayItems).map((item) => pruneValue(item, depth + 1, maxDepth, maxArrayItems, maxStringLength));
  }

  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = pruneValue(v, depth + 1, maxDepth, maxArrayItems, maxStringLength);
    }
    return out;
  }

  return value;
}

export function extractImportantFields(input: Record<string, unknown>, preferred: string[]): Record<string, unknown> {
  const defaults = ["id", "name", "title", "type", "status", "url", "amount", "date", "message", "error", "code"];
  const ordered = [...new Set([...preferred, ...defaults])];
  const selected: Record<string, unknown> = {};

  for (const key of ordered) {
    if (key in input) selected[key] = input[key];
  }

  return selected;
}
