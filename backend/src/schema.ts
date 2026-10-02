import { z } from "zod";

export const AnalyzeResponseSchema = z.object({
  ingredients: z.array(
    z.object({
      name: z.string(),
      urgency: z.enum(["high", "medium", "low"]),
      note: z.string().optional(),
    }),
  ),
  recipe: z.object({
    title: z.string(),
    usesIngredients: z.array(z.string()),
    missingIngredients: z.array(z.string()),
    steps: z.array(z.string()),
    servings: z.number().int().positive(),
  }),
});

export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;

export const ImportedRecipeSchema = z.object({
  title: z.string(),
  servings: z.number().int().positive().optional(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      quantity: z.string().optional(),
    }),
  ),
});

export type ImportedRecipe = z.infer<typeof ImportedRecipeSchema>;
