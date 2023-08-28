<template>
  <form @submit.prevent="submit">
    <div
      class="p-2 flex items-center flex-col gap-2"
      v-if="fetchedThumbnailUrl"
    >
      <p class="text-xl">Image récupérée</p>
      <img :src="fetchedThumbnailUrl" class="w-64 h-64 object-cover" />
    </div>
    <div v-else>
      <ul v-if="thumbnail">
        <li :key="thumbnail.name">
          <div class="flex justify-evenly items-center">
            <p>{{ thumbnail.name }}</p>
            <UButton
              icon="i-tabler-trash-x"
              size="sm"
              variant="soft"
              @click="thumbnail = undefined"
            />
          </div>
          <img :src="displayedThumbnail" />
        </li>
      </ul>
      <UploadBox @files-changed="thumbnailChanged" :max-files="1" v-else />
    </div>
    <div class="flex justify-center my-4">
      <UButton label="Créer" variant="solid" type="submit" />
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  fetchedThumbnailUrl: string | undefined;
}>();

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

const displayedThumbnail = computed(() => {
  return URL.createObjectURL(thumbnail.value!);
});

function submit() {
  emit("submit", { thumbnail: thumbnail.value! });
}
</script>
