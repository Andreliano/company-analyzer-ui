/* Imports */
import { defineStore } from 'pinia';

const DEFAULT_LIFE = {
  success: 4000,
  warn: 6000,
  error: null,
};

let counter = 0;
const timers = new Map();

export const useFlashMessagesStore = defineStore('flashMessagesStore', {
  state: () => ({
    flashMessages: [],
  }),
  getters: {
    getFlashMessages: (state) => state.flashMessages,
  },
  actions: {
    setFlashMessage(msg) {
      const id = ++counter;
      this.flashMessages.push({ id, ...msg });

      const life = msg.life === undefined ? DEFAULT_LIFE[msg.severity] : msg.life;
      if (life) {
        timers.set(id, setTimeout(() => this.removeFlashMessage(id), life));
      }
      return id;
    },
    removeFlashMessage(id) {
      const idx = this.flashMessages.findIndex((m) => m.id === id);
      if (idx !== -1) this.flashMessages.splice(idx, 1);
      if (timers.has(id)) {
        clearTimeout(timers.get(id));
        timers.delete(id);
      }
    },
    showError(text, opts = {}) {
      this.setFlashMessage({ text, severity: 'error', closable: true, ...opts });
    },
    showSuccess(text, opts = {}) {
      this.setFlashMessage({ text, severity: 'success', closable: true, ...opts });
    },
    showWarning(text, opts = {}) {
      this.setFlashMessage({ text, severity: 'warn', closable: true, ...opts });
    },
  },
});

export default useFlashMessagesStore;