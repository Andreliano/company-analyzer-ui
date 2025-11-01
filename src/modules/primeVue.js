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
} from 'primevue';
import {
    Form,
    FormField,
} from '@primevue/forms';

/**
 * Injects PrimeVue and its components into the Vue application instance.
 * @param {import('vue').App} app - The Vue application instance.
 */
export const injectPrimeVue = (app) => {
    const MyPreset = definePreset(Aura, {
        semantic: {
            primary: {
                0: '{gray.0}',
                50: '{gray.50}',
                100: '{gray.100}',
                200: '{gray.200}',
                300: '{gray.300}',
                400: '{gray.400}',
                500: '{gray.500}',
                600: '{gray.600}',
                700: '{gray.700}',
                800: '{gray.800}',
                900: '{gray.900}',
                950: '{gray.950}',
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
    app.component('Form', Form);
    app.component('FormField', FormField);
};

export default injectPrimeVue;
