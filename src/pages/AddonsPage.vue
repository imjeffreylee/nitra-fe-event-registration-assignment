<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import AppTabs from '../components/AppTabs.vue';
import WorkshopCard from '../components/addOns/WorkshopCard.vue';
import { addons } from '../mocks/addons.js';
import { sessions } from '../mocks/sessions.js';

const router = useRouter();
const activeCategory = ref('Workshops');

// Persistent state variables
const selectedTicket = ref('vip');
const selectedSessionIds = ref([]);
const selectedWorkshops = ref([]);
const selectedMeals = ref([]);

onMounted(() => {
  // Load selected ticket type
  const savedTicket = localStorage.getItem('selected_ticket');
  if (savedTicket) {
    selectedTicket.value = savedTicket;
  }

  // Load selected sessions
  const savedSessions = localStorage.getItem('selected_sessions');
  if (savedSessions) {
    try {
      selectedSessionIds.value = JSON.parse(savedSessions);
    } catch (e) {}
  }

  // Load selected workshops
  const savedWorkshops = localStorage.getItem('selected_workshops');
  if (savedWorkshops) {
    try {
      selectedWorkshops.value = JSON.parse(savedWorkshops);
    } catch (e) {}
  }

  // Load selected meals
  const savedMeals = localStorage.getItem('selected_meals');
  if (savedMeals) {
    try {
      selectedMeals.value = JSON.parse(savedMeals);
    } catch (e) {}
  }
});

// Watch and save workshops
watch(
  selectedWorkshops,
  (newVal) => {
    localStorage.setItem('selected_workshops', JSON.stringify(newVal));
  },
  { deep: true },
);

// Watch and save meals
watch(
  selectedMeals,
  (newVal) => {
    localStorage.setItem('selected_meals', JSON.stringify(newVal));
  },
  { deep: true },
);

// Check if current user is VIP
const isVip = computed(() => selectedTicket.value === 'vip');

// Get full session objects for those selected (needed for conflict detection)
const activeSelectedSessions = computed(() => {
  return sessions.filter((s) => selectedSessionIds.value.includes(s.id));
});

// Filter workshops from mixed addons mock
const workshops = computed(() => {
  return addons.filter((addon) => addon.category === 'workshop');
});

// Filter meal packages from mixed addons mock
const meals = computed(() => {
  return addons.filter((addon) => addon.category === 'meal');
});

const isSelected = (id) => selectedWorkshops.value.includes(id);

const toggleWorkshop = (id) => {
  const idx = selectedWorkshops.value.indexOf(id);
  if (idx >= 0) {
    selectedWorkshops.value.splice(idx, 1);
  } else {
    selectedWorkshops.value.push(id);
  }
};

const isMealSelected = (id) => selectedMeals.value.includes(id);

const toggleMeal = (id) => {
  const idx = selectedMeals.value.indexOf(id);
  if (idx >= 0) {
    selectedMeals.value.splice(idx, 1);
  } else {
    selectedMeals.value.push(id);
  }
};

// Conflict detection logic (returns true if workshop overlaps with any selected session)
const hasTimeConflict = (workshop) => {
  const wStart = new Date(workshop.date).getTime();
  const wEnd = new Date(workshop.endDate).getTime();

  return activeSelectedSessions.value.some((s) => {
    const sStart = new Date(s.date).getTime();
    const sEnd = new Date(s.endDate).getTime();
    return wStart < sEnd && sStart < wEnd;
  });
};
</script>

<template>
  <PageContainer content-class="space-y-8">
    <SectionTitle>Select Add-ons</SectionTitle>
    <AppTabs
      v-model="activeCategory"
      :options="['Workshops', 'Meal Packages', 'Merchandise']"
    />

    <!-- Workshops Tab view -->
    <div
      v-if="activeCategory === 'Workshops'"
      class="flex flex-col items-start gap-4 w-full"
    >
      <WorkshopCard
        v-for="workshop in workshops"
        :key="workshop.id"
        :workshop="workshop"
        :selected="isSelected(workshop.id)"
        :conflict="hasTimeConflict(workshop)"
        @select="toggleWorkshop(workshop.id)"
      />
    </div>

    <!-- Meal Packages Tab view -->
    <div
      v-else-if="activeCategory === 'Meal Packages'"
      class="flex flex-col items-start gap-4 w-full"
    >
      <WorkshopCard
        v-for="meal in meals"
        :key="meal.id"
        :workshop="meal"
        :selected="isMealSelected(meal.id)"
        @select="toggleMeal(meal.id)"
      />
    </div>
  </PageContainer>
  <ActionBar
    next-label="Next: Review"
    @back="router.push('/sessions')"
    @next="router.push('/review')"
  />
</template>
