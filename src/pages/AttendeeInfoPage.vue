<script setup>
import { useRouter } from 'vue-router';
import TicketTypeSection from '../components/TicketTypeSection.vue';
import SectionTitle from '../components/SectionTitle.vue';
import { event } from '../mocks/event.js';

const router = useRouter();
</script>

<template>
  <main
    class="flex-1 flex flex-col justify-center items-center py-10 max-w-[1200px] mx-auto w-full"
  >
    <div
      class="bg-white border border-gray-100 rounded-lg w-full flex flex-col min-h-[350px] justify-between"
    >
      <div class="space-y-4">
        <TicketTypeSection
          title="Select Ticket Type"
          :tickets="event.ticketTypes"
        />
        <SectionTitle>Attendee Information</SectionTitle>
      </div>
      <div class="flex justify-end p-4">
        <q-btn color="primary" label="Next" @click="router.push('/sessions')" />
      </div>
    </div>
  </main>
</template>
