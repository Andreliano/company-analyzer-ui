<template>
  <Toast position="bottom-center"></Toast>
  <ConfirmDialog></ConfirmDialog>
  <main class="main">
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </main>
</template>

<style lang="scss">

.main {
  display: flex;
  flex-direction: column;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
