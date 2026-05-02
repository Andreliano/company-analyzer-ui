<script setup>
/* Imports */
import {
  ref,
  computed,
  watchEffect,
  watch,
  useTemplateRef,
  onMounted
} from 'vue';
import {useRouter} from 'vue-router';
import {storeToRefs} from 'pinia';
import {useMarketDataStore} from '../store/marketDataStore.js';
import {useIndustriesTableStore} from '../store/industriesTableStore.js';
import LoadingSpinner from './LoadingSpinner.vue';

/* Router */
const router = useRouter();

/* Stores */
const marketDataStore = useMarketDataStore();
const industriesTableStore = useIndustriesTableStore();
const {tableFilters} = storeToRefs(industriesTableStore);

/* Template Refs */
const dataTable = useTemplateRef('dataTable');

/* State */
const state = ref({
  searchTerm: null,
  totalFilteredResults: null,
});

/* Computed */
const industriesData = computed(() => marketDataStore.getIndustriesWithMetrics);
const isLoading = computed(() => marketDataStore.getIndustriesLoading);
const showTable = computed(() => industriesTableStore.getShowTable);

const formattedTotalResults = computed(() => {
  const count = state.value.totalFilteredResults ?? 0;
  return `<b>${count}</b> result${count === 1 ? '' : 's'}`;
});

/* Methods */
const handleViewClick = (industry) => {
  router.push({
    name: 'companyScreenerView',
    query: {industry: industry.name},
  });
};

const clearTableFilters = () => {
  industriesTableStore.clearTableFilters();
  state.value.searchTerm = null;
};

const getGlobalFilterFields = () =>
    industriesTableStore.getHeaderColumns.map((col) => col.field);

/* Lifecycle */
onMounted(() => {
  clearTableFilters();
});

/* Watchers */
watchEffect(() => {
  if (dataTable.value?.processedData) {
    state.value.totalFilteredResults = dataTable.value.processedData.length;
  } else {
    state.value.totalFilteredResults = industriesData.value?.length ?? 0;
  }
});

watch(
    () => tableFilters.value?.global?.value,
    (newValue) => {
      state.value.searchTerm = newValue;
    }
);

watch(
    () => tableFilters.value,
    () => {
    },
    {deep: true}
);
</script>

<template>
  <div class="industries-table-wrapper">
    <LoadingSpinner
      :is-loading="isLoading"
      data-testid="industries-table-spinner"
    />

    <div
      v-if="showTable"
      class="industries-table"
      data-testid="industries-table"
    >
      <DataTable
        ref="dataTable"
        v-model:filters="tableFilters"
        :value="industriesData"
        paginator
        :rows="5"
        :rows-per-page-options="[5, 10, 20]"
        :global-filter-fields="getGlobalFilterFields()"
        responsive-layout="scroll"
        filter-display="menu"
        striped-rows
        scroll-height="auto"
      >
        <!-- Header: Search + Clear Filters -->
        <template #header>
          <div class="industries-table__header">
            <Button
              icon="pi pi-filter-slash"
              label="Clear Filters"
              class="p-button-outlined industries-table__header__clear-filters"
              data-testid="clear-filters-button"
              @click="clearTableFilters"
            />
            <InputText
              v-model="state.searchTerm"
              v-tooltip.bottom="'Press ENTER after typing'"
              class="industries-table__header__search-term"
              placeholder="Search industries..."
              data-testid="industries-table-search"
              @keyup.enter="industriesTableStore.setSearchTerm(tableFilters, state.searchTerm?.trim())"
            />
          </div>
        </template>

        <!-- Dynamic Columns -->
        <Column
          v-for="col in industriesTableStore.getHeaderColumns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          :sortable="col.sortable"
          :style="col.style"
        >
          <!-- Filter for 'name' column -->
          <template
            v-if="col.field === 'name'"
            #filter="{ filterModel }"
          >
            <InputText
              v-model="filterModel.value"
              type="text"
              class="p-column-filter"
              placeholder="Search by industry"
            />
          </template>

          <!-- Body templates -->
          <template #body="{ data }">
            <!-- Industry Name -->
            <span
              v-if="col.field === 'name'"
              class="industry-name"
            >
              {{ data.name }}
            </span>

            <!-- P/E Ratio -->
            <template v-else-if="col.field === 'avgPERatio'">
              <div
                v-if="data.avgPERatio !== null && data.avgPERatio !== undefined && data.avgPERatio !== 'N/A'"
                class="pe-ratio-container"
              >
                <span class="pe-ratio">
                  {{ typeof data.avgPERatio === 'number' ? data.avgPERatio.toFixed(2) : data.avgPERatio }}
                </span>
                <span
                  v-if="data.peRatioYear"
                  v-tooltip.top="`Latest available data for this industry`"
                  class="pe-ratio-year"
                  :class="{ 'pe-ratio-year--old': data.peRatioYear < new Date().getFullYear() }"
                >
                  ({{ data.peRatioYear }})
                </span>
              </div>
              <span
                v-else
                class="pe-ratio-na"
              >N/A</span>
            </template>

            <!-- Company Count -->
            <span
              v-else-if="col.field === 'companyCount'"
              class="company-count"
            >
              {{ data.companyCount || 0 }}
            </span>
          </template>
        </Column>

        <!-- Action Column -->
        <Column
          header="Action"
          style="width: 10%; text-align: center"
        >
          <template #body="{ data }">
            <Button
              v-tooltip.bottom="'View companies'"
              icon="pi pi-eye"
              class="p-button-rounded p-button-text p-button-sm"
              aria-label="View"
              @click="handleViewClick(data)"
            />
          </template>
        </Column>

        <!-- Paginator end: total results -->
        <template #paginatorend>
          <p v-html="formattedTotalResults" />
        </template>
      </DataTable>
    </div>

    <div
      v-if="!showTable && !isLoading"
      class="no-results"
    >
      <p>No industries data available.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.industries-table-wrapper {
  width: 100%;
}

