# Release Checklist

Use this checklist before publishing a new version.

- [ ] `package.json` version updated (and matches release tag)
- [ ] `CHANGELOG.md` updated
- [ ] `README.md` examples and commands verified
- [ ] `openclaw.plugin.json` present and valid JSON
- [ ] `configSchema` aligned with `src/config/defaults.ts`
- [ ] `openclaw.extensions` points to `dist/openclaw.js`
- [ ] `npm run lint` passes
- [ ] `npm test` passes
- [ ] `npm pack --dry-run` includes `dist/` and `openclaw.plugin.json`
- [ ] GitHub release notes prepared
- [ ] Release published (triggers `.github/workflows/publish.yml`)
