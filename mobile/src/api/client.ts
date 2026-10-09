import { ImportedRecipe, RecipePlan, ScannedItem } from "../types";
import { ScanSourceKey } from "../types/pantry";
import { staticImport, staticPlan, staticScan } from "./staticDemo";

// Set EXPO_PUBLIC_STATIC_DEMO=1 for a build with no backend (the shareable web
// artifact): scan, recipe and import answer from canned data on the device.
const STATIC_DEMO = process.env.EXPO_PUBLIC_STATIC_DEMO === "1";
const pause = () => new Promise((r) => setTimeout(r, 900));

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
  if (STATIC_DEMO) return pause().then(() => ({ items: staticScan(input.source) }));
  return post("/api/scan", input, "I couldn't read that photo. Try another one.");
}

export function planRecipe(input: {
  pantry: Array<{ name: string; qty: string; days: number }>;
  diet: string[];
  allergies: string[];
}): Promise<RecipePlan> {
  if (STATIC_DEMO) {
    return pause().then(() => {
      const plan = staticPlan(input);
      if (!plan) {
        throw new ApiError(
          "I couldn't build a dinner from this list that avoids your allergies. Add a few more ingredients.",
          "allergen_conflict",
        );
      }
      return plan;
    });
  }
  return post("/api/recipe", input, "I couldn't come up with a recipe. Try again.");
}

export function importRecipe(url: string): Promise<ImportedRecipe> {
  if (STATIC_DEMO) return pause().then(() => staticImport(url));
  return post("/api/import-recipe", { url }, "I couldn't import that recipe. Try a different link.");
}
