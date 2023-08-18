<template>
  <div class="p-6">
    <h2 class="text-xl font-medium">{{ dish.title }}</h2>
    <div class="flex items-center space-x-2 mt-2">
      <div class="flex items-center space-x-1">
        <span class="text-gray-600"
          >{{ dish.expand?.recipe.servings }} servings</span
        >
      </div>
      <div class="flex items-center space-x-1">
        <div class="mt-2">
          <p class="text-gray-600">Tags: {{ tagContent }}</p>
          <p class="text-gray-600">
            Rating: {{ dish.expand?.recipe.expand?.rating?.stars }}/5
          </p>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <div class="grid grid-cols-2 gap-4 mt-2">
        <p class="text-gray-600" v-if="dish.media.length === 0">
          No media yet.
        </p>
        <div
          class="aspect-w-16 aspect-h-9"
          :key="i"
          v-for="(media, i) in dish.media"
        >
          <img
            :src="getDishImageUrl(media)"
            alt="Dish Media"
            class="object-cover w-full h-full rounded-lg"
          />
        </div>
      </div>
    </div>
    <div class="mt-4">
      <h3 class="text-lg font-medium">Comments:</h3>
      <div class="mt-2">
        <p class="text-gray-600" v-if="comments.length === 0">
          No comments yet.
        </p>
        <CommentCard
          :comment="comment"
          :key="comment.id"
          v-for="comment in comments"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  CommentsResponse,
  DishesResponse,
  RatingsResponse,
  RecipesResponse,
  TagsResponse,
  UsersResponse,
} from "~/types/pocketbase";
import CommentCard from "./CommentCard.vue";

const nuxtApp = useNuxtApp();

const props = defineProps<{
  dish: DishesResponse<{
    recipe: RecipesResponse<{ tags: TagsResponse[]; rating: RatingsResponse }>;
  }>;
  comments: CommentsResponse<{ author: UsersResponse }>[];
}>();

async function getDishImageUrl(media: string) {
  return await getImageUrl(nuxtApp.$pb, props.dish, media);
}

const tagContent = computed(() => {
  props.dish.expand?.recipe.expand?.tags?.map((tag) => tag.text).join(", ");
});
</script>
