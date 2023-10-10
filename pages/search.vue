<template>
  <Navbar />
  <main class="pb-12">
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
    <div class="py-4" v-if="recipes && recipes?.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
        <RecipeDisplayCard
          v-for="recipe in recipes?.slice(
            (page - 1) * pageSize,
            page * pageSize
          )"
          :recipe="recipe"
          :key="recipe.id"
        />
      </div>
      <div class="flex justify-center py-4">
        <UPagination v-model="page" :total="recipes.length" />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";

import type { RecipesResponse, UsersResponse } from "~/types/pocketbase";

type RecipeItem = RecipesResponse<{
  author: UsersResponse;
}>;

const searchQuery = ref("");
const page = ref(1);
const pageSize = ref(10);
const recipes = ref<RecipesResponse[] | null>([]);

watch(searchQuery, async (newValue: any) => {
  const { data: matchingRecipes } = useAsyncData(async (nuxtApp) => {
    const response = await nuxtApp!.$pb
      .collection("recipes")
      .getList<RecipeItem>(page.value, pageSize.value, {
        filter: `title ~ "${newValue}" || ingredients.name ?~ "${newValue}"`,
        expand: "ingredients,author",
      });
    return structuredClone(response.items);
  });
  recipes.value = matchingRecipes.value;
});
</script>
