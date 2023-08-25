<template>
  <section>
    <div class="py-4">
      <div class="flex flex-col items-center justify-center">
        <img
          :src="avatarUrl"
          alt="User Avatar"
          class="w-16 h-16 rounded-full"
        />
        <div>
          <h2 class="text-3xl font-cal font-medium">{{ user.name }}</h2>
          <div class="flex items-center space-x-2 mt-2">
            <i class="mdi mdi-email-outline text-gray-600"></i>
            <span class="text-gray-600">{{ user.email ?? "Pas de mail" }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-4 md:pl-24 lg:pl-48">
        <div class="mt-4">
          <h3 class="text-lg font-medium">Bio:</h3>
          <p class="text-gray-600">{{ user.bio ?? "Pas de bio" }}</p>
        </div>
        <div class="mt-4">
          <h3 class="text-lg font-medium">Private:</h3>
          <UBadge
            variant="soft"
            :label="user.private ? 'Yes' : 'No'"
            color="blue"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { UsersResponse } from "~/types/pocketbase";

const router = useRouter();
const toast = useToast();
const { getImageUrl, logout } = useDb();

type Props = {
  user: UsersResponse;
};
const props = defineProps<Props>();

const avatarUrl = await getImageUrl(props.user, props.user.avatar, {
  thumb: "100x250",
});

function handleLogout() {
  logout();
  toast.add({
    title: "Déconnexion réussie",
    description: "Vous êtes maintenant déconnecté.",
    icon: "i-tabler-user-off",
    color: "green",
  });
  router.push("/login");
}
</script>
