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

const { getRecordById, getRecordFullList } = useDb();
const route = useRoute();
const id = route.params.id as string;

type Dish = DishesResponse<{
  author: UsersResponse;
  recipe: RecipesResponse<{
    tags: TagsResponse[];
    rating: RatingsResponse;
  }>;
}>;

const { data: dish } = await useAsyncData(async () => {
  const records = (await getRecordById<Dish>("dishes", id, {
    expand: "recipe,author",
  })) as Dish;
  return structuredClone(records);
});

type Comment = CommentsResponse<{ author: UsersResponse }>;

const { data: comments } = await useAsyncData(async () => {
  const records = (await getRecordFullList<Comment>("comments", {
    filter: `dish.id = '${id}'`,
    expand: "author",
  })) as Comment[];
  return structuredClone(records);
});
</script>
