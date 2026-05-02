<script setup>
/* Imports */
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarketDataStore } from '../store/marketDataStore.js';
import LoadingSpinner from './LoadingSpinner.vue';

/* Store */
const {
  marketPERatioData,
  marketPERatioLoading,
  marketPERatioError
} = storeToRefs(useMarketDataStore());

/* Computed */
const isLoading = computed(() => marketPERatioLoading.value);
const errorMessage = computed(() => marketPERatioError.value);

const chartData = computed(() => {
  const data = marketPERatioData.value;
  if (!data?.length) return null;

  const sorted = [...data].sort((a, b) => a.year - b.year);
  return {
    labels: sorted.map((item) => String(item.year)),
    datasets: [
      {
        label: 'Market P/E Ratio',
        data: sorted.map((item) => item.avgPERatio ?? 0),
        ...lineDatasetStyle,
      },
    ],
  };
});

const lineDatasetStyle = {
  borderColor: '#3b82f6',
  backgroundColor: 'rgba(59, 130, 246, 0.1)',
  borderWidth: 2,
  fill: true,
  pointRadius: 5,
  pointBackgroundColor: '#3b82f6',
  pointBorderColor: '#fff',
  pointBorderWidth: 2,
  tension: 0.4,
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        font: { size: 12 },
        padding: 15,
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => ` P/E Ratio: ${ctx.parsed.y?.toFixed(2) ?? 'N/A'}`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      title: { display: true, text: 'P/E Ratio' },
      ticks: { font: { size: 11 } },
    },
    x: {
      title: { display: true, text: 'Year' },
      ticks: { font: { size: 11 } },
    },
  },
};
</script>

<template>
  <div class="pe-chart">
    <header class="pe-chart__header">
      <h3 class="pe-chart__title">
        Market P/E Trend by Year
      </h3>
    </header>

    <LoadingSpinner
      :is-loading="isLoading"
      data-testid="pe-chart-spinner"
    />

    <div
      v-if="errorMessage && !isLoading"
      class="pe-chart__error"
    >
      <i class="pi pi-exclamation-triangle" />
      <span>{{ errorMessage }}</span>
    </div>

    <div
      v-else-if="!isLoading && chartData"
      class="pe-chart__canvas"
    >
      <Chart
        type="line"
        :data="chartData"
        :options="chartOptions"
      />
    </div>

    <div
      v-else-if="!isLoading"
      class="pe-chart__empty"
    >
      <i class="pi pi-chart-line" />
      <p>No P/E ratio data available for the selected period.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.pe-chart {
  width: 100%;

  &__header {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid $color-divider;
  }

  &__title {
    margin: 0;
    font-size: $font-lg;
    font-weight: 600;
    color: $color-text-main;
  }

  &__canvas {
    position: relative;
    height: 280px;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background-color: rgba(239, 68, 68, 0.08);
    color: $color-error;
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.5rem;
    font-size: $font-md;

    i {
      font-size: $font-xl;
      flex-shrink: 0;
    }
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3rem 2rem;
    color: $color-text-muted;
    background-color: $color-bg;
    border-radius: 0.5rem;
    border: 1px dashed $color-border;

    i {
      font-size: 2.5rem;
      opacity: 0.5;
    }

    p {
      margin: 0;
      font-size: $font-md;
    }
  }
}
</style>
