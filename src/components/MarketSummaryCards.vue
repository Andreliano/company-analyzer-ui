<script setup>
/* Imports */
import { computed } from 'vue';
import { useMarketDataStore } from '../store/marketDataStore.js';

/* Store */
const marketDataStore = useMarketDataStore();

/* Computed */
const summaryCards = computed(() => marketDataStore.getMarketSummaryCards);
const isLoading = computed(
    () => marketDataStore.getIndustriesLoading || marketDataStore.getCompaniesByIndustryLoading
);

/* Methods */
const getCardClasses = (card) => [
  'summary-card',
  `summary-card--${card.color}`,
  { 'summary-card--loading': isLoading.value },
];

const getValueClasses = [
  'summary-card__value',
  { 'summary-card__value--loading': isLoading.value },
];
</script>

<template>
  <div class="market-summary-cards">
    <div
      v-for="card in summaryCards"
      :key="card.key"
      :class="getCardClasses(card)"
    >
      <div class="summary-card__icon-wrapper">
        <i
          :class="card.icon"
          class="summary-card__icon"
        />
      </div>
      <div class="summary-card__content">
        <p class="summary-card__title">
          {{ card.title }}
        </p>
        <p :class="getValueClasses">
          {{ isLoading ? '-' : card.value }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:list';

$summary-colors: (
    'blue':   (rgba(99, 102, 241, 0.06),  rgba(99, 102, 241, 0.15),  #6366f1),
    'purple': (rgba(139, 92, 246, 0.06),  rgba(139, 92, 246, 0.15),  #8b5cf6),
    'green':  (rgba(16, 185, 129, 0.06),  rgba(16, 185, 129, 0.15),  #10b981),
);

.market-summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.summary-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid $color-border; // Bordura subtila uniforma
  background-color: $color-surface; // Alb pur — contrast cu $color-bg
  box-shadow: $shadow-sm;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }

  // Iconita colorata fara fundal colorat pe tot cardul
  @each $name, $values in $summary-colors {
    $bg:         list.nth($values, 1);
    $border:     list.nth($values, 2);
    $icon-color: list.nth($values, 3);

    &--#{$name} {
      .summary-card__icon-wrapper {
        background-color: $bg;
        border: 1px solid $border;
      }

      .summary-card__icon {
        color: $icon-color;
      }
    }
  }

  &__icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3.25rem;
    height: 3.25rem;
    border-radius: 0.625rem;
    margin-right: 1.25rem;
    flex-shrink: 0;
  }

  &__icon {
    font-size: 1.5rem;
  }

  &__content {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: $font-xs;
    font-weight: 600;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  &__value {
    margin: 0.375rem 0 0;
    font-size: $font-3xl;
    font-weight: 700;
    color: $color-text-main;
    line-height: 1;

    &--loading {
      color: $color-border;
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>
