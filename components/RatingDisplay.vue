<template>
  <div class="flex items-center space-x-2">
    <div class="rating" v-for="(_, i) in Array.from({ length: 5 })">
      <input
        type="radio"
        name="rating-2"
        class="mask mask-star-2 bg-orange-300"
        checked
        v-if="i < stars"
      />
      <input
        type="radio"
        name="rating-2"
        class="mask mask-star-2 bg-gray-300"
        v-else
      />
    </div>
  </div>
</template>

<script setup lang="ts">
type Props = {
  stars: number;
};
defineProps<Props>();
</script>
