<template>
  <NuxtLayout>
    <UContainer>
      <NuxtPage />
    </UContainer>

    <Navbar
      :pathname="pathname"
      class="fixed bottom-0 w-full"
      v-if="!UNLOGGED_ROUTES.includes(pathname)"
    />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute();
const pathname = route.path;
const UNLOGGED_ROUTES = ["/login", "/signup"];
</script>
