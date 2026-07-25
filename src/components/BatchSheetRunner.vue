<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useBatchStore } from '../store/batchStore.js';
import { useGetCompaniesStockSymbols } from '../store/getCompaniesStockSymbols.js';
import SheetPreviewTable from './SheetPreviewTable.vue';
import LoadingSpinner from './LoadingSpinner.vue';

const store = useBatchStore();
const symbolsStore = useGetCompaniesStockSymbols();

const selectedTickers = ref([]);
const currentYear = new Date().getFullYear();
const fromYear = ref(currentYear - 10);
const toYear = ref(currentYear);
const previewVisible = ref(false);

const tickerOptions = computed(() => {
  const seen = new Set();
  return (symbolsStore.getCompaniesStockSymbolsResults ?? [])
      .filter((c) => {
        if (!c?.symbol || seen.has(c.symbol)) return false;
        seen.add(c.symbol);
        return true;
      })
      .map((c) => ({ symbol: c.symbol, description: c.description || c.symbol }));
});

const canSubmit = computed(
    () =>
        selectedTickers.value.length > 0 &&
        fromYear.value <= toYear.value &&
        !store.submitting &&
        !store.polling,
);

const onSubmit = () => {
  store.submitBatch({
    tickers: selectedTickers.value,
    fromYear: fromYear.value,
    toYear: toYear.value,
  });
};

const onPreview = (row) => {
  if (!row.success) return;
  store.previewSheet({ ticker: row.ticker, sheetId: row.sheetId });
  previewVisible.value = true;
};

onMounted(() => {
  if (!symbolsStore.getCompaniesStockSymbolsResults?.length) {
    symbolsStore.fetchAllCompaniesStockSymbols();
  }
});

onUnmounted(() => {
  store.stopPolling();
  store.$reset();
});
</script>

<template>
  <div class="batch">
    <div class="batch__form">
      <div class="batch__field batch__field--tickers">
        <label>Companies</label>
        <MultiSelect
            v-model="selectedTickers"
            :options="tickerOptions"
            option-label="symbol"
            option-value="symbol"
            data-key="symbol"
            :filter="true"
            :filter-fields="['symbol', 'description']"
            filter-placeholder="Search by ticker or name…"
            :virtual-scroller-options="{ itemSize: 44 }"
            :max-selected-labels="4"
            selected-items-label="{0} companies selected"
            :show-toggle-all="false"
            :loading="symbolsStore.getCompaniesStockSymbolsResultsLoading"
            placeholder="Select companies"
            class="batch__multiselect"
            panel-class="ticker-panel"
        >
          <template #option="{ option }">
            <div class="ticker-option">
              <span class="ticker-option__symbol">{{ option.symbol }}</span>
              <span class="ticker-option__sep">—</span>
              <span class="ticker-option__name" :title="option.description">{{ option.description }}</span>
            </div>
          </template>
        </MultiSelect>
        <small>{{ selectedTickers.length }} selected</small>
      </div>
      <div class="batch__field">
        <label>From year</label>
        <InputNumber v-model="fromYear" :use-grouping="false" :min="1990" :max="currentYear" />
      </div>
      <div class="batch__field">
        <label>To year</label>
        <InputNumber v-model="toYear" :use-grouping="false" :min="1990" :max="currentYear" />
      </div>
      <Button
          label="Run Batch"
          icon="pi pi-play"
          :disabled="!canSubmit"
          :loading="store.submitting"
          @click="onSubmit"
      />
    </div>

    <div v-if="store.job" class="batch__progress">
      <div class="batch__progress-header">
        <span class="batch__status">{{ store.status }}</span>
        <span>
          {{ store.finishedTasks }} / {{ store.totalTasks }} done
          <span v-if="store.failedTasks"> · {{ store.failedTasks }} failed</span>
        </span>
      </div>
      <ProgressBar :value="store.progressPct" />
    </div>

    <div v-if="store.resultRows.length" class="batch__results">
      <DataTable :value="store.resultRows" data-key="ticker" size="small" show-gridlines>
        <Column field="ticker" header="Ticker" style="min-width: 120px;" />
        <Column header="Status" style="min-width: 120px;">
          <template #body="{ data }">
            <Tag
                :value="{ pending: 'Pending', ready: 'Ready', failed: 'Failed' }[data.state]"
                :severity="{ pending: 'info', ready: 'success', failed: 'danger' }[data.state]"
            />
          </template>
        </Column>
        <Column header="Action" style="min-width: 140px;">
          <template #body="{ data }">
            <Button
                label="Preview"
                icon="pi pi-eye"
                text
                :disabled="!data.success"
                @click="onPreview(data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
        v-model:visible="previewVisible"
        modal
        maximizable
        :header="`Income Statement — ${store.previewTicker}`"
        :style="{ width: '90vw' }"
    >
      <LoadingSpinner :is-loading="store.previewLoading" data-testid="batch-preview-spinner" />
      <SheetPreviewTable :grid="store.previewGrid" scroll-height="70vh" />
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.batch {
  &__form {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 2rem;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;

    &--tickers {
      flex: 0 0 auto;
      position: relative;

      small {
        position: absolute;
        bottom: -1.4rem;
        left: 0;
      }
    }

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: $color-text-muted;
    }

    small {
      color: $color-text-muted;
    }
  }

  &__progress {
    margin-bottom: 2rem;

    &-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      color: $color-text-main;
    }
  }

  &__status {
    font-weight: 600;
  }
}

/* Top-level — ca să prindă panoul teleportat în body */
.batch__multiselect {
  width: 340px;
  max-width: 100%;
}

.ticker-option {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  width: 100%;
  overflow: hidden;

  &__symbol {
    font-weight: 700;
    flex: 0 0 auto;
  }

  &__sep {
    color: $color-text-muted;
    flex: 0 0 auto;
  }

  &__name {
    color: $color-text-muted;
    font-size: 0.85rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1 1 auto;
    min-width: 0; // esențial ca ellipsis să meargă în flex
  }
}
</style>