<template>
  <header
    class="flex flex-row items-center px-4 md:px-12 py-4 gap-3 w-full h-18 bg-white self-stretch flex-none border-b-1 border-b-solid border-b-gray-100"
  >
    <!-- Logo as a Vue component -->
    <Logo class="flex-none w-10 h-10" />

    <!-- Event Name -->
    <div class="w-[218px] h-6 flex items-center flex-none">
      <span class="text-h4 fw-[680] text-neutral truncate">
        <slot>{{ event ? event.name : $t('loadingLabel') }}</slot>
      </span>
    </div>
  </header>
</template>

<script setup>
import Logo from '../assets/Logo.svg';
import { useEvent } from '../composables/useEvent.js';

const { event } = useEvent();
</script>
