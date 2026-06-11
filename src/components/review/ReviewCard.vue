<template>
  <div
    class="box-border flex flex-col items-start p-5 w-full max-w-[1200px] min-h-[120px] bg-[#F4F5F6] rounded-[6px] flex-none self-stretch flex-grow-0"
    :class="
      hasMissingRequired
        ? 'border-2 border-solid border-danger-emphasis'
        : 'border border-solid border-[#E3E6E8]'
    "
  >
    <!-- Header: Title and Edit Button -->
    <div
      class="flex flex-row justify-between items-center p-0 w-full flex-none self-stretch flex-grow-0 h-5"
    >
      <h3
        class="font-semibold text-[16px] leading-[20px] flex-none order-0 flex-grow-0 m-0"
        :class="hasMissingRequired ? 'text-danger' : 'text-neutral'"
      >
        {{ title }}
      </h3>
      <div
        v-if="!showLastItemDivider"
        class="flex flex-row items-center p-0 gap-[2px] h-4 flex-none order-1 flex-grow-0"
      >
        <button
          type="button"
          class="h-4 font-semibold text-[12px] leading-[16px] text-[#3A7679] underline [font-variation-settings:'slnt'_0] border-none bg-transparent cursor-pointer p-0 flex-none order-0 flex-grow-0 text-right whitespace-nowrap"
          @click="$emit('edit')"
        >
          {{ editText }}
        </button>
      </div>
    </div>

    <!-- Details Rows -->
    <div class="flex flex-col gap-3 w-full mt-3">
      <template v-for="(item, index) in visibleItems" :key="index">
        <!-- Divider before the last item if requested -->
        <div
          v-if="
            showLastItemDivider &&
            index === visibleItems.length - 1 &&
            visibleItems.length > 0
          "
          class="w-full h-[1px] bg-[rgba(0,0,0,0.05)] self-stretch flex-none"
        />

        <div
          class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 min-h-4 gap-4"
        >
          <span
            class="text-[12px] leading-[16px] [font-variation-settings:'slnt'_0] flex-1 order-0 flex-grow text-left break-words max-w-[45%]"
            :class="[
              item.labelClass || 'text-neutral-muted',
              showLastItemDivider && index === visibleItems.length - 1
                ? 'fw-[550]'
                : item.labelClass
                  ? ''
                  : 'fw-[485]',
            ]"
          >
            {{ item.label }}
          </span>
          <span
            class="text-[12px] leading-[16px] [font-variation-settings:'slnt'_0] flex-1 order-1 flex-grow text-right break-words max-w-[55%]"
            :class="[
              item.required &&
              (item.value === undefined ||
                item.value === null ||
                item.value === '')
                ? 'text-[#C71A1A] fw-[485]'
                : [
                    item.valueClass || 'text-neutral',
                    showLastItemDivider && index === visibleItems.length - 1
                      ? 'fw-[550]'
                      : item.valueClass
                        ? ''
                        : 'fw-[485]',
                  ],
            ]"
          >
            {{
              item.required &&
              (item.value === undefined ||
                item.value === null ||
                item.value === '')
                ? item.errorMessage || '— (required)'
                : item.value
            }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
    // Expects: { label: String, value: String, required?: Boolean, errorMessage?: String }[]
  },
  showLastItemDivider: {
    type: Boolean,
    default: false,
  },
  editText: {
    type: String,
    default: 'Edit',
  },
});

defineEmits(['edit']);

const visibleItems = computed(() => {
  return props.items.filter((item) => {
    if (item.required) return true;
    return item.value !== undefined && item.value !== null && item.value !== '';
  });
});

// Detect if any required field is missing/empty
const hasMissingRequired = computed(() => {
  return props.items.some(
    (item) =>
      item.required &&
      (item.value === undefined || item.value === null || item.value === ''),
  );
});
</script>
