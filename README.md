# FinBoard — Finance Dashboard UI

A clean, production-quality finance dashboard built for the Frontend Developer Intern assignment. Designed and engineered to feel intentional, responsive, and easy to use.

---

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Build for production:**
```bash
npm run build
```

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 18 + JavaScript | Stable, widely used, good ecosystem |
| State | Context API + useReducer | Interview-appropriate, no extra dependencies |
| Charts | Recharts | React-native, composable, good defaults |
| Styling | Custom CSS with variables | Full control, dark mode without a build step |
| Persistence | localStorage | Practical, no backend needed |
| Typography | Syne + DM Sans (Google Fonts) | Distinctive display + clean body pairing |
| Date handling | date-fns | Lightweight, tree-shakeable |

---

## Features

### Dashboard Overview
- 4 summary cards: Total Balance, Income, Expenses, Savings Rate
- Area chart: Monthly income vs expenses trend (6 months)
- Donut chart: Spending breakdown by category
- Recent transactions list (last 5)

### Transactions
- Full transaction table with date, description, category, type, amount
- Live search by description or category
- Filter by category and type (income/expense)
- Sort by date or amount (ascending/descending)
- Reset filters button
- CSV export of filtered results
- Empty state when no results match

### Role-Based UI
Switch roles via the dropdown in the top bar.

| Feature | Viewer | Admin |
|---|---|---|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

Role is persisted to localStorage so it survives a page refresh.

### Insights
- Top spending category with percentage
- Month-over-month expense comparison with trend indicator
- Largest single expense
- Savings rate with health indicator
- Monthly income vs expenses bar chart
- Full category breakdown with animated progress bars

### State Management
All global state lives in AppContext with a useReducer. Only transactions, role, and theme are persisted to localStorage. Ephemeral UI state (filters, active section) resets on reload — intentional, avoids surprising users.

### Dark Mode
Toggle via the sun/moon button in the top bar. Uses CSS custom properties defined on [data-theme="dark"] — no JS-in-CSS overhead.

### CSV Export
Available in the Transactions view. Exports the currently filtered set. Uses a Blob URL download — no external library needed.

---

## Project Structure

```
src/
├── context/AppContext.js         Global state + reducer + localStorage sync
├── data/mockData.js              58 realistic mock transactions (6 months, INR)
├── utils/finance.js              All derived calculations (pure functions)
├── hooks/useApp.js               Clean context consumption hook
├── components/
│   ├── layout/Sidebar.js         Navigation + role indicator
│   ├── layout/Topbar.js          Title, role switcher, theme toggle, export
│   ├── dashboard/SummaryCards.js
│   ├── dashboard/BalanceTrendChart.js
│   ├── dashboard/SpendingBreakdown.js
│   ├── transactions/TransactionList.js
│   ├── transactions/TransactionModal.js
│   └── insights/InsightsPanel.js
├── index.css                     Design system (tokens, dark mode, responsive)
└── App.js                        Shell + section routing
```

---

## Design Decisions

**Typography:** Syne for headings (geometric, strong hierarchy), DM Sans for body (humanist, readable). Clear visual hierarchy without relying on weight alone.

**Color system:** Warm off-white base reduces eye strain. Semantic accents: green = income/positive, red = expense/negative, amber = warning, blue = neutral info.

**No UI library:** Hand-crafted CSS with custom properties. Lean bundle, full control, demonstrates CSS fluency.

**utils/finance.js:** All derived calculations are pure functions outside components. Components call these with state as input — easy to test, easy to read.

**Responsive:** Sidebar hides on mobile (slide-in drawer). Summary grid: 4 → 2 → 1 columns. Table hides Category column on small screens.

---

## Mock Data

58 transactions across November 2024 – April 2025. Categories: Salary, Freelance, Rent, Food, Travel, Shopping, Utilities, Entertainment, Health, Investment. Amounts in Indian Rupees (INR).

---

## Edge Cases Handled

- Savings rate when expenses exceed income
- Empty state when filters return zero results
- Charts with zero or minimal data
- Delete confirmation modal (accidental deletion prevention)
- Form validation on Add/Edit modal
- Role controls update immediately on switch
- localStorage errors caught silently (private browsing, quota exceeded)
