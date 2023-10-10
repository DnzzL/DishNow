<template>
  <RecipeDetails :recipe="recipe" v-if="recipe" class="mb-16" />
</template>

<script setup lang="ts">
import type {
  IngredientsResponse,
  InstructionsResponse,
  RecipesResponse,
  TagsResponse,
} from "~/types/pocketbase";

const { getRecordById } = useDb();
const route = useRoute();
const id = route.params.id as string;

type Recipe = RecipesResponse<{
  ingredients: IngredientsResponse[];
  instructions: InstructionsResponse[];
  tags: TagsResponse[];
}>;

const { data: recipe } = await useAsyncData(async (nuxtApp) => {
  const records = (await getRecordById<Recipe>("recipes", id, {
    expand: "ingredients,instructions,tags",
  })) as Recipe;
  return structuredClone(records);
});
</script>
