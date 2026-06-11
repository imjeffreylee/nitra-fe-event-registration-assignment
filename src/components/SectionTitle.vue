<template>
  <component
    :is="as"
    class="font-sans not-italic fw-[680] text-h3 text-neutral [font-variation-settings:'slnt'_0] w-full max-w-[1200px] min-h-[28px] flex-none grow-0 self-stretch"
  >
    <slot />
  </component>
</template>

<script setup>
defineProps({
  /**
   * The HTML tag to render (e.g. 'h1', 'h2', 'h3', 'h4', 'span')
   */
  as: {
    type: String,
    default: 'h3',
    validator: (value) => {
      return ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div'].includes(value);
    },
  },
});
</script>
