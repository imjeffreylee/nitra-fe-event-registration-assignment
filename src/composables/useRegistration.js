import { reactive, watch, toRefs, computed } from 'vue';
import { sessions } from '../mocks/sessions.js';
import { addons } from '../mocks/addons.js';

// Helper for safe JSON parsing
const safeParseJson = (key, fallback) => {
  const data = localStorage.getItem(key);
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error parsing JSON for localStorage key "${key}":`, e);
    return fallback;
  }
};

// 1. Singleton Reactive State (defined outside the function to share across all imports)
const state = reactive({
  ticketType: localStorage.getItem('selected_ticket') || 'vip',
  fullName: localStorage.getItem('attendee_full_name') || '',
  email: localStorage.getItem('attendee_email') || '',
  phone: localStorage.getItem('attendee_phone') || '',
  company: localStorage.getItem('attendee_company') || '',
  jobTitle: localStorage.getItem('attendee_job_title') || '',
  shippingAddress: localStorage.getItem('attendee_shipping_address') || '',

  selectedSessions: safeParseJson('selected_sessions', []),
  selectedWorkshops: safeParseJson('selected_workshops', []),
  selectedMeals: safeParseJson('selected_meals', []),
  selectedMerchandise: safeParseJson('selected_merchandise', {}),
});

// 2. Individual properties synchronization watchers
watch(
  () => state.ticketType,
  (val) => {
    localStorage.setItem('selected_ticket', val);
  },
);

watch(
  () => state.fullName,
  (val) => {
    localStorage.setItem('attendee_full_name', val);
  },
);

watch(
  () => state.email,
  (val) => {
    localStorage.setItem('attendee_email', val);
  },
);

watch(
  () => state.phone,
  (val) => {
    localStorage.setItem('attendee_phone', val);
  },
);

watch(
  () => state.company,
  (val) => {
    localStorage.setItem('attendee_company', val);
  },
);

watch(
  () => state.jobTitle,
  (val) => {
    localStorage.setItem('attendee_job_title', val);
  },
);

watch(
  () => state.shippingAddress,
  (val) => {
    localStorage.setItem('attendee_shipping_address', val);
  },
);

// Deep watchers for collections
watch(
  () => state.selectedSessions,
  (val) => {
    localStorage.setItem('selected_sessions', JSON.stringify(val));
  },
  { deep: true },
);

watch(
  () => state.selectedWorkshops,
  (val) => {
    localStorage.setItem('selected_workshops', JSON.stringify(val));
  },
  { deep: true },
);

watch(
  () => state.selectedMeals,
  (val) => {
    localStorage.setItem('selected_meals', JSON.stringify(val));
  },
  { deep: true },
);

watch(
  () => state.selectedMerchandise,
  (val) => {
    localStorage.setItem('selected_merchandise', JSON.stringify(val));
  },
  { deep: true },
);

// 3. Export composable hook function
export function useRegistration() {
  // Single source of truth for required fields (some are dynamic based on state)
  const isRequired = computed(() => {
    const hasMerch = Object.values(state.selectedMerchandise).some(
      (m) => m && m.quantity > 0,
    );

    return {
      fullName: true,
      email: true,
      phone: true,
      company: true,
      jobTitle: false,
      shippingAddress: hasMerch,
    };
  });

  // Clean registration in-memory state and target-remove localStorage entries
  const clearRegistration = () => {
    // Reset in-memory values to defaults (prevents stale state in SPA sessions)
    state.ticketType = 'vip';
    state.fullName = '';
    state.email = '';
    state.phone = '';
    state.company = '';
    state.jobTitle = '';
    state.shippingAddress = '';
    state.selectedSessions = [];
    state.selectedWorkshops = [];
    state.selectedMeals = [];
    state.selectedMerchandise = {};

    // Targeted removal of localStorage items
    localStorage.removeItem('selected_ticket');
    localStorage.removeItem('attendee_full_name');
    localStorage.removeItem('attendee_email');
    localStorage.removeItem('attendee_phone');
    localStorage.removeItem('attendee_company');
    localStorage.removeItem('attendee_job_title');
    localStorage.removeItem('attendee_shipping_address');
    localStorage.removeItem('selected_sessions');
    localStorage.removeItem('selected_workshops');
    localStorage.removeItem('selected_meals');
    localStorage.removeItem('selected_merchandise');
  };

  const isEmailValid = computed(() => {
    if (!state.email) return true; // Let required check handle empty state
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
  });

  const isPhoneValid = computed(() => {
    if (!state.phone) return true; // Let required check handle empty state
    return /^09\d{8}$/.test(state.phone);
  });

  const fullNameErrorMessage = computed(() => {
    if (isRequired.value.fullName && !state.fullName) {
      return 'Full name is required';
    }
    return '';
  });

  const emailErrorMessage = computed(() => {
    if (!state.email) return 'Email is required';
    if (!isEmailValid.value) {
      return 'Invalid email address';
    }
    return '';
  });

  const phoneErrorMessage = computed(() => {
    if (!state.phone) return 'Phone number is required';
    if (!isPhoneValid.value) {
      return 'Phone number must be 10 digits starting with 09';
    }
    return '';
  });

  const companyErrorMessage = computed(() => {
    if (isRequired.value.company && !state.company) {
      return 'Company is required';
    }
    return '';
  });

  const shippingAddressErrorMessage = computed(() => {
    if (isRequired.value.shippingAddress && !state.shippingAddress) {
      return 'Shipping address is required for merchandise orders';
    }
    return '';
  });

  // Helper to check if two schedule intervals overlap
  const areOverlapping = (itemA, itemB) => {
    if (!itemA?.date || !itemA?.endDate || !itemB?.date || !itemB?.endDate)
      return false;
    const sA = new Date(itemA.date).getTime();
    const eA = new Date(itemA.endDate).getTime();
    const sB = new Date(itemB.date).getTime();
    const eB = new Date(itemB.endDate).getTime();
    return sA < eB && sB < eA;
  };

  const hasSessionConflict = (workshop) => {
    const activeSessions = sessions.filter((s) =>
      state.selectedSessions.includes(s.id),
    );
    return activeSessions.some((s) => areOverlapping(workshop, s));
  };

  const hasWorkshopConflict = (session) => {
    const activeWorkshops = addons.filter(
      (a) =>
        a.category === 'workshop' && state.selectedWorkshops.includes(a.id),
    );
    return activeWorkshops.some((w) => areOverlapping(session, w));
  };

  return {
    // Use toRefs so components can safely destructure properties
    ...toRefs(state),
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
  };
}
