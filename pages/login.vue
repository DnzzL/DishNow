<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-100">
    <div class="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
      <h2 class="text-3xl font-bold text-neutral mb-6 font-cal">Log In</h2>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="form-control">
          <label class="label" for="username">Username</label>
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
          <label class="label" for="password">Password</label>
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
          Log In
        </button>
      </form>
      <div class="mt-4 text-sm text-center text-neutral">
        Don't have an account?
        <NuxtLink
          href="/signup"
          class="text-accent font-semibold hover:text-accent-dark"
          >Sign Up now</NuxtLink
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
import { login } from "~/utils/pocketbase";

const router = useRouter();
const toast = useToast();

const username = ref("");
const password = ref("");

const nuxtApp = useNuxtApp();
const pb = nuxtApp!.$pb;

async function handleSubmit() {
  try {
    await login({ pb, username: username.value, password: password.value });
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
