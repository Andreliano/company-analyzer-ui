<script setup>
/* Imports */
import {
  onMounted,
  computed,
  watch,
} from 'vue';
import { useMarketDataStore } from '../store/marketDataStore.js';
import MarketSummaryCards from './MarketSummaryCards.vue';
import IndustriesTable from '../components/IndustriesTable.vue';
import MarketPEChart from '../components/MarketPEChart.vue';
import QuickActions from '../components/QuickActions.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';

/* Constants */
const PAGE_HEADER = {
  title: 'Market Overview',
  subtitle: 'Comprehensive market analytics and company insights',
};

const SECTION_TITLES = {
  industries: 'Industries Overview',
};

/* Store */
const marketDataStore = useMarketDataStore();

/* Computed */
const isLoading = computed(
    () =>
        marketDataStore.getIndustriesLoading ||
        marketDataStore.getMarketPERatioLoading ||
        marketDataStore.getIndustryPERatiosLoading,
);

/* Lifecycle */
onMounted(async () => {
  await marketDataStore.fetchIndustries();
  await Promise.all([
    marketDataStore.fetchCompaniesByIndustry(),
    marketDataStore.fetchMarketPERatio(),
    marketDataStore.fetchIndustryLatestWeightedPERatios(),
  ]);
});

/* Watchers */
watch(isLoading, (loading) => {
  document.body.style.overflow = loading ? 'hidden' : '';
});
</script>

<template>
  <div class="market-data-view">
    <LoadingSpinner
      :is-loading="isLoading"
      data-testid="market-data-view-spinner"
    />

    <div class="market-data-view__container">
      <header class="market-data-view__header">
        <h1 class="market-data-view__title">
          {{ PAGE_HEADER.title }}
        </h1>
        <p class="market-data-view__subtitle">
          {{ PAGE_HEADER.subtitle }}
        </p>
      </header>

      <section class="market-data-view__section">
        <MarketSummaryCards />
      </section>

      <section class="market-data-view__main-content">
        <div class="market-data-view__left-column">
          <div class="section-card">
            <h2 class="section-card__title">
              {{ SECTION_TITLES.industries }}
            </h2>
            <IndustriesTable />
          </div>
        </div>

        <div class="market-data-view__right-column">
          <div class="section-card">
            <MarketPEChart />
          </div>
          <div class="section-card">
            <QuickActions />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.market-data-view {
  min-height: 100vh;
  background-color: $color-bg;
  padding: 2rem 1rem;

  &__container {
    max-width: 1400px;
    margin: 0 auto;
  }

  &__header {
    text-align: left;
    margin-bottom: 2rem;
  }

  &__title {
    margin: 0 0 0.5rem;
    font-size: 2rem;
    font-weight: 700;
    color: $color-text-main;
  }

  &__subtitle {
    margin: 0;
    font-size: 1rem;
    color: $color-text-muted;
  }

  &__section {
    margin-bottom: 2rem;
  }

  &__main-content {
    display: grid;
    grid-template-columns: 60% 1fr;
    gap: 2rem;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__left-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__right-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

.section-card {
  background-color: $color-surface;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: $shadow-sm;
  border: 1px solid $color-border;

  &__title {
    margin: 0 0 1.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text-main;
    padding-bottom: 1rem;
    border-bottom: 1px solid $color-divider;
  }
}

@media (max-width: 768px) {
  .market-data-view {
    padding: 1rem 0.5rem;

    &__title {
      font-size: 1.5rem;
    }

    &__main-content {
      grid-template-columns: 1fr;
    }
  }

  .section-card {
    padding: 1rem;

    &__title {
      font-size: 1.125rem;
    }
  }
}
</style>
