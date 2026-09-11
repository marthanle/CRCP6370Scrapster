# Scrapster

Turn what's already in your fridge/pantry into a meal before it goes to waste — snap a photo or type a list, and get one recipe built around your most urgent ingredients first.

See [docs/product-brief.md](docs/product-brief.md) for the full product spec and [docs/mvp-scope.md](docs/mvp-scope.md) for what's in v1 vs. deferred.

## Structure

- `mobile/` — React Native (Expo) app: photo/list input, urgency-ranked recipe result
- `backend/` — Node/Express service that calls Claude for ingredient parsing + recipe generation

## Running locally

**Backend:**
```bash
cd backend
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm install
npm run dev
```

**Mobile app:**
```bash
cd mobile
npm install
npm start
```

Update `API_BASE_URL` in `mobile/src/api/client.ts` to your machine's LAN IP (not `localhost`) when running on a physical device or simulator.