.industries-table {
  background-color: $color-surface;
  border-radius: 0.75rem;
  overflow: hidden;

  :deep(.p-datatable) {
    font-size: $font-sm;
    background: transparent;
  }

  :deep(.p-datatable-thead > tr > th) {
    background-color: $color-bg; // slate-100 — mai inchis decat body
    border-bottom: 1px solid $color-border;
    font-weight: 600;
    font-size: $font-xs;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: $color-text-muted;
    padding: 0.875rem 1rem;
  }

  :deep(.p-datatable-tbody > tr > td) {
    border-bottom: 1px solid $color-divider;
    padding: 0.875rem 1rem;
    vertical-align: middle;
    color: $color-text-main;
  }

  :deep(.p-datatable-tbody > tr:last-child > td) {
    border-bottom: none; // Ultimul rand fara bordura
  }

  // Zebra striping subtil
  :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
    background-color: $color-divider; // surface-100 — foarte subtil
  }

  :deep(.p-datatable-tbody > tr:nth-child(odd) > td) {
    background-color: $color-surface;
  }

  :deep(.p-datatable-tbody > tr) {
    transition: background-color 0.15s ease;

    &:hover > td {
      background-color: rgba(99, 102, 241, 0.15) !important;
      color: $color-text-main;
    }
  }

  :deep(.p-paginator) {
    background-color: $color-bg; // consistent cu header-ul tabelului
    border-top: 1px solid $color-border;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: $font-sm;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1rem;

    &__clear-filters {
      font-size: $font-sm;
    }

    &__search-term {
      flex: 1;
      max-width: 300px;
    }
  }
}

// Industry name
.industry-name {
  font-weight: 500;
  color: $color-text-main;
  font-size: $font-sm;
}

// Badge P/E Ratio
.pe-ratio {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 600;
  font-size: $font-sm;
  color: #059669;                    // emerald-600
  background-color: rgba(16, 185, 129, 0.08);
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.pe-ratio-na {
  color: $color-text-muted;
  font-size: $font-sm;
  font-style: italic;
}

// Badge No. of Companies
.company-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  background-color: rgba(99, 102, 241, 0.08); // Indigo subtil
  color: #6366f1;                              // Indigo-500
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  font-weight: 600;
  font-size: $font-sm;
}

// Empty state
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  padding: 3rem 2rem;
  color: $color-text-muted;
  font-size: $font-sm;

  .pi {
    font-size: 2rem;
    opacity: 0.4;
  }
}
</style>
