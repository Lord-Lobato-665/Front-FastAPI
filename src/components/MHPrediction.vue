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

      <div class="grid lg:grid-cols-2 gap-8">
        <!-- Input -->
        <div class="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
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
            <div class="space-y-3 pt-2">
              <label for="hours" class="block text-base font-medium text-gray-700">
                Horas diarias en redes
              </label>
              <div class="relative">
                <input id="hours" v-model.number="usageHours" type="number" step="0.1" min="0" max="24"
                  class="w-full text-lg py-3 pl-4 pr-16 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all duration-200 bg-white/50"
                  placeholder="Ej. 3.5" />
                <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">hrs</span>
              </div>
            </div>

            <button @click="getPrediction" :disabled="isLoading"
              class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed group">
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analizando...
              </span>
              <span v-else class="flex items-center justify-center">
                <svg class="w-5 h-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Analizar mi bienestar
              </span>
            </button>

            <!-- Resultado -->
            <div v-if="predictionData !== null" class="mt-4 space-y-6 animate-fade-in">
              <div :class="[
                'p-6 rounded-xl transition-all duration-500 shadow-inner',
                getHealthStatus(predictionData.prediccion).bg
              ]">
                <div class="flex items-start gap-4">
                  <div :class="['p-2 rounded-lg', getHealthStatus(predictionData.prediccion).iconBg]">
                    <svg :class="['w-6 h-6', getHealthStatus(predictionData.prediccion).color]" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg text-gray-900 mb-1">Resultados del Análisis</h3>
                    <div class="flex items-baseline gap-2 mb-3">
                      <span class="font-bold text-3xl">{{ predictionData.prediccion.toFixed(1) }}</span>
                      <span class="text-gray-500">/10</span>
                      <span :class="['ml-2 px-2 py-1 rounded-full text-xs font-semibold', getHealthStatus(predictionData.prediccion).badge]">
                        {{ predictionData.nivel_riesgo }}
                      </span>
                    </div>
                    
                    <p class="text-gray-700 mb-4 leading-relaxed">
                      {{ predictionData.interpretacion.descripcion }}
                    </p>
                    
                    <div class="flex items-center gap-2 mb-3">
                      <span class="text-sm text-gray-600">Estado:</span>
                      <span :class="['font-semibold', getHealthStatus(predictionData.prediccion).color]">
                        {{ getHealthStatus(predictionData.prediccion).status }}
                      </span>
                    </div>

                    <div class="mb-5">
                      <div class="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Bajo riesgo</span>
                        <span>Alto riesgo</span>
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
            </div>

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

        <!-- Chart -->
        <div class="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl shadow-lg overflow-hidden">
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
        </div>
      </div>

      <!-- Sección de recomendaciones  -->
      <div v-if="predictionData !== null" class="mt-8 animate-fade-in">
        <!-- Tarjeta de recomendaciones -->
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
              <div v-for="(recomendacion, index) in predictionData.interpretacion.recomendaciones" :key="index" 
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

        <!-- Tarjeta de detalles técnicos (separada) -->
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
                <p class="font-bold text-gray-800 text-xl">{{ predictionData.estadisticas.correlacion }}</p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Uso promedio</p>
                <p class="font-bold text-gray-800 text-xl">{{ predictionData.estadisticas.uso_promedio_dataset }} <span class="text-sm">hrs</span></p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Puntaje promedio</p>
                <p class="font-bold text-gray-800 text-xl">{{ predictionData.estadisticas.puntaje_promedio_dataset }}<span class="text-sm">/10</span></p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p class="text-xs text-gray-500 uppercase tracking-wider mb-1">Modelo utilizado</p>
                <p class="font-bold text-gray-800 text-xl">Lineal</p>
              </div>
            </div>
            <div class="mt-6 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              <p class="text-sm text-blue-800 italic">
                {{ predictionData.modelo_info.interpretacion_coeficiente }}
              </p>
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
import type { MentalHealthPrediction } from '../types/MentalHealthPrediction'

const usageHours = ref<number>(3)
const predictionData = ref<MentalHealthPrediction | null>(null)
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
  predictionData.value = null
  plotUrl.value = null

  try {
    predictionData.value = await mentalHealthService.getPrediction(usageHours.value)

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