<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md"><b>日本語</b></a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

# World Monitor

**リアルタイムグローバルインテリジェンスダッシュボード** — AI駆動のニュース集約、地政学モニタリング、インフラ追跡を統合した状況認識インターフェース。

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/Web_App-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/テック版-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variant"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/金融版-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finance Variant"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 v2.6.0 更新ハイライト

> **リリース日 2026-03-05** — [完全な変更履歴](../CHANGELOG.md)

<table>
<tr>
<td width="50%">

### 🌍 CII 54カ国に拡大

国家不安定指数が**54カ国**を監視（22カ国から拡大）。新しい**適応型重み付けエンジン**が国の特性に基づいてCIIコンポーネントの影響を動的に調整：

| 国家プロファイル | 調整 |
|---|---|
| 🔴 **紛争地帯**（リスク ≥ 40） | 紛争重み ↑ 20% → 30% |
| 🟡 **権威主義**（乗数 ≥ 2.0） | 不安定重み ↑ 20% → 28% |
| 🟢 **民主主義**（乗数 ≤ 0.5） | 情報ノイズ ↓ 20% → 12% |

</td>
<td width="50%">

### 📊 CII ↔ 市場クロスバリデーション

**34カ国のETF**と株価指数との**ピアソン相関分析**による新サービス：

| 判定 | シグナル |
|---|---|
| `confirmed` 確認済み | CII ↑ + 市場 ↓ |
| `market_leading` 市場先行 | 市場 ↓ + CII 安定 |
| `noise` ノイズ | CII ↑ + 市場平穏 |
| `recovery` 回復 | CII ↓ + 市場 ↑ |

</td>
</tr>
</table>

---

## World Monitor を選ぶ理由

| 問題 | ソリューション |
|---|---|
| 100以上のソースに散在するニュース | **統合ダッシュボード**（100+ キュレーション済みフィード） |
| イベントの地理的コンテキストの欠如 | **インタラクティブ3D地球儀**（35+ トグル可能データレイヤー） |
| 情報過多 | **AI統合ブリーフィング**（フォーカルポイント検出 + ローカルLLMサポート） |
| 暗号資産/マクロシグナルのノイズ | **7シグナルマーケットレーダー**（複合BUY/CASH判定） |
| 高価なOSINTツール | **100% 無料・オープンソース** |
| クラウド依存のAIツール | **ローカルAI実行**（Ollama/LM Studio）、APIキー不要 |
| Webのみのダッシュボード | **ネイティブデスクトップアプリ**（Tauri）+ インストール可能PWA |

---

## ライブデモ

| バリアント | URL | フォーカス |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | 地政学、軍事、紛争、インフラ |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | スタートアップ、AI/ML、クラウド |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | グローバル市場、トレーディング、中央銀行 |

---

## 主要機能

### AI駆動インテリジェンス

- **ワールドブリーフ** — LLM合成サマリー、4層プロバイダーフォールバック：Ollama（ローカル）→ Groq → OpenRouter → ブラウザT5
- **ローカルLLMサポート** — Ollama / LM Studioでローカルハードウェア上でAI実行
- **国家不安定指数（CII）** — **54カ国**のリアルタイム安定性スコア、適応型重み付け
- **CII ↔ 市場クロスバリデーション** — 34カ国ETFピアソン相関、6クラス判定
- **フォーカルポイント検出** — ニュース、軍事、抗議、停電、市場間のエンティティ相関
- **戦略的態勢評価** — 9つの作戦エリアの継続的評価

### リアルタイムデータレイヤー

- **35以上のデータレイヤー** — 紛争、軍事基地、核施設、海底ケーブル、パイプライン、衛星火災検出、抗議、自然災害等
- **8つの地域プリセット** — グローバル、アメリカ、ヨーロッパ、MENA、アジア、アフリカ、オセアニア、ラテンアメリカ
- **WebGL加速レンダリング** — deck.gl + MapLibre GL JS、60fpsパフォーマンス
- **スマートクラスタリング** — Superclusterによる低ズームレベルマーカーグルーピング

### ライブニュース & ビデオ

- **150以上のRSSフィード** — 地政学、防衛、エネルギー、テック、金融
- **8つのライブビデオストリーム** — Bloomberg、Sky News、Al Jazeera等
- **YouTube可用性検出** — ブロックされたネットワークでの優雅なフォールバック
- **19のライブウェブカメラ** — 4地域の地政学ホットスポット

### デスクトップアプリ（Tauri）

- **ネイティブデスクトップ** — macOS、Windows、Linux
- **OSキーチェーン統合** — APIキーのセキュアストレージ
- **ローカルAPIサイドカー** — 60以上のAPIハンドラーをローカル実行
- **クラウドフォールバック** — ローカル障害時の透過的プロキシ

### セキュリティ

| レイヤー | メカニズム |
|---|---|
| **CORSオリジン許可リスト** | worldmonitor.appドメインのみAPIコール許可 |
| **RSSドメイン許可リスト** | 許可リストドメインからのみフェッチ（90+） |
| **SSRF防止** | リダイレクトURLのドメイン検証 |
| **XSS防御** | `JSON.stringify()`による安全なパラメータインジェクション |
| **IPレート制限** | Upstash Redisスライディングウィンドウリミッター |
| **ボット検出** | Edge MiddlewareによるAPIルートのクローラーブロック |

---

## クイックスタート

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # フロントエンド + 全60+ API Edgeファンクション起動
```

[http://localhost:3000](http://localhost:3000) を開く

---

## テックスタック

| カテゴリ | テクノロジー |
|---|---|
| **フロントエンド** | TypeScript, Vite, deck.gl, MapLibre GL |
| **デスクトップ** | Tauri 2 (Rust) + Node.js サイドカー |
| **AI/ML** | Ollama / LM Studio, Groq, OpenRouter, Transformers.js |
| **キャッシュ** | Redis (Upstash), Vercel CDN, Service Worker |
| **API契約** | Protocol Buffers（92プロトファイル、17サービス） |
| **デプロイ** | Vercel Edge + Railway + Tauri + PWA |

---

## コントリビュート

コントリビュート歓迎！詳細は [CONTRIBUTING.md](../../.github/CONTRIBUTING.md) をご覧ください。

## ライセンス

GNU Affero General Public License v3.0 (AGPL-3.0) — [LICENSE](../../LICENSE) 参照。

**Elie Habib** — [GitHub](https://github.com/koala73)

---

> 📖 完全な技術ドキュメントは [英語版 README](../../README.md) をご覧ください
