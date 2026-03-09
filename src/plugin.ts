import { DEFAULT_CONFIG, resolveConfig } from "./config/defaults";
import { normalizeToolOutput } from "./core/normalize";
import { NormalizedResult, NormalizerConfig } from "./types";

const configSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    maxStringLength: { type: "integer", minimum: 50, default: 500 },
    maxArrayItems: { type: "integer", minimum: 1, default: 5 },
    maxObjectDepth: { type: "integer", minimum: 1, default: 4 },
    maxExcerptLength: { type: "integer", minimum: 80, default: 400 },
    enableWarnings: { type: "boolean", default: true },
    preferredImportantFields: { type: "array", items: { type: "string" } },
    webNoisePatterns: { type: "array", items: { type: "string" } },
    debug: { type: "boolean", default: false }
  }
} as const;

export interface OpenClawNormalizerPlugin {
  id: string;
  name: string;
  version: string;
  configSchema: typeof configSchema;
  normalize: (input: unknown, runtimeConfig?: Partial<NormalizerConfig>) => NormalizedResult;
  register: (api: unknown) => { normalizeToolOutput: typeof normalizeToolOutput };
  defaults: NormalizerConfig;
}

export function createPlugin(config?: Partial<NormalizerConfig>): OpenClawNormalizerPlugin {
  const merged = resolveConfig(config);

  return {
    id: "openclaw-tool-output-normalizer",
    name: "OpenClaw Tool Output Normalizer",
    version: "0.1.0",
    configSchema,
    normalize: (input, runtimeConfig) => normalizeToolOutput(input, { ...merged, ...(runtimeConfig ?? {}) }),
    register: (_api: unknown) => ({ normalizeToolOutput }),
    defaults: DEFAULT_CONFIG
  };
}

const plugin = createPlugin();

export default plugin;
