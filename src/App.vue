<script setup>
import {
  computed,
  ref
} from 'vue';
import {
  useRoute,
  useRouter
} from 'vue-router';
import GlobalUIWrapper from './containers/GlobalUIWrapper.vue';

const route = useRoute();
const isNavigating = ref(false);

const router = useRouter();
router.beforeEach(() => { isNavigating.value = true; });
router.afterEach(() => { isNavigating.value = false; });

const headingContent = computed(() => route?.meta?.heading ?? null);
</script>

<template>
  <ProgressBar
      v-if="isNavigating"
      mode="indeterminate"
      style="height: 3px; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;"
  />

  <GlobalUIWrapper />

  <main class="main">
    <Heading
        v-if="headingContent"
        :content="headingContent"
        :data-testid="`heading-${route?.name}`"
        size="1"
        visual-size="2"
        text-align="left"
        :style-object="{
        padding: '0 1rem 1rem',
      }"
    />
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </main>
</template>