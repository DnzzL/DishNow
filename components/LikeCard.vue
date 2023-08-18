<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center">
        <NuxtLink :href="`/users/${like.expand?.author.id}`">
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

const nuxtApp = useNuxtApp();

const props = defineProps<{
  like: LikesResponse<{ author: UsersResponse }>;
}>();

const avatarUrl = await getImageUrl(
  nuxtApp.$pb,
  props.like.expand?.author,
  props.like.expand?.author.avatar
);
</script>
