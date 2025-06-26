<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold">Predicción con Regresión Logística</h2>
        <p class="text-indigo-100 mt-2">Analiza la probabilidad de ocurrencia de un evento</p>
      </div>

      <div class="p-6 space-y-8">
        <!-- Selección de variable objetivo (Y) -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">¿Qué quieres predecir?</h3>
          <p class="text-sm text-gray-500 mb-2">Selecciona una variable binaria (Sí/No) para predecir</p>
          <select
            v-model="selectedTarget"
            class="w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecciona una opción</option>
            <option
              v-for="target in binaryTargets"
              :key="target"
              :value="target"
            >
              {{ formatColumnName(target) }}
            </option>
          </select>
        </div>

        <!-- Factores de predicción como cards colapsables -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Factores de predicción</h3>
          <p class="text-sm text-gray-500 mb-6">Haz clic en un factor para ingresar su valor numérico</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="feature in numericFeatures"
              :key="feature"
              class="border-2 rounded-lg p-4 cursor-pointer transition-shadow duration-200"
              :class="expandedFeatures.includes(feature)
                ? 'border-indigo-500 shadow-lg bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'"
              @click="toggleFeature(feature)"
            >
              <div class="flex items-center justify-between">
                <span class="font-semibold text-gray-900">{{ formatColumnName(feature) }}</span>
                <svg
                  :class="['w-5 h-5 transition-transform duration-300',
                    expandedFeatures.includes(feature)
                      ? 'rotate-180 text-indigo-600'
                      : 'text-gray-400'
                  ]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <transition name="slide-fade">
                <div v-if="expandedFeatures.includes(feature)" class="mt-4">
                  <input
                    type="number"
                    v-model.number="inputValues[feature]"
                    :step="getInputStep(feature)"
                    :placeholder="getPlaceholder(feature)"
                    class="w-full border border-indigo-300 rounded-md p-2 focus:ring-indigo-400 focus:border-indigo-400"
                    @blur="onInputChange(feature, $event)"
                    @click.stop
                  />
                </div>
              </transition>
            </div>
          </div>
        </div>

        <!-- Botón de predicción -->
        <div class="pt-4" ref="analyzeButton">
          <button
            @click="predictAndScroll"
            :disabled="!isValid || isLoading"
            :class="[
              'w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2',
              isValid && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <svg
              v-if="isLoading"
              class="w-5 h-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ isLoading ? 'Procesando...' : 'Realizar Predicción' }}</span>
          </button>
        </div>

        <!-- Resultados -->
        <div v-if="result" class="mt-8" ref="resultsSection">
          <transition name="fade-slide">
            <div class="bg-indigo-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
              <h3 class="text-2xl font-bold text-indigo-800 mb-6">Resultado</h3>

              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs">
                  <h4 class="font-semibold text-gray-700 mb-2">Predicción</h4>
                  <p
                    :class="[
                      result.prediccion_clase
                        ? 'text-red-600 font-bold text-lg'
                        : 'text-green-600 font-bold text-lg',
                      'typewriter'
                    ]"
                  >
                    {{ result.descripcion_prediccion }}
                  </p>
                  <p class="text-gray-600 mt-2 typewriter">
                    Probabilidad: {{ (result.probabilidad_clase_positiva * 100).toFixed(1) }}%
                  </p>
                </div>

                <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs">
                  <h4 class="font-semibold text-gray-700 mb-2">Nivel de riesgo</h4>
                  <div class="flex items-center gap-2 mt-1">
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        class="h-2.5 rounded-full transition-all duration-500"
                        :class="riskLevelColor"
                        :style="{ width: `${(result.nivel_de_riesgo / 9) * 100}%` }"
                      ></div>
                    </div>
                    <span class="text-sm font-medium typewriter">{{ result.nivel_de_riesgo }}/9</span>
                  </div>
                  <p class="text-sm text-gray-600 mt-3 typewriter">{{ result.interpretacion_general }}</p>
                </div>
              </div>

              <div class="mt-6">
                <h4 class="font-semibold text-gray-700 mb-3">Análisis por factor</h4>
                <ul class="space-y-2 text-gray-700">
                  <li
                    v-for="(analysis, idx) in result.analisis_individual"
                    :key="idx"
                    class="flex items-start typewriter"
                  >
                    <span class="text-indigo-600 mr-2">•</span>{{ analysis }}
                  </li>
                </ul>
              </div>

              <div class="mt-6">
                <img
                  :src="plotUrl"
                  alt="Gráfico regresión logística"
                  class="w-full rounded-lg border border-indigo-200 shadow-sm"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { logisticService } from '../services/LogisticService';
import type { LogisticInput, LogisticResponse } from '../types/LogisticRegression';

const numericFeatures = ref<string[]>([]);
const binaryTargets = ref<string[]>([]);
const selectedTarget = ref<string>('');
const inputValues = ref<Record<string, number>>({});
const result = ref<LogisticResponse | null>(null);
const plotUrl = ref<string>('');
const isLoading = ref(false);
const expandedFeatures = ref<string[]>([]);

const analyzeButton = ref<HTMLElement | null>(null);
const resultsSection = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    numericFeatures.value = await logisticService.getNumericFeatures();
    binaryTargets.value = await logisticService.getBinaryTargets();
  } catch (error) {
    console.error('Error loading data:', error);
  }
});

