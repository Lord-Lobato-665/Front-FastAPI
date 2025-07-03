<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="relative w-24 h-24 mx-auto mb-4">
          <div class="absolute inset-0 bg-blue-100 rounded-full animate-pulse opacity-30"></div>
          <img
            src="https://images.vexels.com/media/users/3/235447/isolated/preview/bf1d3d610540bbc29a5af67c30ad69bc-organos-n-cerebro-17.png"
            alt="Ilustración salud mental" class="relative w-full h-full object-contain" />
        </div>

        <h1
          class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 font-serif">
          Bienestar Digital
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Descubre cómo tus hábitos digitales afectan tu equilibrio mental y recibe recomendaciones personalizadas
        </p>
      </div>

      <!-- Primera fila: Input y Resultados -->
      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Input -->
        <CardContainer>
          <DigitalHabitsInput :profile="profile" :error="error" />
        </CardContainer>
        <!-- Resultados -->
        <CardContainer>
          <PredictionResults :predictionData="predictionData" :getHealthStatus="getHealthStatus" :getAddictionStatus="getAddictionStatus" />
        </CardContainer>
      </div>

      <!-- Segunda fila: Gráfico -->
      <div class="mt-8">
        <CardContainer>
          <template #default>
            <div class="p-6 pb-4 border-b border-gray-100">
              <h2 class="flex items-center gap-3 text-2xl font-semibold mb-2 text-gray-800">
                <svg class="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Visualización de datos
              </h2>
              <p class="text-base text-gray-600">Relación entre uso de redes y bienestar mental</p>
            </div>
            <PredictionChart :isLoading="isLoading" :plotUrl="plotUrl" />
          </template>
        </CardContainer>
      </div>

      <!-- Sección de recomendaciones y detalles técnicos -->
      <div v-if="predictionData !== null" class="mt-8 animate-fade-in">
        <RecommendationsCard :recomendaciones="predictionData.interpretacion.recomendaciones" />
        <TechnicalDetailsCard :estadisticas="predictionData.estadisticas" :interpretacionCoeficiente="predictionData.modelo_info.interpretacion_coeficiente" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { mentalHealthService } from '../../services/MentalHealth'
import type { MentalHealthPrediction } from '../../types/MentalHealthPrediction'

import DigitalHabitsInput from '../MentalHealth/DigitalHabitsInput.vue'
import PredictionResults from '../MentalHealth/PredictionResults.vue'
import PredictionChart from '../MentalHealth/PredictionChart.vue'
import RecommendationsCard from '../MentalHealth/RecommendationsCard.vue'
import TechnicalDetailsCard from '../MentalHealth/TechnicalDetailsCard.vue'
import CardContainer from '../CardContainer.vue'

function getProfileFromStorage() {
  try {
    const data = localStorage.getItem('userProfile');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

const profile = ref<any>(null)
const usageHours = ref<number>(3)
const predictionData = ref<MentalHealthPrediction | null>(null)
const plotUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

const getPrediction = async (hours: number) => {
  isLoading.value = true
  error.value = null
  predictionData.value = null
  plotUrl.value = null

  try {
    predictionData.value = await mentalHealthService.getPrediction(hours)
    setTimeout(async () => {
      plotUrl.value = await mentalHealthService.getPlot()
      isLoading.value = false
    }, 500)
  } catch (err) {
    console.error(err)
    error.value = 'Ocurrió un error al calcular la predicción. Intenta nuevamente.'
    isLoading.value = false
  }
}

onMounted(async () => {
  profile.value = getProfileFromStorage()
  if (profile.value && profile.value.Avg_Daily_Usage_Hours !== undefined) {
    usageHours.value = profile.value.Avg_Daily_Usage_Hours
    await getPrediction(usageHours.value)
  }
})

const getHealthStatus = (score: number) => {
  if (score >= 8) {
    return {
      status: 'Excelente',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      badge: 'bg-emerald-100 text-emerald-800',
      progressColor: 'bg-emerald-500'
    }
  }
  if (score >= 6) {
    return {
      status: 'Bueno',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      badge: 'bg-blue-100 text-blue-800',
      progressColor: 'bg-blue-500'
    }
  }
  if (score >= 4) {
    return {
      status: 'Regular',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      badge: 'bg-amber-100 text-amber-800',
      progressColor: 'bg-amber-500'
    }
  }
  return {
    status: 'Preocupante',
    color: 'text-red-600',
    bg: 'bg-red-50',
    iconBg: 'bg-red-100',
    badge: 'bg-red-100 text-red-800',
    progressColor: 'bg-red-500'
  }
}

const getAddictionStatus = (score: number) => {
  if (score >= 7) {
    return {
      status: 'Alta adicción',
      color: 'text-red-600',
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      badge: 'bg-red-100 text-red-800',
      progressColor: 'bg-red-500'
    }
  }
  if (score >= 5) {
    return {
      status: 'Adicción moderada',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      badge: 'bg-amber-100 text-amber-800',
      progressColor: 'bg-amber-500'
    }
  }
  return {
    status: 'Baja adicción',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100',
    badge: 'bg-emerald-100 text-emerald-800',
    progressColor: 'bg-emerald-500'
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efecto de carta elevada al hover */
.bg-white\/90:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
</style>