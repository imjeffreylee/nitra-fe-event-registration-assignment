<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  showBack: {
    type: Boolean,
    default: true,
  },
  showNext: {
    type: Boolean,
    default: true,
  },
  backLabel: {
    type: String,
    default: 'Back',
  },
  nextLabel: {
    type: String,
    default: 'Next',
  },
  disableNext: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const computedBackLabel = computed(() => props.backLabel === 'Back' ? t('backBtn') : props.backLabel);
const computedNextLabel = computed(() => props.nextLabel === 'Next' ? t('nextBtn') : props.nextLabel);

const emit = defineEmits(['back', 'next']);
</script>

<template>
  <div class="w-full bg-white border-t-1 border-t-solid border-t-gray-100">
    <div
      class="w-full max-w-[1440px] h-[72px] px-4 md:px-16 lg:px-[120px] py-4 flex flex-row justify-between items-center mx-auto bg-white"
    >
      <button
        v-if="showBack"
        class="flex flex-row justify-center items-center min-w-[72px] h-10 px-4 bg-[#E3E6E8] rounded-[10px] cursor-pointer border-none"
        @click="emit('back')"
      >
        <span
          class="text-[14px] font-semibold leading-5 text-center text-black/60"
        >
          {{ computedBackLabel }}
        </span>
      </button>
      <div v-else />

      <button
        v-if="showNext"
        class="flex flex-row justify-center items-center min-w-[72px] h-10 px-4 rounded-[10px] border-none transition-all duration-200"
        :class="[
          disableNext
            ? 'bg-[#ABB5BA] cursor-not-allowed opacity-60'
            : 'bg-[#FB7429] cursor-pointer hover:bg-[#E05E1A]',
        ]"
        :disabled="disableNext"
        @click="emit('next')"
      >
        <span
          class="text-[14px] font-semibold leading-5 text-center text-white"
        >
          {{ computedNextLabel }}
        </span>
      </button>
      <div v-else />
    </div>
  </div>
</template>
