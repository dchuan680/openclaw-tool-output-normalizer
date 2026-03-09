import { NormalizerConfig } from "../types";

export const DEFAULT_CONFIG: NormalizerConfig = {
  maxStringLength: 500,
  maxArrayItems: 5,
  maxObjectDepth: 4,
  maxExcerptLength: 400,
  enableWarnings: true,
  preferredImportantFields: ["id", "name", "title", "status"],
  webNoisePatterns: ["copyright", "all rights reserved", "navigation"],
  debug: false
};

export function resolveConfig(partial?: Partial<NormalizerConfig>): NormalizerConfig {
  const merged: NormalizerConfig = {
    ...DEFAULT_CONFIG,
    ...(partial ?? {}),
    preferredImportantFields: partial?.preferredImportantFields ?? DEFAULT_CONFIG.preferredImportantFields,
    webNoisePatterns: partial?.webNoisePatterns ?? DEFAULT_CONFIG.webNoisePatterns
  };

  if (merged.maxStringLength < 50) merged.maxStringLength = 50;
  if (merged.maxArrayItems < 1) merged.maxArrayItems = 1;
  if (merged.maxObjectDepth < 1) merged.maxObjectDepth = 1;
  if (merged.maxExcerptLength < 80) merged.maxExcerptLength = 80;

  return merged;
}
