<p align="center">
  <a href="../../.github/SECURITY.md"><b>English</b></a> &nbsp;|&nbsp;
  <a href="./SECURITY.zh.md">简体中文</a>
</p>

# 安全策略

## 支持的版本

| 版本 | 支持状态 |
|---|---|
| main | :white_check_mark: |

仅 `main` 分支上的最新版本会得到积极维护和安全更新。

## 报告漏洞

**请勿通过公开的 GitHub Issues 报告安全漏洞。**

如果您在 World Monitor 中发现安全漏洞，请负责任地报告：

1. **GitHub 私密漏洞报告**：使用 [GitHub 私密漏洞报告](https://github.com/koala73/worldmonitor/security/advisories/new) 直接通过仓库提交报告。

2. **直接联系**：或者通过 GitHub 直接联系仓库所有者 [@koala73](https://github.com/koala73)。

### 报告应包含

- 漏洞描述及其潜在影响
- 复现步骤
- 受影响的组件（边缘函数、客户端代码、数据图层等）
- 您发现的任何潜在修复或缓解措施

### 响应时间

- **确认收到**：报告后 48 小时内
- **初步评估**：1 周内
- **修复/补丁**：根据严重程度，关键问题将优先处理

### 预期流程

- 您将收到报告确认
- 我们将与您合作理解和验证问题
- 我们将通知您修复进展
- 修复提交中将注明报告者（除非您希望匿名）

## 安全注意事项

World Monitor 是一个客户端情报仪表盘，聚合公开可用的数据。以下是关键安全领域：

### API 密钥与密码

- 所有 API 密钥存储在 Vercel Edge Functions 服务端
- 不应将任何 API 密钥提交到仓库
- 环境变量（`.env.local`）已在 gitignore 中
- RSS 代理使用域白名单防止 SSRF
- Upstash Redis 滑动窗口速率限制器防止 API 滥用

### Edge Functions 与 Sebuf 处理程序

- 所有 17 个域 API 通过 Sebuf（Proto-first RPC 框架）经 Vercel Edge Functions 提供
- 边缘函数和处理程序应验证/清理所有输入
- CORS 头按函数配置
- 速率限制和断路器防止滥用

### 客户端安全

- localStorage 或 sessionStorage 中不存储敏感数据
- 外部内容（RSS 源、新闻）在渲染前经过清理
- 地图数据图层使用可信、经审核的数据源
- YouTube 嵌入使用 `JSON.stringify()` 防止 XSS 注入

### 数据源

- World Monitor 聚合公开可用的 OSINT 数据
- 不使用机密或受限数据源
- 国家关联源标有宣传风险评级
- 所有数据以只读方式消费 — 平台不修改上游源

## 范围

以下属于安全报告的**范围内**：

- World Monitor 代码库中的漏洞
- Edge Function 安全问题（SSRF、注入、认证绕过）
- 通过 RSS 源或外部数据的 XSS 或内容注入
- API 密钥泄露或密码泄漏
- 具有可行攻击向量的依赖漏洞

以下**不在范围内**：

- 上游数据源中的漏洞（GDELT、ACLED、OpenSky 等）
- 影响所有 Vercel 部署的通用 Vercel 基础设施问题
- 社会工程攻击
- 拒绝服务（DoS）攻击
- 不影响应用安全性的 UI/UX 问题

---

> 📖 完整英文安全策略请参阅 [SECURITY.md](../../.github/SECURITY.md)
