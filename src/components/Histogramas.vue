<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold">Histogramas</h2>
        <p class="text-indigo-100 mt-2">Análisis del impacto del uso de redes sociales</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Inputs -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Ingresa los valores</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Histograma</label>
              <select v-model="selectedHistogram"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                <option value="usage_hours">Horas de Uso</option>
                <option value="sleep_academic">Sueño Académico</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Valor del Usuario</label>
              <input type="number" v-model.number="userValue" min="0"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número de Bins</label>
              <input type="number" v-model.number="bins" min="1"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button @click="fetchHistogram" :disabled="isLoading" :class="[
            'w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300',
            !isLoading
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]">
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Procesando...
            </span>
            <span v-else class="flex items-center justify-center gap-2 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Analizar
            </span>
          </button>
        </div>

        <!-- Error -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded mt-4">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Resultados -->
        <div v-if="result" class="mt-8 space-y-6 animate-fade-in">
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
            <h3 class="text-2xl font-bold text-indigo-800 mb-4">Resumen del Histograma</h3>

            <ul class="space-y-2 text-gray-700">
              <li><strong>Descripción:</strong> {{ result.descripcion }}</li>
              <li><strong>Tu valor:</strong> {{ result.user_value }}</li>
              <li><strong>Percentil:</strong> {{ result.percentil }}%</li>
              <li><strong>Interpretación:</strong> {{ result.interpretacion }}</li>
            </ul>

            <div class="mt-6">
              <img :src="plotUrl" alt="Gráfico de histograma" class="w-full h-auto rounded-lg border border-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { histogramasService } from '../services/HistogramasService';

const selectedHistogram = ref<'usage_hours' | 'sleep_academic'>('usage_hours');
const userValue = ref<number>(10);
const bins = ref<number>(10);

const isLoading = ref(false);
const error = ref<string | null>(null);
const result = ref<any>(null);
const plotUrl = ref<string>('');

const fetchHistogram = async () => {
  isLoading.value = true;
  error.value = null;
  result.value = null;
  plotUrl.value = '';

  try {
    let response;

    if (selectedHistogram.value === 'usage_hours') {
      response = await histogramasService.getUsageHoursHistogram(userValue.value, bins.value);
    } else {
      response = await histogramasService.getSleepAcademicHistogram(userValue.value, bins.value, '');
    }

    result.value = response;

    // Obtén la imagen usando el endpoint grafica_url, asegurando URL absoluta
    const baseUrl = 'http://localhost:8000'; // Ajusta si usas otro host/puerto
    const imgUrl = response.grafica_url.startsWith('http')
      ? response.grafica_url
      : baseUrl + response.grafica_url;

    plotUrl.value = await histogramasService.getHistogramPlotImage(imgUrl);
    console.log(plotUrl.value);

  } catch (err: any) {
    error.value = 'Error al obtener el histograma.';
    console.error('Error:', err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
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
