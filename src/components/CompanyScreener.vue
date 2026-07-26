<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useMarketDataStore} from '../store/marketDataStore.js';
import {useFlashMessagesStore} from '../store/flashMessagesStore.js';
import LoadingSpinner from './LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const marketDataStore = useMarketDataStore();
const flashMessagesStore = useFlashMessagesStore();

const companies = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const first = ref(0);
const rows = ref(12);

const industryFromQuery = computed(() => route.query.industry || null);

const headingLabel = computed(() =>
    industryFromQuery.value ? `${industryFromQuery.value} Companies` : 'All Companies',
);

const filteredCompanies = computed(() => {
  let result = [...companies.value];
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter(
        (c) => c.name?.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q),
    );
  }
  return result.sort((a, b) =>
      (a.name?.toLowerCase() || '').localeCompare(b.name?.toLowerCase() || ''),
  );
});

const totalCount = computed(() => companies.value.length);

const formatPe = (pe) => (pe == null ? 'N/A' : Number(pe).toFixed(2));

const loadCompanies = async () => {
  isLoading.value = true;
  first.value = 0;
  try {
    if (!industryFromQuery.value && !marketDataStore.getIndustriesData?.length) {
      await marketDataStore.fetchIndustries();
    }

    await marketDataStore.fetchCompaniesByIndustry(industryFromQuery.value);
    const all = marketDataStore.getCompaniesByIndustry ?? [];

    const list = industryFromQuery.value
        ? all.filter((c) => c.industry === industryFromQuery.value)
        : all;

    const seen = new Set();
    companies.value = list.filter((c) => {
      if (!c?.symbol || seen.has(c.symbol)) return false;
      seen.add(c.symbol);
      return true;
    });

    if (totalCount.value === 0) {
      flashMessagesStore.showWarning(
          industryFromQuery.value
              ? `No companies found for "${industryFromQuery.value}" industry.`
              : 'No companies found.',
      );
    }
  } catch (error) {
    flashMessagesStore.showError(`Failed to load companies: ${error?.message || 'Unknown error'}`);
    companies.value = [];
  } finally {
    isLoading.value = false;
  }
};

const goToProfile = (company) => {
  router.push({name: 'companyProfileView', query: {ticker: company.symbol}});
};

const onPage = (event) => {
  first.value = event.first;
  rows.value = event.rows;
};

onMounted(loadCompanies);
watch(industryFromQuery, loadCompanies);
watch(searchQuery, () => {
  first.value = 0;
});
</script>

<template>
  <div class="company-screener">
    <LoadingSpinner :is-loading="isLoading" data-testid="company-screener-spinner"/>

    <div class="company-screener__header">
      <div class="flex justify-content-between align-items-center flex-wrap gap-3">
        <div class="company-screener__title-section">
          <h1 class="company-screener__title">{{ headingLabel }}</h1>
          <p v-if="totalCount > 0" class="company-screener__subtitle">
            Showing <strong>{{ filteredCompanies.length }}</strong> of <strong>{{ totalCount }}</strong>
          </p>
        </div>

        <span class="p-input-icon-left company-screener__search">
          <i class="pi pi-search"/>
          <InputText
              v-model="searchQuery"
              placeholder="Search by name or ticker..."
              class="w-full md:w-20rem"
          />
        </span>
      </div>
    </div>

    <DataView
        v-if="totalCount > 0"
        :value="filteredCompanies"
        data-key="symbol"
        layout="grid"
        paginator
        :rows="rows"
        :first="first"
        :rows-per-page-options="[12, 24, 48]"
        @page="onPage"
    >
      <template #grid="{ items }">
        <div class="company-screener__grid">
          <Card v-for="company in items" :key="company.symbol" class="company-card-pv">
            <template #title>
              <div class="flex justify-content-between align-items-center">
                <span class="text-xl font-bold">{{ company.name }}</span>
                <Tag :value="company.symbol" severity="primary"/>
              </div>
            </template>

            <template #subtitle>
              <div class="flex align-items-center gap-2 mt-1">
                <i class="pi pi-tag text-xs"/>
                <span>{{ company.industry }}</span>
              </div>
            </template>

            <template #content>
              <div class="flex flex-column gap-3 mt-2">
                <div class="detail-row">
                  <span class="label">Sector</span>
                  <span class="value">{{ company.sector || 'N/A' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">P/E Ratio</span>
                  <span class="value">{{ formatPe(company.pricePerEarningsRatio) }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Country</span>
                  <span class="value">{{ company.country || 'N/A' }}</span>
                </div>

                <p v-if="company.description" class="description-text line-height-3">
                  {{ company.description.substring(0, 150) }}...
                </p>
              </div>
            </template>

            <template #footer>
              <div class="flex gap-3 mt-1">
                <Button
                    label="View Profile"
                    icon="pi pi-external-link"
                    class="flex-auto p-button-outlined"
                    @click="goToProfile(company)"
                />
              </div>
            </template>
          </Card>
        </div>
      </template>

      <template #empty>
        <div class="company-screener__state">
          <i class="pi pi-filter-slash"/>
          <p v-if="searchQuery">No companies match "{{ searchQuery }}".</p>
          <p v-else>No companies to display.</p>
          <Button v-if="searchQuery" label="Clear search" link @click="searchQuery = ''"/>
        </div>
      </template>
    </DataView>

    <div v-else-if="!isLoading" class="company-screener__state">
      <i class="pi pi-inbox"/>
      <p>No companies available.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.company-screener__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
  margin-bottom: 1.5rem;
}

.company-screener__state {
  text-align: center;
  padding: 4rem 1rem;
  color: var(--text-color-secondary);

  i {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
  }
}

.company-card-pv {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
  }

  :deep(.p-card-body) {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 1.25rem;
  }

  :deep(.p-card-content) {
    flex-grow: 1;
    padding: 0;
  }

  :deep(.p-card-footer) {
    padding: 1rem 0 0 0;
  }
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.85rem;

  .label {
    color: var(--text-color-secondary);
  }
}

.description-text {
  font-size: 0.85rem;
  color: var(--text-color-secondary);
  border-top: 1px solid var(--surface-border);
  padding-top: 1rem;
}
</style>