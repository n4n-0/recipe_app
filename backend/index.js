const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

async function generateText(prompt) {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const openaiApiUrl =
    "https://api.openai.com/v1/engines/davinci-codex/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${openaiApiKey}`,
  };

  const data = {
    prompt,
    max_tokens: 200,
    n: 1,
    stop: null,
    temperature: 0.8,
  };

  try {
    const response = await axios.post(openaiApiUrl, data, { headers });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error(`Error generating text: ${error.message}`);
  }
}

async function generateDailyMealPlan(excludedIngredients) {
  const prompt = `Create a daily meal plan with breakfast, lunch, and dinner without using ${excludedIngredients.join(
    ", "
  )}.`;
  const dailyMealPlanText = await generateText(prompt);
  const dailyMealPlan = parseMealPlan(dailyMealPlanText);
  return dailyMealPlan;
}

async function generateWeeklyMealPlan(excludedIngredients) {
  const prompt = `Create a weekly meal plan with breakfast, lunch, and dinner for 7 days without using ${excludedIngredients.join(
    ", "
  )}.`;
  const weeklyMealPlanText = await generateText(prompt);
  const weeklyMealPlan = parseMealPlan(weeklyMealPlanText);
  return weeklyMealPlan;
}

function parseMealPlan(mealPlanText) {
  const meals = mealPlanText.split("\n").map((meal) => meal.trim());
  return meals.filter((meal) => meal.length > 0);
}

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
