<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SessionCard from '../components/sessions/SessionCard.vue';
import SectionTitle from '../components/SectionTitle.vue';
import AppTabs from '../components/AppTabs.vue';
import { sessions } from '../mocks/sessions.js';
import { useRegistration } from '../composables/useRegistration.js';

const router = useRouter();

// Retrieve selectedSessions directly from global state
const { selectedSessions } = useRegistration();
const activeDay = ref('Nov 15');

// Grouping logic
const day1Sessions = computed(() => {
  return sessions.filter((s) => s.date.startsWith('2028-11-15'));
});

const day2Sessions = computed(() => {
  return sessions.filter((s) => s.date.startsWith('2028-11-16'));
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
    <SectionTitle>Select Sessions</SectionTitle>
    <AppTabs v-model="activeDay" :options="['Nov 15', 'Nov 16']" />
    <!-- Selected Sessions Count -->
    <div>
      <span
        class="text-[12px] leading-4 fw-[550] text-[#264D4F] [font-variation-settings:'slnt'_0] flex-none"
      >
        {{ selectedSessions.length }} session{{
          selectedSessions.length === 1 ? '' : 's'
        }}
        selected
      </span>
    </div>
    <!-- Day 1 Sessions Section -->
    <div v-if="activeDay === 'Nov 15'" class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <SessionCard
          v-for="session in day1Sessions"
          :key="session.id"
          :session="session"
          :selected="isSelected(session.id)"
          @select="toggleSession(session.id)"
        />
      </div>
    </div>
    <!-- Day 2 Sessions Section -->
    <div v-else-if="activeDay === 'Nov 16'" class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <SessionCard
          v-for="session in day2Sessions"
          :key="session.id"
          :session="session"
          :selected="isSelected(session.id)"
          @select="toggleSession(session.id)"
        />
      </div>
    </div>
  </PageContainer>
  <ActionBar
    next-label="Next: Add-ons"
    @back="router.push('/attendeeinfo')"
    @next="router.push('/addons')"
  />
</template>
