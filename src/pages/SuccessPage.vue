<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { event } from '../mocks/event.js';
import SuccessIcon from '../assets/SuccessIcon.svg';

const route = useRoute();
const router = useRouter();

// Retrieve registration details from route query params
const name = computed(() => route.query.name || 'Attendee');
const email = computed(() => route.query.email || 'your email');
const ticketType = computed(() => {
  const t = route.query.ticket || 'vip';
  return t.toUpperCase();
});
const confirmationNumber = computed(() => route.query.conf || 'TC2028-47291');
const eventName = computed(() => event.name || 'TechConf 2025');

const startNewRegistration = () => {
  router.push('/attendeeinfo');
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
      class="font-sans not-italic fw-[680] text-[28px] leading-[32px] text-[#11925C] [font-variation-settings:'slnt'_0] m-0 text-center flex-none order-1 flex-grow-0"
    >
      Registration Complete!
    </h2>

    <!-- Confirmation Number -->
    <div
      class="font-sans not-italic fw-[485] text-[16px] leading-[24px] text-[rgba(0,0,0,0.9)] [font-variation-settings:'slnt'_0] text-center flex-none order-2 flex-grow-0"
    >
      Confirmation #{{ confirmationNumber }}
    </div>

    <!-- Thank you message -->
    <p
      class="w-[408px] h-[32px] font-sans not-italic fw-[485] text-[12px] leading-[16px] text-[rgba(0,0,0,0.6)] [font-variation-settings:'slnt'_0] m-0 text-center flex-none order-3 flex-grow-0"
    >
      Thank you, {{ name }}! Your {{ ticketType }} registration for
      {{ eventName }} is confirmed. You will receive a confirmation email at
      {{ email }}.
    </p>

    <!-- Action Button to return to start / book another -->
    <button
      class="flex flex-row justify-center items-center py-[10px] px-[8px] w-[126px] min-w-[72px] h-[40px] bg-[#FB7429] rounded-[10px] border-none cursor-pointer outline-none transition-all duration-200 ease flex-none order-4 flex-grow-0 hover:bg-[#e2611a] active:bg-[#c95112]"
      @click="startNewRegistration"
      aria-label="Book another registration"
    >
      <div
        class="flex flex-row justify-center items-center py-0 px-[8px] gap-[8px] w-[110px] h-[20px] flex-none order-1 flex-grow-0"
      >
        <span
          class="font-sans not-italic fw-[610] text-[14px] leading-[20px] text-center text-white [font-variation-settings:'slnt'_0] flex-none order-0 flex-grow-0"
        >
          Back to Home
        </span>
      </div>
    </button>
  </div>
</template>
