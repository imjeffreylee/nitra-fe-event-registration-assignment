<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import ReviewCard from '../components/review/ReviewCard.vue';

const router = useRouter();

// Attendee fields loaded from localStorage
const fullName = ref('');
const email = ref('');
const phone = ref('');
const company = ref('');
const jobTitle = ref('');
const shippingAddress = ref('');
const ticketType = ref('vip');

onMounted(() => {
  fullName.value = localStorage.getItem('attendee_full_name') || '';
  email.value = localStorage.getItem('attendee_email') || '';
  phone.value = localStorage.getItem('attendee_phone') || '';
  company.value = localStorage.getItem('attendee_company') || '';
  jobTitle.value = localStorage.getItem('attendee_job_title') || '';
  shippingAddress.value =
    localStorage.getItem('attendee_shipping_address') || '';
  ticketType.value = localStorage.getItem('selected_ticket') || 'vip';
});

const handleEdit = () => {
  router.push('/attendeeinfo');
};
</script>

<template>
  <PageContainer content-class="space-y-8">
    <SectionTitle>Review Your Registration</SectionTitle>

    <!-- Review Attendee Information -->
    <ReviewCard
      :full-name="fullName"
      :email="email"
      :phone="phone"
      :company="company"
      :job-title="jobTitle"
      :shipping-address="shippingAddress"
      :ticket-type="ticketType"
      @edit="handleEdit"
    />
  </PageContainer>
  <ActionBar
    :show-next="false"
    @back="router.push('/addons')"
    next-label="Submit Registration"
  />
</template>
