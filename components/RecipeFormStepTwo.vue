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
import { ref } from "vue";
import type { RecipesRecord } from "~/types/pocketbase";
import DynamicSizeList from "./DynamicSizeList.vue";
import TagsInput from "./TagsInput.vue";

const ingredients = ref<string[]>([]);
const instructions = ref<string[]>([]);

const props = defineProps<{
  origin: string;
  pb: Pocketbase;
  partialRecipe: Partial<RecipesRecord>;
}>();

onMounted(() => {
  title.value = props.partialRecipe.title || "";
  servings.value = props.partialRecipe.servings || 0;
  totalTime.value = props.partialRecipe.totalTime || 0;
  ingredients.value = props.partialRecipe.ingredients || [];
  ingredientRange.value = Math.max(props.partialRecipe.ingredients?.length, 1);
  instructions.value = props.partialRecipe.instructions || [];
  instructionRange.value = Math.max(
    props.partialRecipe.instructions?.length,
    1
  );
  tags.value = props.partialRecipe.tags || [];
});

const title = ref("");
const servings = ref(0);
const totalTime = ref(0);
const ingredientRange = ref(0);
const instructionRange = ref(0);
const tags = ref<string[]>([]);

export type StepTwoOutput = {
  title: string;
  servings: number;
  totalTime: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
};

const emit = defineEmits<{
  (e: "submit", output: StepTwoOutput): void;
}>();

function handleIngredientChange(id: number, evt: Event) {
  const target = evt.target as HTMLInputElement;
  ingredients.value[id - 1] = target.value;
}

function handleInstructionChange(id: number, evt: Event) {
  const target = evt.target as HTMLInputElement;
  instructions.value[id - 1] = target.value;
}

const submit = async () => {
  try {
    emit("submit", {
      title: title.value,
      servings: servings.value,
      totalTime: totalTime.value,
      tags: tags.value,
      ingredients: ingredients.value,
      instructions: instructions.value,
    });
  } catch (err) {
    console.log(err);
  }
};
</script>
