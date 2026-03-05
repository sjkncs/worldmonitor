<p align="center">
  <a href="../../README.md">English</a> &nbsp;|&nbsp;
  <a href="./README.zh.md">简体中文</a> &nbsp;|&nbsp;
  <a href="./README.ja.md">日本語</a> &nbsp;|&nbsp;
  <a href="./README.ko.md">한국어</a> &nbsp;|&nbsp;
  <a href="./README.ar.md"><b>العربية</b></a> &nbsp;|&nbsp;
  <a href="./README.de.md">Deutsch</a> &nbsp;|&nbsp;
  <a href="./README.it.md">Italiano</a> &nbsp;|&nbsp;
  <a href="./README.fr.md">Français</a>
</p>

<div dir="rtl">

# World Monitor

**لوحة معلومات استخباراتية عالمية في الوقت الفعلي** — تجميع أخبار مدعوم بالذكاء الاصطناعي، مراقبة جيوسياسية، وتتبع البنية التحتية في واجهة موحدة للوعي الظرفي.

[![GitHub stars](https://img.shields.io/github/stars/koala73/worldmonitor?style=social)](https://github.com/koala73/worldmonitor/stargazers)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

<p align="center">
  <a href="https://worldmonitor.app"><img src="https://img.shields.io/badge/تطبيق_الويب-worldmonitor.app-blue?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Web App"></a>&nbsp;
  <a href="https://tech.worldmonitor.app"><img src="https://img.shields.io/badge/النسخة_التقنية-tech.worldmonitor.app-0891b2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Tech Variant"></a>&nbsp;
  <a href="https://finance.worldmonitor.app"><img src="https://img.shields.io/badge/النسخة_المالية-finance.worldmonitor.app-059669?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Finance Variant"></a>
</p>

![World Monitor Dashboard](../assets/new-world-monitor.png)

---

## 🆕 أبرز تحديثات الإصدار 2.6.0

> **تاريخ الإصدار 2026-03-05** — [سجل التغييرات الكامل](../CHANGELOG.md)

### 🌍 توسيع CII إلى 54 دولة

يراقب مؤشر عدم الاستقرار القُطري الآن **54 دولة** (بدلاً من 22). محرك **الأوزان التكيفية** الجديد يضبط تأثير مكونات CII ديناميكياً بناءً على خصائص كل دولة:

| نوع الدولة | التعديل |
|---|---|
| 🔴 **مناطق حرب** (خطر ≥ 40) | وزن النزاع ↑ 20% → 30% |
| 🟡 **سلطوية** (المضاعف ≥ 2.0) | وزن الاضطراب ↑ 20% → 28% |
| 🟢 **ديمقراطيات** (المضاعف ≤ 0.5) | ضوضاء المعلومات ↓ 20% → 12% |

### 📊 التحقق المتبادل CII ↔ السوق

خدمة جديدة تربط درجات CII مع **34 صندوق ETF قُطري** ومؤشرات الأسهم باستخدام **تحليل ارتباط بيرسون**:

| الحكم | الإشارة |
|---|---|
| `confirmed` مؤكد | CII ↑ + السوق ↓ |
| `market_leading` السوق يقود | السوق ↓ + CII مستقر |
| `noise` ضوضاء | CII ↑ + السوق هادئ |
| `recovery` تعافٍ | CII ↓ + السوق ↑ |

---

## لماذا World Monitor؟

| المشكلة | الحل |
|---|---|
| أخبار متناثرة عبر 100+ مصدر | **لوحة معلومات موحدة** مع 100+ مصدر منتقى |
| غياب السياق الجغرافي للأحداث | **خريطة ثلاثية الأبعاد تفاعلية** مع 35+ طبقة بيانات |
| فيض المعلومات | **ملخصات ذكاء اصطناعي** مع كشف نقاط التركيز |
| أدوات OSINT مكلفة | **مجاني 100% ومفتوح المصدر** |
| أدوات AI تعتمد على السحابة | **تشغيل AI محلياً** (Ollama/LM Studio) |
| لوحات ويب فقط | **تطبيق سطح مكتب أصلي** (Tauri) + PWA |

---

## العروض التوضيحية المباشرة

| النسخة | الرابط | التركيز |
|---|---|---|
| **World Monitor** | [worldmonitor.app](https://worldmonitor.app) | الجيوسياسة، العسكرية، النزاعات |
| **Tech Monitor** | [tech.worldmonitor.app](https://tech.worldmonitor.app) | الشركات الناشئة، AI/ML، السحابة |
| **Finance Monitor** | [finance.worldmonitor.app](https://finance.worldmonitor.app) | الأسواق العالمية، البنوك المركزية |

---

## الميزات الرئيسية

### الذكاء الاصطناعي

- **ملخص عالمي** — ملخص LLM مع سلسلة احتياطية من 4 مستويات
- **دعم LLM محلي** — Ollama / LM Studio على الأجهزة المحلية
- **مؤشر عدم الاستقرار القُطري (CII)** — درجات استقرار لحظية لـ **54 دولة**
- **التحقق المتبادل CII ↔ السوق** — ارتباط بيرسون لـ 34 ETF قُطري
- **كشف نقاط التركيز** — ارتباط الكيانات عبر مصادر متعددة

### طبقات البيانات في الوقت الفعلي

- **35+ طبقة بيانات** — نزاعات، قواعد عسكرية، منشآت نووية، كابلات بحرية، أنابيب، حرائق أقمار صناعية
- **8 إعدادات مسبقة إقليمية** — عالمي، أمريكا، أوروبا، الشرق الأوسط، آسيا، أفريقيا
- **150+ مصدر RSS** — جيوسياسة، دفاع، طاقة، تقنية، مالية

### الأمان

| الطبقة | الآلية |
|---|---|
| **قائمة CORS المسموحة** | فقط نطاقات worldmonitor.app |
| **منع SSRF** | التحقق من نطاقات URL المعاد توجيهها |
| **دفاع XSS** | `JSON.stringify()` لحقن آمن |
| **تحديد المعدل** | Upstash Redis نافذة منزلقة |
| **فحص الصحة** | نقطة نهاية `/api/health` |

---

## البدء السريع

```bash
git clone https://github.com/koala73/worldmonitor.git
cd worldmonitor
npm install
vercel dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## المساهمة

المساهمات مرحب بها! راجع [CONTRIBUTING.md](../../.github/CONTRIBUTING.md).

## الرخصة

GNU Affero General Public License v3.0 (AGPL-3.0) — راجع [LICENSE](../../LICENSE).

**Elie Habib** — [GitHub](https://github.com/koala73)

---

> 📖 للتوثيق التقني الكامل، راجع [README باللغة الإنجليزية](../../README.md)

</div>
