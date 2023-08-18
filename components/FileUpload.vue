<template>
  <!-- <div v-bind="api.rootProps">
    <div v-bind="api.dropzoneProps">
      <input v-bind="api.hiddenInputProps" />
      Drag your files here
    </div>

    <button v-bind="api.triggerProps">Choose Files...</button>

    <ul>
      <li v-for="file in api.files" :key="file.name">
        <div>{{ file.name }}</div>
        <button v-bind="api.getDeleteTriggerProps({ file })" }>Delete</button>
      </li>
    </ul>
  </div> -->

  <div class="flex items-center justify-center w-full" v-bind="api.rootProps">
    <label
      for="dropzone-file"
      class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
    >
      <div
        class="flex flex-col items-center justify-center pt-5 pb-6"
        v-bind="api.dropzoneProps"
      >
        <svg
          class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
          <button v-bind="api.triggerProps">Choose Files...</button> or drag and
          drop
        </p>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          SVG, PNG, JPG or GIF (MAX. 800x400px)
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        class="hidden"
        v-bind="api.hiddenInputProps"
      />
    </label>
    <ul>
      <li v-for="file in api.files" :key="file.name">
        <div>{{ file.name }}</div>
        <button v-bind="api.getDeleteTriggerProps({ file })" }>Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import * as fileUpload from "@zag-js/file-upload";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed } from "vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const [state, send] = useMachine(fileUpload.machine({ id: props.id }));

const api = computed(() =>
  fileUpload.connect(state.value, send, normalizeProps)
);
</script>
