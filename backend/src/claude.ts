import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import {
  RecipePlan,
  RecipePlanSchema,
  ScanResult,
  ScanResultSchema,
  ScanSource,
} from "./schema.js";

const client = new Anthropic();
const MODEL = "claude-opus-5";
// Adaptive thinking tokens count toward max_tokens, so leave generous headroom.
const MAX_TOKENS = 12000;

type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

function assertUsable(response: { stop_reason: string | null }) {
  if (response.stop_reason === "refusal") {
    throw new Error("The model declined this request.");
  }
  if (response.stop_reason === "max_tokens") {
    throw new Error("The model ran out of room before finishing. Try again.");
  }
}

const SCAN_PROMPT = `You read photos of someone's food and turn them into a kitchen inventory.

Each item needs:
- name: a plain grocery name ("Baby spinach", "Rice, cooked", "Feta") - no brands or packaging noise. Merge duplicates.
- qty: a short human amount ("half bag", "2", "1 cup", "bottle"). If unsure, give your best visual estimate.
- daysLeft: your best estimate of days until it should be used or binned, as a whole number. Use 0 for "use today".
- note: a few words naming the cue behind the estimate ("wilting leaves", "leafy green, no date visible", "sealed jar"). Empty string if nothing notable.

Estimating daysLeft:
- Visual cues win: wilting/yellowing, soft spots, browning, mold, liquid pooling, and legible use-by dates. Frozen and sealed shelf-stable goods are 180+ regardless of how long they've been there.
- Otherwise use category defaults: fresh leafy greens/herbs, berries, cut produce, fish, cooked leftovers = 0-2; most fresh vegetables, raw meat, eggs, opened dairy, tofu = 4-10; root vegetables, hard cheese = 14-30; grains, canned/jarred, dried goods, oils, sauces = 180-400.

Only list food. Order items by daysLeft ascending (most urgent first).`;

const SOURCE_HINTS: Record<ScanSource, string> = {
  fridge: "This is a photo of the inside of a fridge.",
  pantry: "This is a photo of a pantry shelf or cupboard.",
  receipt:
    "This is a photo of a grocery receipt. List the food line items only (skip bags, tax, non-food). Items were bought today, so estimate daysLeft for freshly bought food of that type; qty comes from the receipt line.",
};

export async function scanPhoto(input: {
  photoBase64: string;
  mediaType: string;
  source: ScanSource;
}): Promise<ScanResult> {
  const response = await client.messages.parse({
    model: MODEL,
    max_tokens: MAX_TOKENS,
    system: SCAN_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: input.mediaType as ImageMediaType,
              data: input.photoBase64,
            },
          },
          { type: "text", text: SOURCE_HINTS[input.source] },
        ],
      },
    ],
    output_config: { format: zodOutputFormat(ScanResultSchema) },
  });
  assertUsable(response);

  if (!response.parsed_output) {
    throw new Error("Claude returned a response that didn't match the expected format.");
  }

  const items = response.parsed_output.items
    .map((i) => ({
      name: i.name.trim(),
      qty: i.qty.trim() || "1",
      days: Math.max(0, Math.round(i.daysLeft)),
      note: i.note.trim(),
    }))
    .filter((i) => i.name.length > 0)
    .sort((a, b) => a.days - b.days);

  return { items };
}

const RECIPE_PROMPT = `You are the "decide dinner for me" engine in a food-waste app for students and young professionals cooking for 1-2 people on a tight budget.

You get the user's kitchen list (name, quantity, days until it goes bad). Commit to exactly ONE dish - no menus.

Rules:
- Build the dish around the most urgent items (lowest days) and weave several of them together; don't just filter on one ingredient.
- First-apartment kitchen: stove and oven, basic pans. Prefer one-pan, under ~30 minutes.
- "uses" may ONLY reference items from the kitchen list, and pantryName must be copied exactly as written there. For each, give qtyUsed and leftoverQty (what remains after cooking, e.g. "½ block"; empty string if fully used up).
- Assume salt, pepper, water, and basic cooking oil are on hand - don't list them as missing.
- "missing" is anything else the dish truly needs (keep it to 0-2 cheap items; prefer a dish that needs nothing). Give estPrice in USD for a typical grocery store, and a one-line substitute using something common ("a splash of any vinegar").
- Respect dietary preferences as a soft preference. Allergies are a HARD filter: no allergen or derivative may appear anywhere in the dish, ingredients, or steps.
- why: ONE sentence naming what the dish rescues, warm and encouraging.
- rescuedValue: estimated USD value of the at-risk food (days <= 7) this dish uses up.
- steps: 3-6 short, concrete steps with timings.
- alternates: exactly two other dish ideas (title + a short meta like "8 min · uses 2").
- nextMealTitle/nextMealMeta: a tomorrow idea built from the leftovers, with meta like "Uses all three · 9 min". Empty strings if nothing sensible.`;

function norm(s: string) {
  return s.toLowerCase().trim();
}

function planText(plan: RecipePlan): string {
  return norm(
    [
      plan.title,
      plan.why,
      ...plan.uses.map((u) => u.pantryName),
      ...plan.missing.map((m) => m.name),
      ...plan.steps,
      ...plan.alternates.map((a) => a.title),
      plan.nextMeal?.title ?? "",
    ].join(" "),
  );
}

export class AllergenError extends Error {}

export async function planRecipe(input: {
  pantry: Array<{ name: string; qty: string; days: number }>;
  diet: string[];
  allergies: string[];
}): Promise<RecipePlan> {
  const allergyTerms = input.allergies.map(norm).filter(Boolean);

  const kitchen = input.pantry
    .map((p) => `- ${p.name} | ${p.qty} | ${p.days} days left`)
    .join("\n");
  const prefs = [
    input.diet.length ? `Dietary preferences: ${input.diet.join(", ")}.` : "No dietary preferences.",
    allergyTerms.length
      ? `ALLERGIES (never include): ${allergyTerms.join(", ")}.`
      : "No allergies.",
  ].join("\n");

  for (let attempt = 0; attempt < 2; attempt++) {
    const retryNote =
      attempt > 0
        ? "\n\nYour previous attempt mentioned an allergen. Pick a different dish with none of them."
        : "";

    const response = await client.messages.parse({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: RECIPE_PROMPT,
      messages: [
        {
          role: "user",
          content: `Kitchen list:\n${kitchen}\n\n${prefs}${retryNote}`,
        },
      ],
      output_config: { format: zodOutputFormat(RecipePlanSchema) },
    });
    assertUsable(response);

    const raw = response.parsed_output;
    if (!raw) {
      throw new Error("Claude returned a response that didn't match the expected format.");
    }

    const known = new Map(input.pantry.map((p) => [norm(p.name), p.name]));
    const plan: RecipePlan = {
      title: raw.title.trim(),
      why: raw.why.trim(),
      minutes: Math.max(1, Math.round(raw.minutes)),
      uses: raw.uses
        .map((u) => ({
          pantryName: known.get(norm(u.pantryName)) ?? "",
          qtyUsed: u.qtyUsed.trim(),
          leftoverQty: u.leftoverQty.trim(),
        }))
        .filter((u) => u.pantryName !== ""),
      missing: raw.missing
        .map((m) => ({
          name: m.name.trim(),
          estPrice: Math.max(0, Math.round(m.estPrice * 100) / 100),
          substitute: m.substitute.trim(),
        }))
        .filter((m) => m.name !== ""),
      steps: raw.steps.map((s) => s.trim()).filter(Boolean),
      rescuedValue: Math.max(0, Math.round(raw.rescuedValue * 100) / 100),
      alternates: raw.alternates.slice(0, 2),
      nextMeal:
        raw.nextMealTitle.trim() !== ""
          ? { title: raw.nextMealTitle.trim(), meta: raw.nextMealMeta.trim() }
          : null,
    };

    if (plan.uses.length === 0 || plan.steps.length === 0) {
      throw new Error("The recipe didn't use anything from your kitchen list. Try again.");
    }

    const text = planText(plan);
    if (!allergyTerms.some((term) => text.includes(term))) {
      return plan;
    }
  }

  throw new AllergenError("Couldn't find a recipe that avoids your allergies from this list.");
}
