<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
    <div class="text-center">
      <h1 class="text-4xl font-bold text-white mb-4">Error {{ error.statusCode }}</h1>
      <p class="text-xl text-gray-300 mb-8">{{ error.message }}</p>
      <UButton
        color="primary"
        variant="solid"
        @click="clearError"
        class="text-white"
      >
        Go back to homepage
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: any
}>()

const clearError = () => clearError({ redirect: '/' })
</script>