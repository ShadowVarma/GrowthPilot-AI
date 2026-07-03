<![CDATA[<div align="center">

  <img src="assets/dashboard_mockup.png" alt="GrowthPilot AI Dashboard" width="860" />

  <h1>🚀 GrowthPilot AI</h1>
  <p><strong>Small Business Growth Advisor — AI-powered insights right in your browser</strong></p>

  ![GitHub last commit](https://img.shields.io/github/last-commit/USERNAME/growthpilot-ai?style=flat-square&color=7c3aed)
  ![GitHub repo size](https://img.shields.io/github/repo-size/USERNAME/growthpilot-ai?style=flat-square&color=06b6d4)
  ![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)
  ![CI](https://github.com/USERNAME/growthpilot-ai/workflows/CI/badge.svg)

</div>

---

## 📖 About

**GrowthPilot AI** is a fully client-side, zero-dependency web application that acts as an intelligent business growth advisor for small business owners. No backend. No API keys. No installation. Just open a browser and grow your business.

The app takes simple inputs (monthly sales, expenses, inventory, best/slow-selling products) and returns a rich, AI-styled dashboard with actionable insights.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏪 **8 Business Types** | Grocery · Restaurant · Clothing · Pharmacy · Bakery · Salon · Electronics · Other |
| 💚 **Health Score Gauge** | Animated 0–100 gauge showing overall business health (green / yellow / red) |
| 📊 **Sales Insights** | Canvas bar chart comparing revenue, expenses, and profit |
| 🔁 **Restock Suggestions** | Flags slow-moving products and calculates reorder quantities |
| 📣 **Marketing Ideas** | 4 curated, industry-specific campaigns per business type (32 total) |
| 📈 **6-Month Forecast** | Line chart with Optimistic / Realistic / Conservative scenarios |
| 🗓️ **Weekly Growth Plan** | Day-by-day checklist saved to `localStorage` |
| 📆 **Monthly Roadmap** | 4-week growth milestones accordion |
| ⬇️ **Download Report** | Export full analysis as a `.txt` file |
| 💰 **Live Profit Calculator** | Profit margin updates in real time as you type |

---

## 🖼️ Screenshots

### Step 1 — Choose Your Business Type
> Eight animated glass cards let you pick your industry in one click.

![Business Selection](assets/dashboard_mockup.png)

### Step 2 — Enter Business Data
> Fill in monthly sales, expenses, inventory value, and tag your best/slow-selling products.

![Data Entry Form](assets/dashboard_mockup.png)

### Step 3 — AI Growth Dashboard
> Full analytics dashboard with health gauge, charts, marketing ideas, forecasts, and growth plans.

![Dashboard](assets/dashboard_mockup.png)

---

## 🔄 App Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        GrowthPilot AI Flow                      │
│                                                                  │
│   1. BUSINESS TYPE SELECTION                                     │
│      └─ 8 animated cards (Grocery · Restaurant · ... · Other)   │
│                        │                                         │
│                        ▼                                         │
│   2. BUSINESS DATA ENTRY                                         │
│      ├─ Monthly Sales & Expenses (live profit calculator)        │
│      ├─ Inventory count & value                                  │
│      ├─ Best-selling products (tag input)                        │
│      └─ Slow-selling products (tag input)                        │
│                        │                                         │
│                        ▼                                         │
│   3. AI ANALYSIS ENGINE (client-side JS)                         │
│      ├─ Health Score (0–100)                                     │
│      ├─ Sales insights & profit margin                           │
│      ├─ Restock recommendations                                  │
│      ├─ Industry-specific marketing campaigns                    │
│      └─ 6-month sales forecast (3 scenarios)                     │
│                        │                                         │
│                        ▼                                         │
│   4. GROWTH DASHBOARD                                            │
│      ├─ Animated health gauge (Canvas)                           │
│      ├─ Bar chart — Revenue vs Expenses vs Profit (Canvas)       │
│      ├─ Line chart — 6-Month Forecast (Canvas)                   │
│      ├─ Weekly plan checklist (localStorage)                     │
│      ├─ Monthly roadmap accordion                                │
│      └─ Downloadable .txt report                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- A modern browser (Chrome, Edge, Firefox, Safari)
- Python 3 **or** Node.js (for the local dev server)

### Run locally

```bash
# 1. Clone the repository
git clone https://github.com/USERNAME/growthpilot-ai.git
cd growthpilot-ai

# 2a. Serve with Python (no install needed)
python -m http.server 3000

# 2b. Or serve with Node / npx
npx -y serve . --listen 3000

# 3. Open your browser
#    http://localhost:3000
```

---

## 📁 Project Structure

```
growthpilot-ai/
├── index.html              # App markup – 3-step wizard + dashboard panels
├── style.css               # Design system – dark theme, glassmorphism, animations
├── app.js                  # Core logic – analysis engine, Canvas charts, localStorage
├── assets/
│   └── dashboard_mockup.png   # UI screenshot used in README
├── .github/
│   └── workflows/
│       └── ci.yml          # GitHub Actions – HTML/CSS/JS lint on push
├── .gitignore
└── README.md
```

---

## ⚙️ GitHub Actions CI

Every push to `main` runs a lightweight CI pipeline:

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npx --yes htmlhint index.html
      - run: npx --yes stylelint style.css
      - run: npx --yes eslint --no-eslintrc -c '{"env":{"browser":true,"es2021":true}}' app.js
```

![CI Badge](https://github.com/USERNAME/growthpilot-ai/workflows/CI/badge.svg)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic, accessible) |
| Styling | Vanilla CSS — glassmorphism, CSS custom properties, `@keyframes` |
| Logic | Vanilla JavaScript ES2021 — no frameworks, no build step |
| Charts | HTML5 Canvas API |
| Persistence | `localStorage` (weekly plan checkboxes) |
| Fonts | Google Fonts — *Inter* |

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-idea`
3. Commit your changes: `git commit -m "feat: add my idea"`
4. Push to the branch: `git push origin feature/my-idea`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

---

<div align="center">
  Made with ❤️ for the <strong>Agents for Business</strong> track
</div>
]]>
