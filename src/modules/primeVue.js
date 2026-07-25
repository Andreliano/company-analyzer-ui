/* Imports */
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import { definePreset } from '@primevue/themes';

/* CSS */
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

/* PrimeVue Components */
import {
    Row,
    ColumnGroup,
    Column,
    DataTable,
    ProgressSpinner,
    Message,
    InputText,
    InputNumber,
    Select,
    Button,
    DatePicker,
    IconField,
    Popover,
    Dialog,
    Toast,
    ToastService,
    ConfirmDialog,
    ConfirmationService,
    MultiSelect,
    Tooltip,
    Tag,
    Drawer,
    ProgressBar,
    Card,
} from 'primevue';
import Chart from 'primevue/chart';
import DataView from 'primevue/dataview';

/**
 * Injects PrimeVue and its components into the Vue application instance.
 * @param {import('vue').App} app - The Vue application instance.
 */
export const injectPrimeVue = (app) => {
    const MyPreset = definePreset(Aura, {
        semantic: {
            primary: {
                50:  '{indigo.50}',
                100: '{indigo.100}',
                200: '{indigo.200}',
                300: '{indigo.300}',
                400: '{indigo.400}',
                500: '{indigo.500}',
                600: '{indigo.600}',
                700: '{indigo.700}',
                800: '{indigo.800}',
                900: '{indigo.900}',
                950: '{indigo.950}',
            },
            colorScheme: {
                light: {
                    surface: {
                        0:   '#ffffff',
                        50:  '{slate.50}',
                        100: '{slate.100}',
                        200: '{slate.200}',
                        300: '{slate.300}',
                        400: '{slate.400}',
                        500: '{slate.500}',
                        600: '{slate.600}',
                        700: '{slate.700}',
                        800: '{slate.800}',
                        900: '{slate.900}',
                        950: '{slate.950}',
                    },
                },
            },
        },
    });

    app.use(PrimeVue, {
        theme: {
            preset: MyPreset,
            options: {
                // Inject this selector to have "light" mode by default
                darkModeSelector: '.dark-mode',
            },
        },
    });

    /* PrimeVue Services */
    app.use(ToastService);
    app.use(ConfirmationService);

    /* PrimeVue Directives */
    app.directive('Tooltip', Tooltip);

    /* PrimeVue Components */
    app.component('DataTable', DataTable);
    app.component('Column', Column);
    app.component('ColumnGroup', ColumnGroup);
    app.component('Row', Row);
    app.component('ProgressSpinner', ProgressSpinner);
    app.component('Message', Message);
    app.component('InputText', InputText);
    app.component('InputNumber', InputNumber);
    app.component('Select', Select);
    app.component('Button', Button);
    app.component('DatePicker', DatePicker);
    app.component('IconField', IconField);
    app.component('Popover', Popover);
    app.component('Dialog', Dialog);
    app.component('Toast', Toast);
    app.component('ConfirmDialog', ConfirmDialog);
    app.component('MultiSelect', MultiSelect);
    app.component('Tag', Tag);
    app.component('Drawer', Drawer);
    app.component('Chart', Chart);
    app.component('ProgressBar', ProgressBar);
    app.component('Card', Card);
    app.component('DataView', DataView);
};

export default injectPrimeVue;
