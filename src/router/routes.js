/* Imports */

import GlobalDataView from "../views/GlobalDataView.vue";
import {h, resolveComponent} from "vue";

const subdirectory = window?.appData?.subdirectory ?? 'app';

export default [
    {
        path: `/${subdirectory}/global-data-view`,
        component: {
            render() {
                return h(resolveComponent('router-view'));
            },
        },
        children: [
            {
                path: '',
                name: 'globalDataView',
                component: GlobalDataView,
            },
        ],
    },
    {
        path: `/${subdirectory}/:pathMatch(.*)*`, // Catch-all route for unmatched paths
        redirect: `/${subdirectory}/global-data-view`, // Redirect to /app/global-data-view
    },
];