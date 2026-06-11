import { ref, readonly } from 'vue';
import { event as mockEvent } from '../mocks/event.js';

// Singleton state shared across all components importing this composable
const eventData = ref(null);
const loading = ref(false);
const error = ref(null);

export function useEvent() {
  const fetchEvent = async () => {
    // Return cached data if already loaded
    if (eventData.value) return;

    loading.value = true;
    error.value = null;

    try {
      // Simulate API response delay of 150ms
      await new Promise((resolve) => setTimeout(resolve, 150));
      eventData.value = mockEvent;
    } catch (err) {
      error.value = err.message || 'Failed to fetch event';
    } finally {
      loading.value = false;
    }
  };

  return {
    event: readonly(eventData),
    loading: readonly(loading),
    error: readonly(error),
    fetchEvent,
  };
}
