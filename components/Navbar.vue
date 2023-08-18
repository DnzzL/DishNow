<template>
  <div class="px-7 bg-white shadow-lg rounded-2xl">
    <div class="flex">
      <div class="flex-1 group" v-for="{ path, name, iconName } in paths">
        <NuxtLink
          :href="path"
          class="flex items-end justify-center text-center mx-auto px-4 pt-2 w-full text-gray-400 group-hover:text-primary"
        >
          <span
            class="block px-1 pt-1 pb-1"
            :class="[pathname === path ? 'text-primary' : '']"
          >
            <UIcon :name="iconName" />
            <span class="block text-xs pb-2">{{ name }}</span>
            <span
              class="block w-5 mx-auto h-1 group-hover:bg-primary rounded-full"
            ></span>
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
    name: "Home",
    iconName: "i-tabler-home",
  },
  {
    path: "/search",
    name: "Search",
    iconName: "i-tabler-search",
  },
  {
    path: "/recipes",
    name: "Recipes",
    iconName: "i-tabler-bookmark",
  },
  {
    path: "/profile",
    name: "Profile",
    iconName: "i-tabler-user",
  },
];
</script>
