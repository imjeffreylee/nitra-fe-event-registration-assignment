<script setup>
import { computed } from 'vue';

const props = defineProps({
  /**
   * The steps array. Each element can be a string (label) or an object with { id, label }.
   */
  steps: {
    type: Array,
    required: true,
    default: () => [],
  },
  /**
   * The current active step (1-based index).
   */
  modelValue: {
    type: Number,
    required: true,
    default: 1,
  },
  /**
   * Whether steps prior to the active step are clickable for navigation.
   */
  clickable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'step-click']);

// Normalize steps to always be objects with { id, label, index }
const normalizedSteps = computed(() => {
  return props.steps.map((step, idx) => {
    const index = idx + 1;
    if (typeof step === 'string') {
      return { id: `step-${index}`, label: step, index };
    }
    return {
      id: step.id || `step-${index}`,
      label: step.label,
      index,
    };
  });
});

const handleStepClick = (step) => {
  if (!props.clickable) return;

  // Allow clicking completed steps or the active step
  if (step.index <= props.modelValue) {
    emit('update:modelValue', step.index);
    emit('step-click', step);
  }
};
</script>

<template>
  <div
    role="nav"
    aria-label="Progress Stepper"
    class="w-full max-w-[1440px] h-20 px-4 md:px-16 lg:px-[120px] flex flex-row items-center justify-between mx-auto select-none"
  >
    <template v-for="(step, idx) in normalizedSteps" :key="step.id">
      <!-- Step Item -->
      <div
        class="flex flex-row items-center gap-2.5 h-8 flex-none transition-all duration-200"
        :class="[
          props.clickable && step.index <= props.modelValue
            ? 'cursor-pointer hover:opacity-80 active:opacity-95'
            : '',
        ]"
        @click="handleStepClick(step)"
        :aria-current="step.index === props.modelValue ? 'step' : undefined"
        :aria-disabled="!(props.clickable && step.index <= props.modelValue)"
      >
        <!-- Step Circle -->
        <div
          class="relative flex flex-col justify-center items-center w-8 h-8 rounded-full transition-colors duration-200"
          :class="[
            step.index <= props.modelValue
              ? 'bg-brand-emphasis-rest text-white'
              : 'bg-disable text-neutral-quiet',
          ]"
        >
          <!-- Show step number -->
          <span
            class="text-[14px] font-semibold text-center leading-[17px]"
            :class="[
              step.index <= props.modelValue
                ? 'text-white'
                : 'text-neutral-quiet',
            ]"
          >
            {{ step.index }}
          </span>
        </div>

        <!-- Step Label -->
        <span
          class="inline-block text-[13px] leading-[16px] transition-colors duration-200 truncate max-w-[120px] md:max-w-none"
          :class="[
            step.index === props.modelValue
              ? 'font-semibold text-neutral'
              : 'font-normal text-neutral-quiet',
          ]"
        >
          {{ step.label }}
        </span>
      </div>

      <!-- Connector Line (shown between steps) -->
      <div
        v-if="idx < normalizedSteps.length - 1"
        class="flex-1 min-w-4 md:min-w-8 lg:min-w-16 h-[2px] px-2 md:px-4 flex items-center"
      >
        <div
          class="w-full h-full rounded-sm transition-colors duration-200"
          :class="[
            step.index < props.modelValue
              ? 'bg-brand-emphasis-rest'
              : 'bg-disable',
          ]"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Perfect fallback for custom font if needed */
.font-sans {
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}
</style>
