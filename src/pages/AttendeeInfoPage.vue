<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import TicketTypeSection from '../components/attendeeInfo/TicketTypeSection.vue';
import SectionTitle from '../components/SectionTitle.vue';
import FormField from '../components/attendeeInfo/FormField.vue';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import { useRegistration } from '../composables/useRegistration.js';
import { useEvent } from '../composables/useEvent.js';

const router = useRouter();
const { event } = useEvent();

const {
  ticketType: selectedTicket,
  fullName,
  email,
  phone,
  company,
  jobTitle,
  shippingAddress,
  isRequired,
  isEmailValid,
  isPhoneValid,
  fullNameErrorMessage,
  emailErrorMessage,
  phoneErrorMessage,
  companyErrorMessage,
  shippingAddressErrorMessage,
} = useRegistration();
</script>

<template>
  <PageContainer content-class="space-y-8">
    <TicketTypeSection
      title="Select Ticket Type"
      :tickets="event?.ticketTypes || []"
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
          :required="isRequired.fullName"
          :error="!!fullNameErrorMessage"
          :error-message="fullNameErrorMessage"
        />
        <FormField
          label="Email *"
          type="email"
          placeholder="Enter your email"
          v-model="email"
          :required="isRequired.email"
          :error="!isEmailValid"
          :error-message="emailErrorMessage"
        />
      </div>
      <!-- Row 2: Phone + Company -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          label="Phone *"
          type="tel"
          placeholder="Enter your phone number"
          v-model="phone"
          :required="isRequired.phone"
          :error="!isPhoneValid"
          :error-message="phoneErrorMessage"
          numeric-only
        />
        <FormField
          label="Company *"
          placeholder="Enter your company name"
          v-model="company"
          :required="isRequired.company"
          :error="!!companyErrorMessage"
          :error-message="companyErrorMessage"
        />
      </div>
      <!-- Row 3: Job Title (full width) -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          label="Job Title"
          placeholder="Enter your job title"
          v-model="jobTitle"
          :required="isRequired.jobTitle"
        />
      </div>
      <!-- Row 4: Shipping Address (full width) -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          :label="
            isRequired.shippingAddress
              ? 'Shipping Address *'
              : 'Shipping Address (Optional)'
          "
          placeholder="Enter your shipping address"
          v-model="shippingAddress"
          :required="isRequired.shippingAddress"
          :error="!!shippingAddressErrorMessage"
          :error-message="shippingAddressErrorMessage"
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
