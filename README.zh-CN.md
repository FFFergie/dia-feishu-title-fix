# Dia 飞书标题修复

**专用于 Dia 浏览器的扩展，让飞书文档标签自动显示真实标题。**

[English](README.md) · [下载安装包](https://github.com/FFFergie/dia-feishu-title-fix/releases/latest) · [反馈问题](https://github.com/FFFergie/dia-feishu-title-fix/issues)

## 解决什么问题

部分飞书页面会在标题前加入不可见的 Unicode 格式字符。在 macOS 的 Dia 1.55.1 中实测：给正常标题添加一个 `U+202C`，侧栏便只显示域名；清理前缀后，文档名称恢复显示。

| 修复前 | 修复后 |
| --- | --- |
| `example.feishu.cn` | `项目笔记 - 飞书云文档` |

扩展在页面加载和标题变化时自动清理前缀，保留可见标题和正文中的组合表情，无需逐个改名。

这是面向 **Dia 浏览器** 的独立兼容性修复，并非 Dia 或飞书官方产品。Dia 内部为什么退回域名显示，尚未确认。

## 在 Dia 中安装

1. 从 [Releases](https://github.com/FFFergie/dia-feishu-title-fix/releases/latest) 下载 `dia-feishu-title-fix-1.0.0.zip`。
2. 解压到一个固定目录。
3. 在 **Dia** 中打开 `dia://extensions`，启用「开发者模式」。
4. 点击「加载未打包的扩展程序」，选择包含 `manifest.json` 的解压目录。
5. 刷新安装前已经打开的飞书文档标签。

之后新打开的匹配页面会自动修复。请保留解压目录，浏览器从这里加载扩展。当前通过未打包扩展分发，没有上架应用商店，也不会自动更新。

从源码安装时，选择仓库的 `extension/` 目录。更新时，用新版文件替换安装目录中的文件，在 Dia 扩展管理页点击该扩展的重新加载按钮，再刷新文档。卸载时移除 **Dia Feishu Title Fix**。

## 范围与隐私

- 仅在 `*.feishu.cn` 下的 HTTPS 文档页面运行，路径限于 `/base/`、`/docx/`、`/docs/`、`/wiki/`、`/sheets/`、`/slides/`。
- 只改变本机页面标题，不修改飞书中的文档名称或内容。
- 不发送网络请求，不采集数据，不使用存储或后台进程，没有第三方依赖与远程代码。
- 无额外扩展 API 权限。匹配规则仍会授予扩展访问对应页面的能力；实际脚本只读取标题、观察页面 head 并更新标题。
- 不覆盖其他域名，包括 `larksuite.com`。

## 验证范围

标题清理逻辑在 macOS、Dia 1.55.1 和飞书多维表格页面上通过实测，覆盖新开页面、安装后刷新和动态标题变化。实测版本只匹配一个租户；公开版本沿用相同清理逻辑，将匹配范围扩展到飞书子域名。

自动检查覆盖前缀清理、后续标题变化、重复回调收敛、文字及组合表情保留、空标题、域名范围和安装包内容。这些是单元与打包检查，不代表所有浏览器场景都通过实测。其他租户、所有文档类型、其他 Dia 版本、浏览器重启和 Windows 尚未逐项验证。

## 开发与发布

需要 Node.js 22+ 和 Python 3，无需安装依赖。

- `npm test`：运行单元与打包检查。
- `npm run check`：检查脚本语法。
- `npm run package`：在 `dist/` 生成安装包。

GitHub Actions 会检查提交与 PR。推送与扩展版本一致的 `vX.Y.Z` 标签后，自动检查、打包并发布 GitHub Release。贡献方式见 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 许可证

[MIT](LICENSE)。Dia 和飞书名称属于各自权利人。
