export type DetectedType = "json" | "web" | "ocr" | "table" | "text";

export interface NormalizerConfig {
  maxStringLength: number;
  maxArrayItems: number;
  maxObjectDepth: number;
  maxExcerptLength: number;
  enableWarnings: boolean;
  preferredImportantFields: string[];
  webNoisePatterns: string[];
  debug: boolean;
}

export interface NormalizedResult {
  summary: string;
  key_points: string[];
  important_fields: Record<string, unknown>;
  raw_excerpt: string;
  warnings: string[];
  meta: {
    detected_type: DetectedType;
    token_before: number;
    token_after: number;
    reduction_ratio: number;
  };
}

export interface NormalizeContext {
  input: unknown;
  config: NormalizerConfig;
  warnings: string[];
  tokenBefore: number;
  detectedType: DetectedType;
}

export type NormalizerFn = (context: NormalizeContext) => Omit<NormalizedResult, "meta">;
