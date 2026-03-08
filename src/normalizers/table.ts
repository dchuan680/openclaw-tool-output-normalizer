import { NormalizeContext } from "../types";
import { excerpt } from "../utils/cleanText";
import { safeJsonStringify } from "../utils/object";

function normalizeRows(input: unknown): { headers: string[]; rows: unknown[][] } {
  if (Array.isArray(input) && input.length && Array.isArray(input[0])) {
    const rows = input as unknown[][];
    const headers = (rows[0] ?? []).map((_, i) => `col_${i + 1}`);
    return { headers, rows };
  }

  if (Array.isArray(input) && input.length && typeof input[0] === "object") {
    const records = input as Record<string, unknown>[];
    const headers = Array.from(new Set(records.flatMap((r) => Object.keys(r))));
    const rows = records.map((record) => headers.map((h) => record[h]));
    return { headers, rows };
  }

  const record = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const headers = Array.isArray(record.headers) ? record.headers.map(String) : [];
  const rows = Array.isArray(record.rows) ? (record.rows as unknown[][]) : [];
  return { headers, rows };
}

export function normalizeTable(context: NormalizeContext) {
  const { headers, rows } = normalizeRows(context.input);
  const rowCount = rows.length;
  const columnCount = headers.length || (rows[0]?.length ?? 0);
  const sampleRows = rows.slice(0, context.config.maxArrayItems);

  const totalCells = Math.max(1, rowCount * Math.max(columnCount, 1));
  const emptyCells = rows.flat().filter((cell) => cell === null || cell === undefined || String(cell).trim() === "").length;
  const emptyRatio = emptyCells / totalCells;

  if (context.config.enableWarnings && rowCount === 0) context.warnings.push("Table appears empty.");
  if (context.config.enableWarnings && columnCount > 30) context.warnings.push("Table has too many columns; summary may be incomplete.");
  if (context.config.enableWarnings && headers.length === 0) context.warnings.push("Table headers are missing or inferred.");

  return {
    summary: `Table normalized with ${rowCount} row(s) and ${columnCount} column(s).`,
    key_points: [
      `Headers: ${headers.slice(0, 10).join(", ") || "none"}`,
      `Empty-cell ratio: ${(emptyRatio * 100).toFixed(1)}%`
    ],
    important_fields: {
      headers,
      row_count: rowCount,
      column_count: columnCount,
      sample_rows: sampleRows
    },
    raw_excerpt: excerpt(safeJsonStringify(sampleRows), context.config.maxExcerptLength),
    warnings: context.warnings
  };
}
