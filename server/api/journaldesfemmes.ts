import * as cheerio from "cheerio";
import { RecipesRecord } from "~/types/pocketbase";

export default defineEventHandler(async (event) => {
  const { url, userId } = await readBody(event);

  const content = (await $fetch(url)) as string;
  const $ = cheerio.load(content);

  const title = $("h1").text();
  const ingredients = $(".app_recipe_ing_title > .jHiddenHref")
    .map((_, el) => $(el).text().toLowerCase().trim())
    .get();

  const quantities = $(".app_recipe_ing_title > .jIngredientQuantity")
    .map((_, el) => $(el).text())
    .get();

  const instructions = $(".bu_cuisine_recette_prepa")
    .map((_, el) => $(el).text().toLowerCase().trim())
    .get();

  const servings = $("#numberPerson").text();
  const totalTime = $("div.app_recipe_resume > div:nth-child(4) > span").text();
  const totalTimeNumber = totalTime.match(/\d+/g);

  const ogImage = $('meta[property="og:image"]').attr("content");

  const recipe: RecipesRecord = {
    author: userId,
    ingredients,
    instructions,
    origin: url,
    servings: Number(servings),
    thumbnailUrl: ogImage,
    title,
    totalTime: 60 * Number(totalTimeNumber),
  };

  return recipe;
});
