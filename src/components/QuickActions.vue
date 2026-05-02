<script setup>
/* Imports */
import { useRouter } from 'vue-router';

/* Router */
const router = useRouter();

/* Methods */
const navigateToBatchAnalysis = () => {
  router.push({
    name: 'batchSheetRunnerView',
  });
};

const navigateToAllCompanies = () => {
  router.push({
    name: 'companyScreenerView',
  });
};
</script>

<template>
  <div class="quick-actions-wrapper">
    <div class="actions-header">
      <h3 class="actions-title">
        Quick Actions
      </h3>
    </div>

    <div class="actions-list">
      <Button
        label="Run Batch Analysis"
        icon="pi pi-play"
        class="action-button batch-button"
        aria-label="Run batch analysis"
        title="Navigate to Sheet Studio to run batch analysis"
        @click="navigateToBatchAnalysis"
      />

      <Button
        label="View All Companies"
        icon="pi pi-list"
        severity="secondary"
        class="action-button view-button"
        aria-label="View all companies"
        title="Navigate to company screener to view all companies"
        @click="navigateToAllCompanies"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.quick-actions-wrapper {
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.actions-header {
  margin-bottom: 1.5rem;
}

.actions-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-button {
  width: 100%;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(2px);
  }

  &.batch-button {
    background-color: #2563eb;
    border-color: #2563eb;
    color: white;

    &:hover {
      background-color: #1d4ed8;
      border-color: #1d4ed8;
    }
  }

  &.view-button {
    border: 1px solid #d1d5db;

    &:hover {
      background-color: #f3f4f6;
    }
  }
}
</style>
