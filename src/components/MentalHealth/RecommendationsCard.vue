<template>
  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl overflow-hidden border border-blue-100 shadow-lg">
    <div class="p-5 bg-gradient-to-r from-blue-500 to-indigo-600">
      <h3 class="text-xl font-semibold text-white flex items-center gap-3">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Plan de Acción Personalizado
      </h3>
    </div>
    <div class="p-6">
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(recomendacion, index) in recomendaciones" :key="index" 
             class="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 mb-3">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-bold">{{ index + 1 }}</span>
              </div>
            </div>
            <h4 class="font-medium text-blue-800">Recomendación {{ index + 1 }}</h4>
          </div>
          <p class="text-gray-700">{{ recomendacion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  recomendaciones: { type: Array, required: true }
})
</script>
