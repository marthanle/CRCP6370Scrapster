import { AnalyzeResponse } from "../types";

// Point this at your local backend during development (see backend/README.md),
// e.g. http://192.168.1.x:3000 — localhost won't resolve from a physical device/simulator.
const API_BASE_URL = "http://localhost:3000";

export async function analyzeIngredients(input: {
  photoBase64?: string;
  photoMediaType?: string;
  ingredientList?: string;
}): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Analyze request failed (${response.status}): ${text}`);
  }

  return response.json();
}
