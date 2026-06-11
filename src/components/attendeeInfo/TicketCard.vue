<template>
  <div
    class="flex flex-col items-start p-5 gap-3 shadow-[0px_4px_16px_rgba(0,0,0,0.08),0px_1px_3px_rgba(0,0,0,0.04)] rounded-[6px] flex-1 min-w-0 box-border cursor-pointer transition-all duration-200"
    :class="
      selected
        ? 'bg-brand-subtle-rest border-2 border-solid border-brand-emphasis'
        : 'bg-surface-l1 border border-solid border-neutral-muted hover:border-gray-300'
    "
    @click="emit('select')"
  >
    <!-- Card Header -->
    <div
      class="flex flex-row justify-between items-center self-stretch flex-none"
    >
      <span class="text-subtitle1 text-neutral">{{
        ticket.name
      }}</span>
      <span class="text-subtitle1 text-neutral"
        >${{ ticket.price }}</span
      >
    </div>

    <!-- Description -->
    <p
      class="text-sm font-regular text-neutral-muted self-stretch flex-none m-0"
    >
      {{ ticket.description }}
    </p>

    <!-- Perks -->
    <div
      v-for="(perk, index) in ticket.perks"
      :key="index"
      class="flex flex-row items-center gap-2 self-stretch flex-none"
    >
      <PrimaryIcon class="w-[14px] h-[14px] flex-none" />
      <span class="text-sm font-regular text-neutral-muted">{{
        perk
      }}</span>
    </div>

    <!-- Badge -->
    <div
      class="flex flex-row justify-center items-center px-[5px] py-[3px] bg-success-bold-rest rounded-full flex-none transition-all duration-200"
      :class="
        selected
          ? 'visible opacity-100 scale-100'
          : 'invisible opacity-0 scale-95'
      "
    >
      <span class="text-[11px] leading-[14px] font-medium text-white px-1"
        >✓ Selected</span
      >
    </div>
  </div>
</template>

<script setup>
import PrimaryIcon from '../../assets/Primary.svg';

const props = defineProps({
  ticket: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select']);
</script>
