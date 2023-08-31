<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-100">
    <div class="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
      <h2 class="text-3xl font-bold text-neutral mb-6 font-cal">Connexion</h2>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        @submit.prevent="handleSubmit"
        class="flex flex-col gap-4"
      >
        <UFormGroup label="Nom utilisateur" name="username">
          <UInput v-model="state.username" autocomplete="username" />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password">
          <UInput
            v-model="state.password"
            type="password"
            autocomplete="current-password"
          />
        </UFormGroup>

        <div class="flex justify-center py-4">
          <UButton variant="solid" type="submit">Se connecter</UButton>
        </div>
      </UForm>
      <div class="mt-4 text-sm text-center text-neutral">
        Pas encore de compte?
        <NuxtLink href="/signup" class="text-malachite-600 font-semibold"
          >S'enregistrer</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "unlogged",
});

import { ClientResponseError } from "pocketbase";
import { z } from "zod";

const router = useRouter();
const toast = useToast();
const { login } = useDb();

const schema = z.object({
  username: z.string().min(3, "Minimum 3 caractères"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const state = ref({
  username: "",
  password: "",
});

const form = ref();

async function handleSubmit() {
  try {
    await login(state.value);
    router.push("/");
  } catch (error) {
    if (error instanceof ClientResponseError) {
      toast.add({
        title: "Une erreur est survenue",
        description: error.data.message,
        icon: "i-tabler-circle-x",
      });
    }
  }
}
</script>
