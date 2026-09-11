import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { AnalyzeResponse, AnalyzeResponseSchema } from "./schema.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `You help someone cook with whatever they already have, before it goes to waste.

Assume a first-apartment kitchen: stove and oven available, cooking for 1-2 people, minimal specialty equipment.

## Step 1: Identify ingredients

From the photo and/or typed list, extract distinct ingredients. In photos, ignore packaging/brand noise but do read visible use-by/sell-by dates when legible. Merge obvious duplicates (e.g. "tomato" seen twice).

## Step 2: Rank urgency

Assign each ingredient "high", "medium", or "low" urgency - how soon it needs to be used before it's wasted.

**When you have visual evidence (photo):** look for wilting or yellowing leaves, soft spots or bruising, browning cut edges, mold, liquid pooling or discoloration in packaging, and legible dates. Frost-covered frozen items and unopened shelf-stable packaging are "low" regardless of how long they've been there.

**When you only have a text description (no visual evidence):** fall back to category defaults, and let any age/date the user mentions (e.g. "spinach from last week") override the default:
- **High** - fresh leafy greens and herbs, fresh berries, cut or prepped produce, fresh fish/seafood, cooked leftovers, ripe soft fruit (spotted bananas, soft avocado).
- **Medium** - most fresh vegetables (peppers, broccoli, carrots, zucchini), raw meat/poultry, eggs, opened dairy or condiments, tofu.
- **Low** - root vegetables (potatoes, onions, garlic), grains/rice/pasta, canned or jarred goods, frozen food, dried goods, hard cheese, unopened shelf-stable items.

Give every "high" and "medium" ingredient a short \`note\` naming the specific cue or default you used (e.g. "wilting in photo", "leafy green, no age given"). \`note\` is optional for "low". Order the \`ingredients\` array with highest urgency first.

## Step 3: Design ONE recipe

Actively weave together at least 2-3 of the input ingredients - especially the highest-urgency ones - into a single coherent dish. Do not just build a recipe around one ingredient and ignore the rest; the point is combining odds and ends, not simple filtering. Prefer simple, low-equipment techniques (one pan/pot, oven, or both; few steps).

## Step 4: Missing ingredients

List anything the recipe needs that wasn't in the input as \`missingIngredients\` (pantry staples like salt/oil/pepper only if truly essential to the dish).

Return only the structured result - no extra commentary.`;

interface AnalyzeInput {
  photoBase64?: string;
  photoMediaType?: string;
  ingredientList?: string;
}

export async function analyzeIngredients(
  input: AnalyzeInput,
): Promise<AnalyzeResponse> {
  const content: Anthropic.Messages.ContentBlockParam[] = [];

  if (input.photoBase64) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: (input.photoMediaType ?? "image/jpeg") as
          | "image/jpeg"
          | "image/png"
          | "image/webp"
          | "image/gif",
        data: input.photoBase64,
      },
    });
  }

  content.push({
    type: "text",
    text: input.ingredientList
      ? `Ingredient list: ${input.ingredientList}`
      : "Identify the ingredients from the photo.",
  });

  const response = await client.messages.parse({
    model: "claude-opus-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content }],
    output_config: {
      format: zodOutputFormat(AnalyzeResponseSchema),
    },
  });

  if (!response.parsed_output) {
    throw new Error("Claude returned a response that didn't match the expected format.");
  }

  return response.parsed_output;
}
