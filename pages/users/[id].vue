<template>
  <UserDetails :user="user" />
</template>

<script setup lang="ts">
import type { UsersResponse } from "~/types/pocketbase";

const { getRecordById } = useDb();
const route = useRoute();
const id = route.params.id as string;

const { data: user } = await useAsyncData(async (nuxtApp) => {
  const records = (await getRecordById<UsersResponse>(
    "users",
    id
  )) as UsersResponse;
  return structuredClone(records);
});
</script>
