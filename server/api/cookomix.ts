import * as cheerio from "cheerio";
import { RecipesRecord } from "~/types/pocketbase";

export default defineEventHandler(async (event) => {
  const { url, userId } = await readBody(event);
  const content = (await $fetch(url)) as string;
  const $ = cheerio.load(content);

  const title = $(".entry-title").text();
  const ingredients = $(".ingredients > dd > a")
    .map((_, el) => $(el).text().toLowerCase())
    .get();

  const quantities = $(".ingredients > dt")
    .map((_, el) => $(el).text())
    .get();

  const instructions = $(".instructions > ol >li")
    .map((i, el) => $(el).text())
    .get();

  const servings = $("#sidebar > dl.basic.prez > dd:nth-child(10)").text();
  const servingsNumber = servings.match(/\d+/g);
  const totalTime = $("#sidebar > dl.basic.prez > dd:nth-child(6)").text();
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