const columnTranslations: Record<string, string> = {
  Age: 'Edad',
  Avg_Daily_Usage_Hours: 'Horas promedio de uso diario',
  Sleep_Hours_Per_Night: 'Horas de sueño por noche',
  Mental_Health_Score: 'Puntaje de salud mental',
  Conflicts_Over_Social_Media: 'Conflictos por redes sociales',
  Addicted_Score: 'Puntaje de adicción',
  // Variables binarias:
  "Academic_Level_Graduate": "Nivel académico: Posgrado",
  "Academic_Level_High_School": "Nivel académico: Preparatoria",
  "Academic_Level_Undergraduate": "Nivel académico: Universidad",
  "Most_Used_Platform_Facebook": "Plataforma más usada: Facebook",
  "Most_Used_Platform_Instagram": "Plataforma más usada: Instagram",
  "Most_Used_Platform_KakaoTalk": "Plataforma más usada: KakaoTalk",
  "Most_Used_Platform_LINE": "Plataforma más usada: LINE",
  "Most_Used_Platform_LinkedIn": "Plataforma más usada: LinkedIn",
  "Most_Used_Platform_Snapchat": "Plataforma más usada: Snapchat",
  "Most_Used_Platform_TikTok": "Plataforma más usada: TikTok",
  "Most_Used_Platform_Twitter": "Plataforma más usada: Twitter",
  "Most_Used_Platform_VKontakte": "Plataforma más usada: VKontakte",
  "Most_Used_Platform_WeChat": "Plataforma más usada: WeChat",
  "Most_Used_Platform_WhatsApp": "Plataforma más usada: WhatsApp",
  "Most_Used_Platform_YouTube": "Plataforma más usada: YouTube",
  "Relationship_Status_Complicated": "Estado sentimental: Es complicado",
  "Relationship_Status_In_Relationship": "Estado sentimental: En una relación",
  "Relationship_Status_Single": "Estado sentimental: Soltero/a"
};

const formatColumnName = (col: string): string => {
  return columnTranslations[col] || col.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

const getRange = (col: string) => {
  const ranges: Record<string, { min: number; max: number }> = {
    Age: { min: 18, max: 100 },
    Avg_Daily_Usage_Hours: { min: 1, max: 24 },
    Mental_Health_Score: { min: 1, max: 10 },
    Addicted_Score: { min: 1, max: 10 },
    Sleep_Hours_Per_Night: { min: 0, max: 12 },
    Conflicts_Over_Social_Media: { min: 0, max: 10 }
  };
  return ranges[col] || { min: 0, max: Infinity };
};

const onInputChange = (feature: string, event: Event) => {
  const t = event.target as HTMLInputElement;
  let v = t.value === '' ? NaN : Number(t.value);
  const { min, max } = getRange(feature);
  if (isNaN(v)) { inputValues.value[feature] = NaN; return; }
  if (v < min) v = min;
  if (v > max) v = max;
  if (['Age', 'Conflicts_Over_Social_Media'].includes(feature)) v = Math.floor(v);
  inputValues.value[feature] = v;
  t.value = String(v);
};

const getInputStep = (col: string) => ['Age', 'Conflicts_Over_Social_Media'].includes(col) ? '1' : '0.1';
const getPlaceholder = (col: string) => ({
  Age: '18-100',
  Avg_Daily_Usage_Hours: '1-24',
  Mental_Health_Score: '1-10',
  Addicted_Score: '1-10',
  Conflicts_Over_Social_Media: '0-10'
}[col] || 'Ingrese valor');

const toggleFeature = (f: string) => {
  expandedFeatures.value.includes(f)
    ? expandedFeatures.value = expandedFeatures.value.filter(x => x !== f)
    : expandedFeatures.value.push(f);
};

const isValid = computed(() => {
  if (!selectedTarget.value) return false;
  if (!Object.keys(inputValues.value).length) return false;
  return Object.entries(inputValues.value).every(([f, v]) => {
    const { min, max } = getRange(f);
    return !isNaN(v) && v >= min && v <= max;
  });
});

const riskLevelColor = computed(() => {
  if (!result.value) return 'bg-gray-400';
  const lvl = result.value.nivel_de_riesgo;
  return lvl <= 3 ? 'bg-green-500' : lvl <= 6 ? 'bg-yellow-500' : 'bg-red-500';
});

const predict = async () => {
  if (!isValid.value) return;
  isLoading.value = true;
  result.value = null;
  plotUrl.value = '';
  try {
    const payload: LogisticInput = { features: { ...inputValues.value }, target: selectedTarget.value };
    result.value = await logisticService.predict(payload);
    plotUrl.value = await logisticService.getPlot();
  } catch (e) { console.error(e); } finally { isLoading.value = false; }
};

const predictAndScroll = async () => {
  await predict();
  await nextTick();
  resultsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
</script>

<style scoped>
.fade-slide-enter-active { transition: all 0.5s ease; }
.fade-slide-leave-active { transition: all 0.3s ease; }
.fade-slide-enter-from { opacity: 0; transform: translateY(20px); }
.fade-slide-enter-to { opacity: 1; transform: translateY(0); }
.typewriter { overflow: hidden; white-space: nowrap; }
.animate-fade-in { animation: fadeIn 0.5s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s ease; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; max-height: 0; overflow: hidden; }
.slide-fade-enter-to, .slide-fade-leave-from { opacity: 1; max-height: 100px; }
</style>
