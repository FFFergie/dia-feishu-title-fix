# Changelog

## 1.1.0 — 2026-11-05

- Add a toolbar popup to close all Feishu/Lark tabs across windows in the current profile, including pinned tabs.
- Request site access only when enabling bulk close; no broad tabs permission.
- Show matching tab count, empty state, permission denial, and closure results in English or Simplified Chinese.
- Document the verified Dia limitation: unloaded sidebar entries must be opened before the extension can identify and close them.
- Preserve automatic title fixing and add domain, permission-flow, and tab-closing tests.

## 1.0.0 — 2026-11-05

- Initial public release for Dia browser.
- Automatically remove leading invisible formatting characters from Feishu document titles.
- Observe subsequent title changes without polling.
- Match supported document paths on Feishu subdomains.
- Include English and Simplified Chinese installation instructions, MIT license, automated tests, and release packaging.
