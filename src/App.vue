<template>
  <div class="flex h-screen">
    <Sidebar />
    <main class="flex-1 overflow-auto bg-gray-100">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts" setup>
import Sidebar from './components/Sidebar.vue';
</script>
