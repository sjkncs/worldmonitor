<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md">العربية</a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md"><b>Français</b></a>
</p>

# World Monitor

**Tableau de bord de renseignement mondial en temps réel** — Agrégation de nouvelles alimentée par l'IA, surveillance géopolitique et suivi des infrastructures dans une interface unifiée de connaissance situationnelle.

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/Application_Web-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/Variante_Tech-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variant"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/Variante_Finance-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finance Variant"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 Nouveautés de la v2.6.0

> **Publié le 05/03/2026** — [Journal des modifications complet](../CHANGELOG.md)

<table>
<tr>
<td width="50%">

### 🌍 Extension du CII à 54 pays

L'Indice d'Instabilité des Pays surveille désormais **54 nations** (contre 22). Un nouveau **moteur de pondération adaptatif** ajuste dynamiquement l'influence des composants CII en fonction des caractéristiques du pays :

| Profil pays | Ajustement |
|---|---|
| 🔴 **Zones de guerre** (risque ≥ 40) | Poids conflit ↑ 20% → 30% |
| 🟡 **Autoritaires** (mult. ≥ 2.0) | Poids troubles ↑ 20% → 28% |
| 🟢 **Démocraties** (mult. ≤ 0.5) | Bruit informationnel ↓ 20% → 12% |

</td>
<td width="50%">

### 📊 Validation croisée CII ↔ Marché

Nouveau service corrélant les scores CII avec **34 ETF nationaux** et indices boursiers via **analyse de corrélation de Pearson** :

| Verdict | Signal |
|---|---|
| `confirmed` Confirmé | CII ↑ + Marché ↓ |
| `market_leading` Marché précurseur | Marché ↓ + CII stable |
| `noise` Bruit | CII ↑ + Marché calme |
| `recovery` Reprise | CII ↓ + Marché ↑ |

</td>
</tr>
</table>

---

## Pourquoi World Monitor ?

| Problème | Solution |
|---|---|
| Actualités dispersées sur 100+ sources | **Tableau de bord unifié** avec 100+ flux sélectionnés |
| Absence de contexte géographique | **Globe 3D interactif** avec 35+ couches de données |
| Surcharge informationnelle | **Briefings synthétisés par IA** avec détection de points focaux |
| Outils OSINT coûteux | **100% gratuit et open source** |
| Outils IA dépendants du cloud | **Exécutez l'IA localement** (Ollama/LM Studio) |
| Tableaux de bord web uniquement | **Application bureau native** (Tauri) + PWA installable |

---

## Démos en direct

| Variante | URL | Focus |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | Géopolitique, militaire, conflits, infrastructures |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | Startups, IA/ML, cloud, cybersécurité |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | Marchés mondiaux, trading, banques centrales |

Les trois variantes sont construites à partir d'une base de code unique — basculez en un clic via la barre supérieure (🌍 MONDE | 💻 TECH | 📈 FINANCE).

---

## Fonctionnalités principales

### Renseignement alimenté par l'IA

- **World Brief** — Résumé synthétisé par LLM, chaîne de repli à 4 niveaux : Ollama (local) → Groq → OpenRouter → T5 navigateur
- **Support LLM local** — Ollama / LM Studio pour l'exécution de l'IA sur matériel local
- **Indice d'Instabilité des Pays (CII)** — Scores de stabilité en temps réel pour **54 nations** avec pondération adaptative
- **Validation croisée CII ↔ Marché** — Corrélation de Pearson avec 34 ETF nationaux, système à 6 classes de verdict
- **Détection de points focaux** — Corrélation d'entités à travers les actualités, l'activité militaire, les manifestations, les pannes et les marchés
- **Évaluation de posture stratégique** — Évaluation continue de 9 théâtres d'opérations

### Couches de données en temps réel

- **35+ couches de données** — Conflits, bases militaires, installations nucléaires, câbles sous-marins, pipelines, détection de feux par satellite, manifestations, catastrophes naturelles
- **8 préréglages régionaux** — Mondial, Amériques, Europe, MENA, Asie, Afrique, Océanie, Amérique latine
- **Rendu accéléré WebGL** — deck.gl + MapLibre GL JS, performances 60fps
- **Clustering intelligent** — Supercluster regroupe les marqueurs aux faibles niveaux de zoom

### Actualités en direct & Vidéo

- **150+ flux RSS** — Géopolitique, défense, énergie, tech, finance
- **8 flux vidéo en direct** — Bloomberg, Sky News, Al Jazeera, France24 et plus
- **Détection de disponibilité YouTube** — Repli gracieux pour les réseaux bloqués
- **19 webcams en direct** — Points chauds géopolitiques dans 4 régions

### Application bureau (Tauri)

- **Application bureau native** — macOS, Windows, Linux
- **Intégration trousseau OS** — Stockage sécurisé des clés API
- **Sidecar API local** — 60+ gestionnaires API exécutés localement
- **Repli cloud** — Proxy transparent en cas de défaillance locale

### Sécurité

| Couche | Mécanisme |
|---|---|
| **Liste blanche origines CORS** | Seuls les domaines worldmonitor.app autorisés |
| **Liste blanche domaines RSS** | Récupération uniquement depuis les domaines autorisés (90+) |
| **Prévention SSRF** | Validation des domaines d'URL redirigées |
| **Défense XSS** | `JSON.stringify()` pour injection sûre de paramètres |
| **Limitation de débit IP** | Limiteur à fenêtre glissante Upstash Redis |
| **Vérification de santé** | Point de terminaison `/api/health` avec Redis + sources externes |

---

## Démarrage rapide

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev       # Démarre le frontend + toutes les 60+ API Edge Functions
```

Ouvrez [http://localhost:3000](http://localhost:3000)

---

## Stack technologique

| Catégorie | Technologies |
|---|---|
| **Frontend** | TypeScript, Vite, deck.gl (globe WebGL 3D), MapLibre GL |
| **Bureau** | Tauri 2 (Rust) + sidecar Node.js, trousseau OS |
| **IA/ML** | Ollama / LM Studio, Groq, OpenRouter, Transformers.js |
| **Cache** | Redis (Upstash), Vercel CDN, Service Worker |
| **Contrats API** | Protocol Buffers (92 fichiers proto, 17 services) |
| **Déploiement** | Vercel Edge + Railway + Tauri + PWA |

---

## Contribuer

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](../../.github/CONTRIBUTING.md) pour les détails.

## Licence

GNU Affero General Public License v3.0 (AGPL-3.0) — voir [LICENSE](../../LICENSE).

**Elie Habib** — [GitHub](https://github.com/koala73)

---

> 📖 Pour la documentation technique complète, consultez le [README en anglais](../../README.md)
