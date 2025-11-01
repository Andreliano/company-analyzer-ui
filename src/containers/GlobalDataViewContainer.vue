<script setup>

import Heading from "../components/Heading.vue";
import {
  onMounted,
} from "vue";
import useFormDataStore from "../store/formDataStore.js";
import {useGetCompaniesStockSymbols} from "../store/getCompaniesStockSymbols.js";
import FormData from "../components/FormData.vue";

/* Store */
const companiesStockSymbolsStore = useGetCompaniesStockSymbols();
const formDataStore = useFormDataStore();

/* Lifecycle Hook */
onMounted(async () => {
  await companiesStockSymbolsStore.fetchAllCompaniesStockSymbols();
});
</script>

<template>
  <div
      class="global-data-view-container"
  >
    <Heading
        content="COMPANY ANALYZER"
        size="2"
        text-align="left"
        :style-object="{
          padding: '0 1rem 1rem'
        }"
    >
    </Heading>
    <FormData
        :show-form="formDataStore.getShowForm"
        :companies-stock-symbols-results="companiesStockSymbolsStore.getCompaniesStockSymbolsResults"
        :companies-stock-symbols-results-loading="companiesStockSymbolsStore.getCompaniesStockSymbolsResultsLoading"
        :companies-stock-symbols-no-results="companiesStockSymbolsStore.getCompaniesStockSymbolsNoResults"
    >
    </FormData>
  </div>
</template>

<style scoped>
.global-data-view-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f9fafb;
  padding-top: 2rem;
}
</style>