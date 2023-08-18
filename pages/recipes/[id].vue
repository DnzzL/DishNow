<template>
  <RecipeDetails :recipe="recipe" v-if="recipe" class="mb-16" />
</template>

<script setup lang="ts">
import type {
  IngredientsResponse,
  InstructionsResponse,
  RecipesResponse,
} from "~/types/pocketbase";
import { getRecordById } from "~/utils/pocketbase";

const route = useRoute();
const id = route.params.id as string;

type Recipe = RecipesResponse<{
  ingredients: IngredientsResponse[];
  instructions: InstructionsResponse[];
}>;

const { data: recipe } = await useAsyncData(async (nuxtApp) => {
  const records = (await getRecordById<Recipe>(nuxtApp!.$pb, "recipes", id, {
    expand: "ingredients,instructions",
  })) as Recipe;
  return structuredClone(records);
});
</script>
