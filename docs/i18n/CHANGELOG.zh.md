<p align="center">
  <a href="../CHANGELOG.md"><b>English</b></a> &nbsp;|&nbsp;
  <a href="./CHANGELOG.zh.md">简体中文</a>
</p>

# 更新日志

World Monitor 的所有重要变更均记录于此。

## [2.6.0] - 2026-03-05

### 亮点

**🌍 CII 扩展至 54 个国家 + 自适应权重** — 国家不稳定指数现监控 54 个国家（原 22 个），覆盖所有大国、活跃冲突区、区域大国、北约前线国家和关键美洲国家。新的自适应权重引擎根据国家特征动态调整 CII 组件权重 — 战争区域提升冲突权重，威权国家放大动荡信号，媒体饱和的民主国家降低信息噪声。

**🏗️ 架构：RefreshScheduler 提取** — 巨型 `App.ts` 中的刷新逻辑已提取到独立的 `RefreshScheduler` 模块，具备抖动间隔、可见性节流、条件执行和通过 `runGuarded()` 实现的统一飞行中去重。

**📊 CII ↔ 市场交叉验证** — 新服务使用皮尔逊相关分析将 CII 评分与国家 ETF 和股票指数性能关联。每国判定将信号分类为 `confirmed`（已确认）、`noise`（噪声）、`market_leading`（市场领先）、`recovery`（恢复）或 `stable`（稳定）。

### 新增

- **CII 国家扩展（22 → 54）** — 扩展了 `TIER1_COUNTRIES`、`COUNTRY_KEYWORDS`、`BASELINE_RISK`、`EVENT_MULTIPLIER`、`ISO3_TO_ISO2`、`COUNTRY_BOUNDS`、`ZONE_COUNTRY_MAP` 和 `HOTSPOT_COUNTRY_MAP`，覆盖 5 个地缘政治分类的 54 个国家
- **自适应 CII 权重** — `getAdaptiveWeights()` 按国家动态调整组件权重：战争区域（基线风险 ≥40）冲突从 20% → 30%，威权国家（事件乘数 ≥2.0）动荡从 20% → 28%，民主国家（乘数 ≤0.5）信息权重从 20% → 12%
- **CII ↔ 市场交叉验证服务**（`cii-market-crosscheck.ts`）— 通过 `MarketServiceClient` 将 CII 评分与 34 个国家 ETF（iShares、Vanguard）和本地股票指数关联，具备皮尔逊相关、分歧评分和 6 类判定系统
- **RefreshScheduler 模块**（`refresh-scheduler.ts`）— 从 `App.ts` 提取，包含 `schedule()`、`runGuarded()`、`flushStale()`、`markInFlight()`/`clearInFlight()`、`isRunning()` 和 `destroy()` API
- **YouTube 可用性检测**（`youtube-availability.ts`）— 使用 `no-cors` 模式探测 `youtube.com/favicon.ico`，5 秒超时，会话生命周期缓存，`online` 事件自动重新探测。LiveNewsPanel 和 LiveWebcamsPanel 在不可用时显示本地化的"YouTube 已封锁"/"正在检查 YouTube..."消息
- **健康检查端点**（`/api/health`）— 聚合探针检查 Upstash Redis 连接和外部源可达性（GitHub API、BBC RSS、YouTube），返回 200/503 状态
- **速率限制工具**（`api/_rate-limit.js`）— Upstash Redis 滑动窗口计数器，可配置窗口/最大值，IP 通过 `x-forwarded-for` 识别，正确的 `Retry-After` 和 `X-RateLimit-*` 头，Redis 错误时放行
- **CII 数据完整性测试**（`tests/verify-cii-data.mjs`）— 15 个自动化测试验证 54 国在所有 CII 数据表的覆盖

### 安全

- **RSS 代理 SSRF 加固** — `validateFeedUrl()` 通过域白名单强制验证重定向 URL 防止服务端请求伪造
- **YouTube 嵌入 XSS 防御** — 用 `JSON.stringify()` 替换字符串插值以安全注入参数到生成的 HTML
- **中间件 Bot 检测** — 除 User-Agent 长度外增加浏览器头检查改进爬虫识别
- **RSS 代理速率限制** — 集成 `checkRateLimit()` 防止 API 滥用

### 变更

- **App.ts 调度器集成** — 用 `RefreshScheduler` 实例替换独立的 `inFlight: Set<string>`；`loadAllData()` 和 `loadDataForLayer()` 现使用 `scheduler.runGuarded()` / `scheduler.markInFlight()` / `scheduler.clearInFlight()`
- **MapContainer 异步初始化** — DeckGLMap 现通过 `ready` Promise 动态导入；`withDeck()` 在延迟队列中缓冲回调，导入完成后重放
- **深度链接国家支持** — URL `?country=XX` 参数现解析所有 54 个 `TIER1_COUNTRIES`
- **i18n 新增** — `en.json` 添加 `youtube_blocked` 和 `youtube_checking` 键

### 修复

- **UAE 和 Qatar 缺失 COUNTRY_BOUNDS** — 添加 54 国扩展中遗漏的边界框 `AE: [22, 26, 51, 56]` 和 `QA: [24, 27, 50, 52]`

---

> 📖 更早版本的更新日志请参阅[英文 CHANGELOG](../CHANGELOG.md)
