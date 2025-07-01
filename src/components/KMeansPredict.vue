<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold">Análisis K-Means Clustering</h2>
        <p class="text-indigo-100 mt-2">Agrupa tus datos según patrones de comportamiento</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Mensaje si no hay perfil -->
        <div v-if="!hasValidProfile" class="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
          <div class="flex items-center gap-2 text-yellow-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No hay datos de perfil disponibles. Completa tu perfil primero.</span>
          </div>
        </div>

        <!-- Selección de columnas -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Selecciona parámetros (2-3)</h3>

          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div
              v-for="col in availableColumns"
              :key="col"
              @click="hasValidProfile ? toggleColumn(col, !selectedColumns.includes(col)) : null"
              :class="[
                'border-2 rounded-lg p-3 cursor-pointer transition-all duration-200',
                selectedColumns.includes(col)
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : selectedColumns.length >= 3
                  ? 'border-gray-200 bg-gray-50 opacity-50'
                  : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50',
                !hasValidProfile ? 'opacity-50 cursor-not-allowed' : ''
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-800">
                  {{ columnTranslations[col] ?? col }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="selectedColumns.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-gray-700 mb-3">Parámetros seleccionados:</h4>
            <div class="flex flex-wrap gap-3">
              <div
                v-for="col in selectedColumns"
                :key="'selected-' + col"
                class="bg-indigo-100 border border-indigo-200 rounded-lg p-3 shadow-sm flex items-center gap-3"
              >
                <span class="font-medium text-indigo-800">{{ columnTranslations[col] ?? col }}</span>
                <span class="text-indigo-700 bg-white border border-indigo-300 px-3 py-1 rounded text-sm shadow-sm">
                  {{ getUserDataValue(col) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input de clusters -->
        <div>
          <label class="block text-lg font-medium text-gray-800 mb-2">Cantidad de grupos (2 a 5):</label>
          <div class="flex items-center gap-4">
            <input
              type="range"
              v-model.number="kValue"
              min="2"
              max="5"
              class="w-full max-w-xs h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              :disabled="!hasValidProfile"
            />
            <span class="text-indigo-700 font-bold text-xl w-8 text-center">{{ kValue }}</span>
          </div>
        </div>

        <!-- Botón -->
        <div class="pt-4" ref="analyzeButton">
          <button
            @click="predictAndScroll"
            :disabled="!isValid || isLoading || !hasValidProfile"
            :class="[
              'w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300',
              isValid && !isLoading && hasValidProfile
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed',
            ]"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Procesando...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Analizar
            </span>
          </button>
        </div>

        <!-- Alerta de error -->
        <transition name="fade">
          <div
            v-if="error"
            class="p-4 bg-red-100 border-l-4 border-red-600 text-red-800 rounded relative"
          >
            <strong class="font-bold">¡Error!</strong>
            <span class="block sm:inline ml-2">{{ error }}</span>
            <button
              @click="error = null"
              class="absolute top-2 right-3 text-red-500 hover:text-red-800 font-bold"
            >
              ×
            </button>
          </div>
        </transition>

        <!-- Resultados -->
        <div v-if="result" ref="resultsSection" class="mt-8 space-y-6 animate-fade-in">
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
            <h3 class="text-2xl font-bold text-indigo-800 mb-4">Resultados del Clustering</h3>

            <!-- Información del grupo asignado -->
            <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs mb-6">
              <h4 class="font-semibold text-gray-700 mb-2">Tu grupo asignado</h4>
              <p class="text-indigo-700 font-bold text-xl mb-2">{{ typedCluster }}</p>
              <p class="text-gray-700">{{ typedGeneralDescription }}</p>
            </div>

            <!-- Descripción de los grupos -->
            <div class="mb-6">
              <h4 class="font-semibold text-gray-700 mb-3">Descripción de los grupos</h4>
              <div class="grid md:grid-cols-2 gap-4">
                <div 
                  v-for="(desc, index) in typedDescriptions" 
                  :key="'cluster-desc-'+index"
                  class="bg-white p-4 rounded-lg border border-gray-200 shadow-xs"
                >
                  <h5 class="font-medium text-indigo-700 mb-1">Grupo {{ index + 1 }}</h5>
                  <p class="text-gray-700">{{ desc }}</p>
                </div>
              </div>
            </div>

            <!-- Gráfico -->
            <div class="mt-6">
              <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <img 
                  :src="plotUrl" 
                  alt="Gráfico de clustering" 
                  class="w-full h-auto rounded-lg border border-gray-200"
                  v-if="plotUrl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { kmeansService } from "../services/KMeansService";
import type { KMeansInput, KMeansResponse } from "../types/KMeans";
import { useProfileStore } from '../stores/profileStore';

const profileStore = useProfileStore();
const userData = computed(() => profileStore.userData);

const availableColumns = ref<string[]>([]);
const selectedColumns = ref<string[]>([]);
const kValue = ref(2);

const result = ref<KMeansResponse | null>(null);
const plotUrl = ref<string | null>(null);
const isLoading = ref(false);
const error = ref<string | null>(null);

const analyzeButton = ref<HTMLElement | null>(null);
const resultsSection = ref<HTMLElement | null>(null);

// Traducción nombres columnas
const columnTranslations: Record<string, string> = {
  Age: "Edad",
  Avg_Daily_Usage_Hours: "Horas de uso diario",
  Sleep_Hours_Per_Night: "Horas de sueño",
  Mental_Health_Score: "Salud mental (1-10)",
  Conflicts_Over_Social_Media: "Conflictos por redes",
  Addicted_Score: "Adicción (1-10)",
};

// Mapeo de propiedades del perfil a nombres de columnas
const propertyToColumnMap: Record<string, string> = {
  'Age': 'Age',
  'Avg_Daily_Usage_Hours': 'Avg_Daily_Usage_Hours',
  'Mental_Health_Score': 'Mental_Health_Score',
  'Sleep_Hours_Per_Night': 'Sleep_Hours_Per_Night',
  'Addiction_Score': 'Addicted_Score',
  'Conflicts_Over_Social_Media': 'Conflicts_Over_Social_Media'
};

// Validar si hay un perfil válido
const hasValidProfile = computed(() => {
  return userData.value !== null && validateUserData(userData.value);
});

// Función para validar los datos del usuario
const validateUserData = (data: any): boolean => {
  const requiredFields = [
    'Age', 'Avg_Daily_Usage_Hours', 'Mental_Health_Score', 
    'Sleep_Hours_Per_Night', 'Addiction_Score'
  ];
  
  return requiredFields.every(field => 
    data[field] !== undefined && 
    data[field] !== null && 
    !isNaN(Number(data[field]))
  );
};

// Obtener valor del perfil del usuario
const getUserDataValue = (col: string): string => {
  if (!userData.value) return 'N/A';

  const property = Object.entries(propertyToColumnMap).find(
    ([_, column]) => column === col
  )?.[0];

  if (!property || userData.value[property] === undefined) return 'N/A';

  const value = userData.value[property];

  // Formatear valores según necesidad
  if (col === 'Mental_Health_Score' || col === 'Addiction_Score') {
    return value !== undefined ? value.toFixed(1) : 'N/A';
  }
  if (col === 'Avg_Daily_Usage_Hours' || col === 'Sleep_Hours_Per_Night') {
    return value !== undefined ? `${value} hrs` : 'N/A';
  }

  return value !== undefined ? value.toString() : 'N/A';
};

function toggleColumn(col: string, checked: boolean) {
  if (checked && selectedColumns.value.length < 3) {
    if (!selectedColumns.value.includes(col)) {
      selectedColumns.value.push(col);
    }
  } else {
    selectedColumns.value = selectedColumns.value.filter((c) => c !== col);
  }
}

const fetchColumns = async () => {
  try {
    const cols = await kmeansService.getHeaders();
    availableColumns.value = cols.filter(c => c !== 'Student_ID');
  } catch {
    error.value = "No se pudieron obtener las columnas del CSV.";
  }
};

const isValid = computed(() => {
  return selectedColumns.value.length >= 2 && selectedColumns.value.length <= 3;
});

function useTypewriter(text: string, speed = 40) {
  const displayText = ref("");
  let index = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const start = () => {
    if (timer) clearTimeout(timer);
    displayText.value = "";
    index = 0;
    (function type() {
      if (index < text.length) {
        displayText.value += text[index++];
        timer = setTimeout(type, speed);
      }
    })();
  };

  start();
  return displayText;
}

const typedCluster = ref("");
const typedGeneralDescription = ref("");
const typedDescriptions = ref<string[]>([]);

watch(result, (newVal) => {
  if (newVal?.user_info) {
    const { cluster_asignado, descripcion } = newVal.user_info;
    typedCluster.value = "";
    typedGeneralDescription.value = "";
    typedDescriptions.value = [];

    if (cluster_asignado) {
      const tw = useTypewriter(cluster_asignado, 30);
      watch(tw, val => typedCluster.value = val);
    }

    if (descripcion) {
      const tw = useTypewriter(descripcion, 30);
      watch(tw, val => typedGeneralDescription.value = val);
    }

    typedDescriptions.value = newVal.descripcion_cluster.map(() => "");
    newVal.descripcion_cluster.forEach((desc, i) => {
      const tw = useTypewriter(desc, 30);
      watch(tw, val => typedDescriptions.value[i] = val);
    });
  }
});

const scrollToResults = () => {
  nextTick(() => {
    resultsSection.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
};

const predict = async () => {
  if (!isValid.value || !userData.value) return;
  isLoading.value = true;
  error.value = null;
  result.value = null;
  plotUrl.value = null;

  try {
    // Crear payload con los valores del perfil del usuario
    const userValues = selectedColumns.value.map(col => {
      const property = Object.entries(propertyToColumnMap).find(
        ([_, column]) => column === col
      )?.[0];
      
      if (property && userData.value && userData.value[property] !== undefined) {
        return Number(userData.value[property]);
      }
      return 0; // Valor por defecto si no existe
    });

    const payload: KMeansInput = {
      features: [...selectedColumns.value],
      k: kValue.value,
      normalize: true,
      user_input: {
        values: userValues
      },
    };
    
    result.value = await kmeansService.predict(payload);
    plotUrl.value = await kmeansService.getPlot();
  } catch (e: any) {
    error.value = e?.response?.data?.detail || e.message || "Error inesperado en el análisis";
  } finally {
    isLoading.value = false;
  }
};

const predictAndScroll = async () => {
  await predict();
  scrollToResults();
};

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    // Cargar columnas disponibles del servicio
    await fetchColumns();
    
    // Cargar datos del perfil desde localStorage
    profileStore.loadFromStorage();
    
  } catch (error) {
    console.error('Error loading data:', error);
  }
});
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>