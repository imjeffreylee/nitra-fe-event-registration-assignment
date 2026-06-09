<template>
  <div class="flex flex-col items-start p-0 gap-[6px] flex-none flex-grow-1">
    <label
      class="text-[12px] leading-[16px] font-[550] font-sans not-italic text-[rgba(0,0,0,0.9)] [font-variation-settings:'slnt'_0] flex-none"
    >
      {{ label }}
    </label>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      class="box-border flex flex-row items-center px-3 py-[10px] w-full h-[44px] bg-white border border-solid border-[#E3E6E8] rounded-[6px] self-stretch flex-none flex-grow-0 text-[16px] leading-[24px] font-[485] font-sans not-italic text-[rgba(0,0,0,0.9)] [font-variation-settings:'slnt'_0] outline-none"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
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
});

defineEmits(['update:modelValue']);
</script>
