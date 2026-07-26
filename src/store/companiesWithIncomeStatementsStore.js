import axios from 'axios';
import { getApiUrl } from '../utils/apiConfig.js';
import { defineStore } from 'pinia';

export const useCompaniesWithIncomeStatements = defineStore('companiesWithIncomeStatementsStore', {
    state: () => ({
        companies: [],
        loading: false,
    }),
    getters: {
        getCompanies: (state) => state.companies,
        getLoading: (state) => state.loading,
    },
    actions: {
        async fetchCompaniesWithIncomeStatements() {
            this.loading = true;
            try {
                const { data } = await axios.get(`${getApiUrl()}/getCompaniesWithIncomeStatements`);
                this.companies = Array.isArray(data) ? data : [];
            } catch (error) {
                console.error('Error fetching companies with income statements:', error?.message || error);
                this.companies = [];
            } finally {
                this.loading = false;
            }
        },
    },
});