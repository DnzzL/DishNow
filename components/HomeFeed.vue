<template>
  <section class="mb-24 mt-6">
    <div class="space-y-4" v-if="feedItems?.length > 0">
      <div class="grid place-items-center" v-for="item in feedItems">
        <DishCard :dish="item.data" v-if="item.type === Collections.Dishes" />
        <CommentCard
          :comment="item.data"
          v-else-if="item.type === Collections.Comments"
        />
        <LikeCard
          :like="item.data"
          v-else-if="item.type === Collections.Likes"
        />

        <RatingCard
          :rating="item.data"
          v-else-if="item.type === Collections.Ratings"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import {
  Collections,
  CommentsResponse,
  DishesResponse,
  LikesResponse,
  RatingsResponse,
  RecipesResponse,
  UsersResponse,
} from "~/types/pocketbase";
import CommentCard from "./CommentCard.vue";
import DishCard from "./DishCard.vue";
import LikeCard from "./LikeCard.vue";
import RatingCard from "./RatingCard.vue";

type FeedItemType =
  | Collections.Dishes
  | Collections.Comments
  | Collections.Likes
  | Collections.Ratings;

type DishItem = DishesResponse<{ author: UsersResponse }>;
type CommentItem = CommentsResponse<{
  author: UsersResponse;
  recipe: RecipesResponse;
}>;
type LikesItem = LikesResponse<{ author: UsersResponse }>;
type RatingsItem = RatingsResponse<{
  author: UsersResponse;
  recipe: RecipesResponse;
}>;

type FeedItem = {
  id: string;
  type: FeedItemType;
  data: any;
};

const { data: dishes } = await useAsyncData(async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("dishes")
    .getFullList<DishItem>({
      expand: "author",
    })) as DishItem[];
  return structuredClone(records);
});

const { data: comments } = await useAsyncData(async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("comments")
    .getFullList<CommentItem>({
      expand: "author,recipe",
    })) as CommentItem[];
  return structuredClone(records);
});

const { data: likes } = await useAsyncData(async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("likes")
    .getFullList<LikesItem>({
      expand: "author",
    })) as LikesItem[];
  return structuredClone(records);
});

const { data: ratings } = await useAsyncData(async (nuxtApp) => {
  const records = (await nuxtApp!.$pb
    .collection("ratings")
    .getFullList<RatingsItem>({
      expand: "author,recipe",
    })) as RatingsItem[];
  return structuredClone(records);
});

const feedItems = computed(() => {
  return dishes.value &&
    comments.value &&
    likes.value &&
    ratings.value &&
    likes.value
    ? ([
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
        ...likes.value!.map((like) => ({
          id: like.id,
          type: Collections.Likes as FeedItemType,
          data: like,
        })),
        ...ratings.value!.map((rating) => ({
          id: rating.id,
          type: Collections.Ratings as FeedItemType,
          data: rating,
        })),
      ].sort(
        (a, b) =>
          new Date(a.data.created).getUTCMilliseconds() -
          new Date(b.data.created).getUTCMilliseconds()
      ) as FeedItem[])
    : [];
});
</script>
