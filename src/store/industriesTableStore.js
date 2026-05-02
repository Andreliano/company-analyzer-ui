import { defineStore } from 'pinia';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';
import { useMarketDataStore } from './marketDataStore.js';

export const useIndustriesTableStore = defineStore('industriesTableStore', {
    state: () => ({
        tableFilterKeys: ['name'],
        tableFilters: {
            global: {
                value: null,
                matchMode: FilterMatchMode.CONTAINS,
            },
            name: {
                operator: FilterOperator.AND,
                constraints: [
                    {
                        value: null,
                        matchMode: FilterMatchMode.STARTS_WITH,
                    },
                ],
            },
        },
        headerColumns: [
            {
                field: 'name',
                header: 'Industry Name',
                sortable: true,
                style: 'width: 40%',
            },
            {
                field: 'avgPERatio',
                header: 'Avg P/E Ratio',
                sortable: true,
                style: 'width: 30%',
            },
            {
                field: 'companyCount',
                header: 'No. of Companies',
                sortable: true,
                style: 'width: 20%',
            },
        ],
    }),

    getters: {
        getHeaderColumns: (state) => state.headerColumns,
        getTableFilters: (state) => state.tableFilters,
        getTableFilterKeys: (state) => state.tableFilterKeys,
        getShowTable: () => {
            const marketDataStore = useMarketDataStore();
            return (
                !marketDataStore.getIndustriesLoading &&
                marketDataStore.getIndustriesWithMetrics?.length > 0
            );
        },
    },

    actions: {
        clearTableFilters() {
            this.tableFilters.global.value = null;
            this.tableFilterKeys.forEach((key) => {
                this.tableFilters[key].constraints[0].value = null;
            });
        },
        setSearchTerm(stateFilters, searchTerm) {
            stateFilters.global.value = searchTerm;
        },
        formatColumns(columnValue, columnName) {
            if (columnName === 'avgPERatio') {
                if (columnValue === null || columnValue === undefined || columnValue === 'N/A') {
                    return null; // handled in template
                }
                return typeof columnValue === 'number' ? columnValue.toFixed(2) : columnValue;
            }
            return columnValue;
        },
    },
});

export default useIndustriesTableStore;