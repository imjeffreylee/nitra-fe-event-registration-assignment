<template>
  <div
    class="box-border flex flex-col items-start p-6 gap-4 w-full md:w-[380px] min-h-[211px] bg-[#F4F5F6] border border-solid border-[#E3E6E8] rounded-[6px] flex-none"
  >
    <h3
      class="text-neutral font-semibold text-[16px] leading-[20px] m-0 flex-none order-0 self-stretch flex-grow-0"
    >
      Order Summary
    </h3>

    <!-- Line items list -->
    <div class="flex flex-col gap-2 w-full text-[14px]">
      <!-- Ticket Line Item -->
      <div
        class="flex justify-between items-start gap-4 w-full text-neutral-muted"
      >
        <span
          class="flex-1 min-w-0 text-left fw-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] break-words flex-none order-0 flex-grow-0"
          >{{ ticketLabel }} Ticket</span
        >
        <span
          class="fw-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] shrink-0 text-right flex-none order-1 flex-grow-0"
        >
          {{ formatCurrency(ticketPrice) }}
        </span>
      </div>

      <!-- Individual Add-ons Line Items (by each kind) -->
      <div
        v-for="item in selectedItemsList"
        :key="item.key"
        class="flex justify-between items-start gap-4 w-full text-neutral-muted"
      >
        <span
          class="flex-1 min-w-0 text-left fw-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] break-words flex-none order-0 flex-grow-0"
        >
          {{ item.name }}
        </span>
        <span
          class="fw-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] shrink-0 text-right flex-none order-1 flex-grow-0"
        >
          {{ formatCurrency(item.price) }}
        </span>
      </div>

      <!-- VIP Discount Line Item (if applicable) -->
      <div
        v-if="vipDiscount > 0"
        class="flex justify-between items-start gap-4 w-full text-success"
      >
        <span
          class="flex-1 min-w-0 text-left fw-[485] text-[11px] leading-[14px] text-[#264D4F] [font-variation-settings:'slnt'_0] break-words flex-none order-0 flex-grow-0"
          >Workshop discount (VIP 10%)</span
        >
        <span
          class="fw-[485] text-[11px] leading-[14px] text-[#264D4F] [font-variation-settings:'slnt'_0] shrink-0 text-right flex-none order-1 flex-grow-0"
        >
          -{{ formatCurrency(vipDiscount) }}
        </span>
      </div>
    </div>

    <!-- Divider -->
    <hr class="w-full border-t border-solid border-[#E3E6E8] m-0" />

    <!-- Total -->
    <div class="flex justify-between items-center w-full text-neutral">
      <span
        class="fw-[550] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >Total</span
      >
      <span
        class="fw-[550] text-[12px] leading-[16px] text-neutral [font-variation-settings:'slnt'_0] flex-none order-1 flex-grow-0"
        >{{ formatCurrency(totalPrice) }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useEvent } from '../../composables/useEvent.js';
import { useAddons } from '../../composables/useAddons.js';

const { event } = useEvent();
const { addons } = useAddons();

const props = defineProps({
  ticketType: {
    type: String,
    default: 'vip',
  },
  selectedWorkshops: {
    type: Array,
    default: () => [],
  },
  selectedMeals: {
    type: Array,
    default: () => [],
  },
  selectedMerch: {
    type: Object,
    default: () => ({}),
  },
});

const ticketTypeObj = computed(() => {
  if (!event.value || !event.value.ticketTypes) return null;
  return (
    event.value.ticketTypes.find((t) => t.id === props.ticketType) ||
    event.value.ticketTypes[0]
  );
});

const ticketPrice = computed(() => {
  return ticketTypeObj.value?.price || 0;
});

const ticketLabel = computed(() => {
  return ticketTypeObj.value?.name || '';
});

const addonsList = computed(() => addons.value || []);

// Compute individual list of all selected add-ons with itemized pricing & labels
const selectedItemsList = computed(() => {
  const list = [];

  // 1. Add Selected Workshops
  props.selectedWorkshops.forEach((id) => {
    const ws = addonsList.value.find((a) => a.id === id);
    if (ws) {
      list.push({
        key: `ws-${id}`,
        name: ws.name,
        price: ws.price,
      });
    }
  });

  // 2. Add Selected Meals
  props.selectedMeals.forEach((id) => {
    const meal = addonsList.value.find((a) => a.id === id);
    if (meal) {
      list.push({
        key: `meal-${id}`,
        name: meal.name,
        price: meal.price,
      });
    }
  });

  // 3. Add Selected Merchandise with size details and quantity multipliers
  Object.entries(props.selectedMerch).forEach(([id, data]) => {
    if (!data || data.quantity <= 0) return;
    const merch = addonsList.value.find((a) => a.id === id);
    if (merch) {
      let displayName = merch.name;
      // Add size in parentheses if item supports size selection
      if (merch.sizes && merch.sizes.length > 0 && data.size) {
        displayName += ` (${data.size})`;
      }
      // Append x {qty} to denote quantity bought
      displayName += ` x ${data.quantity}`;

      list.push({
        key: `merch-${id}`,
        name: displayName,
        price: merch.price * data.quantity,
      });
    }
  });

  return list;
});

const workshopsPrice = computed(() => {
  return props.selectedWorkshops.reduce((sum, id) => {
    const ws = addonsList.value.find((a) => a.id === id);
    return sum + (ws?.price || 0);
  }, 0);
});

const mealsPrice = computed(() => {
  return props.selectedMeals.reduce((sum, id) => {
    const meal = addonsList.value.find((a) => a.id === id);
    return sum + (meal?.price || 0);
  }, 0);
});

const merchPrice = computed(() => {
  return Object.entries(props.selectedMerch).reduce((sum, [id, data]) => {
    if (!data || !data.quantity) return sum;
    const merch = addonsList.value.find((a) => a.id === id);
    return sum + (merch?.price || 0) * data.quantity;
  }, 0);
});

const addonsPrice = computed(() => {
  return workshopsPrice.value + mealsPrice.value + merchPrice.value;
});

const vipDiscount = computed(() => {
  if (props.ticketType === 'vip') {
    return workshopsPrice.value * 0.1;
  }
  return 0;
});

const totalPrice = computed(() => {
  return ticketPrice.value + addonsPrice.value - vipDiscount.value;
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
</script>
