<script setup>
/* Imports */
import {
  ref,
  computed,
  onMounted,
  watch
} from 'vue';
import {useRoute} from 'vue-router';
import {useMarketDataStore} from '../store/marketDataStore.js';
import {useFlashMessagesStore} from '../store/flashMessagesStore.js';

/* Router */
const route = useRoute();

/* Stores */
const marketDataStore = useMarketDataStore();
const flashMessagesStore = useFlashMessagesStore();

/* State */
const selectedIndustry = ref(null);
const companies = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');

/* Computed */
const industryFromQuery = computed(() => route.query.industry);

const filteredCompanies = computed(() => {
  if (!companies.value) return [];

  let result = [...companies.value];

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(c =>
        c.name?.toLowerCase().includes(query) ||
        c.symbol?.toLowerCase().includes(query)
    );
  }

  return result.sort((a, b) => {
    const nameA = a.name?.toLowerCase() || '';
    const nameB = b.name?.toLowerCase() || '';
    return nameA.localeCompare(nameB);
  });
});

const companyCount = computed(() => companies.value.length); // totalul nefiltat
const hasNoData = computed(() => !isLoading.value && companies.value.length === 0);

/* Methods */
const fetchCompaniesByIndustry = async (industry) => {
  if (!industry) {
    flashMessagesStore.showError('No industry selected.');
    return;
  }

  isLoading.value = true;
  selectedIndustry.value = industry;

  try {
    await marketDataStore.fetchCompaniesByIndustry(industry);
    companies.value = marketDataStore.getCompaniesByIndustry.filter(
      (company) => company.industry === industry
    );

    if (companyCount.value === 0) {
      flashMessagesStore.showWarning(`No companies found for "${industry}" industry.`);
    } else {
      flashMessagesStore.showSuccess(`Loaded ${companyCount.value} companies from "${industry}" industry.`);
    }
  } catch (error) {
    flashMessagesStore.showError(`Failed to load companies: ${error?.message || 'Unknown error'}`);
    companies.value = [];
  } finally {
    isLoading.value = false;
  }
};

/* Lifecycle */
onMounted(() => {
  if (industryFromQuery.value) {
    fetchCompaniesByIndustry(industryFromQuery.value);
  }
});

/* Watchers */
watch(
  () => industryFromQuery.value,
  (newIndustry) => {
    if (newIndustry) {
      fetchCompaniesByIndustry(newIndustry);
    }
  }
);
</script>

<template>
  <div class="company-screener">
    <div class="company-screener__header">
      <div class="flex justify-content-between align-items-center flex-wrap gap-3">
        <!-- Titlu -->
        <div class="company-screener__title-section">
          <h1 class="company-screener__title">
            <span v-if="selectedIndustry" class="company-screener__industry-tag">
              {{ selectedIndustry }}
            </span>
            Companies
          </h1>
          <p v-if="companyCount > 0" class="company-screener__subtitle">
            Showing <strong>{{ filteredCompanies.length }}</strong> of <strong>{{ companyCount }}</strong>
          </p>
        </div>

        <!-- Search Bar -->
        <span class="p-input-icon-left company-screener__search">
          <i class="pi pi-search" />
          <InputText
              v-model="searchQuery"
              placeholder="Search by name or ticker..."
              class="w-full md:w-20rem"
          />
        </span>
      </div>
    </div>

    <!-- Grid cu PrimeVue Cards -->
    <div v-if="!isLoading && filteredCompanies.length > 0" class="company-screener__grid">
      <Card v-for="company in filteredCompanies" :key="company.symbol" class="company-card-pv">
        <template #title>
          <div class="flex justify-content-between align-items-center">
            <span class="text-xl font-bold">{{ company.name }}</span>
            <Tag :value="company.symbol" severity="primary" />
          </div>
        </template>

        <template #subtitle>
          <div class="flex align-items-center gap-2 mt-1">
            <i class="pi pi-tag text-xs"></i>
            <span>{{ company.industry }}</span>
          </div>
        </template>

        <template #content>
          <div class="flex flex-column gap-3 mt-2">
            <div class="detail-row">
              <span class="label">Sector</span>
              <span class="value">{{ company.sector || 'N/A' }}</span>
            </div>
            <div class="detail-row" v-if="company.marketCap">
              <span class="label">Market Cap</span>
              <span class="value">{{ company.marketCap }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Exchange</span>
              <Tag :value="company.exchange" severity="info" pt:root:class="text-xs" />
            </div>

            <p v-if="company.description" class="description-text line-height-3">
              {{ company.description.substring(0, 150) }}...
            </p>
          </div>
        </template>

        <template #footer>
          <div class="flex gap-3 mt-1">
            <Button label="View Profile" icon="pi pi-external-link" class="flex-auto p-button-outlined" />
            <Button v-if="company.website" icon="pi pi-globe" rounded text as="a" :href="company.website" target="_blank" />
          </div>
        </template>
      </Card>
    </div>

    <!-- No Search Results -->
    <div v-if="!isLoading && filteredCompanies.length === 0 && searchQuery" class="text-center p-5">
      <i class="pi pi-filter-slash text-4xl text-400 mb-3"></i>
      <p>No companies match your search "{{ searchQuery }}"</p>
      <Button label="Clear Search" link @click="searchQuery = ''" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.company-screener__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  align-items: stretch;
}

.company-card-pv {
  display: flex;
  flex-direction: column;
  height: 100%;

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

.company-card-pv {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  }
}

</style>