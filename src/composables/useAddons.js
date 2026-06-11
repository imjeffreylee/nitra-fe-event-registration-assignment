import { ref, readonly } from 'vue';
import { addons as mockAddons } from '../mocks/addons.js';

// Singleton state shared across all components importing this composable
const addonsData = ref([]);
const loading = ref(false);
const error = ref(null);

export function useAddons() {
  const fetchAddons = async () => {
    // Return cached data if already loaded
    if (addonsData.value && addonsData.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      // Simulate API response delay of 150ms
      await new Promise((resolve) => setTimeout(resolve, 150));
      addonsData.value = mockAddons;
    } catch (err) {
      error.value = err.message || 'Failed to fetch addons';
    } finally {
      loading.value = false;
    }
  };

  return {
    addons: readonly(addonsData),
    loading: readonly(loading),
    error: readonly(error),
    fetchAddons,
  };
}
