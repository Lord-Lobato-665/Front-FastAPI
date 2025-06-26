<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold">Análisis K-Means Clustering</h2>
        <p class="text-indigo-100 mt-2">Agrupa tus datos según patrones de comportamiento</p>
      </div>
      <div class="p-6 space-y-8">
        <!-- Selección de columnas mejorada -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">Selecciona parámetros (2-3)</h3>
          <!-- Columnas disponibles -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div v-for="col in availableColumns" :key="col" @click="toggleColumn(col, !selectedColumns.includes(col))"
              :class="[
                'border-2 rounded-lg p-3 cursor-pointer transition-all duration-200',
                selectedColumns.includes(col)
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : selectedColumns.length >= 3
                    ? 'border-gray-200 bg-gray-50 opacity-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              ]">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-800">{{ columnTranslations[col] ?? col }}</span>
                <input type="checkbox" :checked="selectedColumns.includes(col)" class="hidden" />
                <span v-if="selectedColumns.includes(col)" class="text-indigo-600">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
          <!-- Columnas seleccionadas (mini cuadros) -->
          <div v-if="selectedColumns.length > 0" class="mb-6">
            <h4 class="text-md font-medium text-gray-700 mb-3">Parámetros seleccionados:</h4>
            <div class="flex flex-wrap gap-3">
              <div v-for="col in selectedColumns" :key="'selected-' + col"
                class="bg-indigo-100 border border-indigo-200 rounded-lg p-3 shadow-sm flex items-center gap-3">
                <span class="font-medium text-indigo-800">{{ columnTranslations[col] ?? col }}</span>
                <input type="number" :step="col === 'Age' ? 1 : 0.01" :min="col === 'Age' ? 1 : 1"
                  :max="col === 'Age' ? 100 : 10" :value="inputValues[col]" @input="onInputValueChange(col, $event)"
                  @click.stop
                  class="w-20 border border-indigo-300 rounded px-2 py-1 text-indigo-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  :placeholder="col === 'Age' ? '1-100' : '1-10'" />
                <button @click.stop="toggleColumn(col, false)" class="text-indigo-600 hover:text-indigo-800">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Input de clusters -->
        <div>
          <label class="block text-lg font-medium text-gray-800 mb-2">Cantidad de grupos (2 a 5):</label>
          <div class="flex items-center gap-4">
            <input type="range" v-model.number="kValue" min="2" max="5"
              class="w-full max-w-xs h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
            <span class="text-indigo-700 font-bold text-xl w-8 text-center">{{ kValue }}</span>
          </div>
        </div>
        <!-- Botón -->
        <div class="pt-4" ref="analyzeButton">
          <button @click="predictAndScroll" :disabled="!isValid || isLoading" :class="[
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
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z">
                </path>
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ error }}</span>
          </div>
        </div>
        <!-- Resultados -->
        <div v-if="result" class="mt-8 space-y-6 animate-fade-in" ref="resultsSection">
          <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm">
            <h3 class="text-2xl font-bold text-indigo-800 mb-4">Resultado del análisis</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <!-- Grupo asignado -->
              <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs">
                <h4 class="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>
                  </svg>
                  Grupo asignado
                </h4>
                <p class="text-3xl font-bold text-indigo-700">{{ typedCluster }}</p>
              </div>
              <!-- Descripción general -->
              <div class="bg-white p-4 rounded-lg border border-indigo-100 shadow-xs">
                <h4 class="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Descripción general
                </h4>
                <p class="text-gray-700">{{ typedGeneralDescription }}</p>
              </div>
            </div>
            <!-- Descripciones por parámetro -->
            <div class="mt-6 space-y-4">
              <div v-for="(col, idx) in selectedColumns" :key="'result-' + col"
                class="bg-white p-4 rounded-lg border border-gray-100">
                <h4 class="font-semibold text-indigo-700 mb-2">{{ columnTranslations[col] ?? col }}</h4>
                <p class="text-gray-600 mb-3">{{ typedFixedDescriptions[idx] }}</p>
                <div v-if="result.descripcion_cluster[idx]" class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                  <p class="text-sm text-gray-700">
                    <span class="font-medium text-blue-700">Análisis del modelo:</span> {{ typedDescriptions[idx] }}
                  </p>
                </div>
              </div>
            </div>
            <!-- Gráfico -->
            <div class="mt-8">
              <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <img :src="plotUrl" alt="Gráfico de K-Means" class="w-full h-auto rounded-lg border border-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { kmeansService } from '../services/KMeansService'
