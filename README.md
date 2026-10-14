# ChurnIQ — Customer Intelligence Studio

> **ML Lab Mini Project** · VIT-AP University · B.Tech Computer Science & Business Systems  
> **Students:** Piyush Patel (24BCB7172) · Jayita (24BCB7032)

A premium interactive web prototype for **Predicting Customer Churn with TabPFN**.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open in your browser
http://localhost:5173
```

---

## Tech Stack

| Layer | Library |
|---|---|
| UI Framework | React 19 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Inter (Google Fonts) |

---

## Project Structure

```
src/
├── types/
│   └── customer.ts           # TypeScript interfaces
├── data/
│   └── demoCustomers.ts      # Three predefined demo profiles
├── lib/
│   └── simulatePrediction.ts # Demo prediction engine (NOT the TabPFN model)
├── components/
│   ├── Sidebar.tsx
│   └── TopNav.tsx
├── pages/
│   ├── OverviewPage.tsx
│   ├── PredictPage.tsx
│   ├── InsightsPage.tsx
│   ├── PerformancePage.tsx
│   └── AboutPage.tsx
├── App.tsx
├── main.tsx
└── index.css
```

---

## Demo Guide

### Loading Example Profiles

1. **High Risk** — Click "High Risk" on Overview page, or the "High Risk" button in Predict form
2. **Medium Risk** — Click "Medium Risk" on Overview or Predict form
3. **Low Risk** — Click "Low Risk" on Overview or Predict form

### Custom Prediction

1. Navigate to Predict Customer
2. Fill in customer details
3. Click "Analyze Customer"

---

## IMPORTANT — Demo Mode

This website does NOT load or execute the trained TabPFN model.

- Predictions use a client-side demo scoring function (src/lib/simulatePrediction.ts)
- Model Performance metrics are actual offline results from the Jupyter notebook
- No backend, API, or model file required

---

## Recorded Model Metrics (from Jupyter notebook)

| Metric | Value |
|---|---|
| Accuracy | 80.70% |
| Precision | 67.59% |
| Recall | 52.41% |
| F1 Score | 59.04% |
| ROC-AUC | 85.00% |

Test set: 1,409 samples. Confusion matrix: TN=941, FP=94, FN=178, TP=196
