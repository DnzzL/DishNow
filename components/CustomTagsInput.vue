<template>
  <form @submit.prevent="submit">
    <div
      class="flex flex-col items-center mt-1 text-sm sm:flex-row sm:space-y-0 sm:space-x-4"
    >
      <div>
        <label for="input1" class="flex items-center">
          <UInput v-model="input" />
        </label>
      </div>
      <UButton icon="i-tabler-plus" variant="solid" type="submit" />
    </div>
  </form>
  <div
    class="mt-2 px-2 py-2 gap-1 flex flex-wrap rounded-lg bg-persian-indigo-200"
    v-if="tags?.length > 0"
  >
    <UBadge v-for="(tag, index) in tags" :key="index">
      {{ tag }}
      <UIcon
        name="i-tabler-x"
        class="ml-1 cursor-pointer hover:text-gray-300"
        @click="tags.splice(index, 1)"
      />
    </UBadge>
  </div>
</template>

<script setup lang="ts">
const input = ref("");

const props = defineProps<{
  modelValue: string[];
}>();
const emit = defineEmits(["update:modelValue"]);

const tags = useVModel(props, "modelValue", emit);

function submit() {
  if (input.value === "") return;
  tags.value.push(input.value);
  input.value = "";

  emit("update:modelValue", tags.value);
}
</script>
