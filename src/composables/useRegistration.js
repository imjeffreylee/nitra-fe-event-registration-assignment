import { reactive, watch, toRefs, computed } from 'vue';
import { useSessions } from './useSessions.js';
import { useAddons } from './useAddons.js';

// Helper for safe JSON parsing
const safeParseJson = (key, fallback) => {
  const data = sessionStorage.getItem(key);
  if (!data) return fallback;
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error(`Error parsing JSON for sessionStorage key "${key}":`, e);
    return fallback;
  }
};

// 1. Singleton Reactive State (defined outside the function to share across all imports)
const state = reactive({
  ticketType: sessionStorage.getItem('selected_ticket') || 'vip',
  fullName: sessionStorage.getItem('attendee_full_name') || '',
  email: sessionStorage.getItem('attendee_email') || '',
  phone: sessionStorage.getItem('attendee_phone') || '',
  company: sessionStorage.getItem('attendee_company') || '',
  jobTitle: sessionStorage.getItem('attendee_job_title') || '',
  shippingAddress: sessionStorage.getItem('attendee_shipping_address') || '',

  selectedSessions: safeParseJson('selected_sessions', []),
  selectedWorkshops: safeParseJson('selected_workshops', []),
  selectedMeals: safeParseJson('selected_meals', []),
  selectedMerchandise: safeParseJson('selected_merchandise', {}),
});

// 2. Individual properties synchronization watchers
watch(
  () => state.ticketType,
  (val) => {
    sessionStorage.setItem('selected_ticket', val);
  },
);

watch(
  () => state.fullName,
  (val) => {
    sessionStorage.setItem('attendee_full_name', val);
  },
);

watch(
  () => state.email,
  (val) => {
    sessionStorage.setItem('attendee_email', val);
  },
);

watch(
  () => state.phone,
  (val) => {
    sessionStorage.setItem('attendee_phone', val);
  },
);

watch(
  () => state.company,
  (val) => {
    sessionStorage.setItem('attendee_company', val);
  },
);

watch(
  () => state.jobTitle,
  (val) => {
    sessionStorage.setItem('attendee_job_title', val);
  },
);

watch(
  () => state.shippingAddress,
  (val) => {
    sessionStorage.setItem('attendee_shipping_address', val);
  },
);

// Deep watchers for collections
watch(
  () => state.selectedSessions,
  (val) => {
    sessionStorage.setItem('selected_sessions', JSON.stringify(val));
  },
  { deep: true },
);

watch(
  () => state.selectedWorkshops,
  (val) => {
    sessionStorage.setItem('selected_workshops', JSON.stringify(val));
  },
  { deep: true },
);

watch(
  () => state.selectedMeals,
  (val) => {
    sessionStorage.setItem('selected_meals', JSON.stringify(val));
  },
  { deep: true },
);

watch(
  () => state.selectedMerchandise,
  (val) => {
    sessionStorage.setItem('selected_merchandise', JSON.stringify(val));
  },
  { deep: true },
);

// 3. Export composable hook function
export function useRegistration() {
  const { sessions } = useSessions();
  const { addons } = useAddons();

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

  // Clean registration in-memory state and target-remove sessionStorage entries
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

    // Targeted removal of sessionStorage items
    sessionStorage.removeItem('selected_ticket');
    sessionStorage.removeItem('attendee_full_name');
    sessionStorage.removeItem('attendee_email');
    sessionStorage.removeItem('attendee_phone');
    sessionStorage.removeItem('attendee_company');
    sessionStorage.removeItem('attendee_job_title');
    sessionStorage.removeItem('attendee_shipping_address');
    sessionStorage.removeItem('selected_sessions');
    sessionStorage.removeItem('selected_workshops');
    sessionStorage.removeItem('selected_meals');
    sessionStorage.removeItem('selected_merchandise');
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
    const list = sessions.value || [];
    const activeSessions = list.filter((s) =>
      state.selectedSessions.includes(s.id),
    );
    const conflict = activeSessions.find((s) => areOverlapping(workshop, s));
    return conflict ? conflict.title : false;
  };

  const hasWorkshopConflict = (session) => {
    const list = addons.value || [];
    const activeWorkshops = list.filter(
      (a) =>
        a.category === 'workshop' && state.selectedWorkshops.includes(a.id),
    );
    const conflict = activeWorkshops.find((w) => areOverlapping(session, w));
    return conflict ? conflict.name : false;
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
