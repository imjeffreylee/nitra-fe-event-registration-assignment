<template>
  <div class="flex flex-col items-start p-0 gap-[6px] flex-none flex-grow-1">
    <label
      class="text-[12px] leading-[16px] font-[550] font-sans not-italic [font-variation-settings:'slnt'_0] flex-none transition-colors duration-200"
      :class="hasError ? 'text-[#C71A1A]' : 'text-[rgba(0,0,0,0.9)]'"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="box-border flex flex-row items-center px-3 py-[10px] w-full h-[44px] bg-white border border-solid rounded-[6px] self-stretch flex-none flex-grow-0 text-[16px] leading-[24px] font-[485] font-sans not-italic text-[rgba(0,0,0,0.9)] [font-variation-settings:'slnt'_0] outline-none transition-colors duration-200"
      :class="
        hasError
          ? 'border-[#C71A1A] focus:border-[#C71A1A]'
          : 'border-[#E3E6E8] hover:border-gray-300'
      "
      @input="$emit('update:modelValue', $event.target.value)"
      @blur="isTouched = true"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  modelValue: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['update:modelValue']);

const isTouched = ref(false);

const hasError = computed(() => {
  return props.required && isTouched.value && !props.modelValue;
});
</script>
