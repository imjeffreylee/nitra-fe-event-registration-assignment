<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ActionBar from '../components/ActionBar.vue';
import PageContainer from '../components/PageContainer.vue';
import SectionTitle from '../components/SectionTitle.vue';
import AppTabs from '../components/AppTabs.vue';

const router = useRouter();
const activeCategory = ref('Workshops');
</script>

<template>
  <PageContainer content-class="space-y-8">
    <SectionTitle>Select Add-ons</SectionTitle>
    <AppTabs
      v-model="activeCategory"
      :options="['Workshops', 'Meal Packages', 'Merchandise']"
    />
  </PageContainer>
  <ActionBar
    next-label="Next: Review"
    @back="router.push('/sessions')"
    @next="router.push('/review')"
  />
</template>
