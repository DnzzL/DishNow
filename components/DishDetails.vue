<template>
  <div class="p-6">
    <h2 class="text-3xl font-medium">{{ dish.title }}</h2>
    <div class="flex items-center space-x-2 mt-2">
      <div class="flex items-center flex-col gap-2">
        <span class="text-gray-600"
          >{{ dish.expand?.recipe.servings }} servings</span
        >
        <span class="text-gray-600" v-if="tagContent?.length > 0"
          >Tags: {{ tagContent }}</span
        >
        <RatingDisplay
          :stars="dish.expand?.recipe.expand?.rating?.stars"
          v-if="dish.expand?.recipe.expand?.rating?.stars"
        />
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
            :src="mediaUrl"
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
        <form @submit.prevent="save">
          <TextAreaInput v-model="comment" />
          <UButton
            icon="i-tabler-send"
            color="primary"
            variant="soft"
            type="submit"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import type {
  CommentsResponse,
  DishesResponse,
  RatingsResponse,
  RecipesResponse,
  TagsResponse,
  UsersResponse,
} from "~/types/pocketbase";
import CommentCard from "./CommentCard.vue";

const { createRecord, getImageUrl } = useDb();

const nuxtApp = useNuxtApp();
const toast = useToast();

const props = defineProps<{
  dish: DishesResponse<{
    recipe: RecipesResponse<{ tags: TagsResponse[]; rating: RatingsResponse }>;
  }>;
  comments: CommentsResponse<{ author: UsersResponse }>[];
}>();

const comment = ref("");

const tagContent = computed(() => {
  return props.dish.expand?.recipe.expand?.tags
    ?.map((tag) => tag.text)
    .join(", ");
});

const mediaUrl = await getImageUrl(props.dish, props.dish.media[0]);

async function save() {
  try {
    await createRecord("comments", {
      text: comment.value,
      dish: props.dish.id,
      author: nuxtApp.$pb.authStore.model?.id!,
    });
    comment.value = "";
    await refreshNuxtData("comments");
  } catch (error) {
    if (error instanceof ClientResponseError) {
      toast.add({
        title: "Une erreur est survenue",
        description: error.data.message,
        icon: "i-tabler-circle-x",
        color: "red",
      });
    }
  }
}
</script>
