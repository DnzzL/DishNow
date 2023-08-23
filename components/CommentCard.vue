<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center">
        <NuxtLink :href="`/users/${comment.expand?.author.id}`">
          <img
            :src="avatarUrl"
            id="avatar"
            alt="Avatar"
            class="w-8 h-8 rounded-full mr-2"
          />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-780 font-medium">{{
              comment.expand?.author.name
            }}</span>
            a commenté
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
import type { CommentsResponse, UsersResponse } from "~/types/pocketbase";

const { getImageUrl } = useDb();

const props = defineProps<{
  comment: CommentsResponse<{ author: UsersResponse }>;
}>();

const avatarUrl = await getImageUrl(
  props.comment.expand?.author,
  props.comment.expand?.author.avatar
);
</script>
