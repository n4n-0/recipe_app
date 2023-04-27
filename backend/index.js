const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Generate a single recipe
  app.post("/api/recipe", async (req, res) => {
    const { title, excludedIngredients } = req.body;
    const recipe = await generateRecipe(title, excludedIngredients);
    res.json(recipe);
  });

  // Generate daily meal plan
  app.post("/api/daily-meal-plan", async (req, res) => {
    const { excludedIngredients } = req.body;
    const dailyMealPlan = await generateDailyMealPlan(excludedIngredients);
    res.json(dailyMealPlan);
  });

  // Generate weekly meal plan
  app.post("/api/weekly-meal-plan", async (req, res) => {
    const { excludedIngredients } = req.body;
    const weeklyMealPlan = await generateWeeklyMealPlan(excludedIngredients);
    res.json(weeklyMealPlan);
  });
});
