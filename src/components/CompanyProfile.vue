<script setup>
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useCompanyProfileStore} from '../store/companyProfileStore.js';
import {useMarketDataStore} from '../store/marketDataStore.js';
import LoadingSpinner from './LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const store = useCompanyProfileStore();
const marketDataStore = useMarketDataStore();

const ticker = computed(() => route.query.ticker || null);
const profile = computed(() => store.profile);

const searchQuery = ref('');
const listLoading = ref(false);

const allCompanies = computed(() => marketDataStore.getDedupedCompanies ?? []);

const filteredCompanies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  const list = q
      ? allCompanies.value.filter(
          (c) => c.name?.toLowerCase().includes(q) || c.symbol?.toLowerCase().includes(q),
      )
      : allCompanies.value;
  return [...list].sort((a, b) =>
      (a.name?.toLowerCase() || '').localeCompare(b.name?.toLowerCase() || ''),
  );
});

const formatPe = (pe) => (pe != null ? Number(pe).toFixed(2) : 'N/A');

const peRatio = computed(() => {
  const pe = store.profile?.pricePerEarningsRatio;
  return pe != null ? Number(pe).toFixed(2) : 'N/A';
});

const sharesOutstanding = computed(() => {
  const shares = store.profile?.sharesOutstanding;
  return shares != null ? Number(shares).toLocaleString('en-US') : 'N/A';
});

const loadList = async () => {
  if (allCompanies.value.length) return; // deja în cache din screener/overview
  listLoading.value = true;
  try {
    await marketDataStore.fetchCompaniesByIndustry();
  } finally {
    listLoading.value = false;
  }
};

const load = () => {
  if (ticker.value) {
    store.fetchProfile(ticker.value);
  } else {
    loadList();
  }
};

const openProfile = (company) => {
  router.push({name: 'companyProfileView', query: {ticker: company.symbol}});
};

onMounted(load);
watch(ticker, load);
onUnmounted(() => store.$reset());
</script>

<template>
  <div class="company-profile">
    <LoadingSpinner :is-loading="store.loading" data-testid="company-profile-spinner"/>

    <div v-if="!ticker" class="company-profile__picker">
      <LoadingSpinner :is-loading="listLoading" data-testid="company-profile-list-spinner"/>

      <div class="company-profile__picker-header">
        <div>
          <h2 class="company-profile__picker-title">Select a company</h2>
          <p class="company-profile__picker-subtitle">Choose a company to view its profile.</p>
        </div>
        <span class="p-input-icon-left">
      <i class="pi pi-search"/>
      <InputText v-model="searchQuery" placeholder="Search by name or ticker..."/>
    </span>
      </div>

      <DataTable
          :value="filteredCompanies"
          data-key="symbol"
          paginator
          :rows="10"
          :rows-per-page-options="[10, 20, 50]"
          size="small"
          :row-hover="true"
          class="company-profile__table"
          @row-click="openProfile($event.data)"
      >
        <Column header="Ticker" style="width: 110px;">
          <template #body="{ data }">
            <Tag :value="data.symbol" severity="primary"/>
          </template>
        </Column>
        <Column field="name" header="Company" sortable/>
        <Column field="industry" header="Industry" sortable/>
        <Column field="sector" header="Sector" sortable/>
        <Column header="P/E" style="width: 90px;">
          <template #body="{ data }">{{ formatPe(data.pricePerEarningsRatio) }}</template>
        </Column>
        <Column header="" style="width: 120px;">
          <template #body="{ data }">
            <Button label="View" icon="pi pi-arrow-right" icon-pos="right" text @click.stop="openProfile(data)"/>
          </template>
        </Column>
        <template #empty>
          <div class="company-profile__table-empty">
            <p v-if="searchQuery">No companies match "{{ searchQuery }}".</p>
            <p v-else>No companies available.</p>
          </div>
        </template>
      </DataTable>
    </div>

    <div v-else-if="profile" class="company-profile__content">
      <header class="company-profile__header">
        <div class="company-profile__title-row">
          <h1 class="company-profile__name">{{ profile.name || ticker }}</h1>
          <Tag :value="profile.symbol || ticker" severity="primary"/>
        </div>
        <div class="company-profile__chips">
          <span v-if="profile.industry" class="company-profile__chip">
            <i class="pi pi-tag"/> {{ profile.industry }}
          </span>
          <span v-if="profile.sector" class="company-profile__chip">{{ profile.sector }}</span>
        </div>
      </header>

      <section class="company-profile__facts">
        <div class="fact">
          <span class="fact__label">P/E Ratio</span>
          <span class="fact__value">{{ peRatio }}</span>
        </div>
        <div class="fact">
          <span class="fact__label">Shares Outstanding</span>
          <span class="fact__value">{{ sharesOutstanding }}</span>
        </div>
        <div class="fact">
          <span class="fact__label">Country</span>
          <span class="fact__value">{{ profile.country || 'N/A' }}</span>
        </div>
        <div class="fact">
          <span class="fact__label">Currency</span>
          <span class="fact__value">{{ profile.currency || 'N/A' }}</span>
        </div>
      </section>

      <section v-if="profile.description" class="company-profile__about">
        <h2 class="company-profile__about-title">About</h2>
        <p class="company-profile__about-text">{{ profile.description }}</p>
      </section>
    </div>

    <div v-else-if="!store.loading" class="company-profile__empty">
      <i class="pi pi-exclamation-circle"/>
      <p>Couldn't load a profile for "{{ ticker }}".</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.company-profile {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;

  &__picker-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
  }

  &__picker-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: $color-text-main;
  }

  &__picker-subtitle {
    margin: 0.25rem 0 0;
    color: $color-text-muted;
  }

  &__table {
    :deep(.p-datatable-tbody > tr) {
      cursor: pointer;
    }
  }

  &__table-empty {
    text-align: center;
    padding: 2rem;
    color: $color-text-muted;
  }

  &__header {
    margin-bottom: 2rem;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  &__name {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: $color-text-main;
  }

  &__chips {
    display: flex;
    gap: 0.75rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }

  &__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.85rem;
    color: $color-text-muted;
  }

  &__facts {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    padding: 1.5rem;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: 0.5rem;
    margin-bottom: 2rem;
  }

  &__about-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $color-text-main;
    margin: 0 0 0.75rem;
  }

  &__about-text {
    color: $color-text-main;
    line-height: 1.6;
  }

  &__empty {
    text-align: center;
    padding: 4rem 1rem;
    color: $color-text-muted;

    i {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }
  }
}

.fact {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;

  &__label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    color: $color-text-muted;
  }

  &__value {
    font-size: 1rem;
    color: $color-text-main;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: $color-primary;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>