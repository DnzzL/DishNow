import * as cheerio from "cheerio";
import { RecipesRecord } from "../../types/pocketbase";

export default defineEventHandler(async (event) => {
  const { url, userId } = await readBody(event);
  const content = (await $fetch(url)) as string;
  const $ = cheerio.load(content);

  const title = $(".u-title-page").text();
  const ingredients = $(".recipe-ingredients-item > span")
    .map((_, el) => $(el).text().toLowerCase())
    .get();

  const quantities = $(".app_recipe_ing_title > .jIngredientQuantity")
    .map((_, el) => $(el).text())
    .get();

  const instructions = $(".recipe-steps-text > p")
    .map((i, el) => $(el).text())
    .get();

  const servings = $(".ingredient-variator-label").text();
  const servingsNumber = servings.match(/\d+/g);
  const totalTime = $("div.recipe-info > div:nth-child(1)").text();
  const totalTimeNumber = totalTime.match(/\d+/g);

  const ogImage = $('meta[property="og:image"]').attr("content");

  const recipe: RecipesRecord = {
    author: userId,
    ingredients,
    instructions,
    origin: url,
    servings: Number(servingsNumber),
    thumbnailUrl: ogImage,
    title,
    totalTime: 60 * Number(totalTimeNumber),
  };

  return recipe;
});
