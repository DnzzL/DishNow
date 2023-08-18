<template>
  <div>
    <div class="flex flex-row justify-between align-middle">
      <h1 class="text-4xl font-cal font-bold mt-2 mb-5">Recherche</h1>
    </div>
    <div class="flex items-center">
      <form>
        <input
          type="text"
          id="searchQuery"
          name="searchQuery"
          v-model="searchQuery"
          placeholder="Enter your search query..."
          class="px-4 py-2 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </form>
    </div>
    <div class="py-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <RecipeCard
          :recipe="recipe"
          v-for="recipe in recipes"
          :key="recipe.id"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { RecipesResponse } from "~/types/pocketbase";

const searchQuery = ref("");
const recipes = ref<RecipesResponse[] | null>([]);

watch(searchQuery, async (newValue) => {
  const { data: matchingRecipes } = useAsyncData(async (nuxtApp) => {
    const response = await nuxtApp!.$pb
      .collection("recipes")
      .getList<RecipesResponse>(1, 10, {
        filter: `title ~ "${newValue}" || ingredients.name ?~ "${newValue}"`,
        expand: "ingredients",
      });
    return structuredClone(response.items);
  });
  recipes.value = matchingRecipes.value;
});
</script>

<!-- try {
    const matchingRecipes = await getRecordList<RecipesResponse>(
      nuxtApp.$pb,
      "recipes",
      {
        page: 1,
        params: {
          filter: `title ~ "${searchQuery}" || ingredients.name ?~ "${searchQuery}"`,
          expand: "ingredients",
        },
      }
    );
    const filteredRecipes = [...matchingRecipes];
    recipes.value = filteredRecipes;
  } catch (error) {
    if (error instanceof ClientResponseError) {
      return new Response(null, {
        status: 500,
        statusText: error.message,
      });
    }
  } -->
