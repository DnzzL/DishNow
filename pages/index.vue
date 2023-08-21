<template>
  <main>
    <UButton icon="i-tabler-plus" variant="soft" @click="isOpen = true" />
    <HomeFeed />
    <UModal v-model="isOpen">
      <div class="py-4">
        <DishForm @done="isOpen = false" />
      </div>
    </UModal>
  </main>
</template>

<script setup lang="ts">
const isOpen = ref(false);
</script>
