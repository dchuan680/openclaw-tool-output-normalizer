import { resolveConfig } from "../config/defaults";
import { normalizeJson } from "../normalizers/json";
import { normalizeOcr } from "../normalizers/ocr";
import { normalizeTable } from "../normalizers/table";
import { normalizeText } from "../normalizers/text";
import { normalizeWeb } from "../normalizers/web";
import { DetectedType, NormalizedResult, NormalizerConfig } from "../types";
import { detectType } from "../utils/detect";
import { estimateTokens } from "../utils/tokens";

const NORMALIZER_MAP: Record<DetectedType, typeof normalizeText> = {
  json: normalizeJson,
  web: normalizeWeb,
  ocr: normalizeOcr,
  table: normalizeTable,
  text: normalizeText
};

export function normalizeToolOutput(input: unknown, config?: Partial<NormalizerConfig>): NormalizedResult {
  const finalConfig = resolveConfig(config);
  const detectedType = detectType(input);
  const tokenBefore = estimateTokens(input);

  const warnings: string[] = [];
  const body = NORMALIZER_MAP[detectedType]({
    input,
    config: finalConfig,
    warnings,
    tokenBefore,
    detectedType
  });

  const tokenAfter = estimateTokens(body);
  return {
    ...body,
    meta: {
      detected_type: detectedType,
      token_before: tokenBefore,
      token_after: tokenAfter,
      reduction_ratio: tokenBefore === 0 ? 0 : Number(((tokenBefore - tokenAfter) / tokenBefore).toFixed(3))
    }
  };
}
