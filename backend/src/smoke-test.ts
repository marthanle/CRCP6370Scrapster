import "dotenv/config";
import { analyzeIngredients } from "./claude.js";
import { importRecipeFromUrl } from "./recipeImport.js";

const SAMPLE_INPUTS = [
  {
    label: "text list with an explicit age hint",
    ingredientList:
      "spinach from last week, half an onion, two eggs, leftover cooked rice, a block of cheddar",
  },
  {
    label: "text list with no age hints (category defaults only)",
    ingredientList: "chicken breast, broccoli, garlic, canned black beans, rice",
  },
];

const SAMPLE_RECIPE_URL = "https://www.bbcgoodfood.com/recipes/easy-pancakes";

async function runAnalyzeSamples() {
  for (const sample of SAMPLE_INPUTS) {
    console.log(`\n=== analyze: ${sample.label} ===`);
    console.log(`Input: ${sample.ingredientList}`);
    try {
      const result = await analyzeIngredients({ ingredientList: sample.ingredientList });
      console.log("Ingredients (highest urgency first):");
      for (const ing of result.ingredients) {
        console.log(`  [${ing.urgency}] ${ing.name}${ing.note ? ` - ${ing.note}` : ""}`);
      }
      console.log(`Recipe: ${result.recipe.title} (serves ${result.recipe.servings})`);
      console.log(`  Uses: ${result.recipe.usesIngredients.join(", ")}`);
      console.log(`  Missing: ${result.recipe.missingIngredients.join(", ") || "none"}`);
      console.log(`  Steps: ${result.recipe.steps.length}`);
    } catch (err) {
      console.error("FAILED:", err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
  }
}

async function runImportSample() {
  console.log(`\n=== import-recipe: ${SAMPLE_RECIPE_URL} ===`);
  try {
    const result = await importRecipeFromUrl(SAMPLE_RECIPE_URL);
    console.log(`Title: ${result.title}${result.servings ? ` (serves ${result.servings})` : ""}`);
    console.log("Ingredients:");
    for (const ing of result.ingredients) {
      console.log(`  ${ing.quantity ? `${ing.quantity} ` : ""}${ing.name}`);
    }
  } catch (err) {
    console.error("FAILED:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

async function main() {
  await runAnalyzeSamples();
  await runImportSample();
}

main();
