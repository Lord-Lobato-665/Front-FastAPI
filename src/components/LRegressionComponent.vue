<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold">Regresión Lineal Multivariable</h2>
        <p class="text-indigo-100 mt-2">Predice valores basados en múltiples variables</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Selección de variables -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Selecciona variables</h3>

          <!-- Variable objetivo -->
          <div class="mb-6">
            <label class="block text-lg font-medium text-gray-700 mb-2">Variable a predecir (objetivo):</label>
            <select v-model="targetVariable"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
              <option v-for="col in targetOptions" :key="col" :value="col">{{ columnTranslations[col] || col }}</option>
            </select>
          </div>

          <!-- Variables predictoras -->
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">Variables predictoras (selecciona 2):</label>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              <div v-for="col in predictorOptions.filter(c => c !== targetVariable)" :key="col"
                @click="togglePredictor(col)" :class="[
                  'border-2 rounded-lg p-3 cursor-pointer transition-all duration-200',
                  predictors.includes(col)
                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                    : predictors.length >= 2
                      ? 'border-gray-200 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
                ]">
                <div class="flex items-center justify-between">
                  <span class="font-medium text-gray-800">{{ columnTranslations[col] || col }}</span>
                  <input type="checkbox" :checked="predictors.includes(col)" class="hidden" />
                  <span v-if="predictors.includes(col)" class="text-indigo-600">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Valores de entrada -->
          <div v-if="predictors.length > 0" class="mt-6">
            <h4 class="text-lg font-medium text-gray-700 mb-3">Ingresa los valores:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="col in predictors" :key="'input-' + col"
                class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ columnTranslations[col] || col }}</label>
                <input type="number" v-model.number="inputValues[col]" :step="getStep(col)" :min="getMin(col)"
                  :max="getMax(col)" @change="validateInput(col)"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  :placeholder="getPlaceholder(col)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de predicción -->
        <div class="pt-4">
          <button @click="predict" :disabled="!isValid || isLoading" :class="[
            'w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300',
            isValid && !isLoading
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]">
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Procesando...
            </span>
            <span v-else class="flex items-center justify-center gap-2 cursor-pointer">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
              </svg>
              Predecir
            </span>
          </button>
        </div>

        <!-- Errores -->
        <div v-if="error" class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>

        <!-- Resultados -->
        <div v-if="result" class="mt-8 space-y-6 animate-fade-in">
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
            <h3 class="text-2xl font-bold text-indigo-800 mb-4">Resultado de la predicción</h3>

            <div class="grid md:grid-cols-2 gap-6 mb-6">
              <!-- Predicción -->
              <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs">
                <h4 class="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Valor predicho
                </h4>
                <p class="text-3xl font-bold text-indigo-700">{{ result.prediccion.toFixed(2) }}</p>
              </div>

              <!-- Resumen -->
              <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs">
                <h4 class="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Interpretación
                </h4>
                <p class="text-gray-700">{{ result.resumen }}</p>
              </div>
            </div>

            <!-- Variables utilizadas -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-2">Variables utilizadas:</h4>
              <div class="flex flex-wrap gap-2">
                <span v-for="col in result.features_utilizados" :key="'used-' + col"
                  class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                  {{ columnTranslations[col] || col }}
                </span>
              </div>
            </div>

            <!-- Gráfico -->
            <div class="mt-6">
              <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <img :!src="plotUrl" alt="Gráfico de regresión"
                  class="w-full h-auto rounded-lg border border-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { linearRegressionService } from '../services/LRegression';

const availableColumns = ref<string[]>([]);
const targetOptions = ref<string[]>([]);
const predictorOptions = ref<string[]>([]);
const columnTranslations: Record<string, string> = {
  Age: 'Edad',
  Avg_Daily_Usage_Hours: 'Horas de uso diario promedio de redes sociales',
  Mental_Health_Score: 'Puntuación de salud mental',
  Sleep_Hours_Per_Night: 'Horas de sueño por noche',
  Addicted_Score: 'Puntuación de adicción',
  Conflicts_Over_Social_Media: 'Conflictos por redes sociales',
};

