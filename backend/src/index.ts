import "dotenv/config";
import cors from "cors";
import express from "express";
import { analyzeIngredients } from "./claude.js";
import { importRecipeFromUrl } from "./recipeImport.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.post("/api/analyze", async (req, res) => {
  const { photoBase64, photoMediaType, ingredientList } = req.body ?? {};

  if (!photoBase64 && !ingredientList) {
    res.status(400).json({ error: "Provide a photoBase64 or an ingredientList." });
    return;
  }

  try {
    const result = await analyzeIngredients({ photoBase64, photoMediaType, ingredientList });
    res.json(result);
  } catch (err) {
    console.error("analyze failed:", err);
    res.status(502).json({ error: "Failed to analyze ingredients." });
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
    res.status(502).json({ error: "Failed to import that recipe." });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Scrapster backend listening on http://localhost:${port}`);
});
