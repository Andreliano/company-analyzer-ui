<script setup>
import { computed } from 'vue';
import { buildSheetTableModel } from '../utils/sheetUtils.js';

const props = defineProps({
  grid: { type: Array, default: () => [] },
  scrollHeight: { type: String, default: '600px' },
});

const tableModel = computed(() => buildSheetTableModel(props.grid));
</script>

<template>
  <DataTable
      :value="tableModel.rows"
      data-key="__id"
      scrollable
      :scroll-height="scrollHeight"
      size="small"
      show-gridlines
  >
    <Column
        v-for="col in tableModel.columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :frozen="col.frozen"
        align-frozen="left"
        :style="col.frozen ? 'min-width: 260px; font-weight: 600;' : 'min-width: 120px;'"
    />
  </DataTable>
</template>