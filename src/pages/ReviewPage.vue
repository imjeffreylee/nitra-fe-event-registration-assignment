<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import Success from '../components/review/SubmissionSuccess.vue';
import { useI18n } from 'vue-i18n';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import ReviewCard from '../components/review/ReviewCard.vue';
import ErrorBanner from '../components/review/ErrorBanner.vue';
import { useRegistration } from '../composables/useRegistration.js';
import { useEvent } from '../composables/useEvent.js';
import { useSessions } from '../composables/useSessions.js';
import { useAddons } from '../composables/useAddons.js';

const router = useRouter();
const { t } = useI18n();
const { event } = useEvent();
const { sessions } = useSessions();
const { addons } = useAddons();

const sessionsList = computed(() => sessions.value || []);
const addonsList = computed(() => addons.value || []);

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
  if (!event.value || !event.value.ticketTypes) return null;
  return (
    event.value.ticketTypes.find((t) => t.id === ticketType.value) ||
    event.value.ticketTypes[0]
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
      label: t('reviewLabelName'),
      value: fullName.value,
      required: isRequired.value.fullName,
    },
    {
      label: t('reviewLabelEmail'),
      value: email.value,
      required: isRequired.value.email,
      invalid: !isEmailValid.value,
    },
    {
      label: t('reviewLabelPhone'),
      value: phone.value,
      required: isRequired.value.phone,
      invalid: !isPhoneValid.value,
    },
    {
      label: t('reviewLabelCompany'),
      value: company.value,
      required: isRequired.value.company,
    },
    {
      label: t('reviewLabelJobTitle'),
      value: jobTitle.value,
      required: isRequired.value.jobTitle,
    },
    {
      label: t('reviewLabelTicketType'),
      value: `${ticketLabel.value} (${formatCurrency(ticketPrice.value)})`,
    },
    {
      label: t('reviewLabelShippingAddress'),
      value: shippingAddress.value,
      required: isRequired.value.shippingAddress,
      errorMessage: t('requiredForMerchError'),
    },
  ];
});

// Format selected sessions list
const sessionItems = computed(() => {
  const selected = sessionsList.value.filter((s) =>
    selectedSessionIds.value.includes(s.id),
  );
  if (selected.length === 0) {
    return [{ label: t('stepSessions'), value: t('noSessionsSelected') }];
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
    const ws = addonsList.value.find((a) => a.id === id);
    if (ws) {
      list.push({
        label: t('reviewLabelWorkshop'),
        value: `${ws.name} (${formatCurrency(ws.price)})`,
        invalid: !!hasSessionConflict(ws),
      });
    }
  });

  // 2. Selected Meals
  selectedMeals.value.forEach((id) => {
    const meal = addonsList.value.find((a) => a.id === id);
    if (meal) {
      list.push({
        label: t('reviewLabelMealPackage'),
        value: `${meal.name} (${formatCurrency(meal.price)})`,
      });
    }
  });

  // 3. Selected Merchandise
  Object.entries(selectedMerch.value).forEach(([id, data]) => {
    if (!data || data.quantity <= 0) return;
    const merch = addonsList.value.find((a) => a.id === id);
    if (merch) {
      let displayName = merch.name;
      if (merch.sizes && merch.sizes.length > 0 && data.size) {
        displayName += ` (${data.size})`;
      }
      displayName += ` x ${data.quantity}`;

      const itemTotal = merch.price * data.quantity;
      list.push({
        label: t('reviewLabelMerchandise'),
        value: `${displayName} (${formatCurrency(itemTotal)})`,
      });
    }
  });

  if (list.length === 0) {
    return [{ label: t('stepAddons'), value: t('noAddonsSelected') }];
  }

  return list;
});

// Subtotal Calculations for Pricing Summary
const workshopsPrice = computed(() => {
  return selectedWorkshops.value.reduce((sum, id) => {
    const ws = addonsList.value.find((a) => a.id === id);
    return sum + (ws?.price || 0);
  }, 0);
});

const mealsPrice = computed(() => {
  return selectedMeals.value.reduce((sum, id) => {
    const meal = addonsList.value.find((a) => a.id === id);
    return sum + (meal?.price || 0);
  }, 0);
});

