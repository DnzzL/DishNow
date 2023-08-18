<template>
  <div ref="ref" v-bind="api.rootProps" class="input input-bordered block">
    <span v-for="(value, index) in api.value" :key="index" class="">
      <div
        v-bind="api.getTagProps({ index, value })"
        class="badge badge-accent inline-block data-selected:badge-secondary"
      >
        <span>{{ value }} </span>
        <button v-bind="api.getTagDeleteTriggerProps({ index, value })">
          &#x2715;
        </button>
      </div>
      <input v-bind="api.getTagInputProps({ index, value })" />
    </span>
    <input
      placeholder="Add tag..."
      v-bind="api.inputProps"
      class="input appearance-none bg-transparent p-1 m-0 border-none focus:outline-none outline-none shadow-none inline-block disabled:opacity-60 disabled:cursor-default"
    />
  </div>
</template>

<script setup lang="ts">
import * as tagsInput from "@zag-js/tags-input";
import { normalizeProps, useMachine } from "@zag-js/vue";
import { computed, ref } from "vue";

const value = ref<string[]>([]);

const props = defineProps<{
  id: string;
}>();

const [state, send] = useMachine(
  tagsInput.machine({
    id: props.id,
    value: value.value,
  })
);
const api = computed(() =>
  tagsInput.connect(state.value, send, normalizeProps)
);
</script>
