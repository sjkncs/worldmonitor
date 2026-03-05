<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md"><b>한국어</b></a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

# World Monitor

**실시간 글로벌 인텔리전스 대시보드** — AI 기반 뉴스 집계, 지정학적 모니터링, 인프라 추적을 통합한 상황 인식 인터페이스.

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/Web_App-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/테크_버전-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variant"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/금융_버전-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finance Variant"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 v2.6.0 업데이트 하이라이트

> **출시일 2026-03-05** — [전체 변경 로그](../CHANGELOG.md)

<table>
<tr>
<td width="50%">

### 🌍 CII 54개국으로 확대

국가 불안정 지수가 **54개국**을 모니터링합니다 (기존 22개국). 새로운 **적응형 가중치 엔진**이 국가 특성에 따라 CII 구성 요소의 영향을 동적으로 조정합니다:

| 국가 프로필 | 조정 |
|---|---|
| 🔴 **전쟁 지역** (위험 ≥ 40) | 분쟁 가중치 ↑ 20% → 30% |
| 🟡 **권위주의** (승수 ≥ 2.0) | 불안 가중치 ↑ 20% → 28% |
| 🟢 **민주주의** (승수 ≤ 0.5) | 정보 노이즈 ↓ 20% → 12% |

</td>
<td width="50%">

### 📊 CII ↔ 시장 교차 검증

**34개국 ETF**와 주가 지수와의 **피어슨 상관 분석**을 사용하는 새로운 서비스:

| 판정 | 신호 |
|---|---|
| `confirmed` 확인됨 | CII ↑ + 시장 ↓ |
| `market_leading` 시장 선행 | 시장 ↓ + CII 안정 |
| `noise` 노이즈 | CII ↑ + 시장 안정 |
| `recovery` 회복 | CII ↓ + 시장 ↑ |

</td>
</tr>
</table>

---

## World Monitor를 선택하는 이유

| 문제 | 솔루션 |
|---|---|
| 100개 이상 소스에 흩어진 뉴스 | **통합 대시보드** (100+ 큐레이션된 피드) |
| 이벤트의 지리적 맥락 부재 | **인터랙티브 3D 지구본** (35+ 토글 가능 데이터 레이어) |
| 정보 과부하 | **AI 종합 브리핑** (포컬 포인트 감지 + 로컬 LLM 지원) |
| 암호화폐/매크로 신호 노이즈 | **7-신호 마켓 레이더** (복합 BUY/CASH 판정) |
| 비싼 OSINT 도구 | **100% 무료 오픈소스** |
| 클라우드 의존 AI 도구 | **로컬 AI 실행** (Ollama/LM Studio), API 키 불필요 |
| 웹 전용 대시보드 | **네이티브 데스크톱 앱** (Tauri) + 설치 가능 PWA |

---

## 라이브 데모

| 버전 | URL | 초점 |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | 지정학, 군사, 분쟁, 인프라 |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | 스타트업, AI/ML, 클라우드 |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | 글로벌 시장, 트레이딩, 중앙은행 |

세 버전 모두 단일 코드베이스에서 구동됩니다 — 상단 바에서 원클릭 전환 (🌍 월드 | 💻 테크 | 📈 금융).

---

## 주요 기능

### AI 기반 인텔리전스

- **월드 브리프** — LLM 합성 요약, 4단계 제공자 폴백 체인: Ollama(로컬) → Groq → OpenRouter → 브라우저 T5
- **로컬 LLM 지원** — Ollama / LM Studio로 로컬 하드웨어에서 AI 실행
- **국가 불안정 지수 (CII)** — **54개국** 실시간 안정성 점수, 적응형 가중치
- **CII ↔ 시장 교차 검증** — 34개국 ETF 피어슨 상관, 6개 클래스 판정
- **포컬 포인트 감지** — 뉴스, 군사, 시위, 정전, 시장 간 엔티티 상관 분석

### 실시간 데이터 레이어

- **35개 이상의 데이터 레이어** — 분쟁, 군사 기지, 핵 시설, 해저 케이블, 파이프라인, 위성 화재 감지, 시위, 자연재해 등
- **8개 지역 프리셋** — 글로벌, 아메리카, 유럽, MENA, 아시아, 아프리카, 오세아니아, 라틴 아메리카
- **WebGL 가속 렌더링** — deck.gl + MapLibre GL JS, 60fps 성능

### 라이브 뉴스 & 비디오

- **150개 이상 RSS 피드** — 지정학, 국방, 에너지, 테크, 금융
- **8개 라이브 비디오 스트림** — Bloomberg, Sky News, Al Jazeera 등
- **YouTube 가용성 감지** — 차단된 네트워크에서 우아한 폴백

### 데스크톱 앱 (Tauri)

- **네이티브 데스크톱** — macOS, Windows, Linux
- **OS 키체인 통합** — API 키 보안 저장
- **로컬 API 사이드카** — 60개 이상 API 핸들러 로컬 실행

### 보안

| 레이어 | 메커니즘 |
|---|---|
| **CORS 오리진 허용 목록** | worldmonitor.app 도메인만 API 호출 허용 |
| **RSS 도메인 허용 목록** | 허용 목록 도메인에서만 가져오기 (90+) |
| **SSRF 방지** | 리디렉션 URL 도메인 유효성 검사 |
| **XSS 방어** | `JSON.stringify()`로 안전한 파라미터 주입 |
| **IP 속도 제한** | Upstash Redis 슬라이딩 윈도우 리미터 |

---

## 빠른 시작

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # 프론트엔드 + 모든 60+ API Edge 함수 시작
```

[http://localhost:3000](http://localhost:3000) 열기

---

## 기술 스택

| 카테고리 | 기술 |
|---|---|
| **프론트엔드** | TypeScript, Vite, deck.gl, MapLibre GL |
| **데스크톱** | Tauri 2 (Rust) + Node.js 사이드카 |
| **AI/ML** | Ollama / LM Studio, Groq, OpenRouter, Transformers.js |
| **캐시** | Redis (Upstash), Vercel CDN, Service Worker |
| **API 계약** | Protocol Buffers (92개 proto 파일, 17개 서비스) |
| **배포** | Vercel Edge + Railway + Tauri + PWA |

---

## 기여

기여를 환영합니다! 자세한 내용은 [CONTRIBUTING.md](../../.github/CONTRIBUTING.md)를 참조하세요.

## 라이선스

GNU Affero General Public License v3.0 (AGPL-3.0) — [LICENSE](../../LICENSE) 참조.

**Elie Habib** — [GitHub](https://github.com/koala73)

---

> 📖 전체 기술 문서는 [영문 README](../../README.md)를 참조하세요
