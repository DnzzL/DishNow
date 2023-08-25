<template>
  <nav class="border-gray-400 dark:bg-gray-900">
    <div class="flex justify-evenly items-center py-2">
      <div>
        <p class="text-3xl font-bold font-cal">
          dishNOW<span class="text-primary-500">!</span>
        </p>
      </div>

      <div class="flex gap-4">
        <div><slot name="action" /></div>
        <UserDropdown />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts"></script>
