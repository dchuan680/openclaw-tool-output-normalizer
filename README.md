# openclaw-tool-output-normalizer

A plugin for OpenClaw that converts verbose tool outputs into short, structured, model-friendly summaries.

> 中文简介：这是一个专注于“工具输出归一化”的 OpenClaw 插件，用于压缩噪音、统一结构并降低上下文成本。

## Why this project

Agent tool outputs are often noisy, inconsistent, and too large for efficient downstream reasoning. This package provides a deterministic local normalization engine (no external LLM dependency) that:

- reduces token footprint,
- keeps critical fields,
- standardizes output shape,
- and surfaces quality warnings.

## Features

- Unified normalized schema for all supported tool outputs.
- Automatic type detection (`json`, `web`, `ocr`, `table`, fallback `text`).
- Dedicated normalizers per data type.
- Stable token estimation (`token_before`, `token_after`, `reduction_ratio`).
- Configurable pruning limits and warning behavior.
- Conservative OpenClaw plugin scaffold + reusable standalone engine.

## Supported input types

1. Large JSON payloads
2. Web scraping / browser tool outputs
3. OCR text outputs
4. Table / Excel style data
5. Generic text fallback

## Output schema

```json
{
  "summary": "Short summary",
  "key_points": ["point 1", "point 2"],
  "important_fields": { "id": "x" },
  "raw_excerpt": "small original snippet",
  "warnings": ["possible missing fields"],
  "meta": {
    "detected_type": "json|web|ocr|table|text",
    "token_before": 4200,
    "token_after": 650,
    "reduction_ratio": 0.845
  }
}
```

## Installation

```bash
npm install openclaw-tool-output-normalizer
```

For OpenClaw plugin installation:

```bash
openclaw plugins install openclaw-tool-output-normalizer
```

For local plugin development, install from your local package path after build.

## Development

```bash
npm run lint
npm test
npm run build
```

## Usage

### As a standalone engine

```ts
import { normalizeToolOutput } from "openclaw-tool-output-normalizer";

const result = normalizeToolOutput(input, {
  maxArrayItems: 3,
  maxStringLength: 300
});
```

### As plugin scaffold export

```ts
import plugin from "openclaw-tool-output-normalizer/dist/plugin";

const normalized = plugin.normalize(toolOutput);
```

## Configuration

`openclaw.plugin.json` defines the plugin `configSchema` and defaults.

Main config fields:

- `maxStringLength` (default: `500`)
- `maxArrayItems` (default: `5`)
- `maxObjectDepth` (default: `4`)
- `maxExcerptLength` (default: `400`)
- `enableWarnings` (default: `true`)
- `preferredImportantFields` (default: `['id','name','title','status']`)
- `webNoisePatterns` (default includes copyright/navigation patterns)
- `debug` (default: `false`)

## OpenClaw runtime note

This package intentionally keeps runtime coupling conservative:

- ✅ fully implemented normalization engine,
- ✅ plugin package scaffold (`openclaw.plugin.json` + `openclaw.extensions` entry),
- ⚠️ minimal plugin runtime wrapper (no fabricated hook signatures).
- ✅ zero external runtime/test dependencies (uses Node built-ins for tests).

You can wire `normalizeToolOutput` into concrete OpenClaw runtime hooks once the exact hook interfaces are available in your environment.

## Roadmap

- richer table semantics (column type inference)
- deterministic scoring for OCR/web quality
- optional domain-specific field extraction profiles
- deeper OpenClaw runtime hook adapters when APIs are finalized

## Non-goals

- model routing
- budget/cost orchestration
- caching layers
- SaaS backend/database/UI
- external LLM API calls
- automatic hooking into every possible tool ecosystem

## License

MIT
