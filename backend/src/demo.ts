import { ImportedRecipe, RecipePlan, ScanResult, ScanSource } from "./schema.js";

// Canned stand-ins for the Claude-backed endpoints, enabled with DEMO_MODE=1.
// They return the same shapes so the whole app works with no API key, but the
// output is deterministic and does not look at the photo.

const SCANS: Record<ScanSource, ScanResult> = {
  fridge: {
    items: [
      { name: "Baby spinach", qty: "half bag", days: 0, note: "wilting leaves" },
      { name: "Cilantro", qty: "small bunch", days: 1, note: "leafy herb" },
      { name: "Rice, cooked", qty: "1 cup", days: 2, note: "leftover" },
      { name: "Half a cucumber", qty: "half", days: 4, note: "cut end" },
      { name: "Feta", qty: "½ block", days: 9, note: "opened" },
    ],
  },
  receipt: {
    items: [
      { name: "Baby spinach", qty: "bag", days: 5, note: "bought today" },
      { name: "Sourdough", qty: "loaf", days: 4, note: "bought today" },
      { name: "Whole milk", qty: "1 qt", days: 8, note: "bought today" },
      { name: "Eggs", qty: "dozen", days: 21, note: "bought today" },
      { name: "Chickpeas, canned", qty: "2 cans", days: 400, note: "shelf-stable" },
    ],
  },
  pantry: {
    items: [
      { name: "Peanut butter", qty: "jar", days: 180, note: "sealed jar" },
      { name: "Olive oil", qty: "half bottle", days: 300, note: "" },
      { name: "Rice, dry", qty: "2 lb bag", days: 400, note: "dry goods" },
      { name: "Soy sauce", qty: "bottle", days: 400, note: "" },
    ],
  },
};

export function demoScan(source: ScanSource): ScanResult {
  return SCANS[source];
}

const norm = (s: string) => s.toLowerCase().trim();
const short = (name: string) => name.split(",")[0].trim();

export function demoPlan(input: {
  pantry: Array<{ name: string; qty: string; days: number }>;
  allergies: string[];
}): RecipePlan | "allergen_conflict" {
  const allergens = input.allergies.map(norm).filter(Boolean);
  const safe = input.pantry
    .filter((p) => !allergens.some((a) => norm(p.name).includes(a)))
    .sort((a, b) => a.days - b.days);
  if (safe.length === 0) return "allergen_conflict";

  const picks = safe.slice(0, 3);
  const names = picks.map((p) => short(p.name).toLowerCase());
  const list =
    names.length === 1
      ? names[0]
      : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
  const rescued = Math.round(picks.length * 1.4 * 100) / 100;
  const needsLemon = !input.pantry.some((p) => norm(p.name).includes("lemon"));

  return {
    title: `One-pan ${names.slice(0, 2).join(" & ")} skillet`,
    why: `It catches the ${list} in one pan — about $${rescued.toFixed(2)} of what was about to go.`,
    minutes: 12 + picks.length * 2,
    uses: picks.map((p) => {
      const allOfIt = p.days <= 2;
      return {
        pantryName: p.name,
        qtyUsed: allOfIt ? "all of it" : "about half",
        leftoverQty: allOfIt ? "" : "about half",
      };
    }),
    missing: needsLemon
      ? [{ name: "lemon", estPrice: 0.59, substitute: "A splash of any vinegar works. Slightly less bright, still dinner." }]
      : [],
    steps: [
      `Get a pan properly hot with a little oil. Start with the ${names[0]} so it gets the most attention.`,
      picks.length > 1
        ? `Add the ${names.slice(1).join(" and ")}, tossing for a couple of minutes until everything is warm and starting to catch.`
        : "Keep it moving for a couple of minutes until it's warm and starting to catch.",
      `Season, ${needsLemon ? "squeeze over a little lemon" : "finish with a squeeze of lemon"}, and eat straight from the pan.`,
    ],
    rescuedValue: rescued,
    alternates: [
      { title: `${short(picks[0].name)} scramble`, meta: "8 min · uses 2" },
      { title: `${short(picks[0].name)} toast`, meta: "6 min · uses 2" },
    ],
    nextMeal: picks.some((p) => p.days > 2)
      ? { title: `${short(picks[picks.length - 1].name)} omelette`, meta: "Uses the leftovers · 9 min" }
      : null,
  };
}

const RECIPES: Array<{ match: RegExp; recipe: ImportedRecipe }> = [
  {
    match: /frittata|feta|spinach/i,
    recipe: {
      title: "Spinach & feta frittata",
      servings: 4,
      ingredients: [
        { quantity: "8", name: "eggs" },
        { quantity: "3 cups", name: "fresh spinach" },
        { quantity: "½ cup", name: "crumbled feta" },
        { quantity: "3", name: "green onions" },
        { quantity: "2 cloves", name: "garlic" },
        { quantity: "1 tbsp", name: "olive oil" },
      ],
    },
  },
  {
    match: /fried.?rice|rice|stir.?fry/i,
    recipe: {
      title: "Weeknight egg fried rice",
      servings: 2,
      ingredients: [
        { quantity: "3 cups", name: "day-old cooked rice" },
        { quantity: "2", name: "eggs" },
        { quantity: "4", name: "scallions" },
        { quantity: "2 tbsp", name: "soy sauce" },
        { quantity: "1 cup", name: "frozen peas & carrots" },
        { quantity: "1 tsp", name: "sesame oil" },
      ],
    },
  },
  {
    match: /pasta|spaghetti|penne|noodle/i,
    recipe: {
      title: "Lemony chickpea pasta",
      servings: 3,
      ingredients: [
        { quantity: "8 oz", name: "short pasta" },
        { quantity: "1 can", name: "chickpeas" },
        { quantity: "1", name: "lemon" },
        { quantity: "2 handfuls", name: "baby spinach" },
        { quantity: "¼ cup", name: "feta" },
        { quantity: "3 tbsp", name: "olive oil" },
      ],
    },
  },
];

export function demoImport(url: string): ImportedRecipe {
  if (/empty/i.test(url)) return { title: "Untitled page", ingredients: [] };
  const hit = RECIPES.find((r) => r.match.test(url));
  if (hit) return hit.recipe;
  const sum = [...url].reduce((a, c) => a + c.charCodeAt(0), 0);
  return RECIPES[sum % RECIPES.length].recipe;
}

export async function demoDelay() {
  await new Promise((r) => setTimeout(r, 900));
}
