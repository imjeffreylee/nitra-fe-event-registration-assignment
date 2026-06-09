<template>
  <div
    class="box-border flex flex-col items-start p-5 gap-3 w-full max-w-[1200px] min-h-[120px] bg-[#F4F5F6] border border-solid border-[#E3E6E8] rounded-[6px] flex-none self-stretch flex-grow-0"
  >
    <!-- Header: Title and Edit Button -->
    <div
      class="flex flex-row justify-between items-center p-0 w-full flex-none self-stretch flex-grow-0 h-5"
    >
      <h3
        class="font-semibold text-[16px] leading-[20px] text-neutral flex-none order-0 flex-grow-0 m-0"
      >
        {{ title }}
      </h3>
      <div
        class="flex flex-row items-center p-0 gap-[2px] w-[76px] h-4 flex-none order-1 flex-grow-0"
      >
        <button
          type="button"
          class="w-[76px] h-4 font-[610] text-[12px] leading-[16px] text-[#3A7679] underline [font-variation-settings:'slnt'_0] border-none bg-transparent cursor-pointer p-0 flex-none order-0 flex-grow-0 text-right"
          @click="$emit('edit')"
        >
          Edit
        </button>
      </div>
    </div>

    <!-- Details Rows -->
    <div class="flex flex-col gap-3 w-full mt-2">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 min-h-4 gap-4"
      >
        <span
          class="text-[12px] leading-[16px] [font-variation-settings:'slnt'_0] flex-1 order-0 flex-grow text-left break-words max-w-[45%]"
          :class="item.labelClass || 'font-[485] text-neutral-muted'"
        >
          {{ item.label }}
        </span>
        <span
          class="text-[12px] leading-[16px] [font-variation-settings:'slnt'_0] flex-1 order-1 flex-grow text-right break-words max-w-[55%]"
          :class="item.valueClass || 'font-[485] text-neutral'"
        >
          {{ item.value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
    // Expects: { label: String, value: String }[]
  },
});

defineEmits(['edit']);
</script>
