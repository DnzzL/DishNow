import * as cheerio from "cheerio";
import type { RecipesRecord, RecipesTypeOptions } from "~/types/pocketbase";

export default defineEventHandler(async (event) => {
  const { url, userId } = await readBody(event);

  const root = "https://api-uno.marmiton.org/recipe";
  const re = new RegExp("(?<=_)\\d+");

  const match = re.exec(url);
  if (!match) {
    throw new Error("Invalid URL");
  }
  const apiUrl = `${root}/${match[0]}`;
  const response = await fetch(apiUrl);
  const marmitonRecipe = (await response.json()) as MarmitonRecipe;

  if (!marmitonRecipe) {
    throw new Error("No data");
  }
  const ingredients = marmitonRecipe.ingredientGroups
    .flatMap((group) => group.items)
    .map((item) => item.name.toLowerCase());
  const instructions = marmitonRecipe.steps.map((step) => {
    return {
      text: step.text,
      position: step.position,
    };
  });

  const rawResponse = await fetch(url);
  const content = await rawResponse.text();
  const $ = cheerio.load(content);
  const ogImage = $('meta[property="og:image"]').attr("content");

  const recipe: RecipesRecord = {
    author: userId,
    ingredients,
    instructions,
    origin: url,
    servings: marmitonRecipe.servings.count,
    thumbnailUrl: ogImage,
    title: marmitonRecipe.title,
    totalTime: marmitonRecipe.totalTime,
    type: marmitonRecipe.categories[0]?.name as RecipesTypeOptions,
  };

  return recipe;
});

export interface MarmitonRecipe {
  id: number;
  guid: string;
  author: Author;
  picturesPreview: Picture[];
  pictureCount: number;
  title: string;
  seoUrl: string;
  seoTags: any[];
  seoTitle: string;
  url: string;
  cookingTime: number;
  preparationTime: number;
  restTime: number;
  rating: number;
  totalTime: number;
  ratingCount: number;
  cost: Cost;
  difficulty: Cost;
  dishType: DishType;
  authorNotes: string;
  steps: Step[];
  servings: Servings;
  ingredientGroups: IngredientGroup[];
  utensils: Utensil[];
  selection: null;
  brand: null;
  isStepByStep: boolean;
  isSeasonal: boolean;
  nutriScore: string;
  ecoScore: string;
  categories: Category[];
  video: null;
  adKeywords: AdKeywords;
  opsTags: any[];
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isVegetarian: boolean;
  isVegan: boolean;
  isPorkFree: boolean;
  isSweet: boolean;
  isSalty: boolean;
  validationDate: Date;
  authorizedFormats: string;
  killed: boolean;
  isIndexed: boolean;
}

export interface AdKeywords {
  rid: string;
  titleWords: string;
  ingredients: string;
  utensils: string;
  leftcolumn: string;
  dishType: string;
  cost: string;
  difficulty: string;
  preparationTime: string;
  cookingTime: string;
  vegetarian: string;
  porkfree: string;
  recipeCategory: string;
}

export interface Author {
  id: number;
  authorType: string;
  name: string;
  avatarUrl: string;
  userName: string;
  nbRecipes: number;
}

export interface Category {
  name: string;
  url: string;
  token: string;
}

export interface Cost {
  id: number;
  name: string;
  token: string;
}

export interface DishType {
  name: string;
  token: string;
}

export interface IngredientGroup {
  ingredientGroupId: number;
  name: string;
  items: Item[];
}

export interface Item {
  ingredientId: number;
  ingredientQuantity: number;
  complement: null | string;
  complementPlural?: null | string;
  picture: Picture;
  brandId: number | null;
  brandName: BrandName | null;
  name: string;
  plural: string;
  token: string;
  unitId: number | null;
  unitName: null | string;
  unitShortName: null | string;
  unitPlural: null | string;
  position?: number;
  url: null | string;
  nutriScore: null;
  showNutriScore: boolean;
}

export enum BrandName {
  Amazon = "Amazon",
  Marmiton = "Marmiton",
}

export interface Picture {
  id: string;
  pictureUrls: PictureUrls | null;
  creationDate?: Date;
  credits: string;
  width: number;
  height: number;
  originWidth: number;
  originHeight: number;
  centerX: number;
  centerY: number;
  cropXTop: null;
  cropYTop: null;
  cropXBottom: number | null;
  cropYBottom: number | null;
  picturePath: string;
  dateString?: string;
  author: null;
  reportable?: boolean;
}

export interface PictureUrls {
  origin: string;
  main: string;
  mainMobile: string;
  thumb: string;
  "1x1": The16_X9;
  "4x3": The16_X9;
  "16x9": The16_X9;
}

export interface The16_X9 {
  webp: string;
  jpg: string;
}

export interface Servings {
  count: number;
  shortUnit: string;
  unit: string;
}

export interface Step {
  id: number;
  position: number;
  text: string;
  duration: number;
  isPreparationStep: boolean;
  isCookingStep: boolean;
  isRestStep: boolean;
  isPreview: boolean;
  stepIngredients: Item[];
  picture: null;
}

export interface Utensil {
  utensilItemId: number;
  quantity: number;
  position: number;
  name: string;
  plural: string;
  isProg: boolean;
  text: string;
  strokeText: string;
  url: string;
  brandId: number;
  brandName: BrandName;
  picture: Picture;
}
