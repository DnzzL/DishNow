<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-100">
    <div class="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
      <h2 class="text-3xl font-bold text-neutral mb-6 font-cal">
        Créer un compte
      </h2>
      <UForm
        ref="form"
        :schema="schema"
        :state="state"
        @submit.prevent="handleSubmit"
        class="flex flex-col gap-4"
      >
        <UFormGroup label="Nom utilisateur" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Mot de passe" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Confirmation" name="passwordConfirm">
          <UInput v-model="state.passwordConfirm" type="password" />
        </UFormGroup>

        <div class="flex justify-center py-4">
          <UButton variant="solid" type="submit">M'enregistrer</UButton>
        </div>
      </UForm>
      <div class="mt-4 text-sm text-center text-neutral">
        Déjà un compte ?
        <NuxtLink href="/login" class="text-malachite-600 font-semibold"
          >Se connecter</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import { z } from "zod";

definePageMeta({
  layout: "unlogged",
});

const router = useRouter();
const toast = useToast();
const { signup } = useDb();

const schema = z.object({
  username: z.string().min(3, "Minimum 3 caractères"),
  name: z.string().min(2, "Minimum 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const state = ref({
  username: "",
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
});

const form = ref();

async function handleSubmit() {
  try {
    await signup(state.value);
    toast.add({
      title: "Compte créé",
      description: "Vous pouvez maintenant vous connecter",
      icon: "i-tabler-circle-check",
      color: "green",
    });
    router.push("/login");
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
