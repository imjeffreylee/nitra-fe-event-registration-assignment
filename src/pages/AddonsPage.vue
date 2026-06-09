<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <main
    class="flex-1 flex flex-col justify-center items-center py-10 max-w-[1200px] mx-auto w-full"
  >
    <div
      class="bg-white border border-gray-100 rounded-lg w-full flex flex-col min-h-[350px] justify-between"
    >
      <div class="space-y-4">
        <p class="text-neutral-muted">
          Enhance your summit experience with workshops, meals, and
          exclusive merchandise.
        </p>
        <div
          class="p-4 bg-surface-l2 rounded border border-gray-100 text-sm text-neutral-muted"
        >
          Add-on items organized by category will be displayed here.
        </div>
      </div>
      <div class="flex justify-between p-4">
        <q-btn flat label="Back" @click="router.push('/sessions')" />
        <q-btn color="primary" label="Next" @click="router.push('/review')" />
      </div>
    </div>
  </main>
</template>
