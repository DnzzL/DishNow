<template>
  <div class="p-6">
    <div class="flex justify-between">
      <h2 class="text-3xl font-medium">
        {{ dish.title }}
      </h2>
      <UButton
        icon="i-tabler-edit"
        label="Editer"
        variant="soft"
        @click="isOpen = true"
        v-if="dish.expand?.author.id === nuxtApp.$pb.authStore.model?.id"
      />
    </div>
    <div class="flex items-center gap-2 mt-2">
      <NuxtLink :href="`/users/${dish.expand?.author.id}`">
        <UAvatar :src="avatarUrl" :alt="dish.expand?.author.username" />
      </NuxtLink>
      <p>
        <span class="text-gray-700 font-medium">{{
          dish.expand?.author.username
        }}</span>
        a cuisiné
        <NuxtLink :href="`/recipes/${dish.expand?.recipe.id}`">
          <span class="font-medium text-lg">{{
            dish.expand?.recipe.title
          }}</span>
        </NuxtLink>
      </p>
    </div>
    <p>
      {{ dish.description }}
    </p>
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
      <h3 class="text-lg font-medium">Commentaires:</h3>
      <div class="flex flex-col gap-4 mt-2">
        <p class="text-gray-600" v-if="comments.length === 0">
          Pas encore de commentaire.
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
            variant="solid"
            type="submit"
          />
        </form>
      </div>
    </div>

    <UModal v-model="isOpen">
      <div class="py-4">
        <DishForm :dish="dish" :is-editing="true" @done="handleDone" />
      </div>
    </UModal>
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
    recipe: RecipesResponse<{
      tags: TagsResponse[];
      rating: RatingsResponse;
    }>;
    author: UsersResponse;
  }>;
  comments: CommentsResponse<{ author: UsersResponse }>[];
}>();

console.log(useNuxtData("dishes"));

const comment = ref("");
const isOpen = ref(false);

const tagContent = computed(() => {
  return props.dish.expand?.recipe.expand?.tags
    ?.map((tag) => tag.text)
    .join(", ");
});

const avatarUrl = await getImageUrl(
  props.dish.expand?.author,
  props.dish.expand?.author.avatar
);

const mediaUrl = await getImageUrl(props.dish, props.dish.media[0]);

async function handleDone() {
  isOpen.value = false;
  await refreshNuxtData("dishes");
}

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
