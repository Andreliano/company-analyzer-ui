<script setup>
/* Imports */
import { computed } from 'vue';

/* Props */
const props = defineProps({
  menuOpen: {
    type: Boolean,
    default: false,
  },
});

/* Emits */
const emit = defineEmits(['open']);

/* Computed - Handle hamburger menu classes */
const hamburgerMenuClasses = computed(() => ({
  'hamburger-menu': true,
  'hamburger-menu--active': props.menuOpen,
}));

/* Handle open menu */
const openMenu = () => emit('open');
</script>

<template>
  <div
    class="hamburger-menu__container"
    data-testid="hamburger-menu-container"
    aria-label="Toggle navigation"
    tabindex="0"
    role="button"
    @keydown.enter.prevent="openMenu"
    @click="openMenu"
  >
    <div
      :class="hamburgerMenuClasses"
      data-testid="hamburger-menu"
    >
      <div
        class="hamburger-menu__line hamburger-menu__line--top"
        data-testid="hamburger-menu-line-top"
      />
      <div
        class="hamburger-menu__line hamburger-menu__line--bottom"
        data-testid="hamburger-menu-line-bottom"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.hamburger-menu {
  position: relative;
  width: 1.25rem;
  height: 0.6875rem;
  margin: auto;

  &__container {
    @include center-flex();
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    border-radius: 0.5rem;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: $color-divider;
    }
  }

  &__line {
    position: absolute;
    background: $color-text-main; // Inlocuit white cu o culoare vizibila
    height: 2px;
    width: 1.25rem;
    border-radius: 1.25rem;
    transition: all ease 0.5s;
    transform-origin: center center;

    &--bottom {
      transform: translateY(0.5rem);
    }
  }

  &--active {
    @include center-flex();

    .hamburger-menu__line {
      background: $color-primary;

      &--top {
        transform: rotate(45deg);
      }

      &--bottom {
        transform: rotate(-45deg);
      }
    }
  }
}
</style>
