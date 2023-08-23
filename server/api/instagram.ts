import * as cheerio from "cheerio";
import { RecipesRecord } from "../../types/pocketbase";

export default defineEventHandler(async (event) => {
  const { url, userId } = await readBody(event);

  const rawResponse = await fetch(url);
  const content = await rawResponse.text();
  const $ = cheerio.load(content);

  const description = $("h1").first().text();

  const recipe: Partial<RecipesRecord> = {
    author: userId,
    ingredients: [],
    instructions: [description],
    origin: url,
    servings: undefined,
    thumbnailUrl: undefined,
    title: "",
    totalTime: undefined,
    type: undefined,
  };

  return recipe;
});
