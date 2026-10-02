import Anthropic from "@anthropic-ai/sdk";
import { ImportedRecipe, ImportedRecipeSchema } from "./schema.js";

const client = new Anthropic();

const SYSTEM_PROMPT = `You extract a structured recipe from a web page so it can be compared against
someone's kitchen inventory.

Fetch the URL the user gives you, then read the page for the recipe's title, serving size (if
stated), and its full ingredient list. For each ingredient, split the quantity (e.g. "2 cups",
"1 tbsp", "to taste") from the ingredient name itself (e.g. "flour", "olive oil") - the name should
be a plain, recognizable grocery item, not the raw recipe-site text.

If the page is not a recipe, or you cannot find an ingredient list, respond with the JSON shape
below using an empty "ingredients" array and a "title" that briefly explains what you found instead.

Respond with ONLY a single JSON object matching exactly this shape - no markdown code fences, no
commentary before or after it:
{
  "title": string,
  "servings": number | omit this field if not stated,
  "ingredients": [{ "name": string, "quantity": string | omit if not stated }]
}`;

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end < start) {
    throw new Error("Claude's response did not contain a JSON object.");
  }
  return JSON.parse(text.slice(start, end + 1));
}

export async function importRecipeFromUrl(url: string): Promise<ImportedRecipe> {
  const messages: Anthropic.Messages.MessageParam[] = [
    { role: "user", content: `Recipe URL: ${url}` },
  ];

  let response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
    tools: [{ type: "web_fetch_20260209", name: "web_fetch", max_uses: 2 }],
  });

  // A long fetch/parse turn can pause; resume until the model actually finishes.
  let guard = 0;
  while (response.stop_reason === "pause_turn" && guard < 3) {
    messages.push({ role: "assistant", content: response.content });
    response = await client.messages.create({
      model: "claude-opus-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
      tools: [{ type: "web_fetch_20260209", name: "web_fetch", max_uses: 2 }],
    });
    guard++;
  }

  const textBlock = response.content.find((b): b is Anthropic.Messages.TextBlock => b.type === "text");
  if (!textBlock) {
    throw new Error("Claude did not return a text response for this recipe URL.");
  }

  const parsed = ImportedRecipeSchema.safeParse(extractJson(textBlock.text));
  if (!parsed.success) {
    throw new Error(`Claude's response didn't match the expected recipe shape: ${parsed.error.message}`);
  }

  return parsed.data;
}
