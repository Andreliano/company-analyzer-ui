<script setup>
/* Imports */
import { computed } from 'vue';

/* Props */
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  ariaLabel: {
    type: String,
    default: 'Loading',
  },
  position: {
    type: String,
    default: 'center-center',
  },
  color: {
    type: String,
    default: 'black',
  },
  size: {
    type: String,
    default: 'medium',
  },
  dataTestId: {
    type: String,
    default: '',
  },
});

/* Computed */
const containerClasses = computed(() => ({
  'loading-spinner': true,
  [`loading-spinner--${props.position}`]: props.position,
}));

const progressSpinnerClasses = computed(() => ({
  'loading-spinner': true,
  [`loading-spinner--${props.size}`]: props.size,
  [`loading-spinner--${props.color}`]: props.color,
}));
</script>

<template>
  <div
      v-if="props.isLoading"
      :class="containerClasses"
  >
    <ProgressSpinner
        :class="progressSpinnerClasses"
        :aria-label="props.ariaLabel"
        stroke-width="4"
        animation-duration=".5s"
        :data-testid="props.dataTestId"
    />
  </div>
</template>

<style lang="scss" scoped>
.loading-spinner {
  cursor: wait;

  &--center-center {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.7);
    z-index: 999;
  }

  &--small {
    width: 1rem;
    height: 1rem;
  }

  &--medium {
    width: 3.125rem;
    height: 3.125rem;
  }

  &--black {
    @include progress-spinner-color(black);
  }
}
</style>