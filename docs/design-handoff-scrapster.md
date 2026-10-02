# Handoff: Scrapster — leftover-to-recipe mobile app (MVP flow)

## Overview
Scrapster takes what a user already has (fridge photo, grocery receipt, pantry photo, or typed list), keeps it as a **persistent kitchen list**, ranks items by spoilage urgency, and commits to **one** recipe that unifies the most-urgent items. After cooking, it consumes the used ingredients, logs leftovers back to the list, and credits money saved to a tracker.

Target user: students / young professionals, 18–30, cooking for one or two, tight budget, unpredictable schedule. **Kitchen assumption: first apartment — stove and oven available.** Voice: warm and encouraging. Emotional leads: money saved + nothing goes to waste.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes that show intended look and behavior. They are **not production code to copy**. The task is to **recreate these designs in the target codebase's existing environment** (React Native, Swift/SwiftUI, Flutter, React web, etc.) using its established components, navigation, and styling patterns. If no codebase exists yet, pick the framework that best fits the project and implement there. Platform intent: **iOS first** (the prototype is drawn inside an iPhone frame at 402×874 logical px).

`Scrapster Flow.dc.html` and `Theme Options.dc.html` use a small in-house HTML component runtime (`support.js`, `ios-frame.jsx`). Those two support files are included only so the prototypes open and run in a browser — do not port them.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, copy and state transitions are final-intent and should be matched closely. Where this README gives an exact value, prefer it over eyeballing the screenshot. Component structure is free — use the codebase's own primitives.

## Design Tokens

### Color
| Token | Hex | Use |
| --- | --- | --- |
| `bg` | `#F6F7F4` | App background |
| `surface` | `#FFFFFF` | Cards, rows |
| `ink` | `#14171A` | Primary text |
| `ink-muted` | `#5A6166` | Secondary text |
| `ink-faint` | `#8A9095` | Tertiary text, placeholders |
| `ink-disabled` | `#9AA0A2` | Inactive tab icons |
| `brand` | `#1F6F4E` | Primary actions, brand green |
| `brand-deep` | `#2E5C46` | Text on `brand-tint` |
| `brand-tint` | `#E3F0E8` | Chips, badges, track fills |
| `brand-on-dark` | `#BCE5D2` | Secondary text on `brand` |
| `accent-lime` | `#C9F24D` | Progress highlight on dark green |
| `danger` | `#A93A22` | "today" urgency text |
| `danger-tint` | `#FBE4DD` | "today" urgency badge bg |
| `danger-bar` | `#C8552F` | "tomorrow" urgency bar |
| `warn-bar` | `#C8A94E` | 2–7 day urgency bar |
| `warn-text` | `#7A5A11` | 2–7 day urgency text |
| `warn-surface` | `#FFF6EC` | Nudge card bg |
| `warn-border` | `#F0DCC0` | Nudge card border |
| `warn-ink` | `#6B5A42` | Nudge card body |
| `warn-strong` | `#7A4E11` | Nudge card emphasis |
| `warn-chip` | `#FAF0D8` | Amber chip bg |
| `hairline` | `rgba(20,23,26,.07)` | Row dividers |
| `border` | `rgba(20,23,26,.12)` | Input/secondary button border |
| `dash` | `rgba(20,23,26,.20)` | Dashed "add" affordances |
| `neutral-chip` | `#F1F2F0` | Delete (✕) button bg |

Card shadow: `0 1px 2px rgba(20,23,26,.07)`. Never heavier.

### Typography
Single family: **Space Grotesk** (weights 400/500/600/700). No secondary face.

| Role | Size / weight | Notes |
| --- | --- | --- |
| Screen title | 25–30px / 700 | `letter-spacing: -.026em`, `line-height: 1.15` |
| Hero number | 42–54px / 700 | `letter-spacing: -.03em`, `line-height: ~1` |
| Section heading | 17–23px / 700 | `letter-spacing: -.022em` |
| Card title | 15–16px / 600–700 | |
| Body | 13.5–14.5px / 400 | `line-height: 1.5` |
| Row label | 15px / 600 | |
| Row sub | 11.5px / 400 | urgency-colored |
| Metadata / chip | 12.5–13px / 500 | |
| Eyebrow | 11–12px / 500 | `letter-spacing: .12em`, uppercase |
| Tab label | 10.5px / 500 | |

