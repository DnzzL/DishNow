<template>
  <UCard class="w-full lg:w-1/2">
    <template #header>
      <div class="flex items-center">
        <NuxtLink :href="`/users/${dish.expand?.author.id}`">
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
              dish.expand?.author.name
            }}</span>
            a cuisiné
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
        />
      </NuxtLink>
      <div class="flex justify-between items-center py-2">
        <h3 class="text-lg font-semibold text-gray-800">{{ dish.title }}</h3>
      </div>
      <div class="py-1" v-if="dish.description">
        <p class>{{ dish.description }}</p>
      </div>
    </template>
    <template #footer>
      <p class="text-xs text-gray-500">{{ dish.created }}</p>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { DishesResponse, UsersResponse } from "~/types/pocketbase";

const nuxtApp = useNuxtApp();

const props = defineProps<{
  dish: DishesResponse<{ author: UsersResponse }>;
}>();

const mediaUrl = await getImageUrl(
  nuxtApp.$pb,
  props.dish,
  props.dish.media[0]
);
const avatarUrl = await getImageUrl(
  nuxtApp.$pb,
  props.dish.expand?.author,
  props.dish.expand?.author.avatar
);
</script>
