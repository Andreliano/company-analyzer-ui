import axios from 'axios';
import { getApiUrl } from '../utils/mainUtils.js';
import { useFlashMessagesStore } from './flashMessagesStore.js';
import { defineStore } from 'pinia';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ERRORS = 3;
const MAX_POLL_MS = 5 * 60 * 1000;

export const useBatchStore = defineStore('batchStore', {
    state: () => ({
        job: null,
        submitting: false,
        polling: false,
        pollHandle: null,
        pollErrors: 0,
        error: null,

        previewTicker: null,
        previewGrid: [],
        previewLoading: false,
    }),

    getters: {
        totalTasks: (s) => s.job?.totalTasks ?? 0,
        finishedTasks: (s) => s.job?.completedTasks ?? 0,   // completedTasks = tot ce s-a terminat
        failedTasks: (s) => s.job?.failedTasks ?? 0,
        status: (s) => s.job?.status ?? null,

        progressPct: (s) => {
            const total = s.job?.totalTasks ?? 0;
            if (!total) return 0;
            return Math.round((s.job.completedTasks / total) * 100);
        },

        isTerminalState: (s) => {
            if (!s.job) return false;
            if (['COMPLETED', 'PARTIAL', 'FAILED'].includes(s.job.status)) return true;
            return s.job.totalTasks > 0 && s.job.completedTasks >= s.job.totalTasks;
        },

        resultRows: (s) => {
            const results = s.job?.results ?? {};
            const tickers = s.job?.tickers?.length ? s.job.tickers : Object.keys(results);
            return tickers.map((ticker) => {
                const sheetId = results[ticker];
                const done = sheetId !== undefined && sheetId !== null;
                const success = done && sheetId !== 'FAILED';
                return {
                    ticker,
                    sheetId: done ? sheetId : null,
                    state: !done ? 'pending' : success ? 'ready' : 'failed',
                    success,
                };
            });
        },
    },

    actions: {
        async submitBatch({ tickers, fromYear, toYear }) {
            this.submitting = true;
            this.error = null;
            this.job = null;
            try {
                const response = await axios.post(`${getApiUrl()}/submitBatchJob`, {
                    tickers,
                    fromYear,
                    toYear,
                });
                this.job = response?.data ?? null;
                if (this.job?.id && !this.isTerminalState) {
                    this.startPolling();
                }
                return this.job;
            } catch (error) {
                this.$handleError(error, 'Failed to submit batch job', 'An error occurred while submitting the batch.');
                return null;
            } finally {
                this.submitting = false;
            }
        },

        processingDurationMs: (s) => {
            const start = Date.parse(s.job?.creationDate);
            const end = Date.parse(s.job?.lastUpdatedDate);
            if (Number.isNaN(start) || Number.isNaN(end)) return null;
            const ms = end - start;
            return ms >= 0 ? ms : null;
        },

        startPolling() {
            this.stopPolling();
            this.polling = true;
            this.pollErrors = 0;
            this.pollStartedAt = Date.now();

            const tick = async () => {
                if (!this.polling) return;
                if (Date.now() - this.pollStartedAt > MAX_POLL_MS) {
                    this.stopPolling();
                    useFlashMessagesStore().showError('Batch is taking longer than expected. Stopped polling — refresh to check again.');
                    return;
                }
                await this.pollOnce();
                if (!this.polling || this.isTerminalState) {
                    this.stopPolling();
                    return;
                }
                this.pollHandle = setTimeout(tick, POLL_INTERVAL_MS);
            };
            tick();
        },

        async pollOnce() {
            const jobId = this.job?.id;
            if (!jobId) return;
            try {
                const response = await axios.get(`${getApiUrl()}/getBatchJobStatus`, { params: { jobId } });
                this.job = response?.data ?? this.job;
                this.pollErrors = 0;
            } catch (error) {
                this.pollErrors += 1;
                if (this.pollErrors >= MAX_POLL_ERRORS) {
                    this.$handleError(error, 'Lost connection to job', 'Lost connection to the batch job.');
                    this.stopPolling();
                }
            }
        },

        stopPolling() {
            if (this.pollHandle) {
                clearTimeout(this.pollHandle);
                this.pollHandle = null;
            }
            this.polling = false;
        },

        async previewSheet({ ticker, sheetId }) {
            this.previewLoading = true;
            this.previewTicker = ticker;
            try {
                const response = await axios.get(`${getApiUrl()}/getIncomeStatementSheet`, {
                    params: { ticker, sheetId },
                });
                this.previewGrid = response?.data?.grid ?? [];
            } catch (error) {
                this.$handleError(error, 'Failed to load sheet', 'An error occurred while loading the sheet.');
                this.previewGrid = [];
            } finally {
                this.previewLoading = false;
            }
        },

        $handleError(error, fallbackMessage, flashMessage) {
            this.error = error?.message || fallbackMessage;
            useFlashMessagesStore().showError(`${flashMessage} Please try again.`);
        },
    },
});