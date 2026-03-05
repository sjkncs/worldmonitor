<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md"><b>Italiano</b></a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

# World Monitor

**Dashboard di intelligence globale in tempo reale** — Aggregazione di notizie basata su IA, monitoraggio geopolitico e tracciamento delle infrastrutture in un'interfaccia unificata di consapevolezza situazionale.

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/Web_App-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/Variante_Tech-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variant"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/Variante_Finanza-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finance Variant"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 Novità nella v2.6.0

> **Rilasciato il 05/03/2026** — [Changelog completo](../CHANGELOG.md)

<table>
<tr>
<td width="50%">

### 🌍 Espansione CII a 54 Paesi

L'Indice di Instabilità Nazionale ora monitora **54 nazioni** (da 22). Un nuovo **motore di pesi adattivi** regola dinamicamente l'influenza dei componenti CII in base alle caratteristiche del paese:

| Profilo Paese | Regolazione |
|---|---|
| 🔴 **Zone di guerra** (rischio ≥ 40) | Peso conflitto ↑ 20% → 30% |
| 🟡 **Autoritari** (molt. ≥ 2.0) | Peso disordini ↑ 20% → 28% |
| 🟢 **Democrazie** (molt. ≤ 0.5) | Rumore informativo ↓ 20% → 12% |

</td>
<td width="50%">

### 📊 Cross-validazione CII ↔ Mercato

Nuovo servizio che correla i punteggi CII con **34 ETF nazionali** e indici azionari tramite **analisi di correlazione di Pearson**:

| Verdetto | Segnale |
|---|---|
| `confirmed` Confermato | CII ↑ + Mercato ↓ |
| `market_leading` Mercato guida | Mercato ↓ + CII stabile |
| `noise` Rumore | CII ↑ + Mercato calmo |
| `recovery` Recupero | CII ↓ + Mercato ↑ |

</td>
</tr>
</table>

---

## Perché World Monitor?

| Problema | Soluzione |
|---|---|
| Notizie sparse su 100+ fonti | **Dashboard unificata** con 100+ feed curati |
| Mancanza di contesto geografico | **Globo 3D interattivo** con 35+ livelli dati |
| Sovraccarico informativo | **Briefing sintetizzati dall'IA** con rilevamento punti focali |
| Strumenti OSINT costosi | **100% gratuito e open source** |
| Strumenti AI dipendenti dal cloud | **Esegui l'IA localmente** (Ollama/LM Studio) |
| Solo dashboard web | **App desktop nativa** (Tauri) + PWA installabile |

---

## Demo Live

| Variante | URL | Focus |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | Geopolitica, militare, conflitti, infrastrutture |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | Startup, AI/ML, cloud, cybersicurezza |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | Mercati globali, trading, banche centrali |

Tutte e tre le varianti sono costruite da un'unica codebase — cambio con un clic tramite la barra superiore (🌍 MONDO | 💻 TECH | 📈 FINANZA).

---

## Funzionalità Principali

### Intelligence basata su IA

- **World Brief** — Riassunto sintetizzato da LLM, catena di fallback a 4 livelli: Ollama (locale) → Groq → OpenRouter → T5 nel browser
- **Supporto LLM locale** — Ollama / LM Studio per l'esecuzione dell'IA su hardware locale
- **Indice di Instabilità Nazionale (CII)** — Punteggi di stabilità in tempo reale per **54 nazioni** con pesi adattivi
- **Cross-validazione CII ↔ Mercato** — Correlazione di Pearson con 34 ETF nazionali, sistema a 6 classi
- **Rilevamento punti focali** — Correlazione di entità tra notizie, militare, proteste, blackout e mercati

### Livelli Dati in Tempo Reale

- **35+ livelli dati** — Conflitti, basi militari, impianti nucleari, cavi sottomarini, pipeline, incendi satellitari, proteste, disastri naturali
- **8 preset regionali** — Globale, Americhe, Europa, MENA, Asia, Africa, Oceania, America Latina
- **Rendering accelerato WebGL** — deck.gl + MapLibre GL JS, 60fps

### Notizie Live & Video

- **150+ feed RSS** — Geopolitica, difesa, energia, tech, finanza
- **8 stream video live** — Bloomberg, Sky News, Al Jazeera e altri
- **Rilevamento disponibilità YouTube** — Fallback per reti bloccate

### App Desktop (Tauri)

- **App desktop nativa** — macOS, Windows, Linux
- **Integrazione portachiavi OS** — Archiviazione sicura delle chiavi API
- **Sidecar API locale** — 60+ handler API eseguiti localmente

### Sicurezza

| Livello | Meccanismo |
|---|---|
| **Allowlist origini CORS** | Solo domini worldmonitor.app |
| **Allowlist domini RSS** | Fetch solo da domini autorizzati (90+) |
| **Prevenzione SSRF** | Validazione domini URL reindirizzati |
| **Difesa XSS** | `JSON.stringify()` per iniezione parametri sicura |
| **Rate limiting IP** | Upstash Redis sliding window limiter |
| **Health check** | Endpoint `/api/health` con Redis + fonti esterne |

---

## Avvio Rapido

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # Avvia frontend + tutte le 60+ API Edge Functions
```

Apri [http://localhost:3000](http://localhost:3000)

---

## Stack Tecnologico

| Categoria | Tecnologie |
|---|---|
| **Frontend** | TypeScript, Vite, deck.gl (globo WebGL 3D), MapLibre GL |
| **Desktop** | Tauri 2 (Rust) + Node.js sidecar, portachiavi OS |
| **AI/ML** | Ollama / LM Studio, Groq, OpenRouter, Transformers.js |
| **Caching** | Redis (Upstash), Vercel CDN, Service Worker |
| **Contratti API** | Protocol Buffers (92 file proto, 17 servizi) |
| **Deployment** | Vercel Edge + Railway + Tauri + PWA |

---

## Contribuire

I contributi sono benvenuti! Vedi [CONTRIBUTING.md](../../.github/CONTRIBUTING.md) per i dettagli.

## Licenza

GNU Affero General Public License v3.0 (AGPL-3.0) — vedi [LICENSE](../../LICENSE).

**Elie Habib** — [GitHub](https://github.com/koala73)

---

> 📖 Per la documentazione tecnica completa, consulta il [README in inglese](../../README.md)
