import { DEFAULT_CONFIG, resolveConfig } from "./config/defaults";
import { normalizeToolOutput } from "./core/normalize";
import { NormalizedResult, NormalizerConfig } from "./types";

export interface OpenClawNormalizerPlugin {
  id: string;
  name: string;
  version: string;
  normalize: (input: unknown, runtimeConfig?: Partial<NormalizerConfig>) => NormalizedResult;
  defaults: NormalizerConfig;
}

export function createPlugin(config?: Partial<NormalizerConfig>): OpenClawNormalizerPlugin {
  const merged = resolveConfig(config);

  return {
    id: "openclaw-tool-output-normalizer",
    name: "OpenClaw Tool Output Normalizer",
    version: "0.1.0",
    normalize: (input, runtimeConfig) => normalizeToolOutput(input, { ...merged, ...(runtimeConfig ?? {}) }),
    defaults: DEFAULT_CONFIG
  };
}

const plugin = createPlugin();

export default plugin;
