<template>
  <UDropdown
    :items="items"
    :ui="{ item: { disabled: 'cursor-text select-text' } }"
    :popper="{ placement: 'bottom-start' }"
  >
    <UAvatar :src="avatarUrl" :alt="user.username" />

    <template #account="{ item }">
      <div class="text-left">
        <p>Connecté</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon
        :name="item.icon"
        class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto"
      />
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { type UsersResponse } from "~/types/pocketbase";

const { getImageUrl, logout } = useDb();
const toast = useToast();
const nuxtApp = useNuxtApp();
const router = useRouter();

const user = nuxtApp.$pb.authStore.model as unknown as UsersResponse;
const avatarUrl = await getImageUrl(user, user.avatar, {
  thumb: "100x250",
});

const items = [
  [
    {
      label: user.username,
      slot: "account",
      disabled: true,
    },
  ],
  [
    {
      label: "Paramètres",
      icon: "i-tabler-settings",
      to: "/profile",
    },
  ],
  [
    {
      label: "Déconnexion",
      icon: "i-tabler-logout",
      click: () => {
        logout();
        toast.add({
          title: "Déconnexion réussie",
          description: "Vous êtes maintenant déconnecté.",
          icon: "i-tabler-user-off",
          color: "green",
        });
        router.push("/login");
      },
    },
  ],
];
</script>
