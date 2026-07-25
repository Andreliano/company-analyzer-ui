import axios from 'axios';
import {
    getApiUrl,
    fetchLastNYearsWithData,
    findLatestWeightedPERatio,
} from '../utils/mainUtils.js';
import { useFlashMessagesStore } from './flashMessagesStore.js';
import {defineStore} from 'pinia';

export const useMarketDataStore = defineStore('marketDataStore', {
    state: () => ({
        industriesData: [],
        industriesLoading: false,
        industriesError: null,

        companiesByIndustry: [],
        companiesByIndustryLoading: false,

        marketPERatioData: [],
        marketPERatioLoading: false,
        marketPERatioError: null,

        industryWeightedPERatioMap: {},
        industryPERatiosLoading: false,
        industryPERatiosError: null,

        marketSummary: {
            totalCompanies: 0,
            industriesCovered: 0,
            activeJobs: 0,
        },

        selectedIndustry: null,
    }),

    getters: {
        getIndustriesData: (state) => state.industriesData,
        getIndustriesLoading: (state) => state.industriesLoading,
        getIndustriesError: (state) => state.industriesError,

        getCompaniesByIndustry: (state) => state.companiesByIndustry,
        getCompaniesByIndustryLoading: (state) => state.companiesByIndustryLoading,

        getMarketPERatioData: (state) => state.marketPERatioData,
        getMarketPERatioLoading: (state) => state.marketPERatioLoading,
        getMarketPERatioError: (state) => state.marketPERatioError,

        getIndustryWeightedPERatioMap: (state) => state.industryWeightedPERatioMap,
        getIndustryPERatiosLoading: (state) => state.industryPERatiosLoading,
        getIndustryPERatiosError: (state) => state.industryPERatiosError,

        getMarketSummary: (state) => state.marketSummary,
        getMarketSummaryCards: (state) => [
            {
                key: 'totalCompanies',
                title: 'Total Companies',
                value: state.marketSummary.totalCompanies || 0,
                icon: 'pi pi-building',
                color: 'blue',
            },
            {
                key: 'industriesCovered',
                title: 'Industries Covered',
                value: state.marketSummary.industriesCovered || 0,
                icon: 'pi pi-th-large',
                color: 'purple',
            },
            {
                key: 'activeJobs',
                title: 'Active Jobs',
                value: state.marketSummary.activeJobs || 0,
                icon: 'pi pi-briefcase',
                color: 'green',
            },
        ],

        getDedupedCompanies: (state) => {
            const seen = new Set();
            return state.companiesByIndustry.filter((c) => {
                if (!c?.symbol || seen.has(c.symbol)) return false;
                seen.add(c.symbol);
                return true;
            });
        },

        getSelectedIndustry: (state) => state.selectedIndustry,

        getIndustriesWithMetrics: (state) => {
            return state.industriesData.map((industry) => {
                const companyCount = state.companiesByIndustry.filter((company) => {
                    const companyIndustry =
                        company.industry === '' || company.industry == null
                            ? 'Uncategorized'
                            : company.industry;
                    return companyIndustry === industry;
                }).length;

                const peData = state.industryWeightedPERatioMap[industry];

                return {
                    name: industry,
                    companyCount,
                    avgPERatio: peData?.value ?? 'N/A',
                    peRatioYear: peData?.year ?? null,
                };
            });
        },
    },

    actions: {
        async fetchIndustries() {
            this.industriesLoading = true;
            this.industriesError = null;
            const opts = {
                method: 'GET',
                url: `${getApiUrl()}/getCompaniesIndustries`,
            };
            try {
                const results = (await axios(opts))?.data;
                this.industriesData = Array.isArray(results) ? results : [];
                this.marketSummary.industriesCovered = this.industriesData?.length;
            } catch (error) {
                this.$handleError(error, {
                    stateKey: 'industriesError',
                    fallbackMessage: 'Failed to fetch industries',
                    flashMessage: 'An error occurred while fetching industries.',
                });
                this.industriesData = [];
            } finally {
                this.industriesLoading = false;
            }
        },

        async fetchCompaniesByIndustry(industry) {
            this.companiesByIndustryLoading = true;

            try {
                const allCompanies = industry
                    ? await this.$fetchCompaniesForIndustry(industry)
                    : await this.$fetchCompaniesForAllIndustries();

                this.companiesByIndustry = allCompanies;
                this.marketSummary.totalCompanies = allCompanies.length;
            } catch (error) {
                this.$handleError(error, {
                    stateKey: 'companiesByIndustryError',
                    fallbackMessage: 'Failed to fetch companies',
                    flashMessage: 'An error occurred while fetching companies.',
                });
                this.companiesByIndustry = [];
            } finally {
                this.companiesByIndustryLoading = false;
            }
        },

        async fetchIndustryLatestWeightedPERatios() {
            if (!this.industriesData.length) {
                return;
            }

            this.industryPERatiosLoading = true;
            this.industryPERatiosError = null;

            try {
                const results = await Promise.all(
                    this.industriesData.map((industry) => this.$fetchPERatioForIndustry(industry))
                );

                this.industryWeightedPERatioMap = results.reduce((acc, { industry, value, year }) => {
                    acc[industry] = { value, year };
                    return acc;
                }, {});
            } catch (error) {
                this.$handleError(error, {
                    stateKey: 'industryPERatiosError',
                    fallbackMessage: 'Failed to fetch industry P/E ratios',
                    flashMessage: 'An error occurred while fetching industry P/E ratios.',
                });
            } finally {
                this.industryPERatiosLoading = false;
            }
        },

        async fetchMarketPERatio() {
            this.marketPERatioLoading = true;
            this.marketPERatioError = null;

            try {
                this.marketPERatioData = await fetchLastNYearsWithData(
                    async (year) => {
                        const response = await axios.get(`${getApiUrl()}/getMarketPERatio`, { params: { year } });
                        return response?.data;
                    },
                    5,
                    10,
                );
            } catch (error) {
                this.$handleError(error, {
                    stateKey: 'marketPERatioError',
                    fallbackMessage: 'Failed to fetch P/E ratio data',
                    flashMessage: 'An error occurred while fetching market P/E ratio.',
                });
                this.marketPERatioData = [];
            } finally {
                this.marketPERatioLoading = false;
            }
        },

        async $fetchCompaniesForIndustry(industry) {
            const response = await axios.get(`${getApiUrl()}/getCompaniesByIndustry`, {
                params: { industry },
            });
            return Array.isArray(response?.data) ? response.data : [];
        },

        async $fetchCompaniesForAllIndustries() {
            const promises = this.industriesData.map((industryName) =>
                axios
                    .get(`${getApiUrl()}/getCompaniesByIndustry`, { params: { industry: industryName } })
                    .catch((error) => {
                        console.warn(`Failed to fetch companies for ${industryName}:`, error?.message);
                        return { data: [] };
                    })
            );
            const results = await Promise.all(promises);
            return results.flatMap((res) => res?.data || []);
        },

        async $fetchPERatioForIndustry(industry) {
            const currentYear = new Date().getFullYear();
            const result = await findLatestWeightedPERatio(
                industry,
                currentYear,
                currentYear - 5,
                async (ind, yr) => {
                    const response = await axios.get(`${getApiUrl()}/getWeightedPERatioByIndustryAndYear`, {
                        params: { industry: ind, year: yr },
                    });
                    return response.data;
                }
            );
            return { industry, ...result };
        },

        $handleError(error, { stateKey, fallbackMessage, flashMessage }) {
            this[stateKey] = error?.message || fallbackMessage;
            useFlashMessagesStore().showError(`${flashMessage} Please try again.`);
        },
    },
});
