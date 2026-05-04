/* Imports */
import { defineStore } from 'pinia';

export const useFlashMessagesStore = defineStore('flashMessagesStore', {
  state: () => ({
    flashMessages: [],
  }),
  getters: {
    getFlashMessages: (state) => state.flashMessages,
  },
  actions: {
    setFlashMessage(msg) {
      this.flashMessages.push(msg);
    },
    showError(text) {
      this.setFlashMessage({ text, severity: 'error', closable: true });
    },
    showSuccess(text) {
      this.setFlashMessage({ text, severity: 'success', closable: true });
    },
    showWarning(text) {
      this.setFlashMessage({ text, severity: 'warn', closable: true });
    },
  },
});

export default useFlashMessagesStore;
