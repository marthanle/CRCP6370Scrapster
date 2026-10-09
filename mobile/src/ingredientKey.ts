const SKIP = new Set([
  "cup", "cups", "tbsp", "tsp", "tablespoon", "tablespoons", "teaspoon", "teaspoons", "oz", "ounce", "ounces",
  "lb", "lbs", "pound", "pounds", "g", "kg", "ml", "l", "clove", "cloves", "handful", "handfuls", "pinch",
  "head", "heads", "bunch", "can", "cans", "slice", "slices", "piece", "pieces", "stick", "sticks",
  "big", "small", "large", "medium", "fresh", "dry", "dried", "frozen", "cooked", "chopped", "diced", "minced",
  "sliced", "grated", "crumbled", "beaten", "whole", "half", "a", "an", "the", "of", "and", "or", "to", "taste",
  "some", "any", "whatever", "you", "have", "day", "old", "cold", "from", "fridge", "bendy", "is", "fine",
]);

/**
 * Short matching token for a free-text ingredient line ("2 cups day-old rice,
 * cold from the fridge" -> "rice"), used to compare it against the kitchen
 * list the way the seeded feed posts do with their hand-written keys.
 */
export function ingredientKey(line: string): string {
  const head = line.split(/[,—–(]/)[0].toLowerCase();
  const words = (head.match(/[a-z]+/g) ?? []).filter((w) => !SKIP.has(w));
  const last = words[words.length - 1] ?? head.trim();
  return last.length > 3 && last.endsWith("s") && !last.endsWith("ss") ? last.slice(0, -1) : last;
}

/** One entry per non-empty line, with list bullets/numbering stripped. */
export function parseLines(text: string): string[] {
  return text
    .split("\n")
    .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "").trim())
    .filter(Boolean);
}
