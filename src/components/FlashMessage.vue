<script setup>
/* Imports */
import useFlashMessagesStore from '../store/flashMessagesStore.js';

/* Store */
const flashMessagesStore = useFlashMessagesStore();

/* Method to get the correct icon based on severity */
const getIconBySeverity = (severity) => ({
  success: 'pi pi-check-circle',
  info: 'pi pi-info-circle',
  warn: 'pi pi-exclamation-triangle',
  error: 'pi pi-exclamation-circle',
  secondary: 'pi pi-circle-off',
  contrast: 'pi pi-adjust',
}[severity] || 'pi pi-question-circle'); // Default icon for unknown severity
</script>

<template>
  <div class="flash-message">
    <Message
      v-for="(flashMessage, flashMessageIndex) in flashMessagesStore?.getFlashMessages"
      :key="flashMessageIndex"
      class="flash-message__item"
      :severity="flashMessage?.severity"
      :closable="flashMessage?.closable"
      :icon="getIconBySeverity(flashMessage?.severity)"
      :data-testid="'flash-message-' + flashMessage?.severity"
      :data-severity="flashMessage?.severity"
    >
      {{ flashMessage?.text }}
    </Message>
  </div>
</template>

<style lang="scss" scoped>
.flash-message {

  &__item {
    padding: 0 1.25rem;
    text-transform: uppercase;
    outline-color: unset;
  }

  :deep(.p-message) {
    border-radius: 0;
  }

  /* Apply specific styling for error severity - ADA */
  :deep(.p-message[data-severity='error']) {
    background-color: red;
    color: white;

    .p-message-close-button {
      background: none;
    }
  }
}
</style>