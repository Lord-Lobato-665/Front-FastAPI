<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
          Predicción de Salud Mental
        </h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Analiza el impacto del uso de redes sociales en tu bienestar mental con inteligencia artificial
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Input -->
        <div class="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-xl">
          <div class="p-6 pb-6">
            <h2 class="flex items-center gap-3 text-2xl font-semibold mb-2">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Datos de Entrada
            </h2>
            <p class="text-base text-gray-600">Ingresa tu tiempo promedio diario en redes sociales</p>
          </div>

          <div class="px-6 pb-6 space-y-6">
            <div class="space-y-3">
              <label for="hours" class="block text-base font-medium text-gray-700">
                Horas promedio de uso diario
              </label>
              <div class="relative">
                <input
                  id="hours"
                  v-model.number="usageHours"
                  type="number"
                  step="0.1"
                  min="0"
                  max="24"
                  class="w-full text-lg py-3 pl-4 pr-16 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-200"
                  placeholder="Ej. 3.5"
                />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">hrs</span>
              </div>
            </div>

            <button
              @click="getPrediction"
              :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analizando...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Predecir Salud Mental
              </span>
            </button>

            <!-- Resultado -->
            <div v-if="prediction !== null" class="mt-8 space-y-4 animate-fade-in">
              <div :class="[
                'p-6 rounded-2xl border-2 transition-all duration-500',
                getHealthStatus(prediction).bg,
                getHealthStatus(prediction).border
              ]">
                <div class="flex items-start gap-4">
                  <svg :class="['w-6 h-6 mt-1', getHealthStatus(prediction).color]" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 class="font-semibold text-lg text-gray-900 mb-2">Resultado del Análisis</h3>
                    <p class="text-gray-700 mb-3">
                      Tu puntaje de salud mental predicho es
                      <span class="font-bold text-2xl">{{ prediction.toFixed(2) }}</span>/10
                    </p>
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-gray-600">Estado:</span>
                      <span :class="['font-semibold', getHealthStatus(prediction).color]">
                        {{ getHealthStatus(prediction).status }}
                      </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-2">Basado en {{ usageHours }} horas de uso diario</p>
                    <div class="mt-4">
                      <div class="w-full bg-gray-200 rounded-full h-3">
                        <div :class="['h-3 rounded-full transition-all duration-1000', getHealthStatus(prediction).progressColor]"
                          :style="{ width: `${(prediction / 10) * 100}%` }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="error" class="p-4 bg-red-50 border-2 border-red-200 rounded-xl animate-fade-in">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-red-700 font-medium">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart -->
        <div class="backdrop-blur-sm bg-white/80 border-0 shadow-2xl rounded-xl">
          <div class="p-6 pb-6">
            <h2 class="flex items-center gap-3 text-2xl font-semibold mb-2">
              <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Visualización de Datos
            </h2>
            <p class="text-base text-gray-600">Gráfico de regresión y análisis predictivo</p>
          </div>
          <div class="px-6 pb-6">
            <div class="relative min-h-[400px] flex items-center justify-center">
              <div v-if="isLoading" class="flex flex-col items-center gap-4">
                <div class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p class="text-gray-600 font-medium">Generando gráfico...</p>
              </div>
              <div v-else-if="plotUrl" class="w-full animate-fade-in">
                <img :src="plotUrl" alt="Gráfico de predicción de salud mental"
                  class="w-full h-auto rounded-xl shadow-lg border border-gray-200" />
              </div>
              <div v-else class="text-center">
                <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                  <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <p class="text-gray-500 font-medium text-lg">Esperando datos para generar el gráfico</p>
                <p class="text-gray-400 text-sm mt-2">Haz clic en "Predecir Salud Mental" para comenzar</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { mentalHealthService } from '../services/MentalHealth'

const usageHours = ref<number>(3)
const prediction = ref<number | null>(null)
const plotUrl = ref<string | null>(null)
const isLoading = ref<boolean>(false)
const error = ref<string | null>(null)

const getPrediction = async () => {
  if (usageHours.value === null || usageHours.value < 0 || usageHours.value > 24) {
    error.value = 'Por favor ingresa un valor válido entre 0 y 24 horas'
    return
  }

  isLoading.value = true
  error.value = null
  prediction.value = null
  plotUrl.value = null

  try {
    const data = await mentalHealthService.getPrediction(usageHours.value)
    prediction.value = data.prediccion

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

const getHealthStatus = (score: number) => {
  if (score >= 8) {
    return {
      status: 'Excelente',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      progressColor: 'bg-emerald-500'
    }
  }
  if (score >= 6) {
    return {
      status: 'Bueno',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      progressColor: 'bg-blue-500'
    }
  }
  if (score >= 4) {
    return {
      status: 'Regular',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      progressColor: 'bg-amber-500'
    }
  }
  return {
    status: 'Preocupante',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    progressColor: 'bg-red-500'
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
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
</style>
