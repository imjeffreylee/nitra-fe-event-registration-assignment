<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TicketTypeSection from '../components/attendeeInfo/TicketTypeSection.vue';
import SectionTitle from '../components/SectionTitle.vue';
import FormField from '../components/attendeeInfo/FormField.vue';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import { event } from '../mocks/event.js';
import { useRegistration } from '../composables/useRegistration.js';

const router = useRouter();

const {
  ticketType: selectedTicket,
  fullName,
  email,
  phone,
  company,
  jobTitle,
  shippingAddress,
  selectedMerchandise,
} = useRegistration();

const hasMerchandise = computed(() => {
  return Object.values(selectedMerchandise.value).some(
    (m) => m && m.quantity > 0,
  );
});
</script>

<template>
  <PageContainer content-class="space-y-8">
    <TicketTypeSection
      title="Select Ticket Type"
      :tickets="event.ticketTypes"
      v-model="selectedTicket"
    />
    <SectionTitle>Attendee Information</SectionTitle>
    <!-- Form Grid -->
    <div class="flex flex-col items-start p-0 gap-5 self-stretch">
      <!-- Row 1: Full Name + Email -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          label="Full Name *"
          placeholder="Enter your full name"
          v-model="fullName"
          required
        />
        <FormField
          label="Email *"
          type="email"
          placeholder="Enter your email"
          v-model="email"
          required
        />
      </div>
      <!-- Row 2: Phone + Company -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          label="Phone *"
          type="tel"
          placeholder="Enter your phone number"
          v-model="phone"
          required
        />
        <FormField
          label="Company *"
          placeholder="Enter your company name"
          v-model="company"
          required
        />
      </div>
      <!-- Row 3: Job Title (full width) -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          label="Job Title"
          placeholder="Enter your job title"
          v-model="jobTitle"
        />
      </div>
      <!-- Row 4: Shipping Address (full width) -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          :label="
            hasMerchandise
              ? 'Shipping Address *'
              : 'Shipping Address (Optional)'
          "
          placeholder="Enter your shipping address"
          v-model="shippingAddress"
          :required="hasMerchandise"
          hint="Shipping address is required for merchandise orders"
        />
      </div>
    </div>
  </PageContainer>
  <ActionBar
    :show-back="false"
    @next="router.push('/sessions')"
    next-label="Next: Session Selection"
  />
</template>