import type { KMeansInput, KMeansResponse } from '../interface/KMeans'

const availableColumns = ref<string[]>([])
const selectedColumns = ref<string[]>([])
const inputValues = ref<Record<string, number>>({})
const kValue = ref<number>(2)

const result = ref<KMeansResponse | null>(null)
const plotUrl = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Referencias para el scroll
const analyzeButton = ref<HTMLElement | null>(null)
const resultsSection = ref<HTMLElement | null>(null)

const columnTranslations: Record<string, string> = {
  Age: 'Edad',
  Avg_Daily_Usage_Hours: 'Horas promedio de uso diario',
  Sleep_Hours_Per_Night: 'Horas de sueño por noche',
  Mental_Health_Score: 'Puntaje de salud mental',
  Conflicts_Over_Social_Media: 'Conflictos por redes sociales',
  Addicted_Score: 'Puntaje de adicción'
}

const fixedDescriptions: Record<string, string> = {
  Age: 'La edad puede influir en el uso y percepción de las redes sociales, así como en los hábitos de descanso y salud mental.',
  Avg_Daily_Usage_Hours: 'El tiempo promedio diario en redes sociales puede indicar niveles de distracción, dependencia o evasión.',
  Sleep_Hours_Per_Night: 'Las horas de sueño reflejan la calidad del descanso, lo cual tiene impacto directo en el bienestar general.',
  Mental_Health_Score: 'El puntaje de salud mental brinda una visión sobre la estabilidad emocional y el estado psicológico actual.',
  Conflicts_Over_Social_Media: 'Los conflictos asociados al uso de redes pueden reflejar relaciones tóxicas, malentendidos o estrés interpersonal.',
  Addicted_Score: 'El puntaje de adicción estima el nivel de dependencia a redes sociales, afectando tanto rutinas como relaciones sociales.'
}

const filteredColumns = (cols: string[]) => {
  const forbidden = ['Student_ID']
  return cols.filter(c => !forbidden.includes(c))
}

const fetchColumns = async () => {
  try {
    const cols = await kmeansService.getHeaders()
    availableColumns.value = filteredColumns(cols)
  } catch {
    error.value = 'No se pudieron obtener las columnas del CSV.'
  }
}

onMounted(fetchColumns)

function toggleColumn(col: string, checked: boolean) {
  if (checked) {
    if (selectedColumns.value.length < 3 && !selectedColumns.value.includes(col)) {
      selectedColumns.value.push(col)
      inputValues.value[col] = col === 'Age' ? 1 : 1
    }
  } else {
    selectedColumns.value = selectedColumns.value.filter(c => c !== col)
    delete inputValues.value[col]
  }
}

function onInputValueChange(col: string, event: Event) {
  const target = event.target as HTMLInputElement
  let val = parseFloat(target.value)

  if (isNaN(val)) {
    inputValues.value[col] = NaN
    return
  }

  if (col === 'Age') {
    val = Math.floor(val)
  }

  const min = col === 'Age' ? 1 : 1
  const max = col === 'Age' ? 100 : 10

  if (val < min) {
    inputValues.value[col] = min
    target.value = String(min)
  } else if (val > max) {
    inputValues.value[col] = max
    target.value = String(max)
  } else {
    inputValues.value[col] = val
    target.value = String(val)
  }
}

const isValid = computed(() => {
  if (selectedColumns.value.length < 2 || selectedColumns.value.length > 3) return false
  for (const col of selectedColumns.value) {
    const val = inputValues.value[col]
    const min = col === 'Age' ? 1 : 1
    const max = col === 'Age' ? 100 : 10
    if (val === undefined || val === null || isNaN(val) || val < min || val > max) return false
  }
  if (kValue.value < 2 || kValue.value > 5) return false
  return true
})

function useTypewriter(text: string, speed = 40) {
  const displayText = ref('')
  let index = 0
  let timer: ReturnType<typeof setTimeout>

  function type() {
    if (index < text.length) {
      displayText.value += text[index]
      index++
      timer = setTimeout(type, speed)
    }
  }
  type()

  return displayText
}

const typedCluster = ref('')
const typedGeneralDescription = ref('')
const typedFixedDescriptions = ref<string[]>([])
const typedDescriptions = ref<string[]>([])

// Función para hacer scroll a los resultados
const scrollToResults = () => {
  nextTick(() => {
    if (resultsSection.value) {
      resultsSection.value.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  })
}

// Función combinada para predecir y hacer scroll
const predictAndScroll = async () => {
  await predict()
  scrollToResults()
}

watch(result, (newVal) => {
  if (newVal && newVal.user_info) {
    typedCluster.value = ''
    typedGeneralDescription.value = ''
    typedFixedDescriptions.value = []
    typedDescriptions.value = []

    if (newVal.user_info.cluster_asignado) {
      const twCluster = useTypewriter(newVal.user_info.cluster_asignado, 30)
      watch(twCluster, val => (typedCluster.value = val))
    }

    if (newVal.user_info.descripcion) {
      const twGeneral = useTypewriter(newVal.user_info.descripcion, 30)
      watch(twGeneral, val => (typedGeneralDescription.value = val))
    }

    const fixedTexts = selectedColumns.value.map(col => fixedDescriptions[col] || 'Sin análisis previo disponible.')
    typedFixedDescriptions.value = fixedTexts.map(() => '')
    fixedTexts.forEach((txt, idx) => {
      const twFixed = useTypewriter(txt, 30)
      watch(twFixed, val => {
        typedFixedDescriptions.value[idx] = val
      })
    })

    typedDescriptions.value = newVal.descripcion_cluster.map(() => '')
    newVal.descripcion_cluster.forEach((desc, idx) => {
      const twDesc = useTypewriter(desc, 30)
      watch(twDesc, val => {
        typedDescriptions.value[idx] = val
      })
    })
  }
})

const predict = async () => {
  isLoading.value = true
  error.value = null
  result.value = null
  plotUrl.value = null

  try {
    const payload: KMeansInput = {
      features: [...selectedColumns.value],
      k: kValue.value,
      normalize: false,
      user_input: { values: selectedColumns.value.map(c => inputValues.value[c]) }
    }

    result.value = await kmeansService.predict(payload)
    plotUrl.value = await kmeansService.getPlot()
  } catch (e: any) {
    console.error("Error en predict:", e)
    error.value = e?.response?.data?.detail || e.message || 'Error al procesar el análisis'
  } finally {
    isLoading.value = false
  }
}
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

input[type="range"] {
  -webkit-appearance: none;
  height: 8px;
  background: #e5e7eb;
  border-radius: 5px;
  background-image: linear-gradient(to right, #4f46e5, #4338ca);
  background-size: 0% 100%;
  background-repeat: no-repeat;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: all 0.3s ease;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #4338ca;
  transform: scale(1.1);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: all 0.3s ease;
}

input[type="range"]::-moz-range-thumb:hover {
  background: #4338ca;
  transform: scale(1.1);
}

input[type="range"]::-ms-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 0 2px 0 #555;
  transition: all 0.3s ease;
}

input[type="range"]::-ms-thumb:hover {
  background: #4338ca;
  transform: scale(1.1);
}

input[type="range"]::-webkit-slider-runnable-track {
  -webkit-appearance: none;
  box-shadow: none;
  border: none;
  background: transparent;
}

input[type="range"]::-moz-range-track {
  box-shadow: none;
  border: none;
  background: transparent;
}

input[type="range"]::-ms-track {
  color: transparent;
  background: transparent;
  border: none;
}
</style>