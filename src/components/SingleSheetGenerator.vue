<script setup>
import {ref, computed, onMounted, onUnmounted} from 'vue';
import {useSheetStudioStore} from '../store/sheetStudioStore.js';
import {useCompaniesWithIncomeStatements} from '../store/companiesWithIncomeStatementsStore.js';
import LoadingSpinner from './LoadingSpinner.vue';
import SheetPreviewTable from './SheetPreviewTable.vue';

const store = useSheetStudioStore();
const symbolsStore = useCompaniesWithIncomeStatements();

const ticker = ref(null);
const generatedTicker = ref('');
const currentYear = new Date().getFullYear();
const fromYear = ref(currentYear - 5);
const toYear = ref(currentYear);
const previewVisible = ref(false);

const isLoading = computed(() => store.generating || store.loadingGrid);

const tickerOptions = computed(() => {
  const seen = new Set();
  return (symbolsStore.getCompanies ?? [])
      .filter((c) => {
        if (!c?.symbol || seen.has(c.symbol)) return false;
        seen.add(c.symbol);
        return true;
      })
      .map((c) => ({symbol: c.symbol, description: c.description || c.symbol}));
});

const sheetUrl = computed(() =>
    store.sheetId ? `https://docs.google.com/spreadsheets/d/${store.sheetId}/edit` : null,
);

const canSubmit = computed(() => !!ticker.value && fromYear.value <= toYear.value);

const onGenerate = () => {
  generatedTicker.value = ticker.value;
  store.generateAndLoad({
    ticker: ticker.value,
    fromYear: fromYear.value,
    toYear: toYear.value,
  });
};

onMounted(() => {
  if (!symbolsStore.getCompanies?.length) {
    symbolsStore.fetchCompaniesWithIncomeStatements();
  }
});

onUnmounted(() => {
  store.$reset();
});
</script>

<template>
  <div class="single-sheet">
    <LoadingSpinner :is-loading="isLoading" data-testid="single-sheet-spinner"/>

    <div class="single-sheet__form">
      <div class="single-sheet__field single-sheet__field--company">
        <label>Company</label>
        <Select
            v-model="ticker"
            :options="tickerOptions"
            option-label="symbol"
            option-value="symbol"
            data-key="symbol"
            :filter="true"
            :filter-fields="['symbol', 'description']"
            filter-placeholder="Search by ticker or name…"
            :virtual-scroller-options="{ itemSize: 44 }"
            :loading="symbolsStore.getLoading"
            placeholder="Select a company"
            reset-filter-on-hide
            show-clear
            class="single-sheet__select"
        >
          <template #option="{ option }">
            <div class="ticker-option">
              <span class="ticker-option__symbol">{{ option.symbol }}</span>
              <span class="ticker-option__sep">—</span>
              <span class="ticker-option__name" :title="option.description">{{ option.description }}</span>
            </div>
          </template>
        </Select>
      </div>
      <div class="single-sheet__field">
        <label>From year</label>
        <InputNumber v-model="fromYear" :use-grouping="false" :min="1990" :max="currentYear"/>
      </div>
      <div class="single-sheet__field">
        <label>To year</label>
        <InputNumber v-model="toYear" :use-grouping="false" :min="1990" :max="currentYear"/>
      </div>
      <Button
          label="Generate & Preview"
          icon="pi pi-file-excel"
          :disabled="!canSubmit || isLoading"
          @click="onGenerate"
      />
    </div>

    <div v-if="store.hasSheet" class="single-sheet__result">
      <div class="single-sheet__result-header">
        <h3>Income Statement — {{ generatedTicker }}</h3>
        <div class="single-sheet__actions">
          <Button
              label="Expand"
              icon="pi pi-window-maximize"
              text
              @click="previewVisible = true"
          />
          <a v-if="sheetUrl" :href="sheetUrl" target="_blank" rel="noopener" class="single-sheet__link">
            <i class="pi pi-external-link"/> Open in Google Sheets
          </a>
        </div>
      </div>

      <SheetPreviewTable :grid="store.sheetGrid"/>
    </div>

    <Dialog
        v-model:visible="previewVisible"
        modal
        maximizable
        :header="`Income Statement — ${generatedTicker}`"
        :style="{ width: '90vw' }"
    >
      <SheetPreviewTable :grid="store.sheetGrid" scroll-height="70vh"/>
    </Dialog>
  </div>
</template>

<style scoped lang="scss">
.single-sheet {
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

    label {
      font-size: 0.8rem;
      font-weight: 600;
      color: $color-text-muted;
    }
  }

  &__select {
    width: 340px;
    max-width: 100%;
  }

  &__result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    gap: 1rem;
    flex-wrap: wrap;

    h3 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: $color-text-main;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: $color-primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
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
    min-width: 0;
  }
}
</style>