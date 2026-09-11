import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { AnalyzeResponse, AnalyzeResponseSchema } from "./schema.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `You help someone cook with whatever they already have, before it goes to waste.

Assume a first-apartment kitchen: stove and oven available, cooking for 1-2 people, minimal specialty equipment.

Given a photo of a fridge/pantry and/or a typed list of ingredients:
1. Identify the distinct ingredients present (ignore packaging/brand noise in photos).
2. Estimate spoilage urgency for each ("high" = wilting/very perishable and should be used today, "medium" = good for a few more days, "low" = shelf-stable/frozen). If you can't tell freshness from a typed list, use reasonable defaults for that ingredient type.
3. Design ONE recipe that combines as many of the ingredients as plausibly work together, prioritizing the highest-urgency ones. Prefer simple, low-equipment techniques (stovetop/oven, few steps).
4. List any ingredients the recipe needs that weren't in their input as missingIngredients.

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
