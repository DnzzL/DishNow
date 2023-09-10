<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center">
        <NuxtLink :href="`/users/${rating.expand?.author.id}`">
          <UAvatar :src="avatarUrl" :alt="rating.expand?.author.username" />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-700 font-medium">{{
              rating.expand?.author.username
            }}</span>
            a noté
            <span class="font-medium"> {{ rating.expand?.recipe.title }}</span>
          </p>
        </div>
      </div>
    </template>
    <template #default>
      <NuxtLink :href="`/recipes/${rating.recipe}`">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-medium">{{ rating.expand?.recipe.title }}</h2>
          <RatingDisplay :stars="rating.stars" />
        </div>
        <div class="mt-4 text-gray-600 text-sm">{{ rating.details }}</div>
      </NuxtLink>
    </template>
    <template #footer>
      <p class="text-xs text-gray-500">{{ rating.created }}</p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type {
  RatingsResponse,
  RecipesResponse,
  UsersResponse,
} from "~/types/pocketbase";

const { getImageUrl } = useDb();

const props = defineProps<{
  rating: RatingsResponse<{ author: UsersResponse; recipe: RecipesResponse }>;
}>();

const avatarUrl = await getImageUrl(
  props.rating.expand?.author,
  props.rating.expand?.author.avatar
);
</script>
