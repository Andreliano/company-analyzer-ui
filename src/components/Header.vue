<script setup>
/* Imports */
import DrawerMenu from './DrawerMenu.vue';

</script>

<template>
  <header class="header">
    <div class="header__top" data-testid="header-container">
      <div class="header__brand" data-testid="header-center">
        <i class="pi pi-chart-bar header__logo-icon" />
        <Heading
            content="Company Analyzer"
            size="3"
            data-testid="header-center-content"
        />
      </div>
    </div>

    <nav class="header__nav" data-testid="header-sub-container">
      <DrawerMenu />
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: $color-surface;
  border-bottom: 1px solid $color-border;
  box-shadow: $shadow-sm;

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.625rem;
  }

  &__logo-icon {
    font-size: 1.5rem;
    color: $color-primary;
  }

  :deep(h3) {
    margin: 0;
    font-size: $font-xl;
    font-weight: 700;
    color: $color-text-main;
    letter-spacing: -0.01em;
    text-transform: none;
  }

  &__nav {
    background-color: $color-bg;
    border-top: 1px solid $color-divider;
    padding: 0.4rem 2rem;
    display: flex;
    align-items: center;
    min-height: 40px;

    :deep(.p-button) {
      color: $color-text-main;
      background: transparent;
      border: none;

      &:hover {
        background-color: $color-divider;
      }
    }

    :deep(.pi-bars) {
      color: $color-text-main;
      font-size: 1.25rem;
    }
  }
}
</style>
