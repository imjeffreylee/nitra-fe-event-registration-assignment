<template>
  <span
    class="text-[10px] leading-3 font-semibold px-2 py-0.5 bg-accent-subtle-rest text-accent-emphasis rounded-full border border-solid border-accent-muted [font-variation-settings:'slnt'_0] whitespace-nowrap"
  >
    {{ $t('timeConflict') }}<span v-if="conflictingName" class="font-normal opacity-85">{{ $t('conflictWith', { name: conflictingName }) }}</span>
  </span>
</template>

<script setup>
defineProps({
  conflictingName: {
    type: String,
    default: '',
  },
});
</script>
