<template>
  <section>
    <div class="py-4">
      <div class="bg-white rounded-lg shadow-lg p-6">
        <div class="flex flex-col items-center justify-center">
          <img
            :src="avatarUrl"
            alt="User Avatar"
            class="w-16 h-16 rounded-full"
          />
          <div>
            <h2 class="text-xl font-medium">{{ user.name }}</h2>
            <div class="flex items-center space-x-2 mt-2">
              <i class="mdi mdi-email-outline text-gray-600"></i>
              <span class="text-gray-600">{{ user.email }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-4 md:pl-24 lg:pl-48">
          <div class="mt-4" v-if="user.bio">
            <h3 class="text-lg font-medium">Bio:</h3>
            <p class="text-gray-600">{{ user.bio }}</p>
          </div>
          <div class="mt-4">
            <h3 class="text-lg font-medium">Private:</h3>
            <p class="text-gray-600">{{ user.private ? "Yes" : "No" }}</p>
          </div>
        </div>
        <div class="flex justify-center mt-12">
          <button class="btn btn-error btn-outline" @click="handleLogout">
            Log out
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UsersResponse } from "~/types/pocketbase";
import { getImageUrl, logout } from "~/utils/pocketbase";

const nuxtApp = useNuxtApp();
const router = useRouter();
const toast = useToast();

type Props = {
  user: UsersResponse;
};
const props = defineProps<Props>();

const avatarUrl = await getImageUrl(
  nuxtApp.$pb,
  props.user,
  props.user.avatar,
  { thumb: "100x250" }
);

function handleLogout() {
  logout(nuxtApp.$pb);
  toast.add({
    title: "Déconnexion réussie",
    description: "Vous êtes maintenant déconnecté.",
    icon: "i-tabler-user-off",
    color: "green",
  });
  router.push("/login");
}
</script>
