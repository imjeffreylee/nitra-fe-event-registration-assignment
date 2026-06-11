<template>
  <div class="flex flex-col items-start p-0 gap-[6px] flex-1 min-w-0">
    <label
      class="text-[12px] leading-[16px] fw-[550] font-sans not-italic [font-variation-settings:'slnt'_0] flex-none transition-colors duration-200"
      :class="hasError ? 'text-danger' : 'text-neutral'"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="box-border flex flex-row items-center px-3 py-[10px] w-full h-[44px] bg-white border border-solid rounded-[6px] self-stretch flex-none flex-grow-0 text-[16px] leading-[24px] fw-[485] font-sans not-italic text-neutral [font-variation-settings:'slnt'_0] outline-none transition-colors duration-200"
      :class="
        hasError
          ? 'border-danger-emphasis focus:border-danger-emphasis'
          : 'border-neutral-muted hover:border-gray-300'
      "
      @input="handleInput"
      @focus="isFocused = true"
      @blur="handleBlur"
    />
    <!-- Error message shown under the input when error occurs -->
    <span
      v-if="hasError && errorMessage"
      class="text-[11px] leading-[14px] fw-[485] text-danger [font-variation-settings:'slnt'_0] transition-opacity duration-200 mt-[-2px] ml-[2px]"
    >
      {{ errorMessage }}
    </span>
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
  error: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  forceShowError: {
    type: Boolean,
    default: false,
  },
  numericOnly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const isTouched = ref(false);
const isFocused = ref(false);

const handleInput = (event) => {
  let val = event.target.value;
  if (props.numericOnly) {
    val = val.replace(/\D/g, '');
    event.target.value = val;
  }
  emit('update:modelValue', val);
};

const handleBlur = () => {
  isFocused.value = false;
  isTouched.value = true;
};

const hasError = computed(() => {
  if (isFocused.value) return false;
  const show = isTouched.value || props.forceShowError;
  if (props.error && show) return true;
  return props.required && show && !props.modelValue;
});
</script>
