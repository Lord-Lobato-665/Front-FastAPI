<template>
  <div class="flex">
    <Sidebar
      :collapsed="isCollapsed"
      :mobile-open="showSidebar"
      @toggle-collapse="toggleSidebar"
    />
    <div
      :class="[
        'transition-all duration-300 flex-1 min-h-screen bg-gray-100',
        isCollapsed ? 'sm:ml-20' : 'sm:ml-64'
      ]"
    >
      <Topbar @toggleSidebar="handleMobileToggle" />
      <main class="pt-12">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import Sidebar from './layouts/Sidebar.vue';
import Topbar from './layouts/Topbar.vue';

const isCollapsed = ref(false);
const showSidebar = ref(true);

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};
const handleMobileToggle = () => {
  showSidebar.value = !showSidebar.value;
};

const handleResize = () => {
  if (window.innerWidth < 640) {
    showSidebar.value = false;
  } else {
    showSidebar.value = true; 
  }
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
  handleResize(); 
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>
