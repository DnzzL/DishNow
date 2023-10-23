<template>
  <div class="flex justify-center">
    <UButton v-if="step > 1" @click="step--" class="mb-2 items-center">
      <UIcon name="i-tabler-chevron-left" />
      Précédent
    </UButton>
  </div>

  <h1 class="font-cal text-2xl font-bold pl-4">Recette</h1>

  <UForm
    ref="inputForm"
    :schema="inputSchema"
    :state="inputState"
    @submit.prevent="handleInputFormSubmit"
    class="p-4 flex flex-col gap-4"
    :validate-on="['blur']"
    v-if="step === 1"
  >
    <UFormGroup label="Titre" name="title">
      <UInput v-model="inputState.title" autocomplete="title" />
    </UFormGroup>

    <UFormGroup label="Type de création" name="creationType">
      <URadio
        v-for="creationType of creationTypes"
        :key="creationType.name"
        v-model="inputState.creationType"
        v-bind="creationType"
      />
    </UFormGroup>

    <TextAreaInput
      label=""
      placeholder="Ingrédients (séparés par une virgule)"
      :model-value="inputState.ingredients.join(',')"
      @update:model-value="inputState.ingredients = $event.trim().split(',')"
      v-if="inputState.creationType === 'generateFromIngredients'"
    />
    <UFormGroup
      label="URL"
      name="url"
      v-else-if="inputState.creationType === 'createFromURL'"
    >
      <UInput type="url" v-model="inputState.url" />
    </UFormGroup>

    <div class="flex justify-center py-4">
      <UButton variant="solid" type="submit">{{
        ["createFromURL", "createFromScratch"].includes(inputState.creationType)
          ? "Créer"
          : "Générer"
      }}</UButton>
    </div>
  </UForm>

  <UForm
    ref="recipeForm"
    :schema="recipeSchema"
    :state="recipeState"
    @submit.prevent=""
    class="flex flex-col gap-4 p-4"
    :validate-on="['blur']"
    v-if="!isLoading && step === 2"
  >
    <UFormGroup label="Nombre de portions" name="servings">
      <UInput v-model.number="recipeState.servings" autocomplete="servings" />
    </UFormGroup>
    <UFormGroup label="Temps de préparation" name="totalTime">
      <UInput v-model.number="recipeState.totalTime" autocomplete="totalTime" />
    </UFormGroup>
    <UFormGroup label="Ingrédients" name="ingredients">
      <DynamicSizeList
        :range="ingredientNumber"
        :items="recipeState.ingredients"
      />
    </UFormGroup>
    <UFormGroup label="Instructions" name="instructions">
      <DynamicSizeList
        :range="instructionNumber"
        :items="recipeState.instructions"
      />
    </UFormGroup>
    <UFormGroup label="Tags" name="tags">
      <CustomTagsInput v-model="recipeState.tags" />
    </UFormGroup>
    <div class="flex justify-center py-4">
      <UButton variant="solid" type="submit">Créer</UButton>
    </div>
  </UForm>

  <!-- <div class="space-y-2" v-if="isLoading">
    <USkeleton class="h-4 w-[250px]" />
    <USkeleton class="h-4 w-[200px]" />
  </div> -->
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { CreationTypeList } from "~/types/enums";
import type { RecipesRecord, RecipesResponse } from "~/types/pocketbase";

const nuxtApp = useNuxtApp();
const toast = useToast();
const { createIngredients, createInstructions, createTags, createRecord } =
  useDb();
const { castAsFormData } = useForm();

const creationTypes = [
  {
    name: "generateFromTitle",
    value: "generateFromTitle",
    label: "Générer à partir du titre",
  },
  {
    name: "generateFromIngredients",
    value: "generateFromIngredients",
    label: "Générer à partir des ingrédients",
  },
  {
    name: "createFromURL",
    value: "createFromURL",
    label: "Créer à partir d'une URL",
  },
  {
    name: "createFromScratch",
    value: "createFromScratch",
    label: "Créer une recette",
  },
];

const inputForm = ref();
const inputSchema = z.object({
  title: z.string().min(3, "Minimum 3 caractères"),
  creationType: z.enum(CreationTypeList),
  ingredients: z.array(z.string()).optional(),
  url: z.string().url().optional(),
});
const inputState = ref({
  title: "",
  creationType: "",
  ingredients: [] as string[],
  url: "",
});

async function generateRecipe() {
  const prompt =
    inputState.value.creationType === "generateFromTitle"
      ? inputState.value.title
      : inputState.value.ingredients.join(", ");
  isLoading.value = true;
  const { data } = await useFetch("/api/text-generation", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      creationType: inputState.value.creationType,
    }),
  });
  isLoading.value = false;

  if (data) {
    const { ingredients, instructions } = data.value as {
      ingredients: string[];
      instructions: string[];
    };
    recipeState.value.ingredients = ingredients;
    ingredientNumber.value = ingredients.length;
    recipeState.value.instructions = instructions;
    instructionNumber.value = instructions.length;
  }
}

async function handleInputFormSubmit() {
  debugger;
  isLoading.value = true;
  if (
    ["generateFromTitle", "generateFromIngredients"].includes(
      inputState.value.creationType
    )
  ) {
    try {
      await generateRecipe();
    } catch (err) {
      toast.add({
        title: "Erreur",
        description: "La recette n'a pas pu être générée",
        icon: "i-tabler-circle-x",
        color: "red",
      });
    }
  } else if (inputState.value.creationType === "createFromURL") {
    try {
      await fetchRecipe();
    } catch (err) {
      toast.add({
        title: "Erreur",
        description: "La recette n'a pas pu être récupérée",
        icon: "i-tabler-circle-x",
        color: "red",
      });
    }
  }
  isLoading.value = false;
  step.value = 2;
}

const isLoading = ref(false);
const step = ref(1);

async function fetchRecipe() {
  let endpoint = "";
  // verify if url is from marmiton
  if (inputState.value.url?.includes("marmiton.org")) {
    endpoint = "/api/marmiton";
  } else if (inputState.value.url?.includes("journaldesfemmes.fr")) {
    endpoint = "/api/journaldesfemmes";
  } else if (inputState.value.url?.includes("jow.fr")) {
    endpoint = "/api/jow";
  } else if (inputState.value.url?.includes("750g.com")) {
    endpoint = "/api/750g";
  } else if (inputState.value.url?.includes("cookomix.com")) {
    endpoint = "/api/cookomix";
  } else if (inputState.value.url?.includes("instagram.com")) {
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
    const recipe = (await $fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ url: inputState.value.url }),
    })) as RecipesRecord;
    recipeState.value = {
      ...recipeState.value,
      ...recipe,
    };
  } catch (err) {
    console.log(err);
  }
}

const recipeForm = ref();
const recipeSchema = z.object({
  title: z.string().min(3, "Minimum 3 caractères"),
  servings: z.number().min(1, "Minimum 1 portion"),
  totalTime: z.number().min(1, "Minimum 1 minute"),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tags: z.array(z.string()),
});
const recipeState = ref({
  servings: 1,
  totalTime: 1,
  ingredients: [] as string[],
  instructions: [] as string[],
  tags: [] as string[],
});
const ingredientNumber = ref(recipeState.value.ingredients.length);
const instructionNumber = ref(recipeState.value.ingredients.length);

async function handleRecipeCreation() {
  try {
    const createdIngredients = await createIngredients(
      recipeState.value.ingredients
    );
    const createdInstructions = await createInstructions(
      recipeState.value.instructions
    );
    const createdTagIds = await createTags(recipeState.value.tags);

    const recipe = {
      author: nuxtApp.$pb.authStore.model?.id!,
      title: inputState.value.title,
      servings: recipeState.value.servings,
      ingredients: createdIngredients,
      instructions: createdInstructions,
      tags: createdTagIds,
      totalTime: recipeState.value.totalTime,
    };

    const formData = castAsFormData(recipe) as unknown as RecipesRecord;

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
    // emit("done");
  } catch (err) {
    console.log(err);
  }
}

// async function handleStepTwoSubmit({
//   title: stepTwoTitle,
//   servings: stepTwoServings,
//   totalTime: stepTwoTotalTime,
//   ingredients: stepTwoIngredientIds,
//   instructions: stepTwoInstructionIds,
//   tags: stepTwoTags,
// }: StepTwoOutput) {
//   try {
//     const createdIngredients = await createIngredients(stepTwoIngredientIds);
//     const createdInstructions = await createInstructions(stepTwoInstructionIds);
//     const createdTagIds = await createTags(stepTwoTags);

//     title.value = stepTwoTitle;
//     servings.value = stepTwoServings;
//     totalTime.value = stepTwoTotalTime;
//     ingredientIds.value = createdIngredients;
//     instructionIds.value = createdInstructions;
//     tagIds.value = createdTagIds;

//     send("CONFIRM_CONTENT", {
//       title: stepTwoTitle,
//       servings: stepTwoServings,
//       totalTime: stepTwoTotalTime,
//       ingredientIds,
//       instructionIds,
//       tagIds,
//     });
//   } catch (err: any) {
//     toast.add({
//       title: "Erreur",
//       description: err.data.message,
//       icon: "i-tabler-circle-x",
//     });
//   }
// }

// async function createRecipe(recipe: RecipesRecord): Promise<RecipesResponse> {
//   const createdRecipe = await createRecord<RecipesResponse>("recipes", recipe);
//   return createdRecipe;
// }
</script>
