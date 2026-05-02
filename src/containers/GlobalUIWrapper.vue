<script setup>
/* Imports */
import {
  defineAsyncComponent,
} from 'vue';
import Header from '../components/Header.vue';

/* Components - Async -> Lazy Load */
const FlashMessage = defineAsyncComponent({
  loader: () => import('../components/FlashMessage.vue'),
});
</script>

<template>
  <Header />
  <FlashMessage />
  <Toast position="bottom-center" />
  <ConfirmDialog />
</template>