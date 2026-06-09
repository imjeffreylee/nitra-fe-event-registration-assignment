<script setup>
defineProps({
  showBack: {
    type: Boolean,
    default: true,
  },
  showNext: {
    type: Boolean,
    default: true,
  },
  backLabel: {
    type: String,
    default: 'Back',
  },
  nextLabel: {
    type: String,
    default: 'Next',
  },
});

const emit = defineEmits(['back', 'next']);
</script>

<template>
  <div
    class="w-full max-w-[1440px] h-[72px] px-4 md:px-16 lg:px-[120px] py-4 flex flex-row justify-between items-center mx-auto bg-white"
  >
    <button
      v-if="showBack"
      class="flex flex-row justify-center items-center min-w-[72px] h-10 px-4 bg-[#E3E6E8] rounded-[10px] cursor-pointer border-none"
      @click="emit('back')"
    >
      <span
        class="text-[14px] font-semibold leading-5 text-center text-black/60"
      >
        {{ backLabel }}
      </span>
    </button>
    <div v-else />

    <button
      v-if="showNext"
      class="flex flex-row justify-center items-center min-w-[72px] h-10 px-4 bg-[#FB7429] rounded-[10px] cursor-pointer border-none"
      @click="emit('next')"
    >
      <span class="text-[14px] font-semibold leading-5 text-center text-white">
        {{ nextLabel }}
      </span>
    </button>
    <div v-else />
  </div>
</template>
