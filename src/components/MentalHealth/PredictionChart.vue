<template>
  <div class="px-6 pb-6">
    <div class="relative min-h-[400px] flex items-center justify-center bg-gray-50/50 rounded-xl border border-gray-100">
      <div v-if="isLoading" class="flex flex-col items-center gap-4">
        <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <p class="text-gray-600 font-medium">Generando visualización...</p>
      </div>
      <div v-else-if="plotUrl" class="w-full animate-fade-in p-2">
        <img :src="plotUrl" alt="Gráfico de predicción de salud mental"
          class="w-full h-auto rounded-lg shadow-sm border border-gray-200" />
      </div>
      <div v-else class="text-center p-6">
        <div
          class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-inner">
          <svg class="w-12 h-12 text-gray-400 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 class="text-gray-600 font-medium text-lg mb-1">Datos visuales</h3>
        <p class="text-gray-400 text-sm">Analiza tu bienestar para ver la relación gráfica</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  isLoading: { type: Boolean, required: true },
  plotUrl: { type: String, required: false }
})
</script>
