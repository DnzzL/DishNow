<template>
  <div class="flex flex-col items-center justify-center h-screen bg-base-100">
    <div class="w-full max-w-md p-6 rounded-lg shadow-md bg-white">
      <h2 class="text-3xl font-bold text-neutral mb-6 font-cal">
        Créer un compte
      </h2>
      <ProfileForm variant="signup" @submit="handleSubmit" />
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
import { ProfileFormType } from "~/components/ProfileForm.vue";

definePageMeta({
  layout: "unlogged",
});

const router = useRouter();
const toast = useToast();
const { signup } = useDb();

async function handleSubmit(state: ProfileFormType) {
  try {
    await signup(state);
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
