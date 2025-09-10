# SmartScript Frontend

React app (Create React App + Tailwind) for SmartScript.

## Quick start
- Node 18+
- Copy a .env.development.local with `REACT_APP_API_BASE_URL=http://localhost:8080`
- Install deps: `npm install`
- Run dev: `npm start` (runs Tailwind watch + CRA)

## Auth
- The app expects JWT in localStorage under `token` and optionally `refreshToken`.

## LLM model preference
- Account page includes a "Preferred LLM (Groq)" select. The choice is saved to localStorage (`preferredLLMModel`) and, if available, will POST to `/api/v1/account/preferences`.
- Backend uses `LLM_MODEL` by default; you can wire reading user preference to override config when building the Groq adapter.

## Payments (Paystack)
- `PaystackPayment` mounts Paystack Popup after initializing a transaction on `/account/initialize-payment` and verifies on `/account/verify-payment`.

## Pages
- Account, Dashboard, Groups, Uploads, Marking, Results, Anomalies, etc., with search/filter/pagination enhancements.
