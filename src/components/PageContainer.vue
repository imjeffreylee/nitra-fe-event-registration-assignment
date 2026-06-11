<template>
  <main
    class="flex-1 flex flex-col justify-center items-center py-10 px-4 md:px-6 lg:px-8 max-w-[1200px] mx-auto w-full"
  >
    <div
      class="bg-white border border-gray-100 rounded-lg w-full flex flex-col min-h-[350px] justify-between"
    >
      <div :class="contentClass">
        <slot />
      </div>
    </div>
  </main>
</template>

<script setup>
defineProps({
  /**
   * Styling class for the inner content wrapper (defaults to 'space-y-4')
   */
  contentClass: {
    type: String,
    default: 'space-y-4',
  },
});
</script>
