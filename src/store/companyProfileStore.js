import axios from 'axios';
import { getApiUrl } from '../utils/mainUtils.js';
import { useFlashMessagesStore } from './flashMessagesStore.js';
import { defineStore } from 'pinia';

export const useCompanyProfileStore = defineStore('companyProfileStore', {
    state: () => ({
        profile: null,
        loading: false,
        error: null,
    }),

    getters: {
        hasProfile: (s) => !!s.profile,
    },

    actions: {
        async fetchProfile(ticker) {
            if (!ticker) return;
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(`${getApiUrl()}/getShareDataByTicker`, {
                    params: { ticker },
                });
                this.profile = response?.data ?? null;
            } catch (error) {
                this.$handleError(error, 'Failed to load company profile', 'An error occurred while loading the company profile.');
                this.profile = null;
            } finally {
                this.loading = false;
            }
        },

        $handleError(error, fallbackMessage, flashMessage) {
            this.error = error?.message || fallbackMessage;
            useFlashMessagesStore().showError(`${flashMessage} Please try again.`);
        },
    },
});