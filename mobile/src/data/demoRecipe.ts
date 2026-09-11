/**
 * Placeholder recipe content matching the design prototype. Swap for the
 * backend's generated recipe (backend/src/claude.ts -> analyzeIngredients)
 * once the result/recipe/cooked screens read from real state instead of a
 * fixed demo dish.
 */
export const DEMO_RECIPE = {
  title: "Crispy rice & wilted spinach bowl",
  usesLine:
    "It catches the spinach, the scallions and the rice in one pan — $3.50 of the $4.30 that was about to go.",
  minutes: 12,
  usedUp: "4/5",
  missingIngredient: { name: "lemon", price: "$0.59" },
  tags: ["rice 1 cup", "spinach", "2 eggs", "feta", "scallions"],
  alternates: [
    { title: "Feta scramble", meta: "8 min · uses 2" },
    { title: "Rice gratin", meta: "35 min · oven" },
  ],
  steps: [
    "Press the cold rice flat into a dry hot pan. Leave it alone 4 minutes — that's the crispy part.",
    "Push it aside, crack in the eggs, scramble them loosely in the same pan.",
    "Heat off. Pile the spinach on and stir — residual heat wilts it in about 40 seconds.",
    "Crumble the feta, squeeze the lemon, scatter the scallions. Eat straight from the pan.",
  ],
  budgetOptions: [
    { name: "Dollar Market", price: "$0.59", meta: "4 min walk · open till 11", best: true },
    { name: "Campus Grocer", price: "$1.20", meta: "In your building · meal-card accepted", best: false },
    { name: "Delivery", price: "$1.09 + fee", meta: "25 min · not worth it for one lemon", best: false },
  ],
  cookedSavings: "+$3.50",
  cookedLine:
    "The spinach made it with hours to spare. That's 4 ingredients rescued and one dinner you didn't have to think about.",
  leftovers: ["½ feta", "1 egg", "½ lemon"],
  nextMeal: { day: "WED", title: "Feta & lemon omelette", meta: "Uses all three · 9 min" },
} as const;

export const MONTHLY_SAVINGS_BARS: Array<[string, number]> = [
  ["Apr", 28],
  ["May", 44],
  ["Jun", 31],
  ["Jul", 52],
  ["Aug", 39],
  ["Sep", 64],
];

export const RESCUE_CATEGORIES = [
  { label: "Greens", pct: 82 },
  { label: "Dairy", pct: 54 },
  { label: "Grains", pct: 31 },
];
