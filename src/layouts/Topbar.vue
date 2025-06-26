<template>
  <nav class="fixed top-0 z-50 w-full bg-blue-900 border-b border-blue-200">
    <div class="px-4 py-3 flex justify-between ">
      <button
        @click="$emit('toggleSidebar')"
        class="inline-flex items-center p-2 text-sm text-white rounded-lg sm:hidden hover:bg-blue-500 focus:outline-none cursor-pointer" 
      >
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clip-rule="evenodd"/>
        </svg>
      </button>
      <span class="text-xl font-semibold text-white">Predicciones - IDYGS93</span>
    </div>
  </nav>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
const isOpen = ref(false);
document.addEventListener('click', (e) => {
  if (!(e.target as HTMLElement).closest('.relative')) isOpen.value = false;
});
</script>
