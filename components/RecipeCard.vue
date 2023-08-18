<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <NuxtLink :href="`/recipes/${recipe.id}`">
      <img
        :src="props.recipe.thumbnailUrl"
        alt="recipe image"
        class="object-cover w-full h-48"
        v-if="props.recipe.thumbnailUrl"
      />
      <div
        class="flex items-center justify-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700"
        v-else
      >
        <svg
          class="w-10 h-10 text-gray-200 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path
            d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
          />
        </svg>
      </div>
    </NuxtLink>
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2">{{ props.recipe.title }}</h3>
      <p class="text-gray-700 text-base">
        {{ props.recipe.title }}
      </p>
      <div class="mt-4">
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >{{ props.recipe.totalTime }} min</span
        >
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >{{ props.recipe.servings }} servings</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecipesResponse } from "~/types/pocketbase";

const props = defineProps<{
  recipe: RecipesResponse;
}>();
</script>
