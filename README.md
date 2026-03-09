# openclaw-tool-output-normalizer

A plugin for OpenClaw that converts verbose tool outputs into short, structured, model-friendly summaries.

> 中文简介：本插件专注于“工具输出归一化”，用于压缩噪音、统一结构、降低 token 成本。

## Why this project

Tool outputs from APIs, crawlers, OCR, and tables are frequently too large and inconsistent for reliable agent workflows. This package provides a deterministic local normalizer so downstream models receive compact, stable, structured data.

## Current integration scope

This package currently provides:

- ✅ A standalone normalization engine (`normalizeToolOutput`)
- ✅ A publishable OpenClaw plugin package scaffold (`openclaw.plugin.json` + `openclaw.extensions`)
- ✅ Minimal and conservative plugin entry (`register(api)` without assuming undocumented hooks)

This package does **not** currently provide:

- ❌ Automatic interception of all OpenClaw tool outputs
- ❌ Model routing / caching / budget control
- ❌ External LLM API calls

## Supported input types

- `json` (large object/array payloads)
- `web` (scrape/browser outputs with `title/url/content/html/text`)
- `ocr` (OCR or scanned-document text)
- `table` (2D arrays or `{ headers, rows }` payloads)
- `text` (fallback)

## Normalized output schema

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

## Install

### 1) Install from npm

```bash
npm install openclaw-tool-output-normalizer
openclaw plugins install openclaw-tool-output-normalizer
```

### 2) Install from local package directory

```bash
npm run build
openclaw plugins install /absolute/path/to/openclaw-tool-output-normalizer
```

### 3) Dev link workflow

```bash
npm run build
npm link
# in the OpenClaw Gateway project/runtime environment
npm link openclaw-tool-output-normalizer
```

After plugin install/update, restart the OpenClaw Gateway process so the runtime reloads plugin manifests and extension entries.

## Usage

### Standalone engine API

```ts
import { normalizeToolOutput } from "openclaw-tool-output-normalizer";

const result = normalizeToolOutput(toolOutput, {
  maxArrayItems: 3,
  maxStringLength: 300
});
```

### Plugin scaffold API

```ts
import plugin from "openclaw-tool-output-normalizer/plugin";

const normalized = plugin.normalize(toolOutput);
```

## How OpenClaw discovers this plugin

This package follows the basic plugin discovery contract:

1. `openclaw.plugin.json` exists in package root.
2. `openclaw.plugin.json` contains required fields: `id` and `configSchema`.
3. `package.json` contains `openclaw.extensions` pointing to compiled extension entry: `dist/plugin.js`.

## Configuration

Config schema is defined in `openclaw.plugin.json` and defaults are implemented in `src/config/defaults.ts`.

- `maxStringLength` (default `500`): truncate long string fields
- `maxArrayItems` (default `5`): keep N array samples
- `maxObjectDepth` (default `4`): prune deep nested objects
- `maxExcerptLength` (default `400`): cap raw excerpt length
- `enableWarnings` (default `true`): emit warning hints
- `preferredImportantFields` (default `['id','name','title','status']`): extraction priority
- `webNoisePatterns` (default includes copyright/navigation markers): web text cleanup
- `debug` (default `false`): debug-oriented behavior switches

## Local development

```bash
npm install
npm run lint
npm test
npm run build
```

## Publishing

Typical release flow:

```bash
npm version patch   # or minor / major
npm run prepublishOnly
npm publish
```

`prepublishOnly` runs lint + test to reduce bad publishes.

## Pre-release checklist

- [ ] `openclaw.plugin.json` exists and is valid JSON
- [ ] `configSchema` and `src/config/defaults.ts` stay aligned
- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `package.json` has correct `openclaw.extensions` path (`dist/plugin.js`)
- [ ] `npm pack --dry-run` includes `dist/` and `openclaw.plugin.json`
- [ ] README commands and examples match current scripts/API
- [ ] Dependencies do not require postinstall/native build
- [ ] package `version` is correct for release
- [ ] local path installation has been smoke-tested

## Security / trust note

OpenClaw plugins run in the Gateway process. Treat plugin code as trusted code and review dependencies carefully. This project intentionally keeps dependencies minimal and pure JS/TS where possible.

## Roadmap

- stronger web/OCR quality heuristics
- richer table profiling
- optional hook adapters once OpenClaw runtime hook contracts are stable and documented

## License

MIT
