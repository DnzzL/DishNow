<template>
  <div>
    <div v-for="index in range" :key="index" class="flex flex-col">
      <div class="flex">
        <input
          type="text"
          id="steps"
          @change="(event) => emit('itemChange', index, event)"
          list="suggestions"
          class="input input-bordered"
          :value="items[index - 1]"
        />
        <datalist v-if="suggestions" id="suggestions">
          <option v-for="{ id, name } in suggestions" :key="id">
            {{ name }}
          </option>
        </datalist>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  range: number;
  items: any[];
  suggestions?: { id: string; name: string }[];
}>();

const emit = defineEmits<{
  (e: "itemChange", id: number, evt: Event): void;
}>();
</script>
