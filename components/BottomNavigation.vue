<template>
  <div class="px-7 bg-white shadow-lg rounded-2xl">
    <div class="flex">
      <div class="flex-1 group" v-for="{ path, name, iconName } in paths">
        <NuxtLink
          :href="path"
          class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-primary"
        >
          <span class="block px-1 pt-1 pb-1">
            <UIcon :name="iconName" />
            <span class="block text-xs pb-2">{{ name }}</span>
          </span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const pathname = route.path;

const paths = [
  {
    path: "/",
    name: "Actus",
    iconName: "i-tabler-news",
  },
  {
    path: "/search",
    name: "Recherche",
    iconName: "i-tabler-search",
  },
  {
    path: "/recipes",
    name: "Recettes",
    iconName: "i-tabler-bookmark",
  },
  {
    path: "/profile",
    name: "Profil",
    iconName: "i-tabler-user",
  },
];
</script>
