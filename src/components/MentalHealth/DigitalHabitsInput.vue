<template>
  <div>
    <div class="p-6 pb-4 border-b border-gray-100">
      <h2 class="flex items-center gap-3 text-2xl font-semibold mb-2 text-gray-800">
        <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tus hábitos digitales
      </h2>
      <p class="text-base text-gray-600">Comienza ingresando tu tiempo diario en redes sociales</p>
    </div>
    <div class="px-6 pb-6 space-y-6">
      <template v-if="profile && profile.Avg_Daily_Usage_Hours !== undefined">
        <div class="space-y-3 pt-2">
          <label class="block text-base font-medium text-gray-700">
            Horas diarias en redes
          </label>
          <div class="relative">
            <input type="number" :value="profile.Avg_Daily_Usage_Hours" disabled
              class="w-full text-lg py-3 pl-4 pr-16 border border-gray-200 rounded-xl bg-gray-100 text-gray-500" />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">hrs</span>
          </div>
        </div>
        <div class="text-green-700 font-semibold flex items-center gap-2">
          <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 13l4 4L19 7" />
          </svg>
          Datos de tu perfil aplicados automáticamente. Espera un momento para ver tus resultados.
        </div>
      </template>
      <template v-else>
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
          <div class="flex-shrink-0 mt-0.5">
            <div class="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center">
              <svg class="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="text-yellow-700 font-medium">
            Primero completa tu perfil para ver tu bienestar digital.
          </p>
        </div>
      </template>
      <div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-xl animate-fade-in flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5">
          <div class="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
            <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <p class="text-red-700 font-medium">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  profile: { type: Object, required: false },
  error: { type: String, required: false }
})
</script>
