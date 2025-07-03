<template>
  <div class="mt-6 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
    <div class="p-5 bg-gray-50 border-b border-gray-100">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Detalles Técnicos del Análisis
      </h3>
    </div>
    <div class="p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Correlación uso-salud</p>
          <p class="font-bold text-gray-800 text-xl">{{ estadisticas.correlacion }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Uso promedio</p>
          <p class="font-bold text-gray-800 text-xl">{{ estadisticas.uso_promedio_dataset }} <span class="text-sm">hrs</span></p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Puntaje promedio</p>
          <p class="font-bold text-gray-800 text-xl">{{ estadisticas.puntaje_promedio_dataset }}<span class="text-sm">/10</span></p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
          <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Modelo utilizado</p>
          <p class="font-bold text-gray-800 text-xl">Lineal</p>
        </div>
      </div>
      <div class="mt-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
        <p class="text-sm text-blue-800 italic">
          {{ interpretacionCoeficiente }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  estadisticas: { type: Object, required: true },
  interpretacionCoeficiente: { type: String, required: true }
})
</script>
