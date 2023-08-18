<template>
  <div class="mx-auto max-w-xs">
    <label for="example5" class="mb-1 block text-sm font-medium text-gray-700"
      >Upload file</label
    >
    <label
      class="flex w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-primary-300"
    >
      <div class="space-y-1 text-center">
        <div
          class="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="h-6 w-6 text-gray-500"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>
        <div class="text-gray-600">
          <NuxtLink
            href="#"
            class="font-medium text-primary-500 hover:text-primary-700"
            >Click to upload</NuxtLink
          >
          or drag and drop
        </div>
        <p class="text-sm text-gray-500">
          SVG, PNG, JPG or GIF (max. 800x400px)
        </p>
      </div>
      <input id="dropzone-file" type="file" @change="handleChange" multiple />
    </label>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    maxFiles: number;
  }>(),
  {
    maxFiles: 1,
  }
);

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
