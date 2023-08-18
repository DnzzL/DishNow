<template>
  <section>
    <div class="py-4">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <img
          class="h-72 w-full object-cover rounded-lg"
          :src="recipe.thumbnailUrl ?? '/images/placeholder.png'"
          alt="Dish Image"
        />
        <h2 class="text-4xl font-medium">{{ recipe.title }}</h2>
        <div class="flex items-center space-x-2 mt-2">
          <div class="flex items-center space-x-1">
            <i class="mdi mdi-chef-hat-outline text-gray-600"></i>
            <span
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >{{ recipe.servings }} servings</span
            >
          </div>
          <div class="flex items-center space-x-1">
            <i class="mdi mdi-clock-outline text-gray-600"></i>
            <span
              class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
              >{{ recipe.totalTime }} minutes</span
            >
          </div>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-medium">Ingredients:</h3>
          <ul class="list-disc list-inside mt-2">
            <li
              class="text-gray-600"
              v-if="recipe.expand?.ingredients.length === 0"
            >
              No ingredients
            </li>
            <li
              v-else
              :key="ingredient.id"
              v-for="ingredient in recipe.expand?.ingredients"
            >
              {{ ingredient.name }}
            </li>
          </ul>
          <div class="mt-4">
            <h3 class="text-lg font-medium">Instructions:</h3>
            <ol class="list-decimal list-inside mt-2">
              <li
                class="text-gray-600"
                v-if="recipe.expand?.instructions.length === 0"
              >
                No instructions
              </li>
              <li
                v-else
                :key="instruction.id"
                v-for="instruction in recipe.expand?.instructions"
              >
                {{ instruction.text }}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  IngredientsResponse,
  InstructionsResponse,
  RecipesResponse,
} from "~/types/pocketbase";

const props = defineProps<{
  recipe: RecipesResponse<{
    ingredients: IngredientsResponse[];
    instructions: InstructionsResponse[];
  }>;
}>();

const timeInMinutes = Math.round(props.recipe.totalTime / 60);
</script>
