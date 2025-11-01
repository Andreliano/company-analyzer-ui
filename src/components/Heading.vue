<script setup>
/* Imports */
import { computed } from 'vue';

/* Props */
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '1',
    validator: (value) => ['1', '2', '3', '4', '5', '6'].includes(value),
  },
  textAlign: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'justify', 'center', 'right'].includes(value),
  },
  styleObject: {
    type: Object,
    default: () => ({}),
  },
  caseTransform: {
    type: String,
    default: 'none',
    validator: (value) => ['upper', 'none'].includes(value),
  },
  dataTestId: {
    type: String,
    default: undefined,
  },
});

/* Computed */
const componentClasses = computed(() => ({
  heading: true,
  [`heading--${props.textAlign}`]: props.textAlign,
  [`heading--${props.caseTransform}`]: props.caseTransform,
}));
</script>

<template>
  <component
      :is="`h${props.size}`"
      :class="componentClasses"
      :style="props.styleObject"
      :data-testid="props.dataTestId"
      v-html="props.content"
  />
</template>

<style lang="scss" scoped>
.heading {
  box-sizing: border-box;

  @for $i from 1 through 6 {
    h#{$i} {
      font-size: #{2 - ($i * 0.2)}rem;
      font-weight: bold;
    }
  }

  &--left {
    text-align: left;
  }

  &--right {
    text-align: right;
  }

  &--center {
    text-align: center;
  }

  &--justify {
    text-align: justify;
  }

  &--uppercase {
    text-transform: uppercase;
  }
}
</style>