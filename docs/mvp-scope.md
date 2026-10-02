# Scrapster — v1 Scope

> **Update:** the Claude Design prototype (see `mobile/` for the ported screens) covers the full
> product vision end to end — login, diet/allergy onboarding, home, kitchen list, scan/confirm,
> recipe result, budget mode, step-by-step recipe, cooked celebration, and the savings tracker.
> We decided to match that design as real v1 scope rather than the narrower cut below, which is
> kept for its rationale but is no longer the operative plan.

## Kitchen assumption

First-apartment kitchen: stove + oven available (not dorm-only microwave/mini-fridge). Recipes should assume standard stovetop/oven equipment.

## v1 feature set (matches the Claude Design prototype)

1. Login / create account, diet & allergy onboarding (hard-filtered allergies)
2. Home: savings summary, kitchen status, "add what you got" actions, urgent-item banner
3. Flexible input — photo of fridge/pantry, grocery receipt scan, or a typed list
4. Kitchen/pantry list grouped by urgency (Use now / This week / Keeps a while), with merge/dedupe on new scans
5. AI-driven recipe result: combines the most/most-urgent ingredients, shows time/ingredients-used/missing-ingredient cost
6. Budget mode — cheapest place to get a missing ingredient, or a substitution
7. Step-by-step recipe view with progress tracking
8. Cooked celebration — savings delta, updated kitchen list, next-day leftover-chained meal suggestion
9. Savings/waste-reduced tracker — lifetime total, monthly chart, category breakdown, personalized insight
10. **Community feed (added post-design-port)** — a "Share to community" action on the Cooked screen posts your dish + savings to a feed others can browse and like. Lightweight by design: no profiles, follows, or comments — scoped down from a full social feed to fit the existing flow with minimal new surface area.
11. **Recipe import (added post-design-port)** — paste a link to any recipe from "Add what you got" on Home; the backend fetches the page and extracts the ingredient list, then the app shows what you already have in your kitchen vs. what's still left to buy.

## Implementation status

- **Mobile UI (all 11 screens):** built in `mobile/src/screens/`, ported from the Claude Design
  prototype's exact interaction model (see `mobile/src/hooks/useScrapsterState.ts`). Currently runs
  on **mock data** — the scan flow uses the prototype's canned fridge/receipt/pantry datasets
  (`mobile/src/data/scanSources.ts`) and the recipe screens show a fixed demo dish
  (`mobile/src/data/demoRecipe.ts`), matching how the design prototype itself worked.
- **Backend AI integration:** `backend/src/claude.ts` already implements real photo/list →
  ingredient parsing + urgency ranking + recipe generation via Claude (`claude-opus-5`,
  `messages.parse()` with a zod schema). It is **not yet wired** into the mobile app's scan/result
  flow — that's the next integration step (replace `SCAN_SOURCES`/`DEMO_RECIPE` with real
  `analyzeIngredients()` calls once a photo is taken).
- **Login/auth, budget-mode pricing, and the savings tracker's historical data** are still
  UI-only/mocked — no real auth, grocery-price lookup, or persistent savings ledger exists yet.
- **Community feed:** UI and interaction (share, like) are fully built and local-state only
  (`mobile/src/data/communityFeed.ts`). There's no backend yet — posts don't persist past an app
  reload and aren't visible to other real users. Needs a shared backend store before it's a real
  multi-user feature.
- **Recipe import is the first real (non-mocked) AI feature wired end-to-end in the mobile app.**
  `backend/src/recipeImport.ts` uses Claude's `web_fetch` tool (`claude-opus-5`) to actually fetch
  the pasted URL and extract a structured ingredient list — not canned data. The mobile app calls
  it via `mobile/src/api/client.ts` → `POST /api/import-recipe`, then matches the result against
  the local pantry client-side (simple case-insensitive substring match in
  `useScrapsterState.ts`). Requires `ANTHROPIC_API_KEY` set in `backend/.env` and the backend
  running (`cd backend && npm run dev`) to actually work — otherwise the mobile app shows a
  friendly "can't reach the server" error. The pantry-matching heuristic is intentionally naive
  (no synonym/unit handling) and will misfire on ingredient names that are phrased very
  differently than what's in the kitchen list.

## Tech stack

- **Mobile app:** React Native + Expo, TypeScript, Space Grotesk (Google Fonts) to match the
  design's typography.
- **Backend:** Small Node/Express service. Holds the AI API key server-side (never embed API keys
  in the mobile client), handles:
  - Image parsing → ingredient list (vision model)
  - Ingredient list → urgency ranking + recipe generation (LLM)
- **AI provider:** Claude (Anthropic API) for both vision parsing and recipe reasoning — see the
  `claude-api` skill for current model IDs/pricing when implementing.

## Original narrower MVP cut (superseded, kept for rationale)

The original plan was to ship only flexible input + urgency ranking + one combined recipe first,
deferring budget mode, dietary personalization, leftover chaining, and the savings tracker to v2 —
on the reasoning that v1 should prove the core differentiator (urgency + combination reasoning)
before investing in retention/monetization features that depend on it working well. Once the full
design prototype existed, we chose to match it as v1 instead of re-splitting the scope.

## Open questions to revisit

- Recipe source: fully AI-generated freeform recipes vs. AI selecting/adapting from a curated recipe database (affects quality/safety consistency)
- How urgency is estimated without a real "days since purchase" input (visual cues from photo vs. user-entered dates) — the backend already handles this; wiring it to the mobile scan flow is the next step
- Real auth, grocery-price data source for Budget mode, and persistent savings ledger are all unscoped
