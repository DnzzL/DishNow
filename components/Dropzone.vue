<template>
  <div class="flex items-center justify-center w-48">
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer border-primary-300 bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <div class="flex flex-col items-center justify-center pt-5 pb-6">
        <nuxt-icon name="images-outline" class="text-3xl text-primary" filled />
        <p class="mb-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          Ajoutez des photos/vidéos
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        class="hidden"
        @change="handleChange"
        multiple
      />
    </label>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (event: "files-changed", files: File[]): void;
}>();

function handleChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    emit("files-changed", Array.from(files));
  }
}
</script>
