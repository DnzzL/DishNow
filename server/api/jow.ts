import * as cheerio from "cheerio";
import { RecipesRecord } from "../../types/pocketbase";

export default defineEventHandler(async (event) => {
  const { url, userId } = await readBody(event);
  const content = (await $fetch(url)) as string;
  const $ = cheerio.load(content);

  const title = $("h1").text();
  const ingredients = $(".jow_prod__sc-ba14d455-6")
    .map((_, el) => $(el).text().toLowerCase())
    .get();

  const quantities = $(".jow_prod__sc-ba14d455-5")
    .map((_, el) => $(el).text())
    .get();

  const instructions = $(".jow_prod__sc-8e8afb9-6")
    .map((i, el) => $(el).text())
    .get();

  console.log(ingredients);

  const servings = $(".jow_prod__sc-c531c030-2").find("option:selected").val();
  const preparationTime = $(
    ".jow_prod__sc-ba7286dc-0 > div:nth-child(1) > div > div > p:nth-child(1)"
  ).text();

  const cookingTime = $(
    ".jow_prod__sc-ba7286dc-0 > div:nth-child(2) > div > div > p:nth-child(1)"
  ).text();

  const ogImage = $('meta[property="og:image"]').attr("content");

  const recipe: RecipesRecord = {
    author: userId,
    ingredients,
    instructions,
    origin: url,
    servings: Number(servings),
    thumbnailUrl: ogImage,
    title,
    totalTime:
      60 * Number(preparationTime?.split(" ")[0]) +
      Number(cookingTime?.split(" ")[0]),
  };

  return recipe;
});
