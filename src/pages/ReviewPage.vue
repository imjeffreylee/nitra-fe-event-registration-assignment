<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import ReviewCard from '../components/review/ReviewCard.vue';
import { sessions } from '../mocks/sessions.js';
import { event } from '../mocks/event.js';

const router = useRouter();

// Persisted attendee details loaded from localStorage
const fullName = ref('');
const email = ref('');
const phone = ref('');
const company = ref('');
const jobTitle = ref('');
const shippingAddress = ref('');
const ticketType = ref('vip');

// Persisted selected sessions
const selectedSessionIds = ref([]);

onMounted(() => {
  fullName.value = localStorage.getItem('attendee_full_name') || '';
  email.value = localStorage.getItem('attendee_email') || '';
  phone.value = localStorage.getItem('attendee_phone') || '';
  company.value = localStorage.getItem('attendee_company') || '';
  jobTitle.value = localStorage.getItem('attendee_job_title') || '';
  shippingAddress.value =
    localStorage.getItem('attendee_shipping_address') || '';
  ticketType.value = localStorage.getItem('selected_ticket') || 'vip';

  const savedSessions = localStorage.getItem('selected_sessions');
  if (savedSessions) {
    try {
      selectedSessionIds.value = JSON.parse(savedSessions);
    } catch (e) {}
  }
});

const ticketTypeObj = computed(() => {
  return (
    event.ticketTypes.find((t) => t.id === ticketType.value) ||
    event.ticketTypes[0]
  );
});

const ticketPrice = computed(() => {
  return ticketTypeObj.value?.price || 0;
});

const ticketLabel = computed(() => {
  return ticketTypeObj.value?.name || '';
});

// Format attendee information as generic key-value items
const attendeeItems = computed(() => {
  return [
    { label: 'Name', value: fullName.value || '—' },
    { label: 'Email', value: email.value || '—' },
    { label: 'Phone', value: phone.value || '—' },
    { label: 'Company', value: company.value || '—' },
    { label: 'Job Title', value: jobTitle.value || '—' },
    {
      label: 'Ticket Type',
      value: `${ticketLabel.value} (${formatCurrency(ticketPrice.value)})`,
    },
    {
      label: 'Shipping Address',
      value: shippingAddress.value || 'Not provided',
    },
  ];
});

// Format selected sessions list
const sessionItems = computed(() => {
  const selected = sessions.filter((s) =>
    selectedSessionIds.value.includes(s.id),
  );
  if (selected.length === 0) {
    return [{ label: 'Sessions', value: 'No sessions selected' }];
  }
  return selected.map((s) => ({
    label: formatSessionTime(s),
    value: s.title,
  }));
});

// Formats a session date & time range cleanly
const formatSessionTime = (session) => {
  try {
    const startDate = new Date(session.date);
    const endDate = new Date(session.endDate);

    const day = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });

    const start = startDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });

    const end = endDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC',
    });

    return `${day}, ${start} – ${end}`;
  } catch (e) {
    return '';
  }
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};
</script>

<template>
  <PageContainer content-class="space-y-8">
    <SectionTitle>Review Your Registration</SectionTitle>

    <!-- Review Block 1: Attendee Information -->
    <ReviewCard
      title="Attendee Information"
      :items="attendeeItems"
      @edit="router.push('/attendeeinfo')"
    />

    <!-- Review Block 2: Selected Sessions -->
    <ReviewCard
      title="Selected Sessions"
      :items="sessionItems"
      @edit="router.push('/sessions')"
    />
  </PageContainer>
  <ActionBar
    :show-next="false"
    @back="router.push('/addons')"
    next-label="Submit Registration"
  />
</template>
