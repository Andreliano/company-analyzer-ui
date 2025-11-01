import {defineStore} from "pinia";
import {useGetCompaniesStockSymbols} from "./getCompaniesStockSymbols.js";

export const useFormDataStore = defineStore('formDataStore', {
    state: () => ({
    }),
    getters: {
        getShowForm: () => {
            const companiesStockSymbolsStore = useGetCompaniesStockSymbols();
            return !companiesStockSymbolsStore.getCompaniesStockSymbolsResultsLoading &&
                companiesStockSymbolsStore.getCompaniesStockSymbolsResults?.length > 0;
        },
    },
    actions: {
    },
});

export default useFormDataStore;