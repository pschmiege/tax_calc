# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install      # install dependencies (first time only)
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build (outputs to dist/)
npm run preview  # preview the production build locally
```

There is no test suite configured.

## Architecture

This is a single-page React app (Vite + React 18) with essentially all logic in one file.

### File structure

- **`tax_calculator_v6.jsx`** — the entire app: tax data, calculation engine, all UI components, and the root `App` component. This is the active file; `src/main.jsx` just imports and mounts it.
- **`tax_calculator_v5.jsx`** — previous version, kept for reference.
- **`src/main.jsx`** — entry point; only imports `App` from `tax_calculator_v6.jsx`.
- **`vite.config.js`** — sets `base: '/tax_calc/'` for GitHub Pages deployment.

### Key sections of `tax_calculator_v6.jsx`

1. **`TAX_DATA`** (top of file) — hard-coded tax tables for 2024, 2025, and 2026: federal brackets, FICA/Medicare rates, FICA wage base, standard deductions, IRS contribution limits, state bracket tables, and UTSW TRS/ORP contribution rates.

2. **`ann()`** — converts any dollar amount + frequency string into an annual figure. Frequencies: Annually, Monthly, Semimonthly, Biweekly, Weekly, or "Per Paycheck".

3. **`bracketTax(income, brackets)`** — applies a progressive bracket table and returns `[tax, marginalRate]`. Bracket format: `[floorAmount, rate, offsetTax]`.

4. **`calcAll(s)`** — the core calculation function. Takes a flat settings object `s` (all inputs already converted to annual values) and returns every derived number used in the UI: AGI, taxable income, primary/secondary/combined tax breakdowns, paycheck equivalents, tax filing balance (owed vs refund), etc.

5. **`calcRetScenario()`** — computes future value for the Retirement Predictor tab's four contribution strategies (100% Traditional, 100% Roth, current split, custom split).

6. **Small UI primitives** — `FInput` (frequency-aware dollar input), `SField` (select), `Met` (metric card), `RRow` (breakdown row), `SHead`/`SLabel` (section headers), `TabBtn` (tab button).

7. **`App`** — the root component. All state lives here (no external state library). Every input has a paired value+frequency state created via the `mk()` helper. All settings are persisted to `localStorage` on every change via a `useEffect`. The `useMemo` block converts all raw inputs to annual values and calls `calcAll()`.

### Styling

All styles are inline objects using a fixed dark-theme color palette defined near the top:
```js
const BG="#0f1117", CARD="#161b27", BORDER="#1e2a3a", ACCENT="#818cf8", ...
```
There are no CSS files or CSS modules.

### State persistence

All user inputs are serialized to `localStorage` under the key `'taxCalcSettings'` and rehydrated on load. When adding new state variables, add them to both the `useEffect` serialization object and the `sv.*` hydration at the top of `App`.

### Deployment

The app deploys to GitHub Pages at `https://pschmiege.github.io/tax_calc/`. The `base: '/tax_calc/'` in `vite.config.js` is required for asset paths to work correctly there.
