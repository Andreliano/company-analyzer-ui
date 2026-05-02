/* Imports */
import {
    createRouter,
    createWebHistory,
} from 'vue-router';
import Routes from './routes.js';

const router = createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition; // back/forward browser navigation
        }

        if (to.meta?.scrollTo) {
            return {
                el: to.meta.scrollTo,
                behavior: 'smooth',
                top: 0,
            };
        }

        return { top: 0, behavior: 'smooth' }; // default — scroll to top
    },
    routes: Routes,
});

export default router