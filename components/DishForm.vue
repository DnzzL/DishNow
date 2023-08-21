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
      <div class="flex flex-col w-full">
        <ul v-if="numberFiles > 0" v-for="(thumbnail, i) in media">
          <li :key="thumbnail.name">
            <div class="flex justify-evenly items-center">
              <p>{{ thumbnail.name }}</p>
              <UButton
                icon="i-tabler-trash-x"
                size="sm"
                variant="soft"
                @click="media.splice(i, 1)"
              />
            </div>
          </li>
        </ul>
        <UploadBox
          @files-changed="handleMediaChange"
          :max-files="3"
          v-if="numberFiles < 3"
        />
      </div>
      <p v-if="numberFiles > 0" class="text-gray-500">
        ({{ numberFiles }} / 3) files selected
      </p>
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
const toast = useToast();
const { createRecord } = useDb();

const { data: suggestions } = await useAsyncData(
  async () => {
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

async function handleDishCreation() {
  try {
    const dish = {
      title: title.value,
      description: description.value,
      media: media.value,
      recipe: selectedRecipe.value?.id!,
      author: nuxtApp.$pb.authStore.model?.id!,
    };

    const createdDish = await createRecord<RecipesResponse>("dishes", dish);
    toast.add({
      title: "Plat créé",
      description: `Votre plat: ${createdDish.title} a bien été créée`,
      icon: "i-tabler-chef-hat",
      color: "green",
    });
  } catch (err) {
    console.log(err);
  }
}
</script>
