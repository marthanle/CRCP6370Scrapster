# Scrapster — MVP Scope

## Kitchen assumption

First-apartment kitchen: stove + oven available (not dorm-only microwave/mini-fridge). Recipes should assume standard stovetop/oven equipment.

## MVP feature set (v1)

1. Flexible input — photo of fridge/pantry, or a typed list of ingredients
2. AI parses input into a structured ingredient list (handles messy photos / casual text)
3. Urgency ranking — AI estimates what's most likely to spoil soon and weights it higher
4. Recipe generation — one recipe that combines the most/most-urgent ingredients into a coherent dish, sized for 1–2 servings

## Explicitly deferred to v2+

- Missing-ingredient shortlist + Budget mode (cheapest place to buy) — needs grocery price data/API
- Dietary/allergy personalization — needs persistent user profile + learning loop
- Leftover chaining (multi-day meal plans) — needs post-cook state tracking
- Savings/waste-reduced tracker — needs historical logging across sessions
- Skill-adaptive step-by-step cooking guidance — flagged as future/complex in the product brief

Rationale: v1 proves the core differentiator (urgency + combination reasoning, not just single-ingredient filtering like SuperCook/Yummly) before investing in the retention/monetization features that depend on it working well.

## Tech stack

- **Mobile app:** React Native + Expo, TypeScript. Cross-platform (iOS/Android) from one codebase, native camera/photo-library access via `expo-image-picker`.
- **Backend:** Small Node/Express service. Holds the AI API key server-side (never embed API keys in the mobile client), handles:
  - Image parsing → ingredient list (vision model)
  - Ingredient list → urgency ranking + recipe generation (LLM)
- **AI provider:** Claude (Anthropic API) for both vision parsing and recipe reasoning — see [claude-api skill] for current model IDs/pricing when implementing.

## Open questions to revisit post-MVP

- Recipe source: fully AI-generated freeform recipes vs. AI selecting/adapting from a curated recipe database (affects quality/safety consistency)
- How urgency is estimated without a real "days since purchase" input (visual cues from photo vs. user-entered dates)
