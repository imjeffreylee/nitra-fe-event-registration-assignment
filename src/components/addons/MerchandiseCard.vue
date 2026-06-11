<template>
  <div
    class="box-border flex flex-col items-start p-4 gap-2 w-full max-w-[788px] min-h-[131px] shadow-[0px_4px_16px_rgba(0,0,0,0.08),0px_1px_3px_rgba(0,0,0,0.04)] rounded-lg transition-all duration-200"
    :class="[
      quantity > 0
        ? 'bg-brand-subtle-rest border border-solid border-brand-emphasis'
        : 'bg-surface-l1 border border-solid border-neutral-muted hover:border-gray-300',
    ]"
  >
    <!-- Header: Name & Price -->
    <div class="flex flex-row justify-between items-center p-0 self-stretch">
      <span class="font-semibold text-[16px] leading-[19px] text-neutral">
        {{ item.name }}
      </span>
      <span class="font-semibold text-[16px] leading-[19px] text-neutral">
        {{ formattedPrice }}
      </span>
    </div>

    <!-- Description -->
    <div class="font-regular text-[12px] leading-[15px] text-neutral-muted">
      {{ item.description }}
    </div>

    <!-- Controls Row -->
    <div class="flex flex-row items-center p-0 gap-4 self-stretch mt-1">
      <!-- Size Selector (only if sizes exist) -->
      <div
        v-if="item.sizes && item.sizes.length > 0"
        class="flex flex-row items-center p-0 gap-2"
      >
        <span class="font-medium text-[12px] leading-[15px] text-neutral-muted">
          Size:
        </span>
        <div
          class="box-border relative flex flex-row items-center justify-between px-3 py-1.5 gap-1.5 min-w-[45px] h-[27px] bg-white border border-solid border-neutral-muted rounded-md"
        >
          <span class="font-medium text-[12px] leading-[15px] text-neutral">
            {{ localSize }}
          </span>
          <span
            class="font-regular text-[10px] leading-[12px] text-neutral-quiet"
          >
            ▾
          </span>
          <select
            v-model="localSize"
            class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          >
            <option v-for="sz in item.sizes" :key="sz" :value="sz">
              {{ sz }}
            </option>
          </select>
        </div>
      </div>

      <!-- Quantity Picker -->
      <div class="flex flex-row items-center p-0 gap-2">
        <span class="font-medium text-[12px] leading-[15px] text-neutral-muted">
          Qty:
        </span>
        <button
          class="flex flex-col justify-center items-center p-0 w-7 h-7 bg-neutral-subtle-rest rounded-md border-none cursor-pointer transition-colors duration-150 hover:enabled:bg-neutral-subtle-hover disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="quantity <= 0"
          type="button"
          aria-label="Decrease quantity"
          @click="decrement"
        >
          <span class="w-3 h-[2px] bg-[rgba(0,0,0,0.9)]"></span>
        </button>
        <div class="flex flex-col justify-center items-center p-0 w-6 h-7">
          <span
            class="font-semibold text-[14px] leading-[14px] flex items-center text-center text-neutral"
          >
            {{ quantity }}
          </span>
        </div>
        <button
          class="flex flex-col justify-center items-center p-0 w-7 h-7 bg-neutral-subtle-rest rounded-md border-none cursor-pointer transition-colors duration-150 hover:enabled:bg-neutral-subtle-hover disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="quantity >= item.maxQuantity"
          type="button"
          aria-label="Increase quantity"
          @click="increment"
        >
          <div class="relative w-3 h-3">
            <span
              class="absolute top-[5px] left-0 w-3 h-[2px] bg-[rgba(0,0,0,0.9)]"
            ></span>
            <span
              class="absolute top-0 left-[5px] w-[2px] h-3 bg-[rgba(0,0,0,0.9)]"
            ></span>
          </div>
        </button>
        <span
          class="font-regular text-[10px] leading-[12px] text-neutral-quiet"
        >
          max {{ item.maxQuantity }}
        </span>
      </div>
    </div>

    <!-- Added to Order Indicator -->
    <div
      v-if="quantity > 0"
      class="flex flex-row items-center p-0 self-stretch mt-1"
    >
      <span class="font-semibold text-[11px] leading-[13px] text-success">
        ✓ Added to order
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  selectedSize: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:quantity', 'update:selectedSize']);

const localSize = computed({
  get() {
    return (
      props.selectedSize || (props.item.sizes && props.item.sizes[0]) || ''
    );
  },
  set(val) {
    emit('update:selectedSize', val);
  },
});

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.item.price);
});

const increment = () => {
  if (props.quantity < props.item.maxQuantity) {
    emit('update:quantity', props.quantity + 1);
  }
};

const decrement = () => {
  if (props.quantity > 0) {
    emit('update:quantity', props.quantity - 1);
  }
};
</script>
