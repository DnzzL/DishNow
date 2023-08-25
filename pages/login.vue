<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-100">
    <div class="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
      <h2 class="text-3xl font-bold text-neutral mb-6 font-cal">Connexion</h2>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="form-control">
          <label class="label" for="username">Nom d'utilisateur</label>
          <input
            class="input input-bordered w-full"
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            v-model="username"
            required
            autocomplete="username"
          />
        </div>
        <div class="form-control">
          <label class="label" for="password">Mot de passe</label>
          <input
            class="input input-bordered w-full"
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            v-model="password"
            required
            autocomplete="current-password"
          />
        </div>
        <button class="btn btn-primary w-full text-white" type="submit">
          Se connecter
        </button>
      </form>
      <div class="mt-4 text-sm text-center text-neutral">
        Pas encore de compte?
        <NuxtLink
          href="/signup"
          class="text-accent font-semibold hover:text-accent-dark"
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

const router = useRouter();
const toast = useToast();
const { login } = useDb();

const username = ref("");
const password = ref("");

async function handleSubmit() {
  try {
    await login({ username: username.value, password: password.value });
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
