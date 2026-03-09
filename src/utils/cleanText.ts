import { truncateText } from "./truncate";

export function normalizeWhitespace(input: string): string {
  return input
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function cleanWebText(input: string, noisePatterns: string[]): string {
  const lines = normalizeWhitespace(input)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const deduped = new Set<string>();
  const filtered: string[] = [];

  for (const line of lines) {
    const lower = line.toLowerCase();
    const noisy = noisePatterns.some((pattern) => lower.includes(pattern.toLowerCase()));
    if (noisy || deduped.has(lower)) continue;
    deduped.add(lower);
    filtered.push(line);
  }

  return filtered.join("\n");
}

export function excerpt(input: string, maxLength: number): string {
  const normalized = normalizeWhitespace(input);
  return truncateText(normalized, maxLength);
}
