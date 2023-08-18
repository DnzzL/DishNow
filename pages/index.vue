<template>
  <main>
    <Modal id="newRecipe" v-if="false">
      <template #open>
        <Icon name="tabler:plus" />
      </template>
      <template #main v-slot="{ close }"><DishForm /></template>
    </Modal>
    <HomeFeed />
  </main>
</template>
