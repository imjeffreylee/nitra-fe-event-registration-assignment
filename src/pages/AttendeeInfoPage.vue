<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import TicketTypeSection from '../components/attendeeInfo/TicketTypeSection.vue';
import SectionTitle from '../components/SectionTitle.vue';
import FormField from '../components/attendeeInfo/FormField.vue';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import { event } from '../mocks/event.js';

const router = useRouter();
const selectedTicket = ref('vip');

// Form state variables
const fullName = ref('');
const email = ref('');
const phone = ref('');
const company = ref('');
const jobTitle = ref('');
const shippingAddress = ref('');

onMounted(() => {
  const saved = localStorage.getItem('selected_ticket');
  if (saved) {
    selectedTicket.value = saved;
  } else {
    localStorage.setItem('selected_ticket', 'vip');
  }

  fullName.value = localStorage.getItem('attendee_full_name') || '';
  email.value = localStorage.getItem('attendee_email') || '';
  phone.value = localStorage.getItem('attendee_phone') || '';
  company.value = localStorage.getItem('attendee_company') || '';
  jobTitle.value = localStorage.getItem('attendee_job_title') || '';
  shippingAddress.value =
    localStorage.getItem('attendee_shipping_address') || '';
});

watch(selectedTicket, (newVal) => {
  localStorage.setItem('selected_ticket', newVal);
});

watch(fullName, (newVal) => {
  localStorage.setItem('attendee_full_name', newVal);
});

watch(email, (newVal) => {
  localStorage.setItem('attendee_email', newVal);
});

watch(phone, (newVal) => {
  localStorage.setItem('attendee_phone', newVal);
});

watch(company, (newVal) => {
  localStorage.setItem('attendee_company', newVal);
});

watch(jobTitle, (newVal) => {
  localStorage.setItem('attendee_job_title', newVal);
});

watch(shippingAddress, (newVal) => {
  localStorage.setItem('attendee_shipping_address', newVal);
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
          label="Full Name"
          placeholder="Enter your full name"
          v-model="fullName"
          required
        />
        <FormField
          label="Email"
          type="email"
          placeholder="Enter your email"
          v-model="email"
          required
        />
      </div>
      <!-- Row 2: Phone + Company -->
      <div class="flex flex-row items-start p-0 gap-6 self-stretch">
        <FormField
          label="Phone"
          type="tel"
          placeholder="Enter your phone number"
          v-model="phone"
          required
        />
        <FormField
          label="Company"
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
          label="Shipping Address (Optional)"
          placeholder="Enter your shipping address"
          v-model="shippingAddress"
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
