# Scrapster — v1 Scope

> **Update:** the Claude Design prototype (see `mobile/` for the ported screens) covers the full
> product vision end to end — login, diet/allergy onboarding, home, kitchen list, scan/confirm,
> recipe result, budget mode, step-by-step recipe, cooked celebration, and the savings tracker.
> We decided to match that design as real v1 scope rather than the narrower cut below, which is
> kept for its rationale but is no longer the operative plan.
>
> **Second update:** a formal design-handoff bundle (`.dc.html` prototype + a detailed README with
> exact design tokens, copy, and a data model — preserved in full at
> [docs/design-handoff-scrapster.md](design-handoff-scrapster.md)) expanded scope further —
> Settings, a much richer community feed (sort/filter, post detail with recipes + comments,
> compose), and a Saved Recipes ("cookbook") screen. All of it is built; see the feature list and
> implementation status below for what's real vs. mocked.

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
12. **Settings** — profile, diet & allergies (links back to onboarding), kitchen list, kitchen setup, Scrapster+ upsell, notifications toggle, email/password, and Log out. Reached by tapping the avatar on Home.
13. **Community feed v2** — "Has recipe" filter and a 4-way sort popover (Best match / Newest / Most saved / Most liked), a "uses N things you have" match badge, and a compose-entry card at the top of the feed.
14. **Post detail** — full post view: photo, caption, tags, like/comment/save actions, either a full recipe (ingredient match list + numbered steps) or a "didn't drop the recipe" note, and a comment thread with a composer.
15. **Compose a post** — dish name, a photo picked from your library, multi-select "what did you rescue" chips sourced from the kitchen list, optional ingredients and steps (one per line; a post with either counts as having a recipe), optional caption, a live "+$X.XX saved" preview computed from the picked items, posts to the feed. You can Edit your own posts (the compose screen reopens prefilled). On your own post every ingredient shows "you have it" since you made it with them.
16. **Saved recipes ("cookbook")** — recipes saved from an import result or a feed post, filterable (All / Ready-ish / From the feed), sorted by how much of each you can already make; reopens into the same result view used for a fresh import.

## Implementation status

- **Core loop is wired to the backend.** Scan (`POST /api/scan`: photo of fridge/pantry/receipt →
  items with name, quantity, days-left, and the cue behind the estimate) feeds the review/merge
  screen; "Cook from this list" calls `POST /api/recipe` (kitchen list + diet + allergies → one
  committed dish with per-item usage and leftover quantities, missing items with price estimate
  and substitute, steps, rescued value, alternates, and a next-meal idea). Result, Budget, Recipe,
  and Cooked all render that response; Mark as cooked consumes/reduces kitchen items from the
  recipe's `uses` and adds the rescued value to this month's total. Allergies are a hard filter:
  the server checks the whole plan and retries once before returning a 422, which the app shows
  as a plain-language message. Backend code: `backend/src/claude.ts`, routes in
  `backend/src/index.ts`; client in `mobile/src/api/client.ts`.
- **Demo mode (`npm run dev:demo`, `DEMO_MODE=1`)** serves canned responses in the real shapes
  (`backend/src/demo.ts`) so the app runs with no API key. The scan returns a fixed item set per
  source; the recipe is assembled from the actual kitchen list (most urgent items, allergens
  filtered, 422 if nothing is left); import matches a few URL keywords. It is for demos and UI
  work, not a stand-in for evaluating the real model.
- **What's verified and what isn't.** The mobile flow (real image picker → request → confirm →
  result → recipe → cooked, plus the unreachable-server error and retry) was exercised end to end
  against a stub server returning the real response shapes. The live Claude calls (scan accuracy,
  recipe quality, the allergy retry) have **not** been run — no API key was available. First
  thing to do with a key: `cd backend && npm run smoke-test -- ./some-fridge-photo.jpg`, then tune
  the prompts in `claude.ts`.
- **Login/auth, store prices, and the savings tracker's history** are still UI-only/mocked. Budget
  mode's three stores are derived from the model's price estimate for the missing items (and say
  so on screen) — there is no grocery-price source. The tracker's lifetime/monthly chart data is
  placeholder (`mobile/src/data/trackerData.ts`); when you cook, this month's total, the lifetime
  total and the items-rescued counts all move together (Home, Cooked and Tracker agree).
  The kitchen list, month total, and everything else reset on app reload — nothing is persisted
  yet.
- **Community feed, post detail, compose, and saved recipes:** all fully built and interactive —
  sort/filter, comments, likes, saving a recipe from a post or an import, the compose flow's live
  savings preview — but entirely **local-state only** (`mobile/src/data/communityFeed.ts` seeds 4
  posts: Priya/Devon/Mei with full captions/ingredients/steps/comments matching the design
  handoff, each with a real photo, plus your own "Sunset toast"). There's no backend — posts, comments, likes, and saved recipes don't persist
  past an app reload and aren't visible to other real users. Needs a shared backend store (posts,
  comments, likes, saved-recipe join table) before this is a real multi-user feature — the
  suggested build order's step 7 flags this explicitly.
- **Settings and Log out** are UI-only — Log out just navigates back to the login screen; there's
  no real session/auth to tear down since there's no real auth yet either.
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
  design's typography, `react-native-svg` for the real stroked-line tab bar/UI icons (ported
  directly from the design handoff's SVG paths rather than the placeholder glyphs the prototype
  used).
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
