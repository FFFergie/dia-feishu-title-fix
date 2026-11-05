# Dia Feishu Title Fix

**A small browser extension for Dia that restores readable Feishu document titles in tabs.**

[简体中文](README.zh-CN.md) · [Download](https://github.com/FFFergie/dia-feishu-title-fix/releases/latest) · [Report an issue](https://github.com/FFFergie/dia-feishu-title-fix/issues)

## The problem

Some Feishu pages prepend invisible Unicode formatting characters to their page titles. In a controlled test with **Dia 1.55.1 on macOS**, adding a single `U+202C` to a clean title made Dia show the website hostname in its sidebar instead of the document name. Removing the prefix restored the document title.

| Without the fix | With the fix |
| --- | --- |
| `example.feishu.cn` | `Project notes - 飞书云文档` |

The extension removes leading invisible formatting characters when a page loads and whenever its title changes. It preserves the visible title and embedded emoji. You do not need to rename tabs manually.

This is an independent compatibility workaround for **Dia browser**, not an official Dia or Feishu product. The internal reason for Dia's hostname fallback has not been established.

## Install in Dia

1. Download `dia-feishu-title-fix-1.0.0.zip` from [Releases](https://github.com/FFFergie/dia-feishu-title-fix/releases/latest).
2. Extract it to a permanent folder.
3. Open `dia://extensions` in **Dia** and enable **Developer mode**.
4. Choose **Load unpacked** and select the extracted folder containing `manifest.json`.
5. Refresh Feishu document tabs that were already open.

New matching pages run the fix automatically. Keep the extracted folder: Dia loads the extension from that location. This extension is distributed as an unpacked extension; it is not listed in the Chrome Web Store and does not update automatically.

To install from source, select this repository's `extension/` folder instead. To update, replace the files in the installed folder, click the extension's reload button in Dia, then refresh the document tabs. To uninstall, remove **Dia Feishu Title Fix** from Dia's extensions page.

## Scope and privacy

- Runs only on HTTPS Feishu document URLs under `*.feishu.cn`, with paths beginning `/base/`, `/docx/`, `/docs/`, `/wiki/`, `/sheets/`, or `/slides/`.
- Changes only the local page title; it does not rename or edit the document on Feishu.
- No network requests, telemetry, storage, background process, third-party libraries, or remote code.
- No additional extension API permissions. The content-script URL matches still grant access to those matching pages; the script uses only the page title and observes the document head.
- Other domains, including `larksuite.com`, are not covered.

## Verification and limitations

The title-cleaning behavior was tested in Dia 1.55.1 on macOS with a Feishu Base document: initial navigation, refresh after installation, and repeated title changes. A tenant-scoped build was used for those live checks. The public build uses the same cleaning logic and broadens the URL matches to Feishu subdomains.

Automated tests cover prefix removal, later title changes, convergence, text and emoji preservation, empty titles, URL scope, and the release archive. They are unit/package checks, not a substitute for browser tests. Every document type, other tenants, other Dia versions, browser restart, and Windows have not been individually verified.

## Development

Requires Node.js 22+ and Python 3. No dependency installation is needed.

- `npm test` — run unit and packaging tests.
- `npm run check` — check script syntax.
- `npm run package` — create the installable ZIP in `dist/`.

Pull requests run the same checks on GitHub Actions. Pushing a `vX.Y.Z` tag matching the manifest version runs checks, builds the ZIP, and publishes a GitHub release. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). Dia and Feishu names belong to their respective owners.
