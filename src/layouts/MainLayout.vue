<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppStepper from '../components/AppStepper.vue';

const steps = ['Attendee Info', 'Sessions', 'Add-ons', 'Review'];

const stepRoutes = ['/attendeeinfo', '/sessions', '/addons', '/review'];

const route = useRoute();
const router = useRouter();

const currentStep = computed({
  get: () => {
    const idx = stepRoutes.indexOf(route.path);
    return idx >= 0 ? idx + 1 : 1;
  },
  set: (val) => {
    router.push(stepRoutes[val - 1]);
  },
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-neutral">
      <AppHeader />
      <div
        class="w-full bg-white border-b-1 border-b-solid border-b-gray-100 flex-none"
      >
        <AppStepper v-model="currentStep" :steps="steps" clickable />
      </div>
    </q-header>

    <q-page-container>
      <q-page class="min-h-screen flex flex-col">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
