<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center">
        <NuxtLink :href="`/users/${rating.expand?.author.id}`">
          <img
            :src="avatarUrl"
            id="avatar"
            alt="Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-780 font-medium">{{
              rating.expand?.author.name
            }}</span>
            a noté
          </p>
        </div>
      </div>
    </template>
    <template #default>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-medium">{{ rating.expand?.recipe.title }}</h2>
        <div class="flex items-center space-x-2">
          <div class="rating" v-for="(_, i) in Array.from({ length: 5 })">
            <input
              type="radio"
              name="rating-2"
              class="mask mask-star-2 bg-orange-300"
              checked
              v-if="i < rating.stars"
            />
            <input
              type="radio"
              name="rating-2"
              class="mask mask-star-2 bg-gray-300"
              v-else
            />
          </div>
        </div>
      </div>
      <div class="mt-4 text-gray-600 text-sm">{{ rating.details }}</div>
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

const nuxtApp = useNuxtApp();

const props = defineProps<{
  rating: RatingsResponse<{ author: UsersResponse; recipe: RecipesResponse }>;
}>();

const avatarUrl = await getImageUrl(
  nuxtApp.$pb,
  props.rating.expand?.author,
  props.rating.expand?.author.avatar
);
</script>
