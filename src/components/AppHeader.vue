<template>
  <header class="flex flex-row items-center px-12 py-4 gap-3 w-full h-18 bg-white self-stretch flex-none border-b border-solid border-gray-100">
    <!-- Logo as a Vue component -->
    <Logo class="flex-none w-10 h-10" />

    <!-- Event Name -->
    <div class="w-[218px] h-6 flex items-center flex-none">
      <span class="text-h4 font-[680] text-neutral truncate">
        <slot>WebDev Summit 2025</slot>
      </span>
    </div>
  </header>
</template>

<script setup>
import Logo from '../assets/Logo.svg'
</script>
