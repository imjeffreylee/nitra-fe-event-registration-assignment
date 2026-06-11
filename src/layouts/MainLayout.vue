<script setup>
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppStepper from '../components/AppStepper.vue';
import { useEvent } from '../composables/useEvent.js';
import { useSessions } from '../composables/useSessions.js';
import { useAddons } from '../composables/useAddons.js';

const { fetchEvent } = useEvent();
const { fetchSessions } = useSessions();
const { fetchAddons } = useAddons();

onMounted(() => {
  fetchEvent();
  fetchSessions();
  fetchAddons();
});

const steps = ['Attendee Info', 'Sessions', 'Add-ons', 'Review'];

const stepRoutes = ['/attendeeinfo', '/sessions', '/addons', '/review'];

const route = useRoute();
const router = useRouter();

const isSuccessPage = computed(() => route.path === '/success');

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
        v-if="!isSuccessPage"
        class="w-full bg-white border-b-1 border-b-solid border-b-gray-100 flex-none"
      >
        <AppStepper v-model="currentStep" :steps="steps" clickable />
      </div>
    </q-header>

    <q-page-container>
      <q-page class="flex flex-col">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>
