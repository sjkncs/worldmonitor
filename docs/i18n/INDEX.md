# 📖 World Monitor — Multilingual Documentation Index

<p align="center">
  <a href="../../README.md"><b>English</b></a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

---

## Documentation Structure / 文档结构

### 📋 Core Documents / 核心文档

| Document | English | 简体中文 | 日本語 | 한국어 | العربية | Deutsch | Italiano | Français |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **README** | [EN](../../README.md) | [ZH](./README.zh.md) | [JA](./README.ja.md) | [KO](./README.ko.md) | [AR](./README.ar.md) | [DE](./README.de.md) | [IT](./README.it.md) | [FR](./README.fr.md) |
| **Changelog** | [EN](../CHANGELOG.md) | [ZH](./CHANGELOG.zh.md) | — | — | — | — | — | — |
| **Contributing** | [EN](../../.github/CONTRIBUTING.md) | — | — | — | — | — | — | — |
| **Code of Conduct** | [EN](../../.github/CODE_OF_CONDUCT.md) | — | — | — | — | — | — | — |
| **Security** | [EN](../../.github/SECURITY.md) | [ZH](./SECURITY.zh.md) | — | — | — | — | — | — |

### 📚 Technical Guides / 技术指南

| Document | Description / 描述 |
|---|---|
| [DOCUMENTATION.md](../DOCUMENTATION.md) | Full technical documentation / 完整技术文档 |
| [ADDING_ENDPOINTS.md](../ADDING_ENDPOINTS.md) | How to add new API endpoints / 如何添加新 API 端点 |
| [API_KEY_DEPLOYMENT.md](../API_KEY_DEPLOYMENT.md) | API key deployment guide / API 密钥部署指南 |
| [DESKTOP_CONFIGURATION.md](../DESKTOP_CONFIGURATION.md) | Desktop app configuration / 桌面应用配置 |
| [RELEASE_PACKAGING.md](../RELEASE_PACKAGING.md) | Release packaging guide / 发布打包指南 |
| [TAURI_VALIDATION_REPORT.md](../TAURI_VALIDATION_REPORT.md) | Tauri validation report / Tauri 验证报告 |
| [local-backend-audit.md](../local-backend-audit.md) | Local backend audit / 本地后端审计 |

### 📡 API Documentation / API 文档

Auto-generated OpenAPI specs from Protocol Buffers:

| Service | Spec |
|---|---|
| Aviation | [OpenAPI](../api/) |
| Climate | [OpenAPI](../api/) |
| Conflict | [OpenAPI](../api/) |
| Economic | [OpenAPI](../api/) |
| Intelligence | [OpenAPI](../api/) |
| Market | [OpenAPI](../api/) |
| Military | [OpenAPI](../api/) |
| News | [OpenAPI](../api/) |
| ... | See [docs/api/](../api/) for all 17 services |

### 🌐 Community / 社区

| Document | Description / 描述 |
|---|---|
| [COMMUNITY-PROMOTION-GUIDE.md](../COMMUNITY-PROMOTION-GUIDE.md) | Community promotion guide / 社区推广指南 |

---

## Web UI Language Support / 网页 UI 语言支持

The web application supports **17 languages** with lazy-loaded locale bundles:

| Language | Code | Locale File | Status |
|---|---|---|---|
| 🇬🇧 English | `en` | `src/locales/en.json` | ✅ Complete |
| 🇫🇷 Français | `fr` | `src/locales/fr.json` | ✅ Complete |
| 🇩🇪 Deutsch | `de` | `src/locales/de.json` | ✅ Complete |
| 🇪🇸 Español | `es` | `src/locales/es.json` | ✅ Complete |
| 🇮🇹 Italiano | `it` | `src/locales/it.json` | ✅ Complete |
| 🇵🇱 Polski | `pl` | `src/locales/pl.json` | ✅ Complete |
| 🇵🇹 Português | `pt` | `src/locales/pt.json` | ✅ Complete |
| 🇳🇱 Nederlands | `nl` | `src/locales/nl.json` | ✅ Complete |
| 🇸🇪 Svenska | `sv` | `src/locales/sv.json` | ✅ Complete |
| 🇷🇺 Русский | `ru` | `src/locales/ru.json` | ✅ Complete |
| 🇸🇦 العربية | `ar` | `src/locales/ar.json` | ✅ Complete (RTL) |
| 🇨🇳 简体中文 | `zh` | `src/locales/zh.json` | ✅ Complete |
| 🇯🇵 日本語 | `ja` | `src/locales/ja.json` | ✅ Complete |
| 🇹🇷 Türkçe | `tr` | `src/locales/tr.json` | ✅ Complete |
| 🇹🇭 ไทย | `th` | `src/locales/th.json` | ✅ Complete |
| 🇻🇳 Tiếng Việt | `vi` | `src/locales/vi.json` | ✅ Complete |
| 🇬🇷 Ελληνικά | `el` | `src/locales/el.json` | ✅ Complete |

### How Language Switching Works / 语言切换原理

1. i18next with browser language detection automatically selects the user's preferred language
2. English is bundled eagerly as fallback; all other locales are lazy-loaded on demand
3. RTL layout is applied automatically for Arabic (`ar`)
4. Language can be changed manually via the UI language selector in the header bar
5. Language preference is persisted to `localStorage`

---

> 📝 Translations are maintained by the community. If you'd like to improve a translation or add a new language, please submit a pull request!
