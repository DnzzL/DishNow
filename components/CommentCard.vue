<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center gap-2">
        <NuxtLink :href="`/users/${comment.expand?.author.id}`">
          <UAvatar :src="avatarUrl" :alt="comment.expand?.author.username" />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-700 font-medium">{{
              comment.expand?.author.username
            }}</span>
            a commenté
            <span class="font-medium"> {{ comment.expand?.dish?.title }}</span>
          </p>
        </div>
      </div>
    </template>
    <template #default>
      <NuxtLink :href="`/dishes/${comment.dish}`">
        <p>{{ comment.text }}</p>
      </NuxtLink>
    </template>
    <template #footer>
      <p class="text-xs text-gray-500">{{ comment.created }}</p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type {
  CommentsResponse,
  DishesResponse,
  UsersResponse,
} from "~/types/pocketbase";

const { getImageUrl } = useDb();

const props = defineProps<{
  comment: CommentsResponse<{ author: UsersResponse; dish: DishesResponse }>;
}>();

const avatarUrl = await getImageUrl(
  props.comment.expand?.author,
  props.comment.expand?.author.avatar
);
</script>
