import "dotenv/config";
import cors from "cors";
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import { AllergenError, planRecipe, scanPhoto } from "./claude.js";
import { importRecipeFromUrl } from "./recipeImport.js";
import { SCAN_SOURCES, ScanSource } from "./schema.js";

// Missing/invalid server credentials are a setup problem, not a user problem.
function sendAiError(res: express.Response, err: unknown, fallback: string) {
  if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
    res.status(503).json({ error: "ai_not_configured", message: "The server's Anthropic API key is missing or invalid." });
    return;
  }
  res.status(502).json({ error: fallback });
}

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, aiConfigured: Boolean(process.env.ANTHROPIC_API_KEY) });
});

app.post("/api/scan", async (req, res) => {
  const { photoBase64, mediaType, source } = req.body ?? {};

  if (typeof photoBase64 !== "string" || photoBase64.length === 0) {
    res.status(400).json({ error: "Provide a photoBase64." });
    return;
  }
  if (!SCAN_SOURCES.includes(source)) {
    res.status(400).json({ error: `source must be one of: ${SCAN_SOURCES.join(", ")}.` });
    return;
  }

  try {
    const result = await scanPhoto({
      photoBase64,
      mediaType: typeof mediaType === "string" ? mediaType : "image/jpeg",
      source: source as ScanSource,
    });
    res.json(result);
  } catch (err) {
    console.error("scan failed:", err);
    sendAiError(res, err, "Couldn't read that photo.");
  }
});

app.post("/api/recipe", async (req, res) => {
  const { pantry, diet, allergies } = req.body ?? {};

  const validPantry =
    Array.isArray(pantry) &&
    pantry.length > 0 &&
    pantry.every(
      (p) =>
        p &&
        typeof p.name === "string" &&
        typeof p.qty === "string" &&
        typeof p.days === "number",
    );
  if (!validPantry) {
    res.status(400).json({ error: "pantry must be a non-empty list of {name, qty, days}." });
    return;
  }
  const strings = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];

  try {
    const plan = await planRecipe({
      pantry,
      diet: strings(diet),
      allergies: strings(allergies),
    });
    res.json(plan);
  } catch (err) {
    if (err instanceof AllergenError) {
      res.status(422).json({ error: "allergen_conflict", message: err.message });
      return;
    }
    console.error("recipe failed:", err);
    sendAiError(res, err, "Couldn't come up with a recipe.");
  }
});

app.post("/api/import-recipe", async (req, res) => {
  const { url } = req.body ?? {};

  if (typeof url !== "string" || !/^https?:\/\//i.test(url)) {
    res.status(400).json({ error: "Provide a valid http(s) url." });
    return;
  }

  try {
    const result = await importRecipeFromUrl(url);
    res.json(result);
  } catch (err) {
    console.error("import-recipe failed:", err);
    sendAiError(res, err, "Failed to import that recipe.");
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Scrapster backend listening on http://localhost:${port}`);
});
