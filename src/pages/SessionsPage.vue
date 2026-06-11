<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SessionCard from '../components/sessions/SessionCard.vue';
import SectionTitle from '../components/SectionTitle.vue';
import AppTabs from '../components/AppTabs.vue';
import { useRegistration } from '../composables/useRegistration.js';
import { useEvent } from '../composables/useEvent.js';
import { useSessions } from '../composables/useSessions.js';

const router = useRouter();

// Retrieve selectedSessions directly from global state
const { selectedSessions, hasWorkshopConflict } = useRegistration();
const { event } = useEvent();
const { sessions } = useSessions();

const activeDay = ref('');

// Format dates dynamically from event
const dayOptions = computed(() => {
  if (!event.value || !event.value.dates) {
    return [];
  }
  return event.value.dates.map((dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  });
});

// Watch options and set first tab as active when options load
watch(
  dayOptions,
  (newOptions) => {
    if (newOptions.length > 0 && !newOptions.includes(activeDay.value)) {
      activeDay.value = newOptions[0];
    }
  },
  { immediate: true },
);

// Grouping and filtering logic
const filteredSessions = computed(() => {
  if (!event.value || !event.value.dates) return [];
  const activeIndex = dayOptions.value.indexOf(activeDay.value);
  if (activeIndex === -1) return [];
  const activeDateStr = event.value.dates[activeIndex];
  return (sessions.value || []).filter((s) => s.date.startsWith(activeDateStr));
});

const isSelected = (id) => selectedSessions.value.includes(id);

const toggleSession = (id) => {
  const idx = selectedSessions.value.indexOf(id);
  if (idx >= 0) {
    selectedSessions.value.splice(idx, 1);
  } else {
    selectedSessions.value.push(id);
  }
};
</script>

<template>
  <PageContainer content-class="space-y-6">
    <SectionTitle>{{ $t('selectSessionsTitle') }}</SectionTitle>
    <AppTabs v-model="activeDay" :options="dayOptions" />
    <!-- Selected Sessions Count -->
    <div>
      <span
        class="text-[12px] leading-4 fw-[550] text-brand [font-variation-settings:'slnt'_0] flex-none"
      >
        {{ $t('sessionsSelected', { count: selectedSessions.length }, selectedSessions.length) }}
      </span>
    </div>
    <!-- Sessions Section -->
    <div class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <SessionCard
          v-for="session in filteredSessions"
          :key="session.id"
          :session="session"
          :selected="isSelected(session.id)"
          :conflict="hasWorkshopConflict(session)"
          @select="toggleSession(session.id)"
        />
      </div>
    </div>
  </PageContainer>
  <ActionBar
    :next-label="$t('nextAddonsBtn')"
    @back="router.push('/attendeeinfo')"
    @next="router.push('/addons')"
  />
</template>
