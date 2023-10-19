<template>
  <div class="flex items-center flex-col">
    <h1 class="text-4xl">
      {{ isEditing ? "Modifier recette" : "Nouvelle recette" }}
    </h1>
    <UForm
      ref="form"
      :schema="schema"
      :state="state"
      @submit.prevent="saveRecipe"
    >
      <UFormGroup label="Source recette" name="source">
        <USelect
          v-model="state.source"
          :options="sources"
          option-attribute="name"
        />
      </UFormGroup>
      <div v-if="state.source === 'website'">
        <UFormGroup label="Site web" name="url">
          <UInput v-model="state.url" />
        </UFormGroup>
        <UButton type="button" @click="fetchRecipe">Fetch recipe data</UButton>
      </div>
      <div v-else>
        <UFormGroup label="Titre" name="title">
          <UInput v-model="state.title" />
        </UFormGroup>
        <UFormGroup label="Couverts" name="servings">
          <UInput v-model="state.servings" type="number" />
        </UFormGroup>
        <UFormGroup label="Temps total" name="totalTime">
          <UInput v-model="state.totalTime" type="number" />
        </UFormGroup>
        <UFormGroup label="Ingrédients" name="ingredients">
          <TextAreaInput
            :model-value="state.ingredients.join('\n')"
            @input="(event: Event) => (state.ingredients = textAreaToArray(event))"
          />
        </UFormGroup>
        <UFormGroup label="Instructions" name="instructions">
          <TextAreaInput
            :model-value="state.instructions.join('\n')"
            @input="(event: Event) => (state.instructions = textAreaToArray(event))"
          />
        </UFormGroup>
        <UFormGroup label="Tags" name="tags">
          <CustomTagsInput v-model="state.tags" />
        </UFormGroup>
      </div>
      <UButton variant="solid" type="submit">Submit</UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import type {
  IngredientsResponse,
  InstructionsResponse,
  RecipesRecord,
  RecipesResponse,
  TagsResponse,
} from "~/types/pocketbase";

const nuxtApp = useNuxtApp();
const toast = useToast();
const {
  createIngredients,
  createInstructions,
  createTags,
  createRecord,
  updateRecord,
} = useDb();
const { castAsFormData } = useForm();

const props = withDefaults(
  defineProps<{
    recipe?: RecipesResponse<{
      ingredients: IngredientsResponse[];
      instructions: InstructionsResponse[];
      tags: TagsResponse[];
    }>;
    isEditing?: boolean;
  }>(),
  {
    isEditing: false,
  }
);

onMounted(() => {
  if (!!props.recipe) {
    state.value = {
      source: "manual",
      url: "",
      title: props.recipe.title,
      servings: props.recipe.servings,
      totalTime: props.recipe.totalTime,
      ingredients: props.recipe.expand?.ingredients.map((i) => i.name) ?? [],
      instructions: props.recipe.expand?.instructions.map((i) => i.text) ?? [],
      tags: props.recipe.expand?.tags.map((t) => t.text) ?? [],
      thumbnail: props.recipe.thumbnail,
    };
  }
});

const emit = defineEmits<{
  (e: "done"): void;
}>();

const sources = [
  {
    name: "Site web",
    value: "website",
  },
  {
    name: "Manuel",
    value: "manual",
  },
];

const form = ref();
const schema = z.object({
  source: z.enum(["website", "manual"]),
  url: z.string().url().optional(),
  title: z.string().min(3, "Minimum 3 caractères"),
  servings: z.number().min(1, "Minimum 1 portion"),
  totalTime: z.number().min(1, "Minimum 1 minute"),
  ingredients: z.array(z.string()).min(1, "Minimum 1 ingrédient"),
  instructions: z.array(z.string()).min(1, "Minimum 1 instruction"),
  tags: z.array(z.string()).optional(),
  thumbnail: z.any().optional(),
});

const state = ref({
  source: "website",
  url: "",
  title: "",
  servings: 0,
  totalTime: 0,
  ingredients: [] as string[],
  instructions: [] as string[],
  tags: [] as string[],
  thumbnail: null as File | null,
});

function textAreaToArray(event: Event) {
  const target = event.target as HTMLTextAreaElement;
  const value = target.value;
  return value.split("\n").filter(Boolean);
}

async function getFileFromUrl(url: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], "filename");
}

async function fetchRecipe() {
  let endpoint = "";
  switch (true) {
    case state.value.url?.includes("marmiton.org"):
      endpoint = "/api/marmiton";
      break;
    case state.value.url?.includes("journaldesfemmes.fr"):
      endpoint = "/api/journaldesfemmes";
      break;
    case state.value.url?.includes("jow.fr"):
      endpoint = "/api/jow";
      break;
    case state.value.url?.includes("750g.com"):
      endpoint = "/api/750g";
      break;
    case state.value.url?.includes("cookomix.com"):
      endpoint = "/api/cookomix";
      break;
    case state.value.url?.includes("instagram.com"):
      endpoint = "/api/instagram";
      break;
    default:
      toast.add({
        title: "Erreur",
        description: "Le site n'est pas supporté",
        icon: "i-tabler-circle-x",
        color: "red",
      });
      return;
  }
  try {
    const response = $fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ url: state.value.url }),
    });
    const recipe = (await response) as any;
    const thumbnail = await getFileFromUrl(recipe.thumbnailUrl);
    state.value = { ...state.value, ...recipe, thumbnail };
  } catch (err) {
    console.log(err);
  }
}

async function saveRecipe() {
  try {
    const createdIngredients = await createIngredients(state.value.ingredients);
    const createdInstructions = await createInstructions(
      state.value.instructions
    );
    const createdTagIds = await createTags(state.value.tags);

    const recipe = {
      author: nuxtApp.$pb.authStore.model?.id!,
      title: state.value.title,
      servings: state.value.servings,
      ingredients: createdIngredients,
      instructions: createdInstructions,
      tags: createdTagIds,
      totalTime: state.value.totalTime,
      thumbnail: state.value.thumbnail,
    };

    const formData = castAsFormData(recipe) as unknown as RecipesRecord;

    if (props.isEditing) {
      await updateRecord("recipes", props.recipe?.id!, formData);
      toast.add({
        title: "Recette modifiée",
        description: `Votre recette de ${state.value.title} a bien été modifiée`,
        icon: "i-tabler-chef-hat",
        color: "green",
      });
      emit("done");
      return;
    } else {
      const createdRecipe = await createRecord<RecipesResponse>(
        "recipes",
        formData
      );
      toast.add({
        title: "Recette créée",
        description: `Votre recette de ${createdRecipe.title} a bien été créée`,
        icon: "i-tabler-circle-check",
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
