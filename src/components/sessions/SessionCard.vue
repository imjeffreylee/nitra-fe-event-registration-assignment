<template>
  <div
    class="flex flex-col items-start p-4 gap-2 shadow-[0px_4px_16px_rgba(0,0,0,0.08),0px_1px_3px_rgba(0,0,0,0.04)] rounded-[6px] w-full max-w-[592px] min-h-[162px] box-border transition-all duration-200"
    :class="[
      isFull && !selected
        ? 'bg-surface-l1 border border-solid border-neutral-muted opacity-60 cursor-not-allowed'
        : selected
          ? 'bg-brand-subtle-rest border-2 border-solid border-brand-emphasis cursor-pointer'
          : 'bg-surface-l1 border border-solid border-neutral-muted hover:border-gray-300 cursor-pointer',
    ]"
    @click="handleCardClick"
  >
    <!-- Top Row (Badge + Selection Checkbox) -->
    <div
      class="flex flex-row justify-between items-center w-full self-stretch flex-none h-5"
    >
      <!-- Left part: Track Badge & Time Conflict Badge -->
      <div class="flex flex-row items-center gap-2">
        <TrackBadge :track="session.track" />
        <ConflictBadge v-if="conflict" :conflicting-name="typeof conflict === 'string' ? conflict : ''" />
      </div>

      <!-- Selection Checkbox -->
      <div
        class="relative w-4 h-4 flex-none rounded-[2px] transition-all duration-200"
        :class="[
          selected ? 'bg-brand-emphasis-rest' : 'border border-solid border-neutral-emphasis',
        ]"
      >
        <!-- Checkmark SVG -->
        <svg
          v-if="selected"
          class="absolute w-[10px] h-[7px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white"
          viewBox="0 0 10 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 3.5L3.5 6L9 1"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- Title -->
    <h4
      class="text-[16px] leading-5 font-semibold text-neutral self-stretch flex-none m-0 truncate"
    >
      {{ session.title }}
    </h4>

    <!-- Speaker -->
    <div
      class="text-[12px] leading-4 fw-[485] text-neutral-muted self-stretch flex-none truncate [font-variation-settings:'slnt'_0]"
    >
      {{ session.speaker }}, {{ session.speakerTitle }}
    </div>

    <!-- Time Range -->
    <div
      class="text-[11px] leading-[14px] fw-[485] text-neutral-quiet self-stretch flex-none [font-variation-settings:'slnt'_0]"
    >
      {{ formattedTimeRange }}
    </div>

    <!-- Capacity Bar -->
    <div
      class="relative w-full h-[6px] bg-disable rounded-[3px] self-stretch flex-none mt-1"
    >
      <div
        class="absolute left-0 top-0 h-[6px] rounded-[3px] transition-all duration-300"
        :class="capacityBarColorClass"
        :style="{ width: `${registeredPercentage}%` }"
      />
    </div>

    <!-- Spots Left Status -->
    <div
      class="text-[11px] leading-[14px] font-medium flex-none"
      :class="isFull ? 'text-neutral-muted' : 'text-accent-emphasis'"
    >
      <span v-if="isFull" class="fw-[600]">{{ $t('workshopSoldOut') }}</span>
      <span v-else class="fw-[500]">{{ $t('spotsLeft', { count: spotsLeft }, spotsLeft) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TrackBadge from './TrackBadge.vue';
import ConflictBadge from '../ConflictBadge.vue';

const props = defineProps({
  session: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  conflict: {
    type: [Boolean, String],
    default: false,
  },
});

const emit = defineEmits(['select']);

// Check if fully booked
const isFull = computed(
  () => props.session.registered >= props.session.capacity,
);

// Spots left calculation
const spotsLeft = computed(() => {
  return Math.max(props.session.capacity - props.session.registered, 0);
});

// Capacity percentage
const registeredPercentage = computed(() => {
  if (!props.session.capacity) return 0;
  return Math.min(
    (props.session.registered / props.session.capacity) * 100,
    100,
  );
});

// Capacity bar color based on registration percentage
const capacityBarColorClass = computed(() => {
  if (isFull.value) {
    return 'bg-neutral-disabled-rest';
  }
  const percentage = registeredPercentage.value;
  if (percentage >= 75) {
    return 'bg-accent-bold-rest';
  }
  if (percentage >= 50) {
    return 'bg-[var(--text-warning-default)]';
  }
  return 'bg-brand-emphasis-rest';
});

// Clean time formatting helper (UTC-based to ensure machine consistency)
const formatTime = (isoString) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });
  } catch (e) {
    return '';
  }
};

const formattedTimeRange = computed(() => {
  const start = formatTime(props.session.date);
  const end = formatTime(props.session.endDate);
  return start && end ? `${start} – ${end}` : '';
});

// Handle card click
const handleCardClick = () => {
  // Allow toggling deselection of selected cards even if full
  if (isFull.value && !props.selected) {
    return;
  }
  emit('select');
};
</script>
