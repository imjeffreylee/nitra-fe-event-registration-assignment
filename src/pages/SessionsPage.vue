<script setup>
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
const router = useRouter();
</script>

<template>
  <PageContainer>
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
  </PageContainer>
  <ActionBar
    next-label="Next: Add-ons"
    @back="router.push('/attendeeinfo')"
    @next="router.push('/addons')"
  />
</template>
