<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <NuxtLink :href="`/recipes/${recipe.id}`">
      <img
        :src="props.recipe.thumbnailUrl"
        alt="recipe image"
        class="object-cover w-full h-48"
      />
    </NuxtLink>
    <div class="p-4">
      <h3 class="font-bold text-lg mb-2">{{ props.recipe.title }}</h3>
      <p class="text-gray-700 text-base">
        {{ props.recipe.title }}
      </p>
      <div class="mt-4">
        <span
          class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >{{ totalTimeInMinutes }} min</span
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
import { computed } from "vue";
import type { RecipesResponse } from "~/types/pocketbase";

const props = defineProps<{
  recipe: RecipesResponse;
}>();

const totalTimeInMinutes = computed(() => {
  return Math.round(props.recipe.totalTime / 60);
});
</script>