### Spacing, radius, motion
- Screen gutter **20px** (24px on auth screens); vertical gap between blocks **12–18px**; gap inside row groups **8–10px**.
- Radii: pill `20–22px`, row/card `14–16px`, hero card `20px`, sheet `26px` top-only, phone screen `36px`.
- Buttons: full-width, `padding: 16px`, radius `14px`, weight 700, 15.5px.
- Delete button: 28px circle. **All tap targets ≥44px tall in production** (prototype rows are ~60px; the ✕ needs a padded 44px hit area).
- Screen enter: `opacity 0→1, translateY(10px→0)`, 250ms ease. Scan sweep: a 120px vertical gradient band looping 1.5s linear. No other motion.

## Data model

```
PantryItem { id, name, qty: string, days: number, src: string, note?: string }
```
`days` = estimated days until it goes bad. `src` = provenance string shown in the row ("Fridge photo · Sun", "Receipt · Sat", "Added by hand", "Leftover · tonight").

**Urgency bands** (derive, never store):
| days | bar color | text color | word |
| --- | --- | --- | --- |
| ≤ 0 | `#A93A22` | `#A93A22` | "today" |
| 1 | `#C8552F` | `#C8552F` | "tomorrow" |
| 2–7 | `#C8A94E` | `#7A5A11` | "N days" |
| 8–60 | `#1F6F4E` | `#1F6F4E` | "N days" |
| > 60 | `#1F6F4E` | `#1F6F4E` | "shelf-stable" |

Seed state (returning user, 6 items): Baby spinach `half bag` d0 · Scallions `2` d1 · Rice, cooked `1 cup` d2 · Feta `½ block` d9 · Eggs `2` d12 · Soy sauce `bottle` d400. Tracker: `$32.10` this month, 9 items rescued, `$212.80` all time.

**Scan sources** — each returns a list of parsed candidates:
- *Fridge photo*: Baby spinach (half bag, d0), Rice cooked (1 cup, d2), Half a cucumber (half, d4), Cilantro (small bunch, d1), Feta (½ block, d9).
- *Receipt*: Eggs (dozen, d21), Whole milk (1 qt, d8), Baby spinach (bag, d5), Chickpeas canned (2 cans, d400), Sourdough (loaf, d4).
- *Pantry photo*: Rice dry (2 lb bag, d400), Soy sauce (bottle, d400), Peanut butter (jar, d180), Olive oil (half bottle, d300).

## Screens / Views

### 1. Log in (`login`)
Not the default entry — reachable via "New here? Create an account" and used for returning sign-in. Brand tile (48px, radius 15, `brand` bg, white "S", 21px/700), title "Welcome back,\nMara" (30px/700), sub "You've kept $32.10 out of the bin this month. Let's keep it going." Email + password fields as white cards (radius 14, 14/15px padding; 11px/500 `ink-faint` label above 15.5px value). Primary "Log in" → home. "or" divider. Apple (black `#14171A`) + Google (white, bordered) side by side, radius 14. Footer link "New here? **Create an account**" → diet setup.

### 2. Dietary setup (`diet`)
Two-dot progress bar (4px, radius 2, first filled `brand`). Title "Anything you don't eat?" (25px/700), sub "We'll never suggest it. Change it any time in Settings." Multi-select pill row: Vegetarian, Vegan, Halal, Kosher, No pork, Gluten-free, Dairy-free — 14px/500, `padding: 10px 16px`, radius 22; selected = `brand` bg + white text, unselected = white + `border`. Default selected: **No pork**. Then "Allergies" heading, a text field placeholder "Peanuts, shellfish…", and an amber explainer: "Allergies are hard filters — anything listed here is never suggested, even from a photo match." Primary "Continue" + tertiary "Skip for now". **Allergies must be a hard filter; dietary preferences are soft re-ranking.**

