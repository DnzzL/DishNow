<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-100">
    <div class="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
      <h2 class="text-3xl font-bold text-neutral mb-6 font-cal">Sign Up</h2>
      <form class="space-y-6" @submit.prevent="handleSubmit">
        <div class="form-control">
          <label class="label" for="name">Name</label>
          <input
            class="input input-bordered w-full"
            id="name"
            name="name"
            v-model="fname"
            type="text"
            placeholder="Name"
            required
            autocomplete="name"
          />
        </div>
        <div class="form-control">
          <label class="label" for="username">Username</label>
          <input
            class="input input-bordered w-full"
            id="username"
            name="username"
            v-model="username"
            type="text"
            placeholder="Username"
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
            v-model="password"
            type="password"
            placeholder="Password"
            required
            autocomplete="new-password"
          />
        </div>
        <div class="form-control">
          <label class="label" for="password">Confirm Password</label>
          <input
            class="input input-bordered w-full"
            id="confirmPassword"
            name="confirmPassword"
            v-model="passwordConfirm"
            type="password"
            placeholder="Confirm Password"
            required
            autocomplete="new-password"
          />
        </div>
        <button class="btn btn-primary w-full text-white" type="submit">
          Sign Up
        </button>
      </form>
      <div class="mt-4 text-sm text-center text-neutral">
        Already have an account?
        <NuxtLink
          href="/login"
          class="text-accent font-semibold hover:text-accent-dark"
          >Log In now</NuxtLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "unlogged",
});

const router = useRouter();
const toast = useToast();
const { signup } = useDb();

const username = ref("");
const fname = ref("");
const password = ref("");
const passwordConfirm = ref("");

async function handleSubmit() {
  try {
    await signup({
      username: username.value,
      password: password.value,
      passwordConfirm: passwordConfirm.value,
      name: fname.value,
    });
    toast.add({
      title: "Compte créé",
      description: "Vous pouvez maintenant vous connecter",
      icon: "i-tabler-circle-check",
      color: "green",
    });
    router.push("/login");
  } catch (error: any) {
    toast.add({
      title: "Une erreur est survenue",
      description: error.data.message,
      icon: "i-tabler-circle-x",
    });
  }
}
</script>
