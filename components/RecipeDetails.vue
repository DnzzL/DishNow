<template>
  <section>
    <div class="py-4">
      <div class="flex flex-col gap-2 p-6">
        <img
          class="h-72 w-full object-cover rounded-lg"
          :src="recipe.thumbnailUrl ?? '/images/placeholder.png'"
          alt="Dish Image"
        />
        <h2 class="text-4xl font-medium">{{ recipe.title }}</h2>
        <NuxtLink :to="recipe.origin" target="_blank" v-if="recipe.origin">
          <UButton
            icon="i-tabler-external-link"
            label="Recette originale"
            variant="soft"
          />
        </NuxtLink>
        <div class="flex items-center space-x-2">
          <UBadge
            :label="`${recipe.servings} personnes`"
            variant="soft"
            color="flamingo"
          />
          <UBadge
            :label="`${recipe.totalTime} minutes`"
            variant="soft"
            color="flamingo"
          />
        </div>
        <div class="flex items-center space-x-2">
          <UBadge
            v-for="tag in recipe.expand?.tags"
            :label="tag.text"
            variant="soft"
            color="jade"
          />
        </div>
        <div class="mt-2">
          <h3 class="text-xl font-medium">Ingredients:</h3>
          <ul class="list-disc list-inside">
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
            <h3 class="text-xl font-medium">Instructions:</h3>
            <ol class="list-decimal list-inside">
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
import type {
  IngredientsResponse,
  InstructionsResponse,
  RecipesResponse,
  TagsResponse,
} from "~/types/pocketbase";

defineProps<{
  recipe: RecipesResponse<{
    ingredients: IngredientsResponse[];
    instructions: InstructionsResponse[];
    tags: TagsResponse[];
  }>;
}>();
</script>
