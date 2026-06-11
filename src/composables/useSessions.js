import { ref, readonly } from 'vue';
import { sessions as mockSessions } from '../mocks/sessions.js';

// Singleton state shared across all components importing this composable
const sessionsData = ref([]);
const loading = ref(false);
const error = ref(null);

export function useSessions() {
  const fetchSessions = async () => {
    // Return cached data if already loaded
    if (sessionsData.value && sessionsData.value.length > 0) return;

    loading.value = true;
    error.value = null;

    try {
      // Simulate API response delay of 150ms
      await new Promise((resolve) => setTimeout(resolve, 150));
      sessionsData.value = mockSessions;
    } catch (err) {
      error.value = err.message || 'Failed to fetch sessions';
    } finally {
      loading.value = false;
    }
  };

  return {
    sessions: readonly(sessionsData),
    loading: readonly(loading),
    error: readonly(error),
    fetchSessions,
  };
}
