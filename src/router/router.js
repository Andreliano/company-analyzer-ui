/* Imports */
import {
    createRouter,
    createWebHistory,
} from 'vue-router';
import Routes from './routes.js';
import scrollBehavior from './scrolling.js';

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior,
    routes: Routes,
});

export default router