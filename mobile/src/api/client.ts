import { ImportedRecipe, RecipePlan, ScannedItem } from "../types";
import { ScanSourceKey } from "../types/pantry";

// Override with EXPO_PUBLIC_API_URL (e.g. http://192.168.1.x:3000) when running
// on a physical device or simulator — localhost won't resolve from there.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: "unreachable" | "ai_not_configured" | "allergen_conflict" | "failed",
  ) {
    super(message);
  }
}

async function post<T>(path: string, body: unknown, failureMessage: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Can't reach the Scrapster server. Make sure the backend is running.", "unreachable");
  }

  if (response.ok) return response.json();

  const payload = await response.json().catch(() => ({}));
  if (payload.error === "ai_not_configured") {
    throw new ApiError("The server has no valid Anthropic API key yet.", "ai_not_configured");
  }
  if (payload.error === "allergen_conflict") {
    throw new ApiError(
      "I couldn't build a dinner from this list that avoids your allergies. Add a few more ingredients.",
      "allergen_conflict",
    );
  }
  throw new ApiError(failureMessage, "failed");
}

export function scanPhoto(input: {
  photoBase64: string;
  mediaType: string;
  source: ScanSourceKey;
}): Promise<{ items: ScannedItem[] }> {
  return post("/api/scan", input, "I couldn't read that photo. Try another one.");
}

export function planRecipe(input: {
  pantry: Array<{ name: string; qty: string; days: number }>;
  diet: string[];
  allergies: string[];
}): Promise<RecipePlan> {
  return post("/api/recipe", input, "I couldn't come up with a recipe. Try again.");
}

export function importRecipe(url: string): Promise<ImportedRecipe> {
  return post("/api/import-recipe", { url }, "I couldn't import that recipe. Try a different link.");
}
