<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md"><b>简体中文</b></a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

# World Monitor

**实时全球情报仪表盘** — AI 驱动的新闻聚合、地缘政治监控和基础设施追踪，统一态势感知界面。

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/Web_App-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/科技版-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variant"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/金融版-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finance Variant"></a>
</p>

<p align="center">
  <a href="https://worldmonitor.app/api/download?platform=windows-exe"><img src="https://img.shields.io/badge/下载-Windows_(.exe)-0078D4?style=for-the-badge&logo=windows&logoColor=white" alt="Download Windows"></a>&nbsp;
  <a href="https://worldmonitor.app/api/download?platform=macos-arm64"><img src="https://img.shields.io/badge/下载-macOS_Apple_Silicon-000000?style=for-the-badge&logo=apple&logoColor=white" alt="Download macOS ARM"></a>&nbsp;
  <a href="https://worldmonitor.app/api/download?platform=linux-appimage"><img src="https://img.shields.io/badge/下载-Linux_(.AppImage)-FCC624?style=for-the-badge&logo=linux&logoColor=black" alt="Download Linux"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 v2.6.0 更新亮点

> **发布日期 2026-03-05** — [完整更新日志](../CHANGELOG.md)

<table>
<tr>
<td width="50%">

### 🌍 CII 扩展至 54 个国家

国家不稳定指数现监控 **54 个国家**（原 22 个），全面覆盖所有评分数据表。新增**自适应权重引擎**根据国家特征动态调整 CII 组件权重：

| 国家类型 | 权重调整 |
|---|---|
| 🔴 **战争区域**（风险 ≥ 40） | 冲突权重 ↑ 20% → 30% |
| 🟡 **威权国家**（乘数 ≥ 2.0） | 动荡权重 ↑ 20% → 28% |
| 🟢 **民主国家**（乘数 ≤ 0.5） | 信息噪声 ↓ 20% → 12% |

</td>
<td width="50%">

### 📊 CII ↔ 市场交叉验证

新服务使用**皮尔逊相关分析**将 CII 评分与 **34 个国家 ETF** 和股票指数关联：

| 判定结果 | 信号组合 |
|---|---|
| `confirmed` 已确认 | CII ↑ + 市场 ↓ |
| `market_leading` 市场领先 | 市场 ↓ + CII 稳定 |
| `noise` 噪声 | CII ↑ + 市场平静 |
| `recovery` 恢复 | CII ↓ + 市场 ↑ |

</td>
</tr>
</table>

---

## 为什么选择 World Monitor？

| 问题 | 解决方案 |
|---|---|
| 新闻分散在 100+ 个来源 | **统一仪表盘**，100+ 精选 RSS 源 |
| 事件缺乏地理空间上下文 | **交互式 3D 地球**，35+ 可切换数据图层 |
| 信息过载 | **AI 综合简报**，焦点检测 + 本地 LLM 支持 |
| 加密/宏观信号噪声 | **7 信号市场雷达**，复合买入/持现判定 |
| 昂贵的 OSINT 工具 | **100% 免费开源** |
| 静态新闻推送 | **实时更新**，直播视频流 |
| 依赖云端的 AI 工具 | **本地运行 AI**（Ollama/LM Studio），无需 API 密钥 |
| 仅限网页版 | **原生桌面应用**（Tauri）+ 可安装 PWA + 离线地图 |

---

## 在线演示

| 版本 | 网址 | 侧重方向 |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | 地缘政治、军事、冲突、基础设施 |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | 初创企业、AI/ML、云计算、网络安全 |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | 全球市场、交易、央行、海湾 FDI |

三个版本由同一代码库构建 — 通过顶栏一键切换（🌍 全球 | 💻 科技 | 📈 金融）。

---

## 核心功能

### 多语言与区域支持

- **16 种语言 UI** — 英语、法语、西班牙语、德语、意大利语、波兰语、葡萄牙语、荷兰语、瑞典语、俄语、阿拉伯语、中文、日语、土耳其语、泰语、越南语
- **RTL 支持** — 阿拉伯语原生从右到左布局
- **本地化新闻源** — 根据语言偏好自动选择地区 RSS 源
- **AI 翻译** — 集成 LLM 翻译，支持跨语言情报收集

### 交互式 3D 地球

