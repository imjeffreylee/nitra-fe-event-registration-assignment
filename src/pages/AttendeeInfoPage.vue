<script setup>
import { useRouter } from 'vue-router';
import TicketTypeSection from '../components/TicketTypeSection.vue';
import SectionTitle from '../components/SectionTitle.vue';
import FormField from '../components/FormField.vue';
import ActionBar from '../components/ActionBar.vue';
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
      <div class="space-y-8">
        <TicketTypeSection
          title="Select Ticket Type"
          :tickets="event.ticketTypes"
        />
        <SectionTitle>Attendee Information</SectionTitle>
        <!-- Form Grid -->
        <div class="flex flex-col items-start p-0 gap-5 self-stretch">
          <!-- Row 1: Full Name + Email -->
          <div class="flex flex-row items-start p-0 gap-6 self-stretch">
            <FormField label="Full Name" placeholder="Enter your full name" />
            <FormField
              label="Email"
              type="email"
              placeholder="Enter your email"
            />
          </div>
          <!-- Row 2: Phone + Company -->
          <div class="flex flex-row items-start p-0 gap-6 self-stretch">
            <FormField
              label="Phone"
              type="tel"
              placeholder="Enter your phone number"
            />
            <FormField label="Company" placeholder="Enter your company name" />
          </div>
          <!-- Row 3: Job Title (full width) -->
          <div class="flex flex-row items-start p-0 gap-6 self-stretch">
            <FormField label="Job Title" placeholder="Enter your job title" />
          </div>
          <!-- Row 4: Shipping Address (full width) -->
          <div class="flex flex-row items-start p-0 gap-6 self-stretch">
            <FormField
              label="Shipping Address (Optional)"
              placeholder="Enter your shipping address"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
  <ActionBar
    :show-back="false"
    @next="router.push('/sessions')"
    next-label="Next: Session Selection"
  />
</template>