const merchPrice = computed(() => {
  return Object.entries(selectedMerch.value).reduce((sum, [id, data]) => {
    if (!data || !data.quantity) return sum;
    const merch = addonsList.value.find((a) => a.id === id);
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
    label: `${ticketLabel.value} ${t('reviewTicketSuffix')}`,
    value: formatCurrency(ticketPrice.value),
  });

  // 2. Workshops Rows
  selectedWorkshops.value.forEach((id) => {
    const ws = addonsList.value.find((a) => a.id === id);
    if (ws) {
      list.push({
        label: ws.name,
        value: formatCurrency(ws.price),
      });
    }
  });

  // 3. Meals Rows
  selectedMeals.value.forEach((id) => {
    const meal = addonsList.value.find((a) => a.id === id);
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
    const merch = addonsList.value.find((a) => a.id === id);
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
      label: t('vipDiscountLabel'),
      value: `-${formatCurrency(vipDiscount.value)}`,
      labelClass: 'fw-[485] text-brand',
      valueClass: 'fw-[485] text-brand',
    });
  }

  // 6. Total Row
  list.push({
    label: t('grandTotalLabel'),
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
    errs.push(
      t('stepErrorPrefix', { step: 1, error: fullNameErrorMessage.value }),
    );
  }
  if (emailErrorMessage.value) {
    errs.push(
      t('stepErrorPrefix', { step: 1, error: emailErrorMessage.value }),
    );
  }
  if (phoneErrorMessage.value) {
    errs.push(
      t('stepErrorPrefix', { step: 1, error: phoneErrorMessage.value }),
    );
  }
  if (companyErrorMessage.value) {
    errs.push(
      t('stepErrorPrefix', { step: 1, error: companyErrorMessage.value }),
    );
  }
  if (shippingAddressErrorMessage.value) {
    errs.push(
      t('stepErrorPrefix', {
        step: 1,
        error: shippingAddressErrorMessage.value,
      }),
    );
  }

  // Check for time conflicts between sessions (Step 2) and workshops (Step 3)
  const selectedSessionsObj = sessionsList.value.filter((s) =>
    selectedSessionIds.value.includes(s.id),
  );
  selectedSessionsObj.forEach((s) => {
    const conflictWorkshopName = hasWorkshopConflict(s);
    if (conflictWorkshopName) {
      errs.push(
        t('step2ConflictError', {
          session: s.title,
          workshop: conflictWorkshopName,
        }),
      );
    }
  });

  return errs;
});

const isSubmitted = ref(false);
const registrationDetails = ref({
  name: '',
  email: '',
  ticketType: '',
  confirmation: '',
});

// Submission action handler
const submitRegistration = () => {
  // Generate a random confirmation number
  const confNumber = 'TC2028-' + Math.floor(10000 + Math.random() * 90000);

  // Store the details before clearing the form
  registrationDetails.value = {
    name: fullName.value,
    email: email.value,
    ticketType: ticketType.value,
    confirmation: confNumber,
  };

  isSubmitted.value = true;

  // Clear registration in-memory and session storage
  clearRegistration();
};

const handleRestart = () => {
  isSubmitted.value = false;
  router.push('/attendeeinfo');
};
</script>

<template>
  <Success
    v-if="isSubmitted"
    :registrant-name="registrationDetails.name"
    :registrant-email="registrationDetails.email"
    :registrant-ticket="registrationDetails.ticketType"
    :confirmation="registrationDetails.confirmation"
    @restart="handleRestart"
  />
  <template v-else>
    <PageContainer content-class="space-y-8">
      <SectionTitle>{{ $t('reviewTitle') }}</SectionTitle>

      <!-- Error Banner (only shown if there are errors) -->
      <ErrorBanner
        v-if="validationErrors.length > 0"
        :errors="validationErrors"
      />

      <!-- Review Block 1: Attendee Information -->
      <ReviewCard
        :title="$t('attendeeInfoTitle')"
        :items="attendeeItems"
        @edit="router.push('/attendeeinfo')"
        :editText="$t('editStep1')"
      />

      <!-- Review Block 2: Selected Sessions -->
      <ReviewCard
        :title="$t('selectedSessionsHeader')"
        :items="sessionItems"
        @edit="router.push('/sessions')"
        :editText="$t('editStep2')"
      />

      <!-- Review Block 3: Selected Add-ons -->
      <ReviewCard
        :title="$t('selectedAddonsHeader')"
        :items="addonItems"
        @edit="router.push('/addons')"
        :editText="$t('editStep3')"
      />

      <!-- Review Block 4: Pricing Summary -->
      <ReviewCard
        :title="$t('pricingSummaryHeader')"
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
      :next-label="$t('btnSubmitRegistration')"
    />
  </template>
</template>
