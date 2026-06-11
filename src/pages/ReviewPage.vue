<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import ReviewCard from '../components/review/ReviewCard.vue';
import ErrorBanner from '../components/review/ErrorBanner.vue';
import { sessions } from '../mocks/sessions.js';
import { addons } from '../mocks/addons.js';
import { event } from '../mocks/event.js';
import { useRegistration } from '../composables/useRegistration.js';

const router = useRouter();

// Retrieve all reactive values and actions from the global composable
const {
  fullName,
  email,
  phone,
  company,
  jobTitle,
  shippingAddress,
  ticketType,
  selectedSessions: selectedSessionIds,
  selectedWorkshops,
  selectedMeals,
  selectedMerchandise: selectedMerch,
  isRequired,
  isEmailValid,
  isPhoneValid,
  fullNameErrorMessage,
  emailErrorMessage,
  phoneErrorMessage,
  companyErrorMessage,
  shippingAddressErrorMessage,
  hasSessionConflict,
  hasWorkshopConflict,
  clearRegistration,
} = useRegistration();

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
    {
      label: 'Name',
      value: fullName.value,
      required: isRequired.value.fullName,
    },
    {
      label: 'Email',
      value: email.value,
      required: isRequired.value.email,
      invalid: !isEmailValid.value,
    },
    {
      label: 'Phone',
      value: phone.value,
      required: isRequired.value.phone,
      invalid: !isPhoneValid.value,
    },
    {
      label: 'Company',
      value: company.value,
      required: isRequired.value.company,
    },
    {
      label: 'Job Title',
      value: jobTitle.value,
      required: isRequired.value.jobTitle,
    },
    {
      label: 'Ticket Type',
      value: `${ticketLabel.value} (${formatCurrency(ticketPrice.value)})`,
    },
    {
      label: 'Shipping Address',
      value: shippingAddress.value,
      required: isRequired.value.shippingAddress,
      errorMessage: '— (required for merchandise)',
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
    invalid: !!hasWorkshopConflict(s),
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
        invalid: !!hasSessionConflict(ws),
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

// Subtotal Calculations for Pricing Summary
const workshopsPrice = computed(() => {
  return selectedWorkshops.value.reduce((sum, id) => {
    const ws = addons.find((a) => a.id === id);
    return sum + (ws?.price || 0);
  }, 0);
});

const mealsPrice = computed(() => {
  return selectedMeals.value.reduce((sum, id) => {
    const meal = addons.find((a) => a.id === id);
    return sum + (meal?.price || 0);
  }, 0);
});

const merchPrice = computed(() => {
  return Object.entries(selectedMerch.value).reduce((sum, [id, data]) => {
    if (!data || !data.quantity) return sum;
    const merch = addons.find((a) => a.id === id);
    return sum + (merch?.price || 0) * data.quantity;
  }, 0);
});

const addonsPrice = computed(() => {
  return workshopsPrice.value + mealsPrice.value + merchPrice.value;
});

const vipDiscount = computed(() => {
  if (ticketType.value === 'vip') {
    return workshopsPrice.value * 0.1;
  }
  return 0;
});

const totalPrice = computed(() => {
  return ticketPrice.value + addonsPrice.value - vipDiscount.value;
});

// Format all individual and totaled pricing rows as key-value items
const pricingSummaryItems = computed(() => {
  const list = [];

  // 1. Ticket Row
  list.push({
    label: `${ticketLabel.value} Ticket`,
    value: formatCurrency(ticketPrice.value),
  });

  // 2. Workshops Rows
  selectedWorkshops.value.forEach((id) => {
    const ws = addons.find((a) => a.id === id);
    if (ws) {
      list.push({
        label: ws.name,
        value: formatCurrency(ws.price),
      });
    }
  });

  // 3. Meals Rows
  selectedMeals.value.forEach((id) => {
    const meal = addons.find((a) => a.id === id);
    if (meal) {
      list.push({
        label: meal.name,
        value: formatCurrency(meal.price),
      });
    }
  });

  // 4. Merchandise Rows
  Object.entries(selectedMerch.value).forEach(([id, data]) => {
    if (!data || data.quantity <= 0) return;
    const merch = addons.find((a) => a.id === id);
    if (merch) {
      let displayName = merch.name;
      if (merch.sizes && merch.sizes.length > 0 && data.size) {
        displayName += ` (${data.size})`;
      }
      displayName += ` x ${data.quantity}`;
      list.push({
        label: displayName,
        value: formatCurrency(merch.price * data.quantity),
      });
    }
  });

  // 5. VIP Discount Row
  if (vipDiscount.value > 0) {
    list.push({
      label: 'Workshop discount (VIP 10%)',
      value: `-${formatCurrency(vipDiscount.value)}`,
      labelClass: 'fw-[485] text-[#264D4F]',
      valueClass: 'fw-[485] text-[#264D4F]',
    });
  }

  // 6. Total Row
  list.push({
    label: 'Grand Total',
    value: formatCurrency(totalPrice.value),
    labelClass: 'fw-[550] text-neutral',
    valueClass: 'fw-[550] text-neutral',
  });

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

// Compile active missing errors to pass to ErrorBanner
const validationErrors = computed(() => {
  const errs = [];
  if (fullNameErrorMessage.value) {
    errs.push(`Step 1: ${fullNameErrorMessage.value}`);
  }
  if (emailErrorMessage.value) {
    errs.push(`Step 1: ${emailErrorMessage.value}`);
  }
  if (phoneErrorMessage.value) {
    errs.push(`Step 1: ${phoneErrorMessage.value}`);
  }
  if (companyErrorMessage.value) {
    errs.push(`Step 1: ${companyErrorMessage.value}`);
  }
  if (shippingAddressErrorMessage.value) {
    errs.push(`Step 1: ${shippingAddressErrorMessage.value}`);
  }
  return errs;
});

// Submission action handler
const submitRegistration = () => {
  // Generate a random confirmation number
  const confNumber = 'TC2028-' + Math.floor(10000 + Math.random() * 90000);

  // Navigate to success page with query parameters
  router.push({
    path: '/success',
    query: {
      name: fullName.value,
      email: email.value,
      ticket: ticketType.value,
      conf: confNumber,
    },
  });

  // Clear registration in-memory and local storage
  clearRegistration();
};
</script>

<template>
  <PageContainer content-class="space-y-8">
    <SectionTitle>Review Your Registration</SectionTitle>

    <!-- Error Banner (only shown if there are errors) -->
    <ErrorBanner
      v-if="validationErrors.length > 0"
      :errors="validationErrors"
    />

    <!-- Review Block 1: Attendee Information -->
    <ReviewCard
      title="Attendee Information"
      :items="attendeeItems"
      @edit="router.push('/attendeeinfo')"
      editText="Edit → Step 1"
    />

    <!-- Review Block 2: Selected Sessions -->
    <ReviewCard
      title="Selected Sessions"
      :items="sessionItems"
      @edit="router.push('/sessions')"
      editText="Edit → Step 2"
    />

    <!-- Review Block 3: Selected Add-ons -->
    <ReviewCard
      title="Selected Add-ons"
      :items="addonItems"
      @edit="router.push('/addons')"
      editText="Edit → Step 3"
    />

    <!-- Review Block 4: Pricing Summary -->
    <ReviewCard
      title="Pricing Summary"
      :items="pricingSummaryItems"
      show-last-item-divider
      @edit="router.push('/addons')"
    />
  </PageContainer>
  <ActionBar
    :show-next="true"
    :disable-next="validationErrors.length > 0"
    @back="router.push('/addons')"
    @next="submitRegistration"
    next-label="Submit Registration"
  />
</template>
