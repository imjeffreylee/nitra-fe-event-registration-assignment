<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import AppTabs from '../components/AppTabs.vue';
import WorkshopCard from '../components/addons/WorkshopCard.vue';
import MerchandiseCard from '../components/addons/MerchandiseCard.vue';
import OrderSummary from '../components/addons/OrderSummary.vue';
import InfoIcon from '../assets/Info.svg';
import { useRegistration } from '../composables/useRegistration.js';
import { useAddons } from '../composables/useAddons.js';

const router = useRouter();
const { addons } = useAddons();
const activeCategory = ref('Workshops');

// Connect component variables to the shared registration composable
const {
  ticketType: selectedTicket,
  selectedWorkshops,
  selectedMeals,
  selectedMerchandise: selectedMerch,
  hasSessionConflict,
} = useRegistration();

// Check if current user is VIP
const isVip = computed(() => selectedTicket.value === 'vip');

// Filter workshops from mixed addons mock
const workshops = computed(() => {
  return (addons.value || []).filter((addon) => addon.category === 'workshop');
});

// Filter meal packages from mixed addons mock
const meals = computed(() => {
  return (addons.value || []).filter((addon) => addon.category === 'meal');
});

// Filter merchandise from mixed addons mock
const merchandise = computed(() => {
  return (addons.value || []).filter((addon) => addon.category === 'merchandise');
});

const hasSelectedMerch = computed(() => {
  return Object.values(selectedMerch.value).some((m) => m && m.quantity > 0);
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

const updateMerchQty = (id, qty, defaultSize) => {
  if (!selectedMerch.value[id]) {
    selectedMerch.value[id] = { quantity: 0, size: defaultSize };
  }
  selectedMerch.value[id].quantity = qty;
};

const updateMerchSize = (id, size) => {
  if (!selectedMerch.value[id]) {
    selectedMerch.value[id] = { quantity: 0, size: size };
  } else {
    selectedMerch.value[id].size = size;
  }
};
</script>

<template>
  <PageContainer content-class="space-y-8">
    <div class="flex flex-col lg:flex-row items-start gap-8 w-full">
      <!-- Left Column: SectionTitle, Tabs, and Lists -->
      <div class="flex-1 flex flex-col items-start gap-6 w-full">
        <SectionTitle class="m-0">Select Add-ons</SectionTitle>
        <AppTabs
          v-model="activeCategory"
          :options="['Workshops', 'Meal Packages', 'Merchandise']"
          class="w-full"
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
            :conflict="hasSessionConflict(workshop)"
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

        <!-- Merchandise Tab view -->
        <div
          v-else-if="activeCategory === 'Merchandise'"
          class="flex flex-col items-start gap-4 w-full"
        >
          <!-- Shipping Banner -->
          <div
            class="box-border flex flex-row items-start p-4 gap-3 w-full max-w-[788px] min-h-[96px] bg-[#EDF6FD] border border-solid border-[rgba(26,126,199,0.5)] rounded-lg shipping-banner-pop"
          >
            <InfoIcon class="flex-none w-4 h-4 mt-[2px]" />
            <div
              class="flex flex-row flex-wrap items-center content-start p-0 gap-1.5 flex-1"
            >
              <span class="font-bold text-[14px] leading-5"
                >Shipping Information</span
              >
              <span class="text-[14px] leading-5 font-regular">
                Merchandise items will be shipped to your address one week
                before the conference. Please ensure your shipping address in
                Step 1 is correct.
              </span>
            </div>
          </div>

          <MerchandiseCard
            v-for="item in merchandise"
            :key="item.id"
            :item="item"
            :quantity="selectedMerch[item.id]?.quantity || 0"
            :selected-size="selectedMerch[item.id]?.size || ''"
            @update:quantity="
              (qty) => updateMerchQty(item.id, qty, item.sizes?.[0] || '')
            "
            @update:selected-size="(size) => updateMerchSize(item.id, size)"
          />
        </div>
      </div>
      <!-- Closes Left Column -->

      <!-- Right Column: Order Summary -->
      <OrderSummary
        :ticket-type="selectedTicket"
        :selected-workshops="selectedWorkshops"
        :selected-meals="selectedMeals"
        :selected-merch="selectedMerch"
      />
    </div>
    <!-- Closes Outer row container -->
  </PageContainer>
  <ActionBar
    next-label="Next: Review"
    @back="router.push('/sessions')"
    @next="router.push('/review')"
  />
</template>

<style scoped>
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.97) translateY(-8px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.shipping-banner-pop {
  animation: popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
</style>