- **WebGL 加速渲染** — deck.gl + MapLibre GL JS，60fps 流畅性能
- **35+ 数据图层** — 冲突、军事基地、核设施、海底电缆、管道、卫星火灾检测、抗议、自然灾害等
- **智能聚类** — Supercluster 低缩放级别分组标记
- **8 个区域预设** — 全球、美洲、欧洲、中东北非、亚洲、非洲、大洋洲、拉美
- **时间过滤** — 1 小时、6 小时、24 小时、48 小时、7 天事件窗口
- **URL 状态共享** — 地图中心、缩放、活跃图层编码在 URL 中

### AI 驱动的情报

- **世界简报** — LLM 综合摘要，4 层提供商回退链：Ollama（本地）→ Groq → OpenRouter → 浏览器 T5
- **本地 LLM 支持** — Ollama 和 LM Studio 完全在本地硬件上运行 AI
- **国家不稳定指数 (CII)** — **54 个国家**实时稳定性评分，自适应权重多信号融合
- **CII ↔ 市场交叉验证** — 34 国 ETF 皮尔逊相关分析，6 类判定系统
- **焦点检测** — 跨新闻、军事、抗议、停电、市场实体相关性分析
- **趋势关键词尖峰检测** — 2 小时滚动窗口 vs 7 天基线
- **战略态势评估** — 9 个作战区持续评估

### 实时数据图层

<details>
<summary><strong>地缘政治</strong></summary>

- 活跃冲突区域（UCDP + ACLED）
- 情报热点及新闻关联
- 社会动荡事件（双源：ACLED 抗议 + GDELT 地理事件）
- 自然灾害（USGS 地震 M4.5+、GDACS 警报、NASA EONET）
- 制裁制度
- 网络威胁 IOC（C2 服务器、恶意软件、钓鱼）
- 天气警报

</details>

<details>
<summary><strong>军事与战略</strong></summary>

- 220+ 军事基地（9 个运营国）
- 实时军事飞行追踪（ADS-B）
- 海军舰艇监控（AIS）
- 核设施与伽马辐射源
- APT 网络威胁归因
- 航天发射场

</details>

<details>
<summary><strong>基础设施</strong></summary>

- 海底电缆与登陆站、电缆健康监测（NGA 航行警告）
- 油气管道
- AI 数据中心（111 个主要集群）
- 83 个战略港口（6 种类型）
- 互联网中断（Cloudflare Radar）
- 关键矿产
- NASA FIRMS 卫星火灾检测

</details>

<details>
<summary><strong>市场与加密情报</strong></summary>

- 7 信号宏观雷达，复合买入/持现判定
- 实时加密价格（BTC、ETH、SOL、XRP 等）
- BTC 现货 ETF 资金流追踪
- 稳定币锚定健康监控（USDT、USDC、DAI、FDUSD、USDe）
- 恐惧与贪婪指数
- 比特币技术趋势（SMA50、SMA200、VWAP、梅耶倍数）

</details>

<details>
<summary><strong>金融与市场</strong>（金融版）</summary>

- 92 个全球证券交易所
- 19 个金融中心
- 13 家央行
- 10 个大宗商品枢纽
- 海湾 FDI 投资图层（64 个沙特/阿联酋投资项目）

</details>

### 直播新闻与视频

- **150+ RSS 源** — 地缘政治、国防、能源、科技、金融
- **8 路直播视频流** — Bloomberg、Sky News、半岛电视台等
- **YouTube 可用性检测** — 网络封锁自动降级（如中国大陆 GFW）
- **19 路实时网络摄像头** — 4 个区域地缘政治热点
- **自定义关键词监控** — 用户自定义关键词警报

### 桌面应用（Tauri）

- **原生桌面应用** — macOS、Windows、Linux
- **OS 钥匙链集成** — API 密钥安全存储
- **本地 API 侧车** — 60+ API 处理程序本地运行
- **云端回退** — 本地失败时透明代理到云端
- **设置窗口** — LLM、API 密钥、调试日志三标签页配置

### 渐进式 Web 应用 (PWA)

- **可安装** — 添加到主屏幕或独立桌面应用
- **离线地图** — MapTiler 瓦片缓存（500 个瓦片，30 天 TTL）
- **智能缓存策略** — 按数据类型分级缓存

---

## 安全模型

| 层级 | 机制 |
|---|---|
| **CORS 源白名单** | 仅允许 worldmonitor.app 域名调用 API |
| **RSS 域白名单** | RSS 代理仅获取白名单域名（90+） |
| **SSRF 防护** | RSS 代理验证重定向 URL 的域名合规性 |
| **XSS 防御** | YouTube 嵌入使用 `JSON.stringify()` 安全注入参数 |
| **IP 速率限制** | Upstash Redis 滑动窗口限流器 |
| **健康检查** | `/api/health` 聚合探针（Redis + 外部源） |
| **Bot 检测** | Edge Middleware 阻止爬虫访问 API 路由 |
| **桌面侧车认证** | 每次启动生成唯一 Bearer 令牌 |
| **OS 钥匙链存储** | API 密钥存储在操作系统凭据管理器中 |

---

## 架构概览

```
┌─────────────────────────────────────┐
│          Vercel (Edge)              │
│  60+ 边缘函数 · 静态 SPA           │
│  Proto 网关（17 个类型化服务）      │
│  CORS 白名单 · Redis 缓存          │
│  AI 管道 · 市场分析                 │
└──────────┬─────────────┬────────────┘
           │             │ 回退
           │             ▼
           │  ┌───────────────────────────────────┐
           │  │     Tauri 桌面（Rust + Node）      │
           │  │  OS 钥匙链 · 令牌认证侧车         │
           │  │  60+ 本地 API 处理程序             │
           │  │  云端回退 · 流量日志               │
           │  └───────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│       Railway（中继服务器）          │
│  WebSocket 中继 · OpenSky OAuth2    │
│  被封域名 RSS 代理 · AIS 船舶流     │
└─────────────────────────────────────┘
```

---

## 快速开始

```bash
# 克隆并运行
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # 运行前端 + 所有 60+ API 边缘函数
```

打开 [http://localhost:3000](http://localhost:3000)

> **注意**：`vercel dev` 需要 [Vercel CLI](https://vercel.com/docs/cli)。如使用 `npm run dev`，只启动前端，新闻和 API 面板不会加载。

### 环境变量（可选）

仪表盘无需 API 密钥即可运行 — 未配置的服务面板不会显示。完整功能请复制示例文件：

```bash
cp .env.example .env.local
```

| 组别 | 变量 | 免费额度 |
|---|---|---|
| **AI（本地）** | `OLLAMA_API_URL`, `OLLAMA_MODEL` | 免费（本地运行） |
| **AI（云端）** | `GROQ_API_KEY`, `OPENROUTER_API_KEY` | 14,400 请求/天 |
| **缓存** | `UPSTASH_REDIS_REST_URL/TOKEN` | 10K 命令/天 |
| **市场** | `FINNHUB_API_KEY`, `FRED_API_KEY` | 均有免费层 |

---

## 技术栈

| 分类 | 技术 |
|---|---|
| **前端** | TypeScript, Vite, deck.gl (WebGL 3D 地球), MapLibre GL |
| **桌面** | Tauri 2 (Rust) + Node.js 侧车, OS 钥匙链 |
| **AI/ML** | Ollama / LM Studio（本地）, Groq, OpenRouter, Transformers.js（浏览器） |
| **缓存** | Redis (Upstash), Vercel CDN, Service Worker (Workbox) |
| **地缘 API** | OpenSky, GDELT, ACLED, UCDP, USGS, NASA EONET/FIRMS |
| **市场 API** | Yahoo Finance, CoinGecko, mempool.space |
| **API 合约** | Protocol Buffers（92 proto 文件, 17 服务）, auto-gen TypeScript + OpenAPI |
| **部署** | Vercel Edge + Railway + Tauri + PWA |

---

## 贡献

欢迎贡献！详见 [CONTRIBUTING.md](../../.github/CONTRIBUTING.md)。

```bash
# 开发
npm run dev          # 全版本
npm run dev:tech     # 科技版
npm run dev:finance  # 金融版

# 构建
npm run build:full
npm run build:tech
npm run build:finance

# 类型检查
npm run typecheck
```

---

## 许可证

GNU Affero General Public License v3.0 (AGPL-3.0) — 详见 [LICENSE](../../LICENSE)。

---

## 作者

**Elie Habib** — [GitHub](https://github.com/koala73)

---

<p align="center">
  <a href="https://worldmonitor.app">worldmonitor.app</a> &nbsp;·&nbsp;
  <a href="https://tech.worldmonitor.app">tech.worldmonitor.app</a> &nbsp;·&nbsp;
  <a href="https://finance.worldmonitor.app">finance.worldmonitor.app</a>
</p>

> 📖 完整技术文档请参阅 [英文 README](../../README.md)
