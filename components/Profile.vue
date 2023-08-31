<template>
  <section>
    <Navbar />
    <div class="flex flex-col gap-6 lg:gap-12 py-4 lg:py-16">
      <UCard class="w-80 mx-auto">
        <template #default>
          <div class="grid grid-cols-[1fr_2fr] px-4 py-2 gap-4">
            <UAvatar size="3xl" :src="avatarUrl" />
            <div class="flex flex-col justify-evenly">
              <h1 class="font-cal text-3xl font-bold">{{ user.username }}</h1>
              <div class="flex items-center">
                <UButton variant="soft" label="Changer image" for="avatar" />
                <label for="file-upload" class="custom-file-upload">
                  <UIcon name="i-tabler-upload" class="cursor-pointer" />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  class="hidden"
                  @input="updateAvatar"
                />
              </div>
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
          <ProfileForm
            variant="profile"
            :disabled="disabled"
            @submit="profileSubmit"
          />
        </template>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ClientResponseError } from "pocketbase";
import { ProfileFormType } from "~/components/ProfileForm.vue";
import type { UsersResponse } from "~/types/pocketbase";

const nuxtApp = useNuxtApp();
const toast = useToast();
const { getImageUrl, updateRecord } = useDb();

type Props = {
  user: UsersResponse;
};
const props = defineProps<Props>();

const disabled = ref(true);

async function updateAvatar(event: any) {
  try {
    const avatar = event.target.files[0];
    const payload = new FormData();
    payload.append("avatar", avatar);
    await updateRecord("users", props.user.id, payload as any);
    toast.add({
      title: "Avatar mis à jour",
      icon: "i-tabler-circle-check",
      color: "green",
    });
  } catch (error) {
    if (error instanceof ClientResponseError) {
      toast.add({
        title: "Une erreur est survenue",
        description: error.data.message,
        icon: "i-tabler-circle-x",
        color: "red",
      });
    }
  }
}

async function profileSubmit(state: ProfileFormType) {
  const payload = {
    username: state.username,
    email: state.email,
    password: state.password,
  };
  try {
    await updateRecord("users", props.user.id, payload as any);
    toast.add({
      title: "Données mises à jour",
      icon: "i-tabler-circle-check",
      color: "green",
    });
    await nuxtApp.$pb.collection("users").authRefresh();
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
