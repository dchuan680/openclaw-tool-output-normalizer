# openclaw-tool-output-normalizer

A plugin for OpenClaw that converts verbose tool outputs into short, structured, model-friendly summaries.

> 中文简介：该项目专注于“工具输出归一化”，将噪音较多、结构不统一的输出压缩成稳定 schema，便于后续模型消费。

## Why this project

Tool outputs from crawlers, OCR, APIs, and spreadsheets are often too long and inconsistent. This package offers a deterministic local normalization engine to:

- reduce token usage,
- keep important fields,
- standardize output format,
- and surface quality warnings.

## What this package does (current scope)

- ✅ Standalone normalization engine (`normalizeToolOutput`)
- ✅ OpenClaw plugin scaffold packaging (`openclaw.plugin.json`, `openclaw.extensions`)
- ✅ Configurable normalization rules
- ✅ Local-only implementation (no external LLM APIs)

## What this package does NOT do

- ❌ Automatic interception of all OpenClaw tool calls
- ❌ Model routing / caching / budget control
- ❌ SaaS backend, DB, or UI
- ❌ External online model inference

## Supported input types

- `json`: large API/object payloads
- `web`: scraped page outputs (`title/url/content/html/text`)
- `ocr`: OCR/scan text outputs
- `table`: two-dimensional rows/columns data
- `text`: fallback for plain text

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

OpenClaw plugin install (package/distribution scenario):

```bash
openclaw plugins install openclaw-tool-output-normalizer
```

## Usage

### Standalone engine

```ts
import { normalizeToolOutput } from "openclaw-tool-output-normalizer";

const result = normalizeToolOutput(input, {
  maxArrayItems: 3,
  maxStringLength: 300
});
```

### Plugin scaffold export

```ts
import plugin from "openclaw-tool-output-normalizer/plugin";

const result = plugin.normalize(input);
```

## Configuration

Config is defined in `openclaw.plugin.json` (`configSchema`) and merged with code defaults.

- `maxStringLength` (default `500`)
- `maxArrayItems` (default `5`)
- `maxObjectDepth` (default `4`)
- `maxExcerptLength` (default `400`)
- `enableWarnings` (default `true`)
- `preferredImportantFields` (default `['id','name','title','status']`)
- `webNoisePatterns` (default includes copyright/navigation patterns)
- `debug` (default `false`)

## OpenClaw integration note

This version intentionally keeps runtime integration minimal and honest:

- the plugin entry exports metadata + config schema + `normalize` API,
- `register(api)` does not assume undocumented OpenClaw hook names,
- deeper runtime interception should be added only when concrete OpenClaw hook signatures are confirmed.

## Development

```bash
npm run lint
npm test
npm run build
```

## Roadmap

- richer table profiling (column-type hints)
- stronger OCR/web quality scoring
- optional domain-specific extraction profiles
- adapter examples for concrete OpenClaw runtime hook APIs (when publicly stable)

## License

MIT
