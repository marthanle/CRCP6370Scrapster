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
