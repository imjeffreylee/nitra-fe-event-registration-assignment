<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import ReviewCard from '../components/review/ReviewCard.vue';
import { sessions } from '../mocks/sessions.js';
import { addons } from '../mocks/addons.js';
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

// Persisted selected addons
const selectedWorkshops = ref([]);
const selectedMeals = ref([]);
const selectedMerch = ref({});

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

  // Load workshops
  const savedWorkshops = localStorage.getItem('selected_workshops');
  if (savedWorkshops) {
    try {
      selectedWorkshops.value = JSON.parse(savedWorkshops);
    } catch (e) {}
  }

  // Load meals
  const savedMeals = localStorage.getItem('selected_meals');
  if (savedMeals) {
    try {
      selectedMeals.value = JSON.parse(savedMeals);
    } catch (e) {}
  }

  // Load merchandise
  const savedMerch = localStorage.getItem('selected_merchandise');
  if (savedMerch) {
    try {
      selectedMerch.value = JSON.parse(savedMerch);
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

// Format selected addons list by kind
const addonItems = computed(() => {
  const list = [];

  // 1. Selected Workshops
  selectedWorkshops.value.forEach((id) => {
    const ws = addons.find((a) => a.id === id);
    if (ws) {
      list.push({
        label: 'Workshop',
        value: `${ws.name} (${formatCurrency(ws.price)})`,
      });
    }
  });

  // 2. Selected Meals
  selectedMeals.value.forEach((id) => {
    const meal = addons.find((a) => a.id === id);
    if (meal) {
      list.push({
        label: 'Meal Package',
        value: `${meal.name} (${formatCurrency(meal.price)})`,
      });
    }
  });

  // 3. Selected Merchandise
  Object.entries(selectedMerch.value).forEach(([id, data]) => {
    if (!data || data.quantity <= 0) return;
    const merch = addons.find((a) => a.id === id);
    if (merch) {
      let displayName = merch.name;
      if (merch.sizes && merch.sizes.length > 0 && data.size) {
        displayName += ` (${data.size})`;
      }
      displayName += ` x ${data.quantity}`;

      const itemTotal = merch.price * data.quantity;
      list.push({
        label: 'Merchandise',
        value: `${displayName} (${formatCurrency(itemTotal)})`,
      });
    }
  });

  if (list.length === 0) {
    return [{ label: 'Add-ons', value: 'No add-ons selected' }];
  }

  return list;
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

    <!-- Review Block 3: Selected Add-ons -->
    <ReviewCard
      title="Selected Add-ons"
      :items="addonItems"
      @edit="router.push('/addons')"
    />
  </PageContainer>
  <ActionBar
    :show-next="false"
    @back="router.push('/addons')"
    next-label="Submit Registration"
  />
</template>
