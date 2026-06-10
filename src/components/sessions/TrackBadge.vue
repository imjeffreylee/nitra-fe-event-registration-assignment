<template>
  <div
    class="flex flex-row justify-center items-center px-[5px] py-[3px] rounded-full flex-none h-5 order-0 grow-0"
    :class="{
      'bg-[#D2E9F9] w-[72px]': track === 'backend',
      'bg-[#FFF6B3] w-[79px]': track === 'frontend',
      'bg-[#FEE5D7] w-[63px]': track === 'devops',
      'bg-[#EBEEEF] w-[47px]': !['backend', 'frontend', 'devops'].includes(
        track,
      ),
    }"
  >
    <!-- Label Container -->
    <div
      class="flex flex-row justify-center items-center flex-none order-1 grow-0 px-[4px] py-0 gap-[8px] h-[14px]"
      :class="{
        'w-[62px]': track === 'backend',
        'w-[69px]': track === 'frontend',
        'w-[53px]': track === 'devops',
        'w-[37px]': !['backend', 'frontend', 'devops'].includes(track),
      }"
    >
      <!-- Placeholder (Text) -->
      <span
        class="text-[11px] leading-[14px] font-[570] uppercase [font-variation-settings:'slnt'_0] flex-none order-0 grow-0 h-[14px]"
        :class="{
          'text-[#1567A2] w-[54px]': track === 'backend',
          'text-[#6A5F06] w-[61px]': track === 'frontend',
          'text-[#C94A03] w-[45px]': track === 'devops',
          'text-[#5C6970] w-[29px]': ![
            'backend',
            'frontend',
            'devops',
          ].includes(track),
        }"
      >
        {{ track }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  track: {
    type: String,
    required: true,
  },
});
</script>