### 3. Home (`home`) — default entry
Order top to bottom:
1. Meta row: "Tuesday, 6:12pm" (13px/500 muted) + 34px avatar circle (`brand-tint` bg, `brand` "M").
2. **Savings card** — `brand` bg, radius 20, padding 18/20. Eyebrow "Saved this month" (`brand-on-dark`), amount `$32.10` (42px/700, `-.028em`), right-aligned "9 items / rescued" (11.5px/500). Three-segment progress strip (flex 3/2/4, 5px tall, radius 3) at opacities 1 / .6 / .28 of `brand-on-dark`. Taps → tracker.
3. **Kitchen summary row** — white card; 36px `brand-tint` square showing item count; "Your kitchen" + "N need you in the next day" (or "nothing urgent right now"); chevron. Taps → kitchen list.
4. "Add what you got" (23px/700) + "Anything new goes on top of what I already know about."
5. **Three input rows**: *Photo of the fridge* (primary, `brand` bg, white text, 38px translucent icon tile — "Re-check what's actually left"), *Scan a grocery receipt* (white — "Fastest after a shop — prices included"), *Photo of the pantry shelf* (white — "Dry goods, cans, the back of the cupboard"), then a dashed "Or type it in" row.
6. **Urgency nudge** (only when something is ≤1 day): amber card, badge "now"/"1d", "Your baby spinach and scallions won't make the week." + non-wrapping "Cook it →". Taps → recipe result.

### 4. Kitchen list (`pantry`)
Title "Your kitchen" + "N items"; sub "Everything I think you own, oldest first. Tap ✕ on anything you've finished or thrown out."
Three grouped sections, each a white card containing rows, each preceded by an 11px/500 uppercase label with `.1em` tracking: **USE NOW** (`danger`, days ≤1), **THIS WEEK** (`warn-text`, 2–7), **KEEPS A WHILE** (`brand`, >7). Hide a section when empty.
Row: 4px×34px urgency bar (radius 2) · name (15px/600) over sub `"{word} · {qty} · {note · }{src}"` (11.5px, urgency-colored) · 28px ✕ delete (`neutral-chip` bg, `ink-faint` glyph). Delete removes immediately (no confirm; consider undo toast in production).
Footer: dashed "+ Add an ingredient by hand", then primary "Cook from this list" → recipe result.

### 5. Scanning (`scanning`) — transient, ~2.1s
Full-width 310px-tall placeholder with diagonal hatch, a looping green sweep band, one solid detection box + a label chip (source-specific, e.g. "spinach · 96%", "Campus Grocer · 6 lines"), one dashed box. Below: source-specific title ("Reading your shelf…" / "Reading your receipt…") and three checklist lines — two done (`brand` ✓), one pending (`ink-faint` ○): found count → "Checking against the N things I already knew about" → "Flagging anything that looks like a duplicate". No tab bar on this screen.

### 6. Additions review (`confirm`)
The duplicate-handling screen — **this is the heart of the persistent-list model.**
Back link "← Retake". Title is source-specific ("New since Sunday" / "From Campus Grocer" / "Cupboard contents"); sub "Tap the pill on any row to change what happens to it."
If any candidate matches an existing item by name (case-insensitive): amber banner "**N already on your list.** Merge to update the amount, or skip to leave it as it was."
Rows in one white card: urgency bar · name · sub (`"already on your list · {qty}"` for duplicates, `"{word} · {qty}"` otherwise) · **action pill** on the right.
- New item: pill cycles `Add → Skip`.
- Duplicate: pill cycles `Merge → Keep both → Skip`.
- Pill styling: Add/Merge `brand-tint`/`brand`; Keep both `warn-chip`/`warn-text`; Skip `neutral-chip`/`ink-faint` + row at 45% opacity with strikethrough name.
Then "+ I also have…" link, a green footer that **recomputes live from the pills** — "Your kitchen list goes from X to Y items." (Y = current count + rows set to Add or Keep both) — and primary "Update my kitchen".
Apply semantics: `skip` → no change; `merge` → overwrite existing item's qty (`"{new qty} (updated)"`), `days`, and `src`; `add`/`keep both` → push a new row (a "keep both" row carries `note: "kept separate"`, which renders in the row sub). Re-sort by `days` ascending, then navigate to the kitchen list so the user sees the result.

