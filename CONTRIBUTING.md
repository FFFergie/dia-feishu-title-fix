# Contributing

Bug reports and contributions in English or Chinese are welcome.

For a title-display issue, include your OS, Dia version, extension version, document type, and reproduction steps. Use a fictional title and redact document URLs, tenant names, account details, and document content. Do not attach unredacted work screenshots.

Run `npm test` and `npm run check` before opening a pull request. Keep changes focused on Dia's Feishu title compatibility. New host matches or permissions should be explained explicitly.

For a release, update `extension/manifest.json`, `package.json`, the download filenames in both READMEs, and `CHANGELOG.md` together. Push a matching `vX.Y.Z` tag after checks pass. GitHub Actions builds and publishes the extension ZIP from the tagged source.
