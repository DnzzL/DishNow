<template>
  <div class="mx-auto max-w-xs">
    <label for="example5" class="mb-1 block text-sm font-medium text-gray-700"
      >Upload file</label
    >
    <label
      class="flex flex-col w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-primary-300"
    >
      <div class="space-y-1 text-center">
        <div
          class="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100"
        >
          <UIcon
            name="i-tabler-file-upload"
            class="text-2xl text-primary-500"
          />
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
      <input
        id="dropzone-file"
        type="file"
        @change="handleChange"
        multiple
        :max="maxFiles"
        class="hidden"
      />
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
  (event: "files-changed", files: FileList): void;
}>();

function handleChange(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (files) {
    emit("files-changed", files);
  }
}
</script>
