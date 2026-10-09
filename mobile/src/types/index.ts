export interface ImportedIngredient {
  name: string;
  quantity?: string;
}

export interface ImportedRecipe {
  title: string;
  servings?: number;
  ingredients: ImportedIngredient[];
}

export interface ScannedItem {
  name: string;
  qty: string;
  days: number;
  note: string;
}

export interface RecipeUse {
  pantryName: string;
  qtyUsed: string;
  leftoverQty: string;
}

export interface RecipeMissing {
  name: string;
  estPrice: number;
  substitute: string;
}

export interface RecipePlan {
  title: string;
  why: string;
  minutes: number;
  uses: RecipeUse[];
  missing: RecipeMissing[];
  steps: string[];
  rescuedValue: number;
  alternates: Array<{ title: string; meta: string }>;
  nextMeal: { title: string; meta: string } | null;
}
