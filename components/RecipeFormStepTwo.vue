<template>
  <form @submit.prevent="submit">
    <div class="form-control">
      <label class="label" for="username">Recette</label>
      <input
        class="input input-bordered w-full"
        id="title"
        name="title"
        type="text"
        placeholder="Titre"
        v-model="title"
        required
      />
    </div>
    <div class="form-control">
      <label class="label" for="username">Couverts</label>
      <input
        class="input input-bordered w-full"
        id="servings"
        name="servings"
        type="number"
        placeholder="Couverts"
        v-model="servings"
        required
      />

      <label class="label" for="username">Temps total</label>
      <input
        class="input input-bordered w-full"
        id="totalTime"
        name="totalTime"
        type="string"
        placeholder="Temps total (min)"
        v-model="totalTime"
        required
      />
    </div>
    <div class="form-control">
      <label class="label" for="ingredientRange"># Ingredients</label>
      <input
        class="input input-bordered"
        id="ingredientRange"
        name="ingredientRange"
        type="number"
        placeholder="Ingredients number"
        v-model="ingredientRange"
        required
      />
      <label class="label" for="ingredients">Ingredients</label>
      <DynamicSizeList
        title="Ingredients"
        :items="ingredients"
        :range="ingredientRange"
        @item-change="handleIngredientChange"
      />
      <label class="label" for="instructionRange"># Instructions</label>
      <input
        class="input input-bordered"
        id="instructionRange"
        name="instructionRange"
        type="number"
        placeholder="Instructions number"
        v-model="instructionRange"
        required
      />
      <label class="label" for="username">Instructions</label>
      <DynamicSizeList
        title="Instructions"
        :items="instructions"
        :range="instructionRange"
        @item-change="handleInstructionChange"
      />
      <label class="label" for="tags">Tags</label>
      <TagsInput id="newRecipe" :value="tags" />
    </div>
    <div>
      <button type="submit" class="btn btn-primary text-white">Next</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import type Pocketbase from "pocketbase";
import { computed, ref, watch } from "vue";
import type {
  IngredientsRecord,
  InstructionsRecord,
  InstructionsResponse,
  TagsRecord,
} from "~/types/pocketbase";
import { createIfNotExists, createRecord } from "~/utils/pocketbase";
import DynamicSizeList from "./DynamicSizeList.vue";
import TagsInput from "./TagsInput.vue";

const ingredients = ref<string[]>([]);
const instructions = ref<string[]>([]);

const props = withDefaults(
  defineProps<{
    origin: string;
    pb: Pocketbase;
    fetchedIngredients?: string[];
    fetchedInstructions?: string[];
  }>(),
  {
    fetchedIngredients: [] as any,
    fetchedInstructions: [] as any,
  }
);

watch(
  () => props.fetchedIngredients,
  () => {
    ingredients.value = props.fetchedIngredients || [];
    ingredientRange.value = props.fetchedIngredients?.length || 0;
  }
);

watch(
  () => props.fetchedInstructions,
  () => {
    instructions.value =
      props.fetchedInstructions?.map((instruction) => instruction!.text) || [];
    instructionRange.value = props.fetchedInstructions?.length || 0;
  }
);

const title = ref("");
const servings = ref(0);
const totalTime = ref(0);
const ingredientRange = ref(0);
const ingredientIdList = ref<string[]>([]);
const instructionRange = ref(0);
const instructionIdList = ref<string[]>([]);
const tags = ref<string[]>([]);
const tagIdList = ref<string[]>([]);

export type StepTwoOutput = {
  title: string;
  servings: number;
  totalTime: number;
  ingredientIds: string[];
  instructionIds: string[];
  tagIds: string[];
};

const emit = defineEmits<{
  (e: "submit", output: StepTwoOutput): void;
}>();

const isExternal = computed(() => props.origin === "external");

function handleIngredientChange(id: number, evt: Event) {
  const target = evt.target as HTMLInputElement;
  ingredients.value[id - 1] = target.value;
}

function handleInstructionChange(id: number, evt: Event) {
  const target = evt.target as HTMLInputElement;
  instructions.value[id - 1] = target.value;
}

async function createIngredients(ingredientNames: string[]): Promise<string[]> {
  let ingredientIds: string[] = [];
  for (const ingredient of ingredientNames) {
    const createdIngredientId = await createIfNotExists<IngredientsRecord>(
      props.pb!,
      "ingredients",
      `name="${ingredient}"`,
      {
        name: ingredient,
      }
    );
    ingredientIds.push(createdIngredientId);
  }
  return ingredientIds;
}

async function createInstructions(
  instructionTexts: string[]
): Promise<string[]> {
  let instructionIds: string[] = [];
  for (const [i, instruction] of instructionTexts.entries()) {
    const createdInstruction = await createRecord<InstructionsResponse>(
      props.pb!,
      "instructions",
      {
        text: instruction,
        position: i + 1,
      } as InstructionsRecord
    );
    instructionIds.push(createdInstruction.id);
  }
  return instructionIds;
}

async function createTags(tagNames: string[]): Promise<string[]> {
  let tagIds: string[] = [];
  for (const tag of tagNames) {
    const createdTagId = await createIfNotExists<TagsRecord>(
      props.pb!,
      "tags",
      `text="${tag}"`,
      {
        text: tag,
      }
    );
    tagIds.push(createdTagId);
  }
  return tagIds;
}

const submit = async () => {
  try {
    const ingredientIds = await createIngredients(ingredients.value);
    const instructionIds = await createInstructions(instructions.value);
    const tagIds = await createTags(tags.value);

    ingredientIdList.value = ingredientIds;
    instructionIdList.value = instructionIds;
    tagIdList.value = tagIds;

    emit("submit", {
      title: title.value,
      servings: servings.value,
      totalTime: totalTime.value,
      tagIds,
      ingredientIds,
      instructionIds,
    });
  } catch (err) {
    console.log(err);
  }
};
</script>
