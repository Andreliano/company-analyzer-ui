<script setup>
/* Imports */
import {computed, ref} from "vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

/* Props */
const props = defineProps({
  showForm: {
    type: Boolean,
    default: false,
  },
  companiesStockSymbolsResults: {
    type: Object,
    default: () => ({}),
  },
  companiesStockSymbolsResultsLoading: {
    type: Boolean,
    default: false,
  },
  companiesStockSymbolsNoResults: {
    type: Boolean,
    default: false,
  },
});

/* State */
const state = ref({
  email: null,
  selectedCompany: null
})

/* Computed */
const companyOptions = computed(() => {
  return props.companiesStockSymbolsResults
      .map(company => `${company?.displaySymbol} - ${company?.description}`);
});

/* Methods */
const onFormSubmit = () => {
  console.log("SUBMIT!!!");
}
</script>

<template>
  <LoadingSpinner
      :is-loading="props.companiesStockSymbolsResultsLoading"
  />
  <div
      v-if="props.showForm"
      class="form-card card"
  >
    <Form
        @submit="onFormSubmit"
    >
      <FormField
          v-slot="$field"
          name="email"
          initialValue=""
      >
        <InputText
            type="email"
            placeholder="Enter your email"
            v-model="state.email"
            class="field-input"
        />
        <Message
            v-if="$field?.invalid"
            severity="error"
            size="small"
            variant="simple"
        >{{
            $field.error?.message
          }}
        </Message>
      </FormField>
      <FormField
          v-slot="$field"
          name="company"
          initialValue="">
        <Select
            filter
            showClear
            :options="companyOptions"
            v-model="state.selectedCompany"
            placeholder="Select a company"
            class="field-input"
            :virtualScrollerOptions="{ itemSize: 35 }"
        />
      </FormField>
      <div class="button-wrapper">
        <Button
            type="submit"
            severity="secondary"
            label="Submit"
        />
      </div>
    </Form>
  </div>
  <div
      v-if="props.companiesStockSymbolsNoResults"
  >
    <p class="table-data__no-results">
      There are no companies to show.
    </p>
  </div>
</template>

<style scoped lang="scss">
form, .p-field, .form-field {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 500px;
  width: 90%;
  padding: 2rem;
  margin: 2rem auto;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.field-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.field-input {
  width: 100%;
}

.button-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.no-results {
  text-align: center;
  margin-top: 2rem;
  color: #888;
  font-style: italic;
}
</style>