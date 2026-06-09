<template>
  <div
    class="flex flex-col md:flex-row md:items-start justify-between p-4 gap-4 shadow-[0px_4px_16px_rgba(0,0,0,0.08),0px_1px_3px_rgba(0,0,0,0.04)] rounded-[6px] w-full max-w-[788px] min-h-[120px] box-border transition-all duration-200"
    :class="[
      isDisabled
        ? 'bg-[#F4F5F6] border border-solid border-[#E3E6E8] opacity-60 cursor-not-allowed'
        : selected
          ? 'bg-[#EEF6F7] border-2 border-solid border-[#264D4F] cursor-pointer'
          : 'bg-[#F4F5F6] border border-solid border-[#E3E6E8] hover:border-gray-300 cursor-pointer',
    ]"
    @click="handleCardClick"
  >
    <!-- Left Column: Workshop Details -->
    <div class="flex-1 flex flex-col items-start gap-1.5 min-w-0">
      <!-- Title & Time Conflict Badge -->
      <div class="flex flex-row flex-wrap items-center gap-2 w-full">
        <h4
          class="text-[16px] leading-5 font-semibold text-neutral m-0 truncate"
        >
          {{ workshop.name }}
        </h4>
        <span
          v-if="conflict"
          class="text-[10px] leading-3 font-semibold px-2 py-0.5 bg-[#FFF2E6] text-[#D86400] rounded-full border border-solid border-[#FFE0CC] [font-variation-settings:'slnt'_0]"
        >
          Time Conflict
        </span>
      </div>

      <!-- Description -->
      <p
        class="text-[12px] leading-4 font-regular text-neutral-muted m-0 self-stretch line-clamp-2 md:line-clamp-none [font-variation-settings:'slnt'_0]"
      >
        {{ workshop.description }}
      </p>

      <!-- Date & Time + Spots left -->
      <div
        class="flex flex-col items-start gap-1 text-[11px] leading-[14px] font-medium text-neutral-quiet"
      >
        <span class="[font-variation-settings:'slnt'_0]">{{
          formattedTimeRange
        }}</span>
        <span>
          {{ isFull ? 'Sold Out' : `${spotsLeft} spots remaining` }}
        </span>
      </div>
    </div>

    <!-- Right Column: Price -->
    <div class="flex flex-col items-start md:items-end flex-none">
      <span class="text-[16px] leading-5 font-bold text-[#264D4F]">
        ${{ workshop.price }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  workshop: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  conflict: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select']);

// Check if fully booked
const isFull = computed(
  () => props.workshop.registered >= props.workshop.capacity,
);

// Check if card is unselectable
const isDisabled = computed(
  () => (isFull.value || props.conflict) && !props.selected,
);

// Spots left calculation
const spotsLeft = computed(() => {
  return Math.max(props.workshop.capacity - props.workshop.registered, 0);
});

// Date and time formatter
const formattedTimeRange = computed(() => {
  try {
    const startDate = new Date(props.workshop.date);
    const endDate = new Date(props.workshop.endDate);

    // Format date like "Nov 15"
    const day = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

    // Format start time
    const start = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });

    // Format end time
    const end = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });

    return `${day}, ${start} – ${end}`;
  } catch (e) {
    return '';
  }
});

// Handle card clicks
const handleCardClick = () => {
  if (isDisabled.value) {
    return;
  }
  emit('select');
};
</script>
