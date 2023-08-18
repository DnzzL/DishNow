<template>
  <main>
    <Modal id="newRecipe" v-if="false">
      <template #open>
        <UIcon name="i-tabler-plus" />
      </template>
      <template #main v-slot="{ close }"><DishForm /></template>
    </Modal>
    <HomeFeed />
  </main>
</template>
