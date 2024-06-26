<template>
  <form
    @submit.prevent="handleDishCreation"
    class="grid place-items-center gap-1"
  >
    <h1 class="text-4xl">{{ isEditing ? "Modifier plat" : "Nouveau plat" }}</h1>
    <div class="flex">
      <input
        type="text"
        id="steps"
        list="suggestions"
        class="input input-bordered"
        v-model="searchQuery"
        required
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
      required
    />
    <label for="img" class="label">Images</label>
    <div class="flex flex-col w-full">
      <ul v-if="numberFiles > 0">
        <li v-for="(thumbnail, i) in media" :key="thumbnail.name">
          <div class="flex justify-evenly items-center">
            <p>{{ thumbnail.name }}</p>
          </div>
        </li>
        <UButton
          icon="i-tabler-trash-x"
          size="sm"
          variant="soft"
          @click="media = undefined"
        />
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
    <div class="flex justify-center my-4">
      <UButton label="Sauvegarder" variant="solid" type="submit" />
    </div>
  </form>
</template>

<script setup lang="ts">
import type {
  DishesRecord,
  DishesResponse,
  RatingsResponse,
  RecipesResponse,
  TagsResponse,
  UsersResponse,
} from "~/types/pocketbase";

const { getRecordList } = useDb();

const searchQuery = ref("");
const title = ref("");
const description = ref("");
const media = ref<FileList>();

const nuxtApp = useNuxtApp();
const toast = useToast();
const { createRecord, updateRecord } = useDb();
const { castAsFormData } = useForm();

// define props so that the form can have initial values
const props = withDefaults(
  defineProps<{
    dish?: DishesResponse<{
      recipe: RecipesResponse<{
        tags: TagsResponse[];
        rating: RatingsResponse;
      }>;
      author: UsersResponse;
    }>;
    isEditing?: boolean;
  }>(),
  {
    isEditing: false,
  }
);

onMounted(() => {
  searchQuery.value = props.dish?.expand?.recipe?.title ?? "";
  title.value = props.dish?.title ?? "";
  description.value = props.dish?.description ?? "";
  media.value = props.dish?.media ?? undefined;
});

const emit = defineEmits<{
  (event: "done"): void;
}>();

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
  return media.value?.length ?? 0;
});

function handleMediaChange(files: FileList) {
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

    const formData = castAsFormData(dish) as unknown as DishesRecord;

    if (props.isEditing) {
      await updateRecord("dishes", props.dish?.id!, formData);
      toast.add({
        title: "Plat modifié",
        description: `Votre plat: ${title.value} a bien été modifié`,
        icon: "i-tabler-chef-hat",
        color: "green",
      });
      emit("done");
      return;
    } else {
      const createdDish = await createRecord<RecipesResponse>(
        "dishes",
        formData
      );
      toast.add({
        title: "Plat créé",
        description: `Votre plat: ${createdDish.title} a bien été créée`,
        icon: "i-tabler-chef-hat",
        color: "green",
      });
      emit("done");
      return;
    }
  } catch (err) {
    console.log(err);
  }
}
</script>
