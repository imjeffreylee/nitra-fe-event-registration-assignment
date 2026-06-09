<template>
  <div class="flex flex-col items-start gap-4 w-full flex-none">
    <!-- Section Title -->
    <span class="text-subtitle1 text-[rgba(0,0,0,0.9)] flex-none">
      {{ title }}
    </span>

    <!-- Ticket Cards Row -->
    <div
      class="flex flex-row items-stretch gap-4 flex-none flex-nowrap self-stretch"
    >
      <TicketCard
        v-for="ticket in tickets"
        :key="ticket.id"
        :ticket="ticket"
        :selected="ticket.id === modelValue"
        :badge="ticket.id === 'vip' ? 'Best Value' : ''"
        @select="emit('update:modelValue', ticket.id)"
      />
    </div>
  </div>
</template>

<script setup>
import TicketCard from './TicketCard.vue';

defineProps({
  title: {
    type: String,
    default: 'Select Ticket Type',
  },
  tickets: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
</script>
