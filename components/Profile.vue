<template>
  <section>
    <Navbar />
    <CustomTagsInput />
    <div class="flex flex-col gap-6 lg:gap-12 py-4 lg:py-16">
      <UCard class="w-80 mx-auto">
        <template #default>
          <div class="grid grid-cols-[1fr_2fr] px-4 py-2 gap-4">
            <UAvatar size="3xl" :src="avatarUrl" />
            <div class="flex flex-col justify-evenly">
              <h1 class="font-cal text-3xl font-bold">{{ user.name }}</h1>
              <label for="avatar">
                <input
                  type="file"
                  class="file-input w-full hidden"
                  id="avatar" />
                <UButton
                  variant="soft"
                  icon="i-tabler-upload"
                  label="Changer image"
                  for="avatar"
              /></label>
            </div>
          </div>
        </template>
      </UCard>
      <UCard class="lg:mx-24">
        <template #header>
          <div class="flex justify-between">
            <h2 class="text-xl font-medium">Informations</h2>
            <UButton
              icon="i-tabler-edit"
              variant="soft"
              color="gray"
              @click="disabled = !disabled"
            />
          </div>
        </template>
        <template #default>
          <UForm
            ref="form"
            :validate="validate"
            :state="state"
            @submit.prevent="submit"
            class="flex flex-col gap-4"
          >
            <div class="grid grid-cols-2 gap-4">
              <UFormGroup label="Nom" name="name">
                <UInput v-model="state.name" :disabled="disabled" />
              </UFormGroup>

              <UFormGroup label="Nom utilisateur" name="username">
                <UInput v-model="state.username" :disabled="disabled" />
              </UFormGroup>
            </div>

            <UFormGroup label="Email" name="email">
              <UInput v-model="state.email" :disabled="disabled" />
            </UFormGroup>

            <UFormGroup label="Bio" name="bio">
              <UTextarea v-model="state.bio" :disabled="disabled" />
            </UFormGroup>

            <div class="flex justify-center py-4">
              <UButton variant="soft" type="submit" :disabled="disabled"
                >Sauvegarder</UButton
              >
            </div>
          </UForm>
        </template>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import type { UsersResponse } from "~/types/pocketbase";

const router = useRouter();
const toast = useToast();
const { getImageUrl, logout, updateRecord } = useDb();

type Props = {
  user: UsersResponse;
};
const props = defineProps<Props>();

const disabled = ref(true);
const state = ref({
  name: props.user.name,
  username: props.user.username,
  email: props.user.email,
  bio: props.user.bio,
});
const form = ref();
async function submit() {
  try {
    await form.value!.validate();
  } catch (e) {
    toast.add({
      title: "Donnée non validate",
      description: "Veuillez vérifier vos données.",
      icon: "i-tabler-alert-circle",
      color: "red",
    });
  }
  try {
    await updateRecord("users", props.user.id, state.value);
    toast.add({
      title: "Données mises à jour",
      icon: "i-tabler-circle-check",
      color: "green",
    });
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

const avatarUrl = await getImageUrl(props.user, props.user.avatar, {
  thumb: "100x250",
});
</script>
