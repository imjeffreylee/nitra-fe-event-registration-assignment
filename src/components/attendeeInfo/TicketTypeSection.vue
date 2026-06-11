<template>
  <div class="flex flex-col items-start gap-4 w-full flex-none">
    <!-- Section Title -->
    <span class="text-subtitle1 text-[rgba(0,0,0,0.9)] flex-none">
      Select Ticket Type
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
        @select="emit('update:modelValue', ticket.id)"
      />
    </div>
  </div>
</template>

<script setup>
import TicketCard from './TicketCard.vue';

defineProps({
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
