export function estimateTokens(value: unknown): number {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (!text) return 0;

  const charsComponent = Math.ceil(text.length / 4);
  const wordsComponent = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil((charsComponent + wordsComponent) / 2));
}
