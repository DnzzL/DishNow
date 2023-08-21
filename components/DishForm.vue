<template>
  <div class="grid place-items-center">
    <h1 class="text-4xl">New dish</h1>
    <div class="flex">
      <input
        type="text"
        id="steps"
        list="suggestions"
        class="input input-bordered"
        v-model="searchQuery"
      />
      <datalist v-if="suggestions" id="suggestions">
        <option v-for="{ id, title } in suggestions" :key="id">
          {{ title }}
        </option>
      </datalist>
    </div>
    <figure>
      <img
        :src="selectedRecipe?.thumbnailUrl ?? 'https://via.placeholder.com/150'"
        alt="Shoes"
        class="object-cover rounded h-28"
      />
    </figure>
    <form @submit.prevent class="mb-24">
      <label for="title" class="label">Title</label>
      <input
        type="text"
        id="title"
        required
        v-model="title"
        class="input input-bordered"
      />
      <label for="description" class="label">Description</label>
      <input
        type="text"
        id="description"
        v-model="description"
        class="input input-bordered"
      />
      <label for="img" class="label">Images</label>
      <div class="flex flex-wrap">
        <template v-for="file in media">
          <div>
            <img
              :src="getImageUrl(nuxtApp.$pb, file)"
              class="object-cover h-24"
            />
          </div>
        </template>
      </div>
      <p v-if="numberFiles > 0" class="text-gray-500">
        ({{ numberFiles }} / 3) files selected
      </p>
      <DropZone class="w-full" @files-changed="handleMediaChange" />
      <button
        type="submit"
        @click="handleDishCreation"
        :class="['btn', 'btn-primary', 'text-white']"
      >
        Submit
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { RecipesResponse } from "types/pocketbase";

const { getImageUrl, getRecordList } = useDb();

const searchQuery = ref("");
const title = ref("");
const description = ref("");
const media = ref<File[]>([]);

const nuxtApp = useNuxtApp();

const { data: suggestions } = await useAsyncData(
  async (nuxtApp) => {
    const records = (await getRecordList<RecipesResponse>("recipes", {
      page: 1,
      params: {
        filter: `title ~ "${searchQuery.value}" || ingredients.name ?~ "${searchQuery.value}"`,
        fields: "id,title,thumbnailUrl",
      },
    })) as RecipesResponse[];
    return structuredClone(records);
  },
  {
    watch: [searchQuery],
  }
);

const selectedRecipe = computed(() => {
  return suggestions.value?.find((suggestion) => {
    return suggestion.title === searchQuery.value;
  });
});

const numberFiles = computed(() => {
  return media.value.length;
});

function handleMediaChange(files: File[]) {
  media.value = files;
}

function handleDishCreation() {
  // mutate({
  //   title: dishTitle.value,
  //   description: dishDescription.value,
  //   media: dishMedia.value as any,
  //   recipe: recipeId!,
  //   author: store.user?.id,
  // });
}
</script>
