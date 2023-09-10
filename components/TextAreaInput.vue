<template>
  <label>
    <div>{{ label }}</div>
    <div>
      <textarea
        class="textarea textarea-bordered w-full"
        v-model="model"
        :rows="rows"
        :placeholder="placeholder"
      ></textarea>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface TextareaProps {
  modelValue?: string;
  label?: string;
  rows?: number;
  custom?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<TextareaProps>(), {
  value: "",
  label: "Votre message",
  rows: 4,
  custom: false,
  placeholder: "Ecrivez votre message ici...",
});

const emit = defineEmits(["update:modelValue"]);
const model = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
</script>
