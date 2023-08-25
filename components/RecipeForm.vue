<template>
  <div class="flex items-center flex-col">
    <p v-if="state.context.errorMessage">{{ state.context.errorMessage }}</p>
    <RecipeFormStepOne
      @submit="handleStepOneSubmit"
      v-if="state.value?.enteringOrigin"
    />
    <RecipeFormStepTwo
      :pb="nuxtApp.$pb"
      :origin="origin"
      :partialRecipe="partialRecipe!"
      @submit="handleStepTwoSubmit"
      v-if="state.value?.enteringContent === 'idle'"
    />
    <RecipeFormStepThree
      :fetchedThumbnailUrl="partialRecipe?.thumbnailUrl"
      @submit="handleStepThreeSubmit"
      v-if="state.value?.enteringMedia === 'idle'"
    />
    <button
      class="btn btn-primary text-white btn-circle btn-sm mt-2"
      @click="send('BACK')"
      type="button"
      v-if="state.value?.enteringOrigin !== 'idle'"
    >
      <UIcon name="i-tabler-arrow-left" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "@xstate/vue";
import { ref } from "vue";
import newRecipeFormMachine from "~/machines/newRecipeForm";
import type { RecipesRecord, RecipesResponse } from "~/types/pocketbase";
import type { StepOneOutput } from "./RecipeFormStepOne.vue";
import RecipeFormStepOne from "./RecipeFormStepOne.vue";
import RecipeFormStepThree, {
  StepThreeOutput,
} from "./RecipeFormStepThree.vue";
import type { StepTwoOutput } from "./RecipeFormStepTwo.vue";
import RecipeFormStepTwo from "./RecipeFormStepTwo.vue";

const { state, send } = useMachine(newRecipeFormMachine);

const nuxtApp = useNuxtApp();
const toast = useToast();
const { createIngredients, createInstructions, createTags, createRecord } =
  useDb();
const { castAsFormData } = useForm();

const emit = defineEmits<{
  (e: "done"): void;
}>();

const origin = ref("");
const url = ref<string>();
const partialRecipe = ref<Partial<RecipesRecord>>();
const title = ref("");
const servings = ref(0);
const totalTime = ref(0);
const ingredients = ref<string[]>([]);
const ingredientIds = ref<string[]>([]);
const instructions = ref<string[]>([]);
const instructionIds = ref<string[]>([]);
const thumbnail = ref<File>();
const tagIds = ref<string[]>([]);

async function handleStepOneSubmit({
  url: stepOneUrl,
  origin: stepOneOrigin,
}: StepOneOutput) {
  try {
    url.value = stepOneUrl;
    origin.value = stepOneOrigin;
    if (stepOneOrigin === "external") {
      partialRecipe.value = await fetchRecipe();
      if (!!partialRecipe) {
        title.value = partialRecipe.value?.title ?? "";
        servings.value = partialRecipe.value?.servings ?? 0;
        ingredients.value = partialRecipe.value?.ingredients ?? [];
        instructions.value = partialRecipe.value?.instructions ?? [];
      }
    }
    send("CONFIRM_ORIGIN", {
      origin: stepOneOrigin,
      url: stepOneUrl,
      recipe: partialRecipe.value,
    });
  } catch (err: any) {
    toast.add({
      title: "Erreur",
      description: err.data.message,
      icon: "i-tabler-circle-x",
    });
  }
}

async function fetchRecipe() {
  let endpoint = "";
  // verify if url is from marmiton
  if (url.value?.includes("marmiton.org")) {
    endpoint = "/api/marmiton";
  } else if (url.value?.includes("journaldesfemmes.fr")) {
    endpoint = "/api/journaldesfemmes";
  } else if (url.value?.includes("jow.fr")) {
    endpoint = "/api/jow";
  } else if (url.value?.includes("750g.com")) {
    endpoint = "/api/750g";
  } else if (url.value?.includes("cookomix.com")) {
    endpoint = "/api/cookomix";
  } else if (url.value?.includes("instagram.com")) {
    endpoint = "/api/instagram";
  } else {
    toast.add({
      title: "Erreur",
      description: "Le site n'est pas supporté",
      icon: "i-tabler-circle-x",
      color: "red",
    });
  }
  try {
    const recipe = $fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ url: url.value }),
    });
    return recipe;
  } catch (err) {
    console.log(err);
  }
}

async function handleStepTwoSubmit({
  title: stepTwoTitle,
  servings: stepTwoServings,
  totalTime: stepTwoTotalTime,
  ingredients: stepTwoIngredientIds,
  instructions: stepTwoInstructionIds,
  tags: stepTwoTags,
}: StepTwoOutput) {
  try {
    const createdIngredients = await createIngredients(stepTwoIngredientIds);
    const createdInstructions = await createInstructions(stepTwoInstructionIds);
    const createdTagIds = await createTags(stepTwoTags);

    title.value = stepTwoTitle;
    servings.value = stepTwoServings;
    totalTime.value = stepTwoTotalTime;
    ingredientIds.value = createdIngredients;
    instructionIds.value = createdInstructions;
    tagIds.value = createdTagIds;

    send("CONFIRM_CONTENT", {
      title: stepTwoTitle,
      servings: stepTwoServings,
      totalTime: stepTwoTotalTime,
      ingredientIds,
      instructionIds,
      tagIds,
    });
  } catch (err: any) {
    toast.add({
      title: "Erreur",
      description: err.data.message,
      icon: "i-tabler-circle-x",
    });
  }
}

async function createRecipe(recipe: RecipesRecord): Promise<RecipesResponse> {
  const createdRecipe = await createRecord<RecipesResponse>("recipes", recipe);
  return createdRecipe;
}

async function handleStepThreeSubmit({
  thumbnail: stepThreeThumbnail,
}: StepThreeOutput) {
  try {
    send("CONFIRM_MEDIA", { thumbnail: stepThreeThumbnail });

    const recipe = {
      author: nuxtApp.$pb.authStore.model?.id!,
      title: title.value,
      servings: servings.value,
      ingredients: ingredientIds.value,
      instructions: instructionIds.value,
      tags: tagIds.value,
      totalTime: totalTime.value,
      thumbnail: stepThreeThumbnail,
      thumbnailUrl: partialRecipe.value?.thumbnailUrl,
    };

    const formData = castAsFormData(recipe) as unknown as RecipesRecord;

    const createdRecipe = await createRecipe(formData);
    toast.add({
      title: "Recette créée",
      description: `Votre recette de ${createdRecipe.title} a bien été créée`,
      icon: "i-tabler-circle-check",
      color: "green",
    });
    emit("done");
  } catch (err) {
    console.log(err);
  }
}
</script>
