import { z } from "zod";

// Structured-output schemas avoid .optional()/.int()/.positive(): "none" is an
// empty string and numbers are rounded/clamped server-side after parsing.

export const SCAN_SOURCES = ["fridge", "receipt", "pantry"] as const;
export type ScanSource = (typeof SCAN_SOURCES)[number];

export const ScanResultSchema = z.object({
  items: z.array(
    z.object({
      name: z.string(),
      qty: z.string(),
      daysLeft: z.number(),
      note: z.string(),
    }),
  ),
});

export type ScanResult = {
  items: Array<{ name: string; qty: string; days: number; note: string }>;
};

export const RecipePlanSchema = z.object({
  title: z.string(),
  why: z.string(),
  minutes: z.number(),
  uses: z.array(
    z.object({
      pantryName: z.string(),
      qtyUsed: z.string(),
      leftoverQty: z.string(),
    }),
  ),
  missing: z.array(
    z.object({
      name: z.string(),
      estPrice: z.number(),
      substitute: z.string(),
    }),
  ),
  steps: z.array(z.string()),
  rescuedValue: z.number(),
  alternates: z.array(z.object({ title: z.string(), meta: z.string() })),
  nextMealTitle: z.string(),
  nextMealMeta: z.string(),
});

export type RecipePlan = {
  title: string;
  why: string;
  minutes: number;
  uses: Array<{ pantryName: string; qtyUsed: string; leftoverQty: string }>;
  missing: Array<{ name: string; estPrice: number; substitute: string }>;
  steps: string[];
  rescuedValue: number;
  alternates: Array<{ title: string; meta: string }>;
  nextMeal: { title: string; meta: string } | null;
};

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
