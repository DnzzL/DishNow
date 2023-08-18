<template>
  <div class="flex items-center flex-col">
    <p v-if="state.context.errorMessage">{{ state.context.errorMessage }}</p>
    <RecipeFormStepOne
      @submit="handleStepOneSubmit"
      v-if="state.value?.enteringOrigin"
    />
    <RecipeFormStepTwo
      :pb="pb"
      :origin="origin"
      :fetchedIngredients="ingredients"
      :fetchedInstructions="instructions"
      @submit="handleStepTwoSubmit"
      v-if="state.value?.enteringContent === 'idle'"
    />
    <RecipeFormStepThree
      @submit="handleStepThreeSubmit"
      v-if="state.value?.enteringMedia === 'idle'"
    />
    <button
      class="btn btn-primary text-white btn-circle fixed bottom-5 left-5 btn-sm"
      @click="send('BACK')"
      type="button"
      v-if="state.value?.enteringOrigin !== 'idle'"
    >
      <Icon name="tabler:arrow-left" />
    </button>
  </div>
</template>

<script setup lang="ts">
import PocketBase from "pocketbase";
import { ref } from "vue";
import type { RecipesRecord, RecipesResponse } from "~/types/pocketbase";
import { createRecord } from "~/utils/pocketbase";
import type { StepOneOutput } from "./RecipeFormStepOne.vue";
import RecipeFormStepOne from "./RecipeFormStepOne.vue";
import RecipeFormStepThree, {
  StepThreeOutput,
} from "./RecipeFormStepThree.vue";
import type { StepTwoOutput } from "./RecipeFormStepTwo.vue";
import RecipeFormStepTwo from "./RecipeFormStepTwo.vue";

const pb = new PocketBase("http://127.0.0.1:8090");

import { useMachine } from "@xstate/vue";

import newRecipeFormMachine from "~/machines/newRecipeForm";

const { state, send } = useMachine(newRecipeFormMachine);

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
    let partialRecipe;
    if (stepOneOrigin === "external") {
      partialRecipe = await fetchRecipe();
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
      recipe: partialRecipe?.value,
    });
  } catch (err) {
    console.log(err);
  }
}

async function fetchRecipe() {
  try {
    const { data: recipe } = await useFetch("/api/marmiton");
    return recipe;
  } catch (err) {
    console.log(err);
  }
}

function handleStepTwoSubmit({
  title: stepTwoTitle,
  servings: stepTwoServings,
  totalTime: stepTwoTotalTime,
  ingredientIds: stepTwoIngredientIds,
  instructionIds: stepTwoInstructionIds,
  tagIds: stepTwoTags,
}: StepTwoOutput) {
  title.value = stepTwoTitle;
  servings.value = stepTwoServings;
  totalTime.value = stepTwoTotalTime;
  ingredientIds.value = stepTwoIngredientIds;
  instructionIds.value = stepTwoInstructionIds;
  tagIds.value = stepTwoTags;

  send("CONFIRM_CONTENT", {
    title: stepTwoTitle,
    servings: stepTwoServings,
    totalTime: stepTwoTotalTime,
    ingredientIds: stepTwoIngredientIds,
    instructionIds: stepTwoInstructionIds,
    tagIds: stepTwoTags,
  });
  console.log(state.value.context);
}

async function createRecipe(recipe: RecipesRecord): Promise<RecipesResponse> {
  const createdRecipe = await createRecord<RecipesResponse>(
    pb,
    "recipes",
    recipe
  );
  return createdRecipe;
}

async function handleStepThreeSubmit({
  thumbnail: stepThreeThumbnail,
}: StepThreeOutput) {
  try {
    send("CONFIRM_MEDIA", { thumbnail: stepThreeThumbnail });

    const recipe = {
      author: pb.authStore.model?.id!,
      title: title.value,
      servings: servings.value,
      ingredients: ingredientIds.value,
      instructions: instructionIds.value,
      tags: tagIds.value,
      totalTime: totalTime.value,
      thumbnail: stepThreeThumbnail,
    };

    const formData = new FormData();
    for (const [key, value] of Object.entries(recipe)) {
      if (!!value) {
        formData.append(key, value.toString());
      }
    }

    const createdRecipe = await createRecipe(formData as any as RecipesRecord);
  } catch (err) {
    console.log(err);
  }
}
</script>
