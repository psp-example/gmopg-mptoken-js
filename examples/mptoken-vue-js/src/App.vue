<script setup lang="ts">
import FormWrapper from './components/FormWrapper.vue';
// import HelloWorld from './components/HelloWorld.vue';
</script>

<!-- App.vue -->
<template>
  <Suspense>
    <template #default>
      <FormWrapper />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
