# Dia Feishu Title Fix

**A browser extension for Dia that fixes Feishu document titles and closes all Feishu tabs on demand.**

[简体中文](README.zh-CN.md) · [Download](https://github.com/FFFergie/dia-feishu-title-fix/releases/latest) · [Report an issue](https://github.com/FFFergie/dia-feishu-title-fix/issues)

## The problem

Some Feishu pages prepend invisible Unicode formatting characters to their page titles. In a controlled test with **Dia 1.55.1 on macOS**, adding a single `U+202C` to a clean title made Dia show the website hostname in its sidebar instead of the document name. Removing the prefix restored the document title.

| Without the fix | With the fix |
| --- | --- |
| `example.feishu.cn` | `Project notes - 飞书云文档` |

The extension removes leading invisible formatting characters when a page loads and whenever its title changes. It preserves the visible title and embedded emoji. You do not need to rename tabs manually.

This is an independent compatibility workaround for **Dia browser**, not an official Dia or Feishu product. The internal reason for Dia's hostname fallback has not been established.

## Install in Dia

1. Download `dia-feishu-title-fix-1.1.0.zip` from [Releases](https://github.com/FFFergie/dia-feishu-title-fix/releases/latest).
2. Extract it to a permanent folder.
3. Open `dia://extensions` in **Dia** and enable **Developer mode**.
4. Choose **Load unpacked** and select the extracted folder containing `manifest.json`.
5. Refresh Feishu document tabs that were already open.

New matching pages run the fix automatically. Keep the extracted folder: Dia loads the extension from that location. This extension is distributed as an unpacked extension; it is not listed in the Chrome Web Store and does not update automatically.

To install from source, select this repository's `extension/` folder instead. To update, replace the files in the installed folder, click the extension's reload button in Dia, then refresh the document tabs. To uninstall, remove **Dia Feishu Title Fix** from Dia's extensions page.

## Close Feishu tabs in one click

Open the extension from Dia's toolbar. On first use, choose **Enable one-click close** and grant access to the listed Feishu/Lark sites. Granting access does not close anything. The button then shows the number of matching tabs; click **Close Feishu tabs (N)** to close them.

This action covers tabs exposed by Dia’s extension API across **all windows in the current browser profile, including exposed pinned tabs**, on these HTTPS domains and their subdomains: `feishu.cn`, `feishu.link`, `feishuapp.com`, `larkoffice.com`, and `larksuite.com`. It includes documents, approvals, admin consoles, and apps hosted on these sites. It does not cross profiles, run automatically, or close unrelated pages whose titles happen to mention Feishu. Save unfinished edits before closing tabs. Closed pages can be reopened from browser history.

**Dia limitation (verified in 1.55.1):** some unloaded sidebar entries are absent from the extension tab API. They only become identifiable after you open them. The extension cannot close those entries while they remain unexposed, and a zero count does not mean the entire sidebar is empty.

## Scope and privacy

- Automatic title fixing runs only on HTTPS document URLs under `*.feishu.cn`, with paths beginning `/base/`, `/docx/`, `/docs/`, `/wiki/`, `/sheets/`, or `/slides/`.
- Title fixing changes only the local page title, not the document on Feishu.
- Bulk closing requests **optional host permissions** for the five listed domains on first use. Declining leaves title fixing available. Access can be revoked in Dia's extension settings.
- No broad `tabs` permission, network requests, telemetry, storage, background process, third-party libraries, or remote code. Optional host access allows reading matching tab URLs/titles and access to matching sites; the bulk action only uses tab metadata and tab IDs.
- Other sites and browser profiles are not included. Automatic title fixing is not enabled on the additional Lark/app domains.

## Verification and limitations

Version 1.1.0 was loaded from the public source in Dia 1.55.1 on macOS. The real toolbar popup displayed two matching tabs, closed both on click, and showed the resulting empty state. A freshly opened Feishu Base document also displayed its corrected title. The unloaded-sidebar limitation above was reproduced by comparing the extension tab list before and after activating a remaining sidebar entry.

The title-cleaning behavior was tested in Dia 1.55.1 on macOS with a Feishu Base document: initial navigation, refresh after installation, and repeated title changes. A tenant-scoped build was used for those live checks. The public build uses the same cleaning logic and broadens the URL matches to Feishu subdomains.

Automated tests cover prefix removal, later title changes, convergence, text and emoji preservation, empty titles, exact domain matching, cross-window selection, permission grant/denial, zero matches, closure results, and the release archive. They are unit/package checks, not a substitute for browser tests. Every document type, other tenants, other Dia versions, browser restart, and Windows have not been individually verified.

## Development

Requires Node.js 22+ and Python 3. No dependency installation is needed.

- `npm test` — run unit and packaging tests.
- `npm run check` — check script syntax.
- `npm run package` — create the installable ZIP in `dist/`.

Pull requests run the same checks on GitHub Actions. Pushing a `vX.Y.Z` tag matching the manifest version runs checks, builds the ZIP, and publishes a GitHub release. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE). Dia and Feishu names belong to their respective owners.
