/* Imports */

import MarketDataView from "../views/MarketDataView.vue";
import {h, resolveComponent} from "vue";

const subdirectory = globalThis?.appData?.subdirectory ?? 'app';

export default [
    {
        path: `/${subdirectory}/market-overview`,
        component: {
            render() {
                return h(resolveComponent('router-view'));
            },
        },
        children: [
            {
                path: '',
                name: 'marketDataView',
                component: MarketDataView,
            },
        ],
    },
    {
        path: '',
        component: () => import('../containers/CompanyResearchContainer.vue'),
        children: [
            {
                path: `/${subdirectory}/company-profile`,
                name: 'companyProfileView',
                component: () => import('../views/CompanyProfileView.vue'),
                meta: { heading: 'Company Profile' },
            },
            {
                path: `/${subdirectory}/company-screener`,
                name: 'companyScreenerView',
                component: () => import('../views/CompanyScreenerView.vue'),
                meta: { heading: 'Company Screener' },
            },
        ],
    },
    {
        path: '',
        component: () => import('../containers/SheetStudioContainer.vue'),
        children: [
            {
                path: `/${subdirectory}/single-sheet-generator`,
                name: 'singleSheetGeneratorView',
                component: () => import('../views/SingleSheetGeneratorView.vue'),
                meta: { heading: 'Single Sheet Generator' },
            },
            {
                path: `/${subdirectory}/batch`,
                name: 'batchSheetRunnerView',
                component: () => import('../views/BatchSheetRunnerView.vue'),
                meta: { heading: 'Batch Sheet Runner' },
            },
        ],
    },
    {
        path: `/${subdirectory}/:pathMatch(.*)*`, // Catch-all route for unmatched paths
        redirect: `/${subdirectory}/market-overview`, // Redirect to /app/global-data-view
    },
];