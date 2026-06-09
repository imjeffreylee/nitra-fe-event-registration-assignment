<template>
  <div
    class="box-border flex flex-col items-start p-5 gap-3 w-full max-w-[1200px] min-h-[228px] bg-[#F4F5F6] border border-solid border-[#E3E6E8] rounded-[6px] flex-none self-stretch flex-grow-0"
  >
    <!-- Header: Title and Edit Button -->
    <div
      class="flex flex-row justify-between items-center p-0 w-full flex-none self-stretch flex-grow-0 h-5"
    >
      <h3
        class="font-semibold text-[16px] leading-[20px] text-neutral flex-none order-0 flex-grow-0 m-0"
      >
        Attendee Information
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
      <!-- Full Name Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Name
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ fullName || '—' }}
        </span>
      </div>

      <!-- Email Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Email
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ email || '—' }}
        </span>
      </div>

      <!-- Phone Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Phone
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ phone || '—' }}
        </span>
      </div>

      <!-- Company Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Company
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ company || '—' }}
        </span>
      </div>

      <!-- Job Title Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Job Title
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ jobTitle || '—' }}
        </span>
      </div>

      <!-- Ticket Type Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Ticket Type
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ ticketLabel }} ({{ formatCurrency(ticketPrice) }})
        </span>
      </div>

      <!-- Shipping Address Row -->
      <div
        class="flex flex-row justify-between items-start p-0 w-full flex-none self-stretch flex-grow-0 h-4"
      >
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Shipping Address
        </span>
        <span
          class="font-[485] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >
          {{ shippingAddress || 'Not provided' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { event } from '../../mocks/event.js';

const props = defineProps({
  fullName: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  company: {
    type: String,
    default: '',
  },
  jobTitle: {
    type: String,
    default: '',
  },
  shippingAddress: {
    type: String,
    default: '',
  },
  ticketType: {
    type: String,
    default: 'vip',
  },
});

defineEmits(['edit']);

const ticketTypeObj = computed(() => {
  return (
    event.ticketTypes.find((t) => t.id === props.ticketType) ||
    event.ticketTypes[0]
  );
});

const ticketPrice = computed(() => {
  return ticketTypeObj.value?.price || 0;
});

const ticketLabel = computed(() => {
  return ticketTypeObj.value?.name || '';
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
</script>
