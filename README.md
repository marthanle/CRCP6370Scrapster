# Scrapster

Turn what's already in your fridge/pantry into a meal before it goes to waste — snap a photo, scan a receipt, or type a list, and get one recipe built around your most urgent ingredients first. Tracks the money and time you save along the way.

See [docs/product-brief.md](docs/product-brief.md) for the full product spec, [docs/design-handoff-scrapster.md](docs/design-handoff-scrapster.md) for the exact design tokens/copy/data model the UI is built to, and [docs/mvp-scope.md](docs/mvp-scope.md) for current v1 scope and implementation status.

## Structure

- `mobile/` — React Native (Expo) app covering the full design handoff: login, diet/allergy onboarding, home, settings, kitchen list, scan, confirm/dedupe, recipe result, budget mode, step-by-step recipe, cooked celebration, savings tracker, a recipe-link importer, saved recipes ("cookbook"), and a community feed (sort/filter, post detail with comments, compose with photo/ingredients/steps, edit your own posts).
- `backend/` — Node/Express service that calls Claude for ingredient parsing (photo or list) + urgency ranking + recipe generation, and for fetching/parsing recipes from a pasted URL.

## What's in the app

- **Dinner from your kitchen:** scan a fridge, pantry shelf or receipt, review and merge the items (duplicates are combined), and get one committed dinner built around what's about to spoil. Budget mode compares stores for what's missing; the step-by-step recipe ends with a "Mark as cooked" celebration.
- **Diet and allergies:** set them at onboarding or any time from Settings (the Diet screen opens as a settings page when you come from there). Allergies are a hard filter, diet preferences are soft, and Settings shows a summary of both.
- **Recipe import and saved recipes:** paste a link, see which ingredients you already have and which you'd need to buy, and save it to your cookbook. You can also save recipes straight from community posts.
- **Community feed:** sort (Best match / Newest / Most saved / Most liked), a "Has recipe" filter, a "uses N things you have" match badge, post detail with likes, comments and save, and seeded posts with real photos. "Sunset toast" is seeded as your own post.
- **Compose and edit posts:** pick a photo from your library, name the dish, tag what you rescued from your kitchen, and optionally add ingredients, steps and a caption. A switch, on by default, takes the tagged items out of your kitchen when you post, since you made the dish. You can edit your own posts later (editing never touches the kitchen). On your own posts every ingredient shows as "you have it".
- **Savings tracker:** the lifetime saved total and items-rescued count on the Tracker are derived from the same month numbers as Home and the Cooked screen, so they agree after you cook.
- **Web preview** runs in a phone-shaped frame; real devices fill the screen.

## Status

- **Scan → kitchen list → dinner is wired to the backend.** A photo of the fridge, pantry shelf, or a receipt goes to `POST /api/scan` (Claude vision → items with quantity and days-left), you review/merge them, and "Cook from this list" calls `POST /api/recipe` to commit to one dish. The result, recipe, budget, and cooked screens all render that real response, and cooking consumes the kitchen list per the recipe. Diet preferences and the allergies field are sent with every request; allergies are a hard filter enforced server-side.
- **Recipe import** is real too: paste a link and the backend fetches the page with Claude's web-fetch tool and extracts the ingredients.
- **All of the above need `ANTHROPIC_API_KEY` in `backend/.env` and the backend running.** The mobile side has been verified end to end against a stub that returns the real response shapes; the live Claude calls themselves haven't been exercised yet (no key was available), so expect to tune prompts once you run them.
- **Still mocked / local-only:** budget-mode store prices (derived from the model's price estimate, not live prices), the savings tracker history, and the community feed, post detail, compose, and saved recipes (no multi-user backend, and nothing persists across a reload). Settings/Log out are UI-only — there's no real auth yet.

See [docs/mvp-scope.md](docs/mvp-scope.md) for the full breakdown of what's real vs. mocked.

## Running locally

**Backend:**
```bash
cd backend
cp .env.example .env   # add your ANTHROPIC_API_KEY
npm install
npm run dev
```

**No API key? Use demo mode** — the backend returns canned scan, recipe, and import responses in the real shapes, so the whole app works without a key or any cost:
```bash
cd backend
npm install
npm run dev:demo
```
Demo output is deterministic and ignores the photo: the scan returns a fixed set of items per source (fridge / receipt / pantry), and the recipe is assembled from whatever is actually in your kitchen list (allergies are respected). Recipe import matches a few keywords in the URL (fried rice, pasta, frittata). `GET /api/health` reports `demoMode`.

Smoke-test the Claude integration directly (no mobile app needed). It plans a recipe from a sample kitchen list and imports a sample recipe; pass a photo path to also exercise the scan:
```bash
cd backend
npm run smoke-test -- ./fridge.jpg   # photo is optional
```

**Mobile app:**
```bash
cd mobile
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or `w` for a web preview (works without Xcode/Android Studio — useful for quick UI iteration). The web preview renders the app inside a fixed 402×874 phone-shaped frame centered on the page, matching the design prototype's own device frame — this only affects the browser preview, not the real app, which already fills the actual device's screen on iOS/Android.

The app talks to `http://localhost:3000` by default. On a physical device or simulator, point it at your machine's LAN IP instead (localhost won't resolve from there):
```bash
EXPO_PUBLIC_API_URL=http://192.168.1.x:3000 npm start
```
On a phone, "Photo of the fridge" opens the camera; in the web preview it opens a file picker.
