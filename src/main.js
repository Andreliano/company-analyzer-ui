import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import injectPrimeVue from "./modules/primeVue.js";
import router from "./router/router.js";
import '@/styles/primeVue.scss';
import { registerGlobalComponents } from './modules/registerGlobalComponents.js';

// Set up pinia
const pinia = createPinia();

const app = createApp(App);

app.use(router);
app.use(pinia);

// Inject PrimeVue
injectPrimeVue(app);

// Inject the components globally
app.use(registerGlobalComponents);

app.mount('#app')
