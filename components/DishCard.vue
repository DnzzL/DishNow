<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center gap-2">
        <NuxtLink :href="`/users/${dish.expand?.author.id}`">
          <UAvatar :src="avatarUrl" :alt="dish.expand?.author.username" />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-700 font-medium">{{
              dish.expand?.author.username
            }}</span>
            a cuisiné
            <span class="font-medium">{{ dish.expand?.recipe.title }}</span>
          </p>
        </div>
      </div>
    </template>
    <template #default>
      <NuxtLink :href="`/dishes/${dish.id}`">
        <img
          class="w-full h-48 object-cover"
          :src="dish.media?.length > 0 ? mediaUrl : ''"
          alt="Dish Image"
          v-if="dish.media?.length > 0"
        />
        <div
          class="flex items-center justify-center w-full h-48 bg-gray-300 rounded dark:bg-gray-700"
          v-else
        >
          <svg
            class="w-10 h-10 text-gray-200 dark:text-gray-600"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 18"
          >
            <path
              d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z"
            />
          </svg>
        </div>
      </NuxtLink>
      <div class="flex justify-between items-center py-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ dish.title }}</h3>
      </div>
      <div class="py-1" v-if="dish.description">
        <p class>{{ dish.description }}</p>
      </div>
    </template>
    <template #footer>
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">{{ dish.created }}</p>
        <UButton
          :icon="isLiked ? 'i-tabler-thumb-up-filled' : 'i-tabler-thumb-up'"
          variant="soft"
          :label="likeCount"
          @click="toggleLike"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type {
  DishesResponse,
  LikesResponse,
  RecipesResponse,
  UsersResponse,
} from "~/types/pocketbase";

const nuxtApp = useNuxtApp();
const { getImageUrl, updateRecord, createRecord } = useDb();

const props = defineProps<{
  dish: DishesResponse<{ author: UsersResponse; recipe: RecipesResponse }>;
  likes: LikesResponse[];
}>();

const mediaUrl = await getImageUrl(props.dish, props.dish.media[0]);
const avatarUrl = await getImageUrl(
  props.dish.expand?.author,
  props.dish.expand?.author.avatar
);

const authorLike = computed(() => {
  return props.likes?.find(
    (like) => like.author === nuxtApp.$pb.authStore.model?.id
  );
});
const isLiked = ref(authorLike.value?.like ?? false);
const likeCount = ref(props.likes.filter((like) => like.like).length);

async function toggleLike() {
  if (authorLike.value) {
    updateRecord("likes", authorLike.value.id, {
      like: !authorLike.value.like,
    });
  } else {
    await createRecord<LikesResponse>("likes", {
      like: true,
      dish: props.dish.id,
      author: nuxtApp.$pb.authStore.model?.id!,
    });
  }
  isLiked.value = !isLiked.value;
  isLiked.value ? likeCount.value++ : likeCount.value--;
  await refreshNuxtData("likes");
}
</script>
