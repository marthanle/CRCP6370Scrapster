# Scrapster

Turn what's already in your fridge/pantry into a meal before it goes to waste — snap a photo, scan a receipt, or type a list, and get one recipe built around your most urgent ingredients first. Tracks the money and time you save along the way.

See [docs/product-brief.md](docs/product-brief.md) for the full product spec and [docs/mvp-scope.md](docs/mvp-scope.md) for current v1 scope and implementation status.

## Structure

- `mobile/` — React Native (Expo) app. All 11 screens from the Claude Design prototype (login, diet/allergy onboarding, home, kitchen list, scan, confirm/dedupe, recipe result, budget mode, step-by-step recipe, cooked celebration, savings tracker), plus a community feed for sharing cooked dishes.
- `backend/` — Node/Express service that calls Claude for ingredient parsing (photo or list) + urgency ranking + recipe generation.

## Status

- **Mobile UI:** fully built and matches the design, but runs on **mock data** — the scan flow uses canned sample datasets (`mobile/src/data/scanSources.ts`) and the recipe screens show a fixed demo dish (`mobile/src/data/demoRecipe.ts`), the same way the design prototype itself worked.
- **Backend:** real Claude-based ingredient parsing + recipe generation is implemented (`backend/src/claude.ts`) but **not yet wired** into the mobile app. Connecting the two — so a real photo produces a real AI-generated recipe — is the next step.
- **Community feed:** share-a-dish + like interactions are fully built, but local-state only — no backend, so posts don't persist or sync across users yet.

See [docs/mvp-scope.md](docs/mvp-scope.md) for the full breakdown of what's real vs. mocked.

## Running locally

**Backend:**
```bash
cd backend
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm install
npm run dev
```

Smoke-test the Claude integration directly (no mobile app needed):
```bash
cd backend
npm run smoke-test
```

**Mobile app:**
```bash
cd mobile
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or `w` for a web preview (works without Xcode/Android Studio — useful for quick UI iteration).

Once the scan flow is wired to the backend, update `API_BASE_URL` in `mobile/src/api/client.ts` to your machine's LAN IP (not `localhost`) when running on a physical device or simulator.
