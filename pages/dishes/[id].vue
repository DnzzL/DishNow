<template>
  <DishDetails :dish="dish" :comments="comments" v-if="dish && comments" />
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
import { getRecordById, getRecordFullList } from "~/utils/pocketbase";

const route = useRoute();
const id = route.params.id as string;

type Dish = DishesResponse<{
  recipe: RecipesResponse<{ tags: TagsResponse[]; rating: RatingsResponse }>;
}>;

const { data: dish } = await useAsyncData(async (nuxtApp) => {
  const records = (await getRecordById<Dish>(nuxtApp!.$pb, "dishes", id, {
    expand: "recipe",
  })) as Dish;
  return structuredClone(records);
});

type Comment = CommentsResponse<{ author: UsersResponse }>;

const { data: comments } = await useAsyncData(async (nuxtApp) => {
  const records = (await getRecordFullList<Comment>(nuxtApp!.$pb, "comments", {
    filter: `dish.id = '${id}'`,
    expand: "author",
  })) as Comment[];
  return structuredClone(records);
});
</script>