const variableRanges: Record<string, { min: number, max: number, step: number }> = {
  Age: { min: 1, max: 100, step: 1 },
  Avg_Daily_Usage_Hours: { min: 0, max: 24, step: 0.5 },
  Mental_Health_Score: { min: 1, max: 10, step: 0.1 },
  Sleep_Hours_Per_Night: { min: 0, max: 24, step: 0.5 },
  Addicted_Score: { min: 1, max: 10, step: 0.1 },
  Conflicts_Over_Social_Media: { min: 0, max: 10, step: 1 },
};

const targetVariable = ref<string>('');
const predictors = ref<string[]>([]);
const inputValues = ref<Record<string, number>>({});
const result = ref<any>(null);
const plotUrl = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const isValid = computed(() => {
  return targetVariable.value !== '' &&
    predictors.value.length === 2 &&
    Object.values(inputValues.value).every(val => val !== undefined && !isNaN(val));
});

const getStep = (col: string) => variableRanges[col]?.step || 1;
const getMin = (col: string) => variableRanges[col]?.min || 0;
const getMax = (col: string) => variableRanges[col]?.max || 100;
const getPlaceholder = (col: string) => {
  const range = variableRanges[col];
  return range ? `${range.min}-${range.max}` : '';
};

const validateInput = (col: string) => {
  if (!inputValues.value[col] || isNaN(inputValues.value[col])) {
    inputValues.value[col] = variableRanges[col]?.min || 0;
    return;
  }

  const range = variableRanges[col];
  if (!range) return;
  if (inputValues.value[col] < range.min) {
    inputValues.value[col] = range.min;
  } else if (inputValues.value[col] > range.max) {
    inputValues.value[col] = range.max;
  }
  if (range.step < 1) {
    const decimals = range.step.toString().split('.')[1]?.length || 0;
    inputValues.value[col] = parseFloat(inputValues.value[col].toFixed(decimals));
  } else {
    inputValues.value[col] = Math.round(inputValues.value[col]);
  }
};

const filterNumericColumns = (columns: string[]) => {
  const numericCols = [
    'Age',
    'Avg_Daily_Usage_Hours',
    'Mental_Health_Score',
    'Sleep_Hours_Per_Night',
    'Addicted_Score',
    'Conflicts_Over_Social_Media',
  ];
  return columns.filter(col => numericCols.includes(col));
};

const fetchColumns = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/v1/predict/csv-heads');
    const data = await response.json();
    availableColumns.value = data.columnas.map((col: any) => col.columna);

    const allNumeric = filterNumericColumns(availableColumns.value);
    targetOptions.value = allNumeric.filter(col => col !== 'Age');
    predictorOptions.value = allNumeric;

    if (targetOptions.value.length > 0) {
      targetVariable.value = targetOptions.value[0];
    }
  } catch (err) {
    error.value = 'Error al cargar las columnas disponibles';
    console.error(err);
  }
};

const togglePredictor = (col: string) => {
  if (predictors.value.includes(col)) {
    predictors.value = predictors.value.filter(c => c !== col);
    delete inputValues.value[col];
  } else if (predictors.value.length < 2) {
    predictors.value.push(col);
    inputValues.value[col] = variableRanges[col]?.min || 0;
  }
};

const predict = async () => {
  isLoading.value = true;
  error.value = null;
  result.value = null;
  plotUrl.value = null;

  try {
    predictors.value.forEach(col => validateInput(col));
    const payload = {
      features: predictors.value.reduce((acc, col) => {
        acc[col] = inputValues.value[col];
        return acc;
      }, {} as Record<string, number>),
      target: targetVariable.value
    };

    result.value = await linearRegressionService.predictMultipleFeatures(payload);
    plotUrl.value = await linearRegressionService.getMultipleFeaturesPlot();
  } catch (err) {
    error.value = 'Error al realizar la predicción';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchColumns);
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