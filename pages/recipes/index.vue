<template>
  <div>
    <div class="flex flex-row justify-between align-middle">
      <h1 class="text-4xl font-cal font-bold mt-2 mb-5">Mes recettes</h1>
      <UButton icon="i-tabler-plus" variant="soft" @click="isOpen = true" />
    </div>
    <UModal v-model="isOpen" @click="handleModalOpen">
      <div class="py-4">
        <RecipeForm @done="isOpen = false" />
      </div>
    </UModal>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 pb-16">
      <NuxtLink
        :href="`/recipes/${recipe.id}`"
        :key="recipe.id"
        v-for="recipe in recipes"
      >
        <RecipeCard :recipe="recipe" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RecipesResponse } from "~/types/pocketbase";

const isOpen = ref(false);

const { data: recipes } = await useAsyncData(async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("recipes")
    .getFullList<RecipesResponse>()) as RecipesResponse[];
  return structuredClone(records);
});

function handleModalOpen() {
  isOpen.value = true;
}
</script>
