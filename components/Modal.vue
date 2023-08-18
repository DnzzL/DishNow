<template>
  <button
    class="btn btn-sm btn-circle"
    onclick="
    document.getElementById('`modal_${props.id}`').showModal()
    "
  >
    <slot name="open" />
  </button>

  <dialog id="`modal_${props.id}`" class="modal">
    <form method="dialog" class="modal-box">
      <slot name="main" :close="closeModal" />
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
}>();

function closeModal() {
  (document.getElementById(`modal_${props.id}`) as HTMLDialogElement).close();
}
</script>
