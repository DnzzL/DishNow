<template>
  <Navbar>
    <template #action>
      <UButton
        icon="i-tabler-bookmark-plus"
        label="Recette"
        variant="soft"
        @click="isOpen = true"
      />
    </template>
  </Navbar>
  <main class="pb-12">
    <div class="flex flex-row justify-between align-middle">
      <h1 class="text-4xl font-cal font-bold mt-2 mb-5">Mes recettes</h1>
    </div>
    <UModal v-model="isOpen">
      <div class="py-4">
        <RecipeForm @done="handleDone" />
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
  </main>
</template>

<script setup lang="ts">
import { RecipesResponse, UsersResponse } from "~/types/pocketbase";

const nuxtApp = useNuxtApp();

const user = nuxtApp.$pb.authStore.model as unknown as UsersResponse;
const isOpen = ref(false);

const { data: recipes } = await useAsyncData("recipes", async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("recipes")
    .getFullList<RecipesResponse>({
      sort: "-created",
      filter: `author.id = '${user.id}'`,
    })) as RecipesResponse[];
  return structuredClone(records);
});

async function handleDone() {
  isOpen.value = false;
  await refreshNuxtData("recipes");
}
</script>
