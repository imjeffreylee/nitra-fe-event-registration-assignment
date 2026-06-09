<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppStepper from '../components/AppStepper.vue';
import TicketTypeSection from '../components/TicketTypeSection.vue';
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
          class="flex-1 flex flex-col justify-center items-center px-4 py-8 max-w-[1440px] mx-auto w-full"
        >
          <div
            class="bg-white border border-gray-100 rounded-lg p-8 w-full shadow-sm flex flex-col min-h-[350px] justify-between"
          >
            <div>
              <div v-if="currentStep === 1" class="space-y-4">
                <TicketTypeSection
                  title="Select Ticket Type"
                  :tickets="event.ticketTypes"
                />
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

            <!-- Wizard Navigation Controls -->
            <div
              class="flex flex-row items-center justify-between mt-8 pt-6 border-t border-gray-100"
            >
              <button
                class="px-5 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-neutral hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                :disabled="currentStep === 1"
                @click="prevStep"
              >
                Back
              </button>

              <button
                class="px-5 py-2.5 rounded-lg text-sm font-semibold bg-brand-emphasis text-white hover:opacity-90 active:opacity-95 transition-opacity"
                @click="currentStep === steps.length ? null : nextStep()"
              >
                {{
                  currentStep === steps.length
                    ? 'Submit Registration'
                    : 'Continue'
                }}
              </button>
            </div>
          </div>
        </main>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
