<!-- src/views/RegressionAnalysisView.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Análisis de Regresión</h1>
        <p class="text-lg text-gray-600">Explora relaciones entre variables y realiza predicciones</p>
      </div>

      <!-- CSV Columns Section -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-800">Columnas Disponibles</h2>
          <button @click="fetchColumns" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Actualizar
          </button>
        </div>
        
        <div v-if="loadingColumns" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="column in csvColumns" :key="column.columna" 
               class="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <h3 class="font-medium text-gray-800 truncate">{{ column.columna }}</h3>
            <p class="text-sm text-gray-500 mt-1">Tipo: {{ column.tipo }}</p>
          </div>
        </div>
      </div>

      <!-- Prediction Section -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Predicción Lineal</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Form -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Variable Objetivo</label>
              <select v-model="predictionForm.target" class="w-full p-2 border border-gray-300 rounded-md">
                <option v-for="col in numericColumns" :key="col" :value="col">{{ col }}</option>
              </select>
            </div>
            
            <div v-for="(value, feature) in predictionForm.features" :key="feature" class="space-y-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ feature }}</label>
              <input v-model.number="predictionForm.features[feature]" type="number" step="0.1"
                     class="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            
            <div class="flex justify-between items-center">
              <button @click="addFeature" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                + Añadir Variable
              </button>
              
              <button @click="predict" :disabled="isPredicting"
                      class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {{ isPredicting ? 'Calculando...' : 'Predecir' }}
              </button>
            </div>
          </div>
          
          <!-- Results -->
          <div v-if="predictionResult" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Resultado</h3>
            <p class="text-gray-700 mb-3">{{ predictionResult.resumen }}</p>
            
            <div class="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p class="text-sm text-gray-500">Variable objetivo</p>
                <p class="font-medium">{{ predictionForm.target }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Valor predicho</p>
                <p class="font-medium">{{ predictionResult.prediccion.toFixed(2) }}</p>
              </div>
            </div>
            
            <button @click="showPredictionPlot" 
                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Gráfica
            </button>
          </div>
        </div>
      </div>

      <!-- Social Media Analysis -->
      <div class="bg-white rounded-xl shadow-md p-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Análisis de Redes Sociales</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Filters -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rango de Edad</label>
              <select v-model="analysisFilters.age_range" class="w-full p-2 border border-gray-300 rounded-md">
                <option value="18-25">18-25 años</option>
                <option value="26-35">26-35 años</option>
                <option value="36-45">36-45 años</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">País (opcional)</label>
              <input v-model="analysisFilters.country" type="text" 
                     class="w-full p-2 border border-gray-300 rounded-md" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nivel Académico</label>
              <select v-model="analysisFilters.academic_level" class="w-full p-2 border border-gray-300 rounded-md">
                <option :value="undefined">Todos</option>
                <option value="High School">Secundaria</option>
                <option value="Undergraduate">Universitario</option>
                <option value="Graduate">Posgrado</option>
              </select>
            </div>
            
            <button @click="fetchAnalysis" :disabled="isAnalyzing"
                    class="w-full py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50">
              {{ isAnalyzing ? 'Analizando...' : 'Obtener Análisis' }}
            </button>
          </div>
          
          <!-- Results -->
          <div v-if="analysisData" class="lg:col-span-2 space-y-4">
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-500">Horas de uso promedio</p>
                <p class="text-xl font-semibold">{{ analysisData.summary.avg_daily_usage_hours.toFixed(1) }}</p>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-500">Afecta rendimiento</p>
                <p class="text-xl font-semibold">{{ analysisData.summary.affects_performance_percentage.toFixed(1) }}%</p>
              </div>
              
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p class="text-sm text-gray-500">Salud mental</p>
                <p class="text-xl font-semibold">{{ analysisData.summary.avg_mental_health_score.toFixed(1) }}/10</p>
              </div>
            </div>
            
            <div>
              <h3 class="font-medium text-gray-800 mb-2">Plataformas más usadas</h3>
              <div class="flex flex-wrap gap-2">
                <span v-for="(count, platform) in analysisData.platform_analysis.top_platforms" :key="platform"
                      class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {{ platform.replace('Most_Used_Platform_', '') }}: {{ count }}
                </span>
              </div>
            </div>
            
            <button @click="showCorrelationPlot" 
                    class="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 mt-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Ver Correlaciones
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Plot Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div class="p-4 border-b flex justify-between items-center">
          <h3 class="text-lg font-semibold">{{ modalTitle }}</h3>
          <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-4">
          <img :src="currentPlotUrl" alt="Gráfica" class="w-full h-auto" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { linearRegressionService } from '../services/LRegression';
import type { CsvColumnInfo, LinearMultiFeatureResponse, SocialMediaAnalysis } from '../interface/LRegressionInterface';


// CSV Columns
const csvColumns = ref<CsvColumnInfo[]>([]);
const loadingColumns = ref(false);

// Prediction
const predictionForm = ref({
  features: {} as Record<string, number>,
  target: ''
});
const predictionResult = ref<LinearMultiFeatureResponse | null>(null);
const isPredicting = ref(false);

// Analysis
const analysisFilters = ref({
  age_range: '18-25',
  country: undefined as string | undefined,
  academic_level: undefined as string | undefined
});
const analysisData = ref<SocialMediaAnalysis | null>(null);
const isAnalyzing = ref(false);

// Plots
const showModal = ref(false);
const modalTitle = ref('');
const currentPlotUrl = ref('');

// Computed
const numericColumns = computed(() => {
  return csvColumns.value
    .filter(col => col.tipo.includes('int') || col.tipo.includes('float'))
    .map(col => col.columna);
});

// Methods
const fetchColumns = async () => {
  try {
    loadingColumns.value = true;
    csvColumns.value = await linearRegressionService.getCsvColumns();
    if (numericColumns.value.length > 0) {
      predictionForm.value.target = numericColumns.value[0];
    }
  } catch (error) {
    console.error('Error fetching columns:', error);
  } finally {
    loadingColumns.value = false;
  }
};

const addFeature = () => {
  const availableColumns = numericColumns.value.filter(
    col => col !== predictionForm.value.target && !predictionForm.value.features[col]
  );
  if (availableColumns.length > 0) {
    predictionForm.value.features[availableColumns[0]] = 0;
  }
};

const predict = async () => {
  try {
    isPredicting.value = true;
    predictionResult.value = await linearRegressionService.predictMultipleFeatures({
      features: predictionForm.value.features,
      target: predictionForm.value.target
    });
  } catch (error) {
    console.error('Prediction error:', error);
  } finally {
    isPredicting.value = false;
  }
};

const fetchAnalysis = async () => {
  try {
    isAnalyzing.value = true;
    analysisData.value = await linearRegressionService.getSocialMediaAnalysis({
      age_range: analysisFilters.value.age_range,
      country: analysisFilters.value.country,
      academic_level: analysisFilters.value.academic_level
    });
  } catch (error) {
    console.error('Analysis error:', error);
  } finally {
    isAnalyzing.value = false;
  }
};

const showPredictionPlot = async () => {
  try {
    modalTitle.value = 'Gráfica de Predicción';
    currentPlotUrl.value = await linearRegressionService.getMultipleFeaturesPlot();
    showModal.value = true;
  } catch (error) {
    console.error('Error loading plot:', error);
  }
};

const showCorrelationPlot = async () => {
  try {
    modalTitle.value = 'Correlaciones';
    currentPlotUrl.value = await linearRegressionService.getCorrelationChart();
    showModal.value = true;
  } catch (error) {
    console.error('Error loading correlation:', error);
  }
};

const closeModal = () => {
  showModal.value = false;
  currentPlotUrl.value = '';
};

// Lifecycle
onMounted(() => {
  fetchColumns();
  fetchAnalysis();
});
</script>

<style scoped>
/* Custom styles if needed */
</style>