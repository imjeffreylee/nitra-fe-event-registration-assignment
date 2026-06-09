<script setup>
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
const router = useRouter();
</script>

<template>
  <PageContainer>
    <p class="text-neutral-muted">
      Verify your information and finish your registration.
    </p>
    <div
      class="p-4 bg-surface-l2 rounded border border-gray-100 text-sm text-neutral-muted"
    >
      Unified validation and full summary order review will be displayed
      here.
    </div>
  </PageContainer>
  <ActionBar
    :show-next="false"
    @back="router.push('/addons')"
    next-label="Submit Registration"
  />
</template>
