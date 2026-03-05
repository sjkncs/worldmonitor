<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md"><b>Deutsch</b></a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

# World Monitor

**Echtzeit-Dashboard für globale Aufklärung** — KI-gestützte Nachrichtenaggregation, geopolitische Überwachung und Infrastruktur-Tracking in einer einheitlichen Lagebildoberfläche.

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/Web_App-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/Tech_Variante-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variante"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/Finanz_Variante-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finanz Variante"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 Neuigkeiten in v2.6.0

> **Veröffentlicht am 05.03.2026** — [Vollständiges Änderungsprotokoll](../CHANGELOG.md)

<table>
<tr>
<td width="50%">

### 🌍 CII-Erweiterung auf 54 Länder

Der Country Instability Index überwacht jetzt **54 Nationen** (statt 22). Eine neue **adaptive Gewichtungs-Engine** passt den Einfluss der CII-Komponenten dynamisch an die Landescharakteristiken an:

| Länderprofil | Anpassung |
|---|---|
| 🔴 **Kriegsgebiete** (Risiko ≥ 40) | Konfliktgewicht ↑ 20% → 30% |
| 🟡 **Autoritäre Staaten** (Mult. ≥ 2.0) | Unruhegewicht ↑ 20% → 28% |
| 🟢 **Demokratien** (Mult. ≤ 0.5) | Informationsrauschen ↓ 20% → 12% |

</td>
<td width="50%">

### 📊 CII ↔ Markt-Kreuzvalidierung

Neuer Service korreliert CII-Scores mit **34 Länder-ETFs** und Aktienindizes mittels **Pearson-Korrelationsanalyse**:

| Bewertung | Signal |
|---|---|
| `confirmed` Bestätigt | CII ↑ + Markt ↓ |
| `market_leading` Markt führend | Markt ↓ + CII stabil |
| `noise` Rauschen | CII ↑ + Markt ruhig |
| `recovery` Erholung | CII ↓ + Markt ↑ |

</td>
</tr>
</table>

---

## Warum World Monitor?

| Problem | Lösung |
|---|---|
| Nachrichten über 100+ Quellen verstreut | **Einheitliches Dashboard** mit 100+ kuratierten Feeds |
| Fehlender geographischer Kontext für Ereignisse | **Interaktiver 3D-Globus** mit 35+ umschaltbaren Datenschichten |
| Informationsüberflutung | **KI-synthetisierte Briefings** mit Fokalpunkt-Erkennung |
| Teure OSINT-Tools | **100% kostenlos & Open Source** |
| Cloud-abhängige KI-Tools | **KI lokal ausführen** (Ollama/LM Studio) |
| Nur Web-Dashboards | **Native Desktop-App** (Tauri) + installierbare PWA |

---

## Live-Demos

| Variante | URL | Fokus |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | Geopolitik, Militär, Konflikte, Infrastruktur |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | Startups, KI/ML, Cloud, Cybersicherheit |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | Globale Märkte, Handel, Zentralbanken |

Alle drei Varianten werden aus einer einzigen Codebasis erstellt — Umschaltung per Klick über die Kopfleiste (🌍 WELT | 💻 TECH | 📈 FINANZEN).

---

## Hauptfunktionen

### KI-gestützte Aufklärung

- **Welt-Briefing** — LLM-synthetisierte Zusammenfassung mit 4-stufiger Anbieter-Fallback-Kette: Ollama (lokal) → Groq → OpenRouter → Browser-T5
- **Lokale LLM-Unterstützung** — Ollama / LM Studio für KI-Ausführung auf lokaler Hardware
- **Länder-Instabilitätsindex (CII)** — Echtzeit-Stabilitätsbewertungen für **54 Nationen** mit adaptiver Gewichtung
- **CII ↔ Markt-Kreuzvalidierung** — Pearson-Korrelation mit 34 Länder-ETFs, 6-Klassen-Bewertungssystem
- **Fokalpunkt-Erkennung** — Entitätskorrelation über Nachrichten, Militär, Proteste, Ausfälle und Märkte

### Echtzeit-Datenschichten

- **35+ Datenschichten** — Konflikte, Militärbasen, Nuklearanlagen, Unterseekabel, Pipelines, Satellitenbrände, Proteste, Naturkatastrophen
- **8 regionale Voreinstellungen** — Global, Amerika, Europa, MENA, Asien, Afrika, Ozeanien, Lateinamerika
- **WebGL-beschleunigtes Rendering** — deck.gl + MapLibre GL JS, 60fps Leistung

### Live-Nachrichten & Video

- **150+ RSS-Feeds** — Geopolitik, Verteidigung, Energie, Tech, Finanzen
- **8 Live-Videostreams** — Bloomberg, Sky News, Al Jazeera u.a.
- **YouTube-Verfügbarkeitserkennung** — Graceful Fallback für blockierte Netzwerke

### Desktop-Anwendung (Tauri)

- **Native Desktop-App** — macOS, Windows, Linux
- **OS-Schlüsselbund-Integration** — Sichere Speicherung von API-Schlüsseln
- **Lokaler API-Sidecar** — 60+ API-Handler lokal ausgeführt
- **Cloud-Fallback** — Transparenter Proxy bei lokalen Ausfällen

### Sicherheit

| Schicht | Mechanismus |
|---|---|
| **CORS-Origin-Allowlist** | Nur worldmonitor.app-Domains erlaubt |
| **RSS-Domain-Allowlist** | Abruf nur von gelisteten Domains (90+) |
| **SSRF-Prävention** | Validierung von Redirect-URL-Domains |
| **XSS-Schutz** | `JSON.stringify()` für sichere Parameter-Injektion |
| **IP-Ratenbegrenzung** | Upstash Redis Sliding-Window-Limiter |
| **Gesundheitsprüfung** | `/api/health` Endpunkt mit Redis + externen Quellen |

---

## Schnellstart

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # Frontend + alle 60+ API Edge Functions starten
```

Öffne [http://localhost:3000](http://localhost:3000)

---

## Technologie-Stack

| Kategorie | Technologien |
|---|---|
| **Frontend** | TypeScript, Vite, deck.gl (WebGL 3D-Globus), MapLibre GL |
| **Desktop** | Tauri 2 (Rust) + Node.js Sidecar, OS-Schlüsselbund |
| **KI/ML** | Ollama / LM Studio, Groq, OpenRouter, Transformers.js |
| **Caching** | Redis (Upstash), Vercel CDN, Service Worker |
| **API-Verträge** | Protocol Buffers (92 Proto-Dateien, 17 Services) |
| **Deployment** | Vercel Edge + Railway + Tauri + PWA |

---

## Mitwirken

Beiträge willkommen! Siehe [CONTRIBUTING.md](../../.github/CONTRIBUTING.md) für Details.

## Lizenz

GNU Affero General Public License v3.0 (AGPL-3.0) — siehe [LICENSE](../../LICENSE).

**Elie Habib** — [GitHub](https://github.com/koala73)

---

> 📖 Vollständige technische Dokumentation finden Sie im [englischen README](../../README.md)
