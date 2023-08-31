<template>
  <UForm
    ref="form"
    :schema="schema"
    :state="state"
    @submit.prevent="emit('submit', state)"
    class="flex flex-col gap-4"
  >
    <UFormGroup label="Nom utilisateur" name="username">
      <UInput
        v-model="state.username"
        autocomplete="username"
        :disabled="disabled"
      />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        autocomplete="email"
        :disabled="disabled"
      />
    </UFormGroup>

    <UFormGroup label="Mot de passe" name="password">
      <UInput
        id="new-password"
        v-model="state.password"
        type="password"
        autocomplete="new-password"
        :disabled="disabled"
      />
    </UFormGroup>

    <UFormGroup label="Confirmation" name="passwordConfirm">
      <UInput
        id="new-password"
        v-model="state.passwordConfirm"
        type="password"
        autocomplete="new-password"
        :disabled="disabled"
      />
    </UFormGroup>

    <div class="flex justify-center py-4">
      <UButton variant="solid" type="submit">{{
        variant === "signup" ? "M'enregistrer" : "Changer"
      }}</UButton>
    </div>
  </UForm>
</template>

<script setup lang="ts">
import { z } from "zod";

type Props = { variant: "signup" | "profile"; disabled?: boolean };
withDefaults(defineProps<Props>(), { disabled: false });

const emit = defineEmits<{
  (e: "submit", value: ProfileFormType): void;
}>();

const form = ref();

const schema = z.object({
  username: z.string().min(3, "Minimum 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const state = ref({
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

export type ProfileFormType = typeof state.value;
</script>