### 7. Recipe result (`result`) — one committed answer
210px full-bleed dish image with a 36px circular back button (white 90%). Content sheet overlaps the image by 26px with a top-only 26px radius.
Eyebrow "TONIGHT, DECIDED" (`brand`), title "Crispy rice & wilted spinach bowl" (27px/700), rationale "It catches the spinach, the scallions and the rice in one pan — **$3.50 of the $4.30** that was about to go."
Three stat tiles: `12` minutes · `4/5` used up · `$0.59` to finish (the third taps → budget mode). Primary "Start cooking". Then "Not feeling it?" / "2 others ⌄" and two compact alternate cards (Feta scramble 8 min · uses 2; Rice gratin 35 min · oven).
**Rule: the app commits to one dish.** Alternates exist but are visually secondary — this is the anti-decision-fatigue stance.

### 8. Budget mode (`budget`)
Title "Budget mode", sub "One lemon stands between you and dinner. Cheapest way to get it — or skip it." Three option cards, cheapest first and outlined in `brand` 2px: Dollar Market **$0.59** / "4 min walk · open till 11"; Campus Grocer $1.20 / "In your building · meal-card accepted"; Delivery $1.09 + fee / "25 min · not worth it for one lemon". Then a `brand-tint` card "Or buy nothing — A splash of any vinegar works. Slightly less bright, still dinner." Primary "Skip it, cook anyway".
Affiliate/commerce links belong here; **always keep the buy-nothing substitution as a first-class option.**

