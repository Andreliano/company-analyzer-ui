<script setup>
/* Imports */
import { defineAsyncComponent } from 'vue';

/* Components - Async -> Lazy Load */
const MarketDataView = defineAsyncComponent({
  loader: () => import('../components/MarketDataView.vue'),
});
</script>

<template>
  <div class="market-data-view-container">
    <MarketDataView />
  </div>
</template>

<style scoped>
.market-data-view-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f9fafb;
}
</style>