<template>
  <div
    class="box-border flex flex-col items-start p-4 gap-2 w-full max-w-[1200px] bg-[#FCE4E4] border border-solid border-[#F6B7B7] rounded-[6px] self-stretch flex-none"
  >
    <!-- Header Message -->
    <div
      class="text-[12px] leading-4 fw-[550] text-[#C71A1A] [font-variation-settings:'slnt'_0] self-stretch flex-none"
    >
      Please fix the following errors before submitting
    </div>

    <!-- Error List Items -->
    <div
      v-for="(error, index) in errors"
      :key="index"
      class="text-[12px] leading-4 fw-[485] text-[#C71A1A] [font-variation-settings:'slnt'_0] self-stretch flex-none"
    >
      • {{ error }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  errors: {
    type: Array,
    required: true,
    // Expects: String[] (e.g. ["Step 1: Phone number is required"])
  },
});
</script>
