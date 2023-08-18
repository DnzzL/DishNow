<template>
  <form @submit.prevent="submit">
    <div class="form-control">
      <UploadBox @files-changed="thumbnailChanged" :max-files="1" />
      <button type="submit" class="btn btn-primary text-white">Create</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UploadBox from "./UploadBox.vue";

const thumbnail = ref<File>();

export type StepThreeOutput = {
  thumbnail: File;
};

const emit = defineEmits<{
  (e: "submit", output: StepThreeOutput): void;
}>();

function thumbnailChanged(files: File[]) {
  thumbnail.value = files[0];
}

function submit() {
  emit("submit", { thumbnail: thumbnail.value! });
}
</script>
