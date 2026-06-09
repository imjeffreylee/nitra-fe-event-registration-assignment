<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppStepper from '../components/AppStepper.vue';
import TicketTypeSection from '../components/TicketTypeSection.vue';
import SectionTitle from '../components/SectionTitle.vue';
import { event } from '../mocks/event.js';

// Step definitions matching the README requirements
const steps = ['Attendee Info', 'Sessions', 'Add-ons', 'Review'];

const currentStep = ref(1);

const nextStep = () => {
  if (currentStep.value < steps.length) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header class="bg-white text-neutral">
      <AppHeader />
    </q-header>

    <!-- Page Container -->
    <q-page-container>
      <q-page class="min-h-screen flex flex-col">
        <!-- Progress Stepper Row -->
        <div
          class="w-full bg-white border-b-1 border-b-solid border-b-gray-100 flex-none"
        >
          <AppStepper v-model="currentStep" :steps="steps" clickable />
        </div>

        <!-- Wizard Step Content -->
        <main
          class="flex-1 flex flex-col justify-center items-center py-10 max-w-[1200px] mx-auto w-full"
        >
          <div
            class="bg-white border border-gray-100 rounded-lg w-full flex flex-col min-h-[350px] justify-between"
          >
            <div>
              <div v-if="currentStep === 1" class="space-y-4">
                <TicketTypeSection
                  title="Select Ticket Type"
                  :tickets="event.ticketTypes"
                />
                <SectionTitle>Attendee Information</SectionTitle>
              </div>

              <div v-else-if="currentStep === 2" class="space-y-4">
                <p class="text-neutral-muted">
                  Browse and select the sessions you would like to attend on
                  November 15 & 16.
                </p>
                <div
                  class="p-4 bg-surface-l2 rounded border border-gray-100 text-sm text-neutral-muted"
                >
                  Interactive Sessions calendar and slot selectors will be
                  displayed here.
                </div>
              </div>

              <div v-else-if="currentStep === 3" class="space-y-4">
                <p class="text-neutral-muted">
                  Enhance your summit experience with workshops, meals, and
                  exclusive merchandise.
                </p>
                <div
                  class="p-4 bg-surface-l2 rounded border border-gray-100 text-sm text-neutral-muted"
                >
                  Add-on items organized by category will be displayed here.
                </div>
              </div>

              <div v-else-if="currentStep === 4" class="space-y-4">
                <p class="text-neutral-muted">
                  Verify your information and finish your registration.
                </p>
                <div
                  class="p-4 bg-surface-l2 rounded border border-gray-100 text-sm text-neutral-muted"
                >
                  Unified validation and full summary order review will be
                  displayed here.
                </div>
              </div>
            </div>
          </div>
        </main>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
