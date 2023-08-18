<template>
  <form @submit.prevent="submit">
    <div class="form-control">
      <label class="label cursor-pointer" for="origin">
        <span class="label-text">Externe</span>
        <input type="radio" value="external" v-model="origin" class="radio" />
      </label>
      <label class="label cursor-pointer" for="origin">
        <span class="label-text">Custom</span>
        <input type="radio" value="custom" v-model="origin" class="radio" />
      </label>
    </div>
    <div class="form-control" v-if="origin === 'external'">
      <label class="label" for="url">Url</label>
      <input
        class="input input-bordered w-full"
        id="url"
        name="title"
        type="text"
        placeholder="Url"
        v-model="url"
        required
      />
      <button type="submit" class="btn btn-primary text-white">Fetch</button>
    </div>
    <div v-else class="grid place-items-center">
      <button type="submit" class="btn btn-primary text-white">Next</button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";

const origin = ref("");
const url = ref("");

export type StepOneOutput = {
  origin: string;
  url?: string;
};

const emit = defineEmits<{
  (e: "submit", output: StepOneOutput): void;
}>();

function submit() {
  emit("submit", { origin: origin.value, url: url.value });
}
</script>
