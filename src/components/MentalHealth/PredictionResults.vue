<template>
  <div v-if="predictionData !== null" class="p-6 space-y-6 animate-fade-in">
    <!-- Salud Mental -->
    <div :class="['p-6 rounded-xl shadow-inner', getHealthStatus(predictionData.prediccion).bg]">
      <div class="flex items-start gap-4">
        <div :class="['p-2 rounded-lg', getHealthStatus(predictionData.prediccion).iconBg]">
          <svg :class="['w-6 h-6', getHealthStatus(predictionData.prediccion).color]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-900 mb-1">Salud Mental</h3>
          <div class="flex items-baseline gap-2 mb-3">
            <span class="font-bold text-3xl">{{ predictionData.prediccion.toFixed(1) }}</span>
            <span class="text-gray-500">/10</span>
            <span :class="['ml-2 px-2 py-1 rounded-full text-xs font-semibold', getHealthStatus(predictionData.prediccion).badge]">
              {{ predictionData.nivel_riesgo }}
            </span>
          </div>
          <p class="text-gray-700 mb-4 leading-relaxed">
            {{ predictionData.interpretacion.evaluacion }}
          </p>
          <div class="mb-5">
            <div class="flex justify-between text-sm text-gray-500 mb-1">
              <span>Saludable</span>
              <span>Preocupante</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-1000', getHealthStatus(predictionData.prediccion).progressColor]"
                :style="{ width: `${(predictionData.prediccion / 10) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Adicción Digital -->
    <div :class="['p-6 rounded-xl shadow-inner', getAddictionStatus(predictionData.addicted_score.puntaje).bg]">
      <div class="flex items-start gap-4">
        <div :class="['p-2 rounded-lg', getAddictionStatus(predictionData.addicted_score.puntaje).iconBg]">
          <svg :class="['w-6 h-6', getAddictionStatus(predictionData.addicted_score.puntaje).color]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="flex-1">
          <h3 class="font-semibold text-lg text-gray-900 mb-1">Adicción Digital</h3>
          <div class="flex items-baseline gap-2 mb-3">
            <span class="font-bold text-3xl">{{ predictionData.addicted_score.puntaje.toFixed(1) }}</span>
            <span class="text-gray-500">/10</span>
            <span :class="['ml-2 px-2 py-1 rounded-full text-xs font-semibold', getAddictionStatus(predictionData.addicted_score.puntaje).badge]">
              {{ predictionData.addicted_score.nivel }}
            </span>
          </div>
          <p class="text-gray-700 mb-4 leading-relaxed">
            {{ predictionData.addicted_score.interpretacion }}
          </p>
          <div class="mb-5">
            <div class="flex justify-between text-sm text-gray-500 mb-1">
              <span>Baja adicción</span>
              <span>Alta adicción</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                :class="['h-full rounded-full transition-all duration-1000', getAddictionStatus(predictionData.addicted_score.puntaje).progressColor]"
                :style="{ width: `${(predictionData.addicted_score.puntaje / 10) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="px-6 pb-6 pt-6 flex items-center justify-center min-h-[400px]">
  <div class="bg-gray-50 rounded-xl p-8 text-center max-w-md w-full">
    <div class="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <h3 class="text-gray-600 font-medium mb-1">Sin resultados aún</h3>
    <p class="text-gray-400 text-sm">Ingresa tus horas de uso y haz clic en "Analizar mi bienestar"</p>
  </div>
</div>

</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
const props = defineProps({
  predictionData: { type: Object, required: false },
  getHealthStatus: { type: Function, required: true },
  getAddictionStatus: { type: Function, required: true }
})
</script>
