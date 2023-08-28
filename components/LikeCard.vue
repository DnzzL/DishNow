<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center">
        <NuxtLink :href="`/users/${like.expand?.author.id}`">
          <UAvatar :src="avatarUrl" :alt="like.expand?.author.name" />
        </NuxtLink>
        <div>
          <p>
            <span class="text-gray-700 font-medium">{{
              like.expand?.author.name
            }}</span>
            a noté
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <p class="text-xs text-gray-500">{{ like.created }}</p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { LikesResponse, UsersResponse } from "~/types/pocketbase";

const { getImageUrl } = useDb();

const props = defineProps<{
  like: LikesResponse<{ author: UsersResponse }>;
}>();

const avatarUrl = await getImageUrl(
  props.like.expand?.author,
  props.like.expand?.author.avatar
);
</script>
