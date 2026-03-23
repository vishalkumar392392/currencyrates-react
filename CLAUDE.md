# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

**Stack:** React 19, Redux Toolkit, React Router v7, Axios, Vite, CSS Modules. Plain JavaScript (no TypeScript).

**Data flow:**

1. Components dispatch async thunks from `src/redux/<Feature>/`
2. Thunks call service functions in `src/services/`
3. Services currently return mock data from `src/mocks/` — real API calls are stubbed out with `axios` and `VITE_BASE_URL` env variable
4. Slice state (`loading`, `error`, data array) is read via `useSelector`

**Key directories:**

- `src/redux/` — RTK slices organized by feature (e.g., `CurrencyRates/currencyRateSlice.js`). Empty `Users/` and `common/` subdirectories are placeholders.
- `src/services/` — API layer; each service exports an object with async methods
- `src/mocks/` — Static mock data used until backend is ready
- `src/components/DataTable/` — Reusable table with search, per-column filters, sorting, row selection, and pagination. Exported via barrel `index.js`.

**Redux store** (`src/store.js`) uses `configureStore`; add new slices here.

**Routing** (`src/App.jsx`) uses `Suspense` + `Routes`. Currently one route (`/` → `CurrencyRates`).

**CSS Modules** are used for all component styles. No CSS-in-JS.

## DataTable Component

`src/components/DataTable/DataTable.jsx` is the main reusable component. Key props:

- `columns` (required) — array of `{ key, label, render?, sortable?, filterable? }`
- `data` (required) — array of row objects
- `rowKey` — field name for unique row identity
- `searchable`, `sortable`, `filterable`, `selectable`, `pagination` — boolean feature flags
- `pageSize`, `pageSizeOptions` — pagination config

## Backend Integration

`src/services/currencyRateService.js` has commented-out axios calls. To enable real API:

1. Set `VITE_BASE_URL` in a `.env` file
2. Uncomment the axios call in the service
3. Remove mock data import from the thunk in the slice

### Add Unit Tests

- Whenever you add any changes add unit tests and run and make sure the tests passes.

### Verify Changes with Playwright (MANDATORY)

_After implementing any new feature, you MUST:_

1. Start the React application (if not already running - npm run dev)
2. Use the Playwright MCP tool to connect to the application at http://127.0.0.1:5173
3. Navigate to and interact with the new feature to verify it works correctly
4. Take a screenshot of the working feature
5. Save the screenshot in the test-output/ folder with a descriptive filename (e.g., feature-name-verification-YYYY-MM-DD.png)

This step ensures that all features are visually verified and provides documentation of the working state of the application.
