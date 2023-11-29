<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center gap-2">
        <NuxtLink :href="`/users/${recipe.expand?.author.id}`">
          <UAvatar :src="avatarUrl" :alt="recipe.expand?.author.username" />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-700 font-medium">{{
              recipe.expand?.author.username
            }}</span>
            a enregistré
            <span class="font-medium">{{ recipe.title }}</span>
          </p>
        </div>
      </div>
    </template>
    <template #default>
      <NuxtLink :href="`/recipes/${recipe.id}`">
        <img
          :src="props.recipe.thumbnailUrl"
          alt="recipe image"
          class="object-cover w-full h-48"
          v-if="props.recipe.thumbnailUrl"
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
    </template>
    <template #footer>
      <div class="flex items-center justify-between">
        <p class="text-xs text-gray-500">{{ recipe.created }}</p>
        <UButton
          :icon="isFavorite ? 'i-tabler-heart-filled' : 'i-tabler-heart'"
          variant="soft"
          :label="favoriteCount"
          @click="toggleFavorite"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type {
  FavoritesResponse,
  RecipesResponse,
  UsersResponse,
} from "~/types/pocketbase";

const nuxtApp = useNuxtApp();
const { getImageUrl, updateRecord, createRecord } = useDb();

const props = defineProps<{
  recipe: RecipesResponse<{ author: UsersResponse }>;
  favorites: FavoritesResponse[];
}>();

const mediaUrl = await getImageUrl(props.recipe, props.recipe.thumbnailUrl);
const avatarUrl = await getImageUrl(
  props.recipe.expand?.author,
  props.recipe.expand?.author.avatar
);

const authorFavorite = computed(() => {
  return props.favorites?.find(
    (favorite) => favorite.author === nuxtApp.$pb.authStore.model?.id
  );
});
const isFavorite = ref(authorFavorite.value?.favorite ?? false);
const favoriteCount = ref(
  props.favorites.filter((favorite) => favorite.favorite).length
);

async function toggleFavorite() {
  if (authorFavorite.value) {
    updateRecord("favorites", authorFavorite.value.id, {
      favorite: !authorFavorite.value.favorite,
    });
  } else {
    await createRecord<FavoritesResponse>("favorites", {
      favorite: true,
      recipe: props.recipe.id,
      author: nuxtApp.$pb.authStore.model?.id!,
    });
  }
  isFavorite.value = !isFavorite.value;
  isFavorite.value ? favoriteCount.value++ : favoriteCount.value--;
  await refreshNuxtData("favorites");
}
</script>
