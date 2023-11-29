<template>
  <Navbar>
    <template #action>
      <UButton
        icon="i-tabler-plus"
        label="Plat"
        variant="soft"
        @click="isOpen = true"
      />
    </template>
  </Navbar>
  <main>
    <section class="mb-24 mt-2">
      <div class="space-y-4" v-if="feedItems?.length > 0">
        <div class="grid place-items-center" v-for="item in feedItems">
          <DishCard
            :dish="item.data"
            :likes="likes?.filter((like) => like.dish === item.data.id) ?? []"
            v-if="item.type === Collections.Dishes"
          />
          <RecipeCard
            :recipe="item.data"
            :favorites="
              favorites?.filter(
                (favorite) => favorite.recipe === item.data.id
              ) ?? []
            "
            v-else-if="item.type === Collections.Recipes"
          />
          <CommentCard
            :comment="item.data"
            v-else-if="item.type === Collections.Comments"
          />
        </div>
      </div>
    </section>
    <UModal v-model="isOpen">
      <div class="py-4">
        <DishForm @done="handleDone" />
      </div>
    </UModal>
  </main>
</template>

<script setup lang="ts">
import {
  Collections,
  type CommentsResponse,
  type DishesResponse,
  type FavoritesResponse,
  type LikesResponse,
  type RecipesResponse,
  type UsersResponse,
} from "~/types/pocketbase";

type FeedItemType =
  | Collections.Dishes
  | Collections.Comments
  | Collections.Recipes;

type DishItem = DishesResponse<{
  author: UsersResponse;
  recipe: RecipesResponse;
}>;
type CommentItem = CommentsResponse<{
  author: UsersResponse;
  dish: DishesResponse;
}>;
type RecipeItem = RecipesResponse<{ author: UsersResponse }>;

type FeedItem = {
  id: string;
  type: FeedItemType;
  data: any;
};
const isOpen = ref(false);

const { data: recipes } = await useAsyncData("recipes", async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("recipes")
    .getFullList<RecipeItem>({
      expand: "author",
    })) as RecipeItem[];
  return structuredClone(records);
});

const { data: dishes } = await useAsyncData("dishes", async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("dishes")
    .getFullList<DishItem>({
      expand: "author,recipe",
    })) as DishItem[];
  return structuredClone(records);
});

const { data: comments } = await useAsyncData("comments", async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("comments")
    .getFullList<CommentItem>({
      expand: "author,dish",
    })) as CommentItem[];
  return structuredClone(records);
});

const { data: likes } = await useAsyncData("likes", async (nuxtApp) => {
  const records = await nuxtApp!.$pb
    .collection("likes")
    .getFullList<LikesResponse>();
  return structuredClone(records);
});

const { data: favorites } = await useAsyncData("favorites", async (nuxtApp) => {
  const records = await nuxtApp!.$pb
    .collection("favorites")
    .getFullList<FavoritesResponse>();
  return structuredClone(records);
});

const feedItems = computed(() => {
  return [
    ...recipes.value!.map((recipe) => ({
      id: recipe.id,
      type: Collections.Recipes as FeedItemType,
      data: recipe satisfies RecipesResponse,
    })),
    ...dishes.value!.map((dish) => ({
      id: dish.id,
      type: Collections.Dishes as FeedItemType,
      data: dish satisfies DishesResponse,
    })),
    ...comments.value!.map((comment) => ({
      id: comment.id,
      type: Collections.Comments as FeedItemType,
      data: comment,
    })),
  ].sort((a, b) => {
    return (
      new Date(b.data.created).getTime() - new Date(a.data.created).getTime()
    );
  }) as FeedItem[];
});

async function handleDone() {
  isOpen.value = false;
  await refreshNuxtData("dishes");
}
</script>
