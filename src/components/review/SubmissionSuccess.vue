<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useEvent } from '../../composables/useEvent.js';
import SuccessIcon from '../../assets/SuccessIcon.svg';

const props = defineProps({
  registrantName: {
    type: String,
    default: '',
  },
  registrantEmail: {
    type: String,
    default: '',
  },
  registrantTicket: {
    type: String,
    default: 'vip',
  },
  confirmation: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['restart']);

const { event } = useEvent();
const { t } = useI18n();

// Retrieve registration details from props
const name = computed(() => props.registrantName || t('defaultAttendeeName'));
const email = computed(() => props.registrantEmail || t('defaultEmailPlaceholder'));
const ticketType = computed(() => {
  const tType = props.registrantTicket || 'vip';
  return tType.toUpperCase();
});
const confirmationNumber = computed(() => props.confirmation || 'TC2028-47291');
const eventName = computed(() => event.value?.name || 'TechConf 2025');

const startNewRegistration = () => {
  emit('restart');
};
</script>

<template>
  <div
    class="flex flex-col justify-center items-center py-[60px] px-4 gap-4 w-full max-w-[1440px] bg-white self-stretch flex-1 mx-auto"
  >
    <!-- Success Icon -->
    <SuccessIcon
      class="flex-none order-0 flex-grow-0 w-20 h-20"
      aria-hidden="true"
    />

    <!-- Title -->
    <h2
      class="font-sans not-italic fw-[680] text-[28px] leading-[32px] text-success [font-variation-settings:'slnt'_0] m-0 text-center flex-none order-1 flex-grow-0"
    >
      {{ $t('registrationCompleteTitle') }}
    </h2>

    <!-- Confirmation Number -->
    <div
      class="font-sans not-italic fw-[485] text-[16px] leading-[24px] text-neutral [font-variation-settings:'slnt'_0] text-center flex-none order-2 flex-grow-0"
    >
      {{ $t('confirmationNumberLabel', { conf: confirmationNumber }) }}
    </div>

    <!-- Thank you message -->
    <p
      class="w-[408px] h-[32px] font-sans not-italic fw-[485] text-[12px] leading-[16px] text-neutral-muted [font-variation-settings:'slnt'_0] m-0 text-center flex-none order-3 flex-grow-0"
    >
      {{ $t('successMessagePattern', { name, ticketType, eventName, email }) }}
    </p>

    <!-- Action Button to return to start / book another -->
    <button
      class="flex flex-row justify-center items-center py-[10px] px-[8px] w-[126px] min-w-[72px] h-[40px] bg-accent-emphasis-rest rounded-[10px] border-none cursor-pointer outline-none transition-all duration-200 ease flex-none order-4 flex-grow-0 hover:bg-accent-emphasis-hover active:bg-accent-emphasis-active"
      @click="startNewRegistration"
      :aria-label="$t('bookAnotherRegAriaLabel')"
    >
      <div
        class="flex flex-row justify-center items-center py-0 px-[8px] gap-[8px] w-[110px] h-[20px] flex-none order-1 flex-grow-0"
      >
        <span
          class="font-sans not-italic fw-[610] text-[14px] leading-[20px] text-center text-white [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          {{ $t('backToHomeBtn') }}
        </span>
      </div>
    </button>
  </div>
</template>