### 9. Recipe detail (`recipe`)
Back "←" + progress "N of 4 done". Title (22px/700). Card "Pulled from your kitchen list" with ingredient chips — owned items `brand-tint`, the missing one `warn-chip` with price ("lemon · $0.59", taps → budget mode).
Four step rows, tappable to toggle done. Unchecked: white, 23px `brand-tint` circle with the step number. The first unchecked row carries a 2px `brand` border (it's "current"). Checked: `#EFF4EE` bg, filled `brand` circle with ✓, text `#6B7370`. Step copy (use verbatim):
1. "Press the cold rice flat into a dry hot pan. Leave it alone 4 minutes — that's the crispy part."
2. "Push it aside, crack in the eggs, scramble them loosely in the same pan."
3. "Heat off. Pile the spinach on and stir — residual heat wilts it in about 40 seconds."
4. "Crumble the feta, squeeze the lemon, scatter the scallions. Eat straight from the pan."
Primary "Mark as cooked" → cook payoff.

### 10. Cook payoff (`cooked`)
**"Mark as cooked" mutates the kitchen list — this must be real, not decorative.** On tap: remove fully-consumed items (rice cooked, baby spinach, scallions), reduce partials (Feta → "½ block", Eggs → "1") and restamp their `src` to "Leftover · tonight", add Lemon "½" d6 if absent, re-sort.
Screen: full-bleed `brand` upper half — eyebrow "NOTHING BINNED TONIGHT", `+$3.50` (54px/700), body "The spinach made it with hours to spare. That's 4 ingredients rescued and one dinner you didn't have to think about.", and a translucent month card ("This month / $35.60") with a 71% `accent-lime` bar. Lower white sheet (26px top radius): "Kitchen list updated" / "Spinach, rice and scallions cleared. Three leftovers logged for tomorrow.", leftover chips (½ feta, 1 egg, ½ lemon), a **WED** chained-meal card ("Feta & lemon omelette — Uses all three · 9 min"), a dashed locked **THU** row ("Unlock the full week — Meal chaining is part of Scrapster+"), and "Back home". No tab bar on this screen.

### 11. Savings tracker (`tracker`)
Title "Your scraps, counted". `brand` hero card: "Saved since you started" / `$212.80` / six-month bar chart (Apr 28, May 44, Jun 31, Jul 52, Aug 39, Sep 64 — bars normalized to a 48px max + 6px floor; latest month `accent-lime`, others `rgba(188,229,210,.55)`; 9.5px labels). Two stat cards: `63` items rescued, `9h` not spent deciding. "What you keep rescuing" with three labeled tracks (Greens 82%, Dairy 54%, Grains 31%). Insight card: "You buy spinach faster than you eat it. Try the half-bag — you'd have kept about **$14** last month."


### 12. Community feed (`feed`) — 5th tab
Entry: tab bar item **Feed** (between Kitchen and Saved), and a **Share to community** button on the Cook payoff screen.
Title "What people rescued" (25px/700), sub "Dishes other Scrapster cooks built from what they already had." Vertical list of post cards, 10px gap. Card (white, radius 16, card shadow, 14/15px padding): header row = 36px circular avatar (initial; `brand-tint` bg + `brand` text for others, solid `brand` + white for "You"), author (14.5px/700) over time-ago (12px `ink-faint`), right-aligned savings pill (`brand-tint`, "+$4.80" 12.5px/700 `brand`). Dish title 16px/600. Like row: ♡ outline (`ink-faint`) ↔ ♥ filled `#D7263D` + count; tap toggles and adjusts count by ±1.
Seed: Priya — "Fried rice from three sad vegetables" +$4.80, 2h ago, 14 · Devon — "Last-bread-slice grilled cheese + soup" +$2.10, 5h ago, 7 · Mei — "Whatever-was-left pasta bake" +$6.35, 1d ago, 22, pre-liked.
**Share:** on Cook payoff, an outline button (2px `brand` border, `brand` text, white fill) above "Back home". Tapping prepends a post (author "You", avatar "M" solid green, the cooked dish, its savings, "just now", 0 likes) and the button is replaced by the text "✓ Shared to the community feed". Share state resets on the next "Mark as cooked".

### 13. Recipe import (`import` → `importResult`)
Entry: 4th row in Home's "Add what you got" list — icon ↗, "Paste a recipe link" / "See what you have and what's left to buy".
**Screen A:** "← Cancel"; title "Import a recipe"; sub "Paste a link to any recipe and I'll check it against your kitchen — what you already have, and what's left to buy."; URL input (placeholder `https://example.com/some-recipe`, `brand` border on focus); primary **Import**. While loading: label "Reading the recipe…", button at 55% opacity and non-interactive, and below it a 16px spinner + "Fetching the page and reading the ingredients…". Errors render as a 13px/500 `danger` line above the button: invalid URL → "That doesn't look like a link — it should start with https://"; network/server failure → "Can't reach the Scrapster server."
**Screen B:** "← Import another"; recipe title (24px/700); "Serves N" if known. **STILL NEED (N)** — amber label, card of rows with a 22px amber "+" badge, qty (muted) + name. **ALREADY IN YOUR KITCHEN (N)** — green label, rows with a 22px green ✓ badge, qty + name, and an 11.5px `ink-faint` note *already have it as "Baby spinach"* when the pantry item's name differs from the recipe's wording. Empty (no ingredients parsed): amber notice "I couldn't find an ingredient list on that page. Try a different link." Primary **Done** → Home. No tab bar on either import screen.

### 14. Feed sort + filter (on `feed`)
Row under the subtitle: a **Has recipe** toggle chip on the left (filters out photo-only posts) and a **Sort: {label} ⌄** pill on the right that opens a popover (white, radius 14, soft shadow) with four options, each with a one-line hint and a ✓ on the active one:
- **Best match** (default): count of the post's ingredient keys found in the user's kitchen list, desc; ties by newest. While active, cards show a `brand-tint` pill "uses N things you have" (hidden on your own posts and when N = 0).
- **Newest**: by post age.
- **Most saved**: by `saved` dollars, desc.
- **Most liked**: by likes, desc.
Feed cards show only the photo, author row + savings pill, dish title, and like/comment counts + "See recipe →" / "View →". Caption, rescued tags and recipe appear **only** on the post detail.

### 15. Post detail (`post`)
Tap any feed card. 300px full-bleed photo under the status bar with a floating back button (left) and a "+$X saved" pill (right); content sheet overlaps by 26px (top radius 26). Author row → dish title (25px/700) → optional meta line ("15 min · one pan · serves 2") → caption → "rescued …" chips. Action bar between hairlines: like toggle (♡/♥ `#D7263D`) + count, comment count, and a **Save recipe** pill on the right (`brand-tint` → solid `brand` "✓ Saved"; adds to Saved recipes; only for posts that include a recipe).
**Recipe (optional per post):** "How {author} made it", sub "You already have X of Y ingredients.", an ingredient card where each line is marked ✓ "you have it" (green) or + "need" (amber) against the kitchen list, then numbered step cards. Recipes vary in depth on purpose: detailed (9 ingredients / 6 steps) and loose ("whatever pasta you have", 2 steps). Posts without a recipe show a dashed note: "{author} didn't drop the recipe on this one. Ask in the comments."
**Comments:** "Comments (N)", each a 32px avatar + white bubble (author, time, text; top-left corner radius 4). Empty: "No comments yet. Hype them up." Composer: pill input "Add a comment…" + 44px round `brand` send button (40% opacity when empty); Enter also sends; appends as "You". No tab bar.

### 16. Compose a post (`compose`)
Entry: the "What did you rescue today?" composer card at the top of the feed. Fields: dashed photo slot ("Add a photo of the dish"), dish name (required; Post button 45% opacity + hint "Give your dish a name to post it." until filled), **What did you rescue?** multi-select chips built from the user's kitchen list, optional caption textarea. A `brand-tint` row previews "+$X.XX saved", computed from per-item price estimates of the selected chips. **Post to community** prepends the post (author "You") and returns to the feed. No tab bar.

### 17. Saved recipes (`cookbook`)
Entry: a second row in Home's kitchen card ("Saved recipes", amber bookmark tile, "N saved · M you can almost make"), and "See all saved recipes →" after saving an import. Sources: **Save recipe** on an import result (outline button → solid "Saved to your recipes") and **Save recipe** on a feed post. Filter chips: All · Ready-ish (≤2 missing) · From the feed; the filter resets to All on every visit. Rows: 64px thumbnail, source eyebrow (domain or "from Priya"), title, and a match bar + "need N" / "have everything" (green when ≤2 missing, amber otherwise); sorted by match ratio, desc. A filled bookmark on each row unsaves it. Tapping a row reopens the import-result view with the back link "← Saved recipes". Empty state: dashed card explaining both ways to save, plus **Paste a link** and **Browse feed** buttons. No tab bar.

## Backend: recipe import endpoint (required for real links)
The prototype mocks this. Browsers cannot fetch arbitrary recipe pages (CORS), so implement a small server endpoint:

```
POST /api/recipes/import
body:     { "url": "https://…" }
200:      { "title": string, "serves": number | null,
            "ingredients": [ { "raw": "3 cups fresh spinach", "qty": "3 cups", "name": "fresh spinach" } ] }
422:      { "error": "no_ingredients" }      → client shows the empty state
4xx/5xx:  { "error": "fetch_failed" }        → client shows "Can't reach the Scrapster server."
```
Server steps:
1. Validate the URL (http/https only; block private/localhost IPs to prevent SSRF). Timeout ~8s, cap response ~2 MB, send a normal browser User-Agent.
2. Parse `<script type="application/ld+json">` blocks and find the object with `@type` "Recipe" (may be nested in `@graph` or an array; `@type` may be an array). Read `name`, `recipeYield`, `recipeIngredient[]`. Most major recipe sites publish this.
3. Fallback when no JSON-LD: microdata (`itemprop="recipeIngredient"`), then an LLM extraction pass over the page's visible text.
4. Split each raw line into `qty` + `name` (an ingredient-parser library or a short LLM call). Return `serves` as an integer parsed from `recipeYield`.
5. Cache by normalized URL.

Client-side matching against the kitchen list: normalize both sides (lowercase, strip quantities/adjectives like "fresh", "chopped", "crumbled", singularize), then match on the core noun with a synonym table (scallion ↔ green onion, cilantro ↔ coriander, chickpea ↔ garbanzo). When a match's pantry name differs from the recipe wording, show the "already have it as …" note. Pantry-staple assumptions (salt, pepper, water) should be treated as owned.

### Tab bar (persistent)
Five items, 24px stroked line icon (1.8px stroke, round caps/joins, `currentColor`) over a 10.5px/500 label, active `brand` / inactive `ink-disabled`: **Home** (house) · **Add** (camera; fires a fridge scan) · **Kitchen** (fridge) · **Feed** (two people) · **Saved** (piggy bank). Use the codebase icon set's equivalents. Container: `rgba(246,247,244,.94)`, 1px top hairline, `padding: 10px 10px 30px` (the 30px is the iOS home-indicator inset). Hidden on `login`, `diet`, `scanning`, `cooked`, `settings`, `import`, `importResult`, `post`, `compose`, `cookbook`. Active mapping: scanning/confirm → Add; pantry/result/budget/recipe/cooked → Kitchen; feed → Feed; tracker → Saved. The avatar on Home opens **Settings** (profile, diet & allergies, kitchen list, kitchen setup, Scrapster+, notifications, account, and a **Log out** button that returns to the login screen).

## Interactions & Behavior
- **Navigation is a single screen enum** in the prototype (`login, diet, home, pantry, scanning, confirm, result, budget, recipe, cooked, tracker`). In production use the platform's navigator; `scanning` is a modal/transient state, not a back-stack entry.
- Scan: tapping any input source (or the Add tab) → `scanning` for ~2.1s → `confirm`. Clear the timer on unmount.
- Duplicate detection runs at scan time by case-insensitive name match, and the default action per row is set then (`merge` for duplicates, `add` for new). The footer projection recomputes on every pill tap.
- Deletes and merges mutate the persistent list immediately; the list is always re-sorted by `days` ascending.
- Recipe steps are independently toggleable; the "current step" ring follows the first unchecked step.
- No hover states (touch target); use platform press opacity/highlight. Respect reduce-motion by dropping the sweep and enter animations.

## State Management
Prototype state: `screen`, `feed[]` (posts with optional `caption`, `tags`, `meta`, `ingredients[{text,key}]`, `steps[]`, `comments[]`), `savedRecipes[]` ({id, title, source, serves, ingredients}), `feedSort`, `feedHasRecipe`, `postId`, `draft`, `pantry[]`, `nextId`, `source` (which scan produced the pending list), `actions{index → 'add'|'merge'|'keep'|'skip'}`, `done{stepIndex → bool}`, `diet{label → bool}`.
Production concerns not modeled in the prototype: persistence (the kitchen list must survive relaunch — local store + sync), auth session, the vision/parse calls for photo and receipt input, spoilage estimation per food type, price lookups for Budget mode, savings ledger accumulation, and the paid-tier gate on multi-day chaining.

## Assets
None shipped. Every image is a diagonal-hatch placeholder (`repeating-linear-gradient(135deg, #E4E9E3 0 11px, #DDE3DC 11px 22px)`, darker `#D5DBD4`/`#CFD6CE` for camera/photo areas) labeled with what belongs there: *camera viewfinder*, *finished dish photo*, *dish photo*. Icons are text glyphs (◱ ◉ ☰ ▤ ▥ ✕ ✓ ⠿ $) standing in for the codebase's real icon set — replace them, don't reproduce them. Font: Space Grotesk via Google Fonts.

## Files
- `Scrapster Flow.dc.html` — the clickable MVP prototype, all 11 screens (open in a browser; starts on Home as a returning user).
- `Theme Options.dc.html` — the exploration doc: four theme/typography directions and the option sets for login, home, ingredient confirmation, recipe results, and cook confirmation. Chosen: theme **1c Fresh Grocer**, login **2a**, home **3a**, confirmation **4c**, results **5b**, detail **6a**. Useful for understanding why the shipped direction won.
- `ios-frame.jsx`, `support.js` — prototype runtime only. Do not port.


## Suggested build order
1. Design tokens + tab bar + navigation shell
2. Kitchen list data model (persistent) → Home → Kitchen list
3. Scan → Additions review (duplicate merge) — mock the vision call first
4. Recipe result → Budget mode → Recipe detail → Mark as cooked (mutates the list) → Tracker
5. Login / diet onboarding / Settings + log out
6. Recipe import (UI against a mocked endpoint, then the real server) → Saved recipes
7. Community feed → post detail → compose → sort (needs a backend for posts, likes, comments)
