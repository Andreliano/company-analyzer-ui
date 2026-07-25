import axios from 'axios';
import { getApiUrl } from '../utils/mainUtils.js';
import { useFlashMessagesStore } from './flashMessagesStore.js';
import { defineStore } from 'pinia';

export const useSheetStudioStore = defineStore('sheetStudioStore', {
    state: () => ({
        sheetId: null,
        sheetGrid: [],
        generating: false,
        loadingGrid: false,
        error: null,
    }),

    getters: {
        hasSheet: (state) => state.sheetGrid.length > 0,
    },

    actions: {
        async generateSheet({ ticker, fromYear, toYear }) {
            this.generating = true;
            this.error = null;
            try {
                const response = await axios.post(`${getApiUrl()}/generateIncomeStatementSheet`, null, {
                    params: { ticker, fromYear, toYear },
                });
                this.sheetId = response?.data?.sheetId ?? null;
                return this.sheetId;
            } catch (error) {
                this.$handleError(error, 'Failed to generate sheet', 'An error occurred while generating the sheet.');
                this.sheetId = null;
                return null;
            } finally {
                this.generating = false;
            }
        },

        async fetchSheetGrid({ ticker, sheetId }) {
            this.loadingGrid = true;
            try {
                const response = await axios.get(`${getApiUrl()}/getIncomeStatementSheet`, {
                    params: { ticker, sheetId },
                });
                this.sheetGrid = response?.data?.grid ?? [];
            } catch (error) {
                this.$handleError(error, 'Failed to load sheet', 'An error occurred while loading the sheet.');
                this.sheetGrid = [];
            } finally {
                this.loadingGrid = false;
            }
        },

        async generateAndLoad({ ticker, fromYear, toYear }) {
            const normalizedTicker = ticker?.trim().toUpperCase();
            const sheetId = await this.generateSheet({ ticker: normalizedTicker, fromYear, toYear });
            if (sheetId) {
                await this.fetchSheetGrid({ ticker: normalizedTicker, sheetId });
            }
        },

        $handleError(error, fallbackMessage, flashMessage) {
            this.error = error?.message || fallbackMessage;
            useFlashMessagesStore().showError(`${flashMessage} Please try again.`);
        },
    },
});