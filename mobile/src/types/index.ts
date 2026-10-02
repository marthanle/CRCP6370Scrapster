export interface RankedIngredient {
  name: string;
  urgency: "high" | "medium" | "low";
  note?: string;
}

export interface Recipe {
  title: string;
  usesIngredients: string[];
  missingIngredients: string[];
  steps: string[];
  servings: number;
}

export interface AnalyzeResponse {
  ingredients: RankedIngredient[];
  recipe: Recipe;
}

export interface ImportedIngredient {
  name: string;
  quantity?: string;
}

export interface ImportedRecipe {
  title: string;
  servings?: number;
  ingredients: ImportedIngredient[];
}
