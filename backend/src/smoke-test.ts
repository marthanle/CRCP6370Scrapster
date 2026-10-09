import "dotenv/config";
import { readFileSync } from "fs";
import { planRecipe, scanPhoto } from "./claude.js";
import { importRecipeFromUrl } from "./recipeImport.js";

const SAMPLE_RECIPE_URL = "https://www.bbcgoodfood.com/recipes/easy-pancakes";

const SAMPLE_PANTRY = [
  { name: "Baby spinach", qty: "half bag", days: 0 },
  { name: "Scallions", qty: "2", days: 1 },
  { name: "Rice, cooked", qty: "1 cup", days: 2 },
  { name: "Feta", qty: "½ block", days: 9 },
  { name: "Eggs", qty: "2", days: 12 },
  { name: "Soy sauce", qty: "bottle", days: 400 },
];

async function step(label: string, fn: () => Promise<void>) {
  console.log(`\n=== ${label} ===`);
  try {
    await fn();
  } catch (err) {
    console.error("FAILED:", err instanceof Error ? err.message : err);
    process.exitCode = 1;
  }
}

async function main() {
  await step("recipe: plan from sample kitchen list", async () => {
    const plan = await planRecipe({ pantry: SAMPLE_PANTRY, diet: ["No pork"], allergies: [] });
    console.log(`${plan.title} (${plan.minutes} min, rescues $${plan.rescuedValue})`);
    console.log(`Why: ${plan.why}`);
    for (const u of plan.uses) {
      console.log(`  uses ${u.pantryName}: ${u.qtyUsed}${u.leftoverQty ? ` (left: ${u.leftoverQty})` : ""}`);
    }
    console.log(`  missing: ${plan.missing.map((m) => `${m.name} ~$${m.estPrice}`).join(", ") || "nothing"}`);
    console.log(`  steps: ${plan.steps.length}, next meal: ${plan.nextMeal?.title ?? "none"}`);
  });

  const photoPath = process.argv[2];
  if (photoPath) {
    await step(`scan: ${photoPath} as a fridge photo`, async () => {
      const result = await scanPhoto({
        photoBase64: readFileSync(photoPath).toString("base64"),
        mediaType: photoPath.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
        source: "fridge",
      });
      for (const i of result.items) {
        console.log(`  [${i.days}d] ${i.name} (${i.qty})${i.note ? ` - ${i.note}` : ""}`);
      }
    });
  } else {
    console.log("\n(skipping scan: pass a photo path, e.g. `npm run smoke-test -- ./fridge.jpg`)");
  }

  await step(`import-recipe: ${SAMPLE_RECIPE_URL}`, async () => {
    const result = await importRecipeFromUrl(SAMPLE_RECIPE_URL);
    console.log(`Title: ${result.title}${result.servings ? ` (serves ${result.servings})` : ""}`);
    for (const ing of result.ingredients) {
      console.log(`  ${ing.quantity ? `${ing.quantity} ` : ""}${ing.name}`);
    }
  });
}

main();
