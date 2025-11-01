import axios from 'axios';
import {getApiUrl} from "../utils/apiConfig.js";
import {defineStore} from 'pinia';

export const useGetCompaniesStockSymbols = defineStore('getCompaniesStockSymbolsStore', {
    state: () => ({
        companiesStockSymbolsResults: [],
        companiesStockSymbolsResultsLoading: false,
        companiesStockSymbolsNoResults: false,
    }),
    getters: {
        getCompaniesStockSymbolsResults: (state) => state.companiesStockSymbolsResults,
        getCompaniesStockSymbolsResultsLoading: (state) => state.companiesStockSymbolsResultsLoading,
        getCompaniesStockSymbolsNoResults: (state) => state.companiesStockSymbolsNoResults,
    },
    actions: {
        async fetchAllCompaniesStockSymbols() {
            this.companiesStockSymbolsResultsLoading = true;
            const opts = {
                method: 'GET',
                url: `${getApiUrl()}/getCompaniesStockSymbols`,
            }
            try {
                this.companiesStockSymbolsResults = (await axios(opts))?.data;
                this.companiesStockSymbolsNoResults = this.companiesStockSymbolsResults?.length === 0;
            } catch (error) {
                console.error('Error fetching data:', error?.message || error);
                this.companiesStockSymbolsResults = [];
                this.companiesStockSymbolsNoResults = true;
            } finally {
                this.companiesStockSymbolsResultsLoading = false;
            }
        }
    }
});