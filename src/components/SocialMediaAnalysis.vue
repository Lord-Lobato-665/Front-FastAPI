<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold">Análisis de redes sociales</h2>
        <p class="text-indigo-100 mt-2">Análisis del impacto del uso de redes sociales</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Inputs -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Ingresa los valores</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-1">Rango de Edad</label>
              <div class="flex gap-2">
                <input type="number" v-model.number="ageMin" placeholder="Mínimo" min="0"
                  class="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                <input type="number" v-model.number="ageMax" placeholder="Máximo" min="0"
                  class="w-1/2 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nivel Académico</label>
              <select v-model="form.academic_level"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                <option value="High School">Preparatoria</option>
                <option value="Undergraduate">Licenciatura</option>
                <option value="Graduate">Posgrado</option>
              </select>
            </div>
          </div>
        </div>

        <div class="pt-4">
          <button @click="predict" :disabled="isLoading" :class="[
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

        <!-- Errores -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
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
            <h3 class="text-2xl font-bold text-indigo-800 mb-4">Resumen del Análisis</h3>

            <ul class="space-y-2 text-gray-700">
              <li><strong>Total de estudiantes:</strong> {{ result.summary.total_students }}</li>
              <li><strong>Uso diario promedio:</strong> {{ result.summary.avg_daily_usage_hours }} horas</li>
              <li><strong>Impacto en rendimiento (%):</strong> {{ result.summary.affects_performance_percentage }}%</li>
              <li><strong>Salud mental promedio:</strong> {{ result.summary.avg_mental_health_score }}</li>
              <li><strong>Puntuación de adicción promedio:</strong> {{ result.summary.avg_addiction_score }}</li>
              <li><strong>Horas promedio de sueño:</strong> {{ result.summary.avg_sleep_hours }}</li>
            </ul>

            <h4 class="text-xl font-semibold mt-6 mb-2">Plataformas más usadas</h4>
            <ul class="list-disc list-inside text-gray-700">
              <li v-for="(count, name) in result.platform_analysis.top_platforms" :key="name">
                {{ name.replace('Most_Used_Platform_', '') }}: {{ count }} estudiantes
              </li>
            </ul>

            <h4 class="text-xl font-semibold mt-6 mb-2">Correlaciones</h4>
            <ul class="list-disc list-inside text-gray-700">
              <li>Uso vs Salud Mental: {{ result.usage_impact.correlation_usage_mental_health }}</li>
              <li>Uso vs Adicción: {{ result.usage_impact.correlation_usage_addiction }}</li>
              <li>Uso vs Sueño: {{ result.usage_impact.correlation_usage_sleep }}</li>
            </ul>

            <h4 class="text-xl font-semibold mt-6 mb-2">Recomendaciones</h4>
            <ul class="list-disc list-inside text-gray-700">
              <li>{{ result.insights.performance_impact }}</li>
              <li>{{ result.insights.mental_health_tip }}</li>
              <li>{{ result.insights.sleep_quality }}</li>
            </ul>

            <div class="mt-6">
              <img :src="plotUrl" alt="Gráfico de correlación"
                class="w-full h-auto rounded-lg border border-gray-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { linearRegressionService } from '../services/LRegression';
import type { SocialMediaAnalysisRequest } from '../types/LRegressionInterface';

const form = ref<SocialMediaAnalysisRequest>({
  age_range: '',
  country: '',
  academic_level: 'Undergraduate'
});

const ageMin = ref<number | null>(null);
const ageMax = ref<number | null>(null);

watch([ageMin, ageMax], ([min, max]) => {
  if (min != null && max != null && min < max) {
    form.value.age_range = `${min}-${max}`;
  } else {
    form.value.age_range = '';
  }
});

const isLoading = ref(false);
const error = ref<string | null>(null);
const result = ref<any>(null);
const plotUrl = ref<string>('');

const predict = async () => {
  isLoading.value = true;
  error.value = null;
  result.value = null;
  plotUrl.value = '';

  try {
    if (!form.value.age_range || !form.value.academic_level) {
      error.value = 'Por favor llena todos los campos requeridos.';
      isLoading.value = false;
      return;
    }

    result.value = await linearRegressionService.socialMediaAnalysis(form.value);
    plotUrl.value = await linearRegressionService.getSocialMediaAnalysisPlot();
  } catch (err) {
    error.value = 'Error al realizar la predicción';
    console.error(err);
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
