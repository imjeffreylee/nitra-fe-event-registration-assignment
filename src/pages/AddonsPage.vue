<script setup>
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
const router = useRouter();
</script>

<template>
  <PageContainer>
    <p class="text-neutral-muted">
      Enhance your summit experience with workshops, meals, and
      exclusive merchandise.
    </p>
    <div
      class="p-4 bg-surface-l2 rounded border border-gray-100 text-sm text-neutral-muted"
    >
      Add-on items organized by category will be displayed here.
    </div>
  </PageContainer>
  <ActionBar
    next-label="Next: Review"
    @back="router.push('/sessions')"
    @next="router.push('/review')"
  />
</template>
