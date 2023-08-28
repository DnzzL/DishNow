<template>
  <Profile :user="user" />
</template>

<script setup lang="ts">
import { UsersResponse } from "~/types/pocketbase";

const nuxtApp = useNuxtApp();

const user = nuxtApp.$pb.authStore.model as unknown as UsersResponse;
</script>
