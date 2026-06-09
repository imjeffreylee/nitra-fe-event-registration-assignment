<template>
  <div
    class="flex flex-row items-start p-1 gap-1 h-10 bg-[#EBEEEF] rounded-[10px] w-max select-none"
  >
    <div
      v-for="option in options"
      :key="option"
      class="flex flex-row justify-center items-center px-5 py-2 h-8 rounded-[8px] cursor-pointer transition-all duration-200"
      :class="[
        option === modelValue
          ? 'bg-[#264D4F] text-white font-semibold'
          : 'text-[rgba(0,0,0,0.6)] font-medium hover:text-[rgba(0,0,0,0.8)]',
      ]"
      @click="emit('update:modelValue', option)"
    >
      <span
        class="text-[13px] leading-4 text-center [font-variation-settings:'slnt'_0]"
      >
        {{ option }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  /**
   * The list of tab options (strings)
   */
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  /**
   * The currently active tab option
   */
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>
