# Contributing

Thanks for contributing to `openclaw-tool-output-normalizer`.

## Development setup

```bash
npm install
npm run lint
npm test
npm run build
```

## Contribution guidelines

1. Keep scope aligned with project goals: tool-output normalization only.
2. Do not add external online model dependencies.
3. Do not assume undocumented OpenClaw runtime hook APIs.
4. Maintain schema compatibility in:
   - `openclaw.plugin.json`
   - `src/config/defaults.ts`
   - `README.md`
5. Add/adjust tests for behavior changes.

## Pull request checklist

- [ ] Code builds with `npm run build`
- [ ] Tests pass with `npm test`
- [ ] README/config docs updated if behavior changed
- [ ] No unnecessary dependency bloat
