<template>
  <div class="p-6 max-w-5xl mx-auto bg-white rounded-xl shadow-lg space-y-6">
    <h2 class="text-3xl font-bold text-indigo-700">Análisis K-Means Clustering</h2>

    <div>
      <label class="block mb-2 font-medium">Selecciona columnas (2-3):</label>
      <div class="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto border rounded p-2">
        <label v-for="col in availableColumns" :key="col" class="flex items-center space-x-2">
          <input
            type="checkbox"
            :value="col"
            @change="toggleColumn(col, $event.target.checked)"
            :checked="selectedColumns.includes(col)"
            :disabled="!selectedColumns.includes(col) && selectedColumns.length >= 3"
          />
          <span>{{ col }}</span>
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" v-if="selectedColumns.length > 0">
      <div v-for="col in selectedColumns" :key="col">
        <label class="block font-medium mb-1">Valor para {{ col }}</label>
        <input
          type="number"
          step="0.01"
          min="1"
          max="10"
          :value="inputValues[col]"
          @input="onInputValueChange(col, $event)"
          class="w-full border p-2 rounded"
          placeholder="Ingresa valor entre 1 y 10"
        />
      </div>
    </div>

    <div>
      <label class="block font-medium mb-1">Cantidad de Clusters (2 a 5):</label>
      <input
        type="number"
        v-model.number="kValue"
        min="2"
        max="5"
        class="w-full border p-2 rounded"
      />
    </div>

    <button
      @click="predict"
      :disabled="!isValid || isLoading"
      class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
    >
      {{ isLoading ? 'Procesando...' : 'Analizar' }}
    </button>

    <div v-if="error" class="text-red-600 mt-2">{{ error }}</div>

    <div v-if="result" class="mt-6">
      <h3 class="text-xl font-semibold text-gray-800">Resultado:</h3>
      <p v-if="result.user_info" class="mt-2">
        <strong>Cluster asignado:</strong> {{ result.user_info.cluster_asignado }}
      </p>
      <p v-if="result.user_info" class="mb-2">
        <strong>Descripción:</strong> {{ result.user_info.descripcion }}
      </p>

      <ul class="list-disc list-inside mt-2 text-gray-700">
        <li v-for="desc in result.descripcion_cluster" :key="desc">{{ desc }}</li>
      </ul>

      <div class="mt-6">
        <img :src="plotUrl" alt="Gráfico de K-Means" class="w-full rounded shadow" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { kmeansService } from '../services/KmeansService'
import type { KMeansInput, KMeansResponse } from '../interface/Kmeans'

const availableColumns = ref<string[]>([])
const selectedColumns = ref<string[]>([])
const inputValues = ref<Record<string, number>>({})
const kValue = ref<number>(2)

const result = ref<KMeansResponse | null>(null)
const plotUrl = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

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
      inputValues.value[col] = 1 // Valor predeterminado entre 1 y 10
    }
  } else {
    selectedColumns.value = selectedColumns.value.filter(c => c !== col)
    delete inputValues.value[col]
  }
}

function onInputValueChange(col: string, event: Event) {
  const target = event.target as HTMLInputElement
  let valStr = target.value
  let val = parseFloat(valStr)

  if (valStr === '' || isNaN(val)) {
    inputValues.value[col] = NaN
    return
  }

  if (val < 1) {
    inputValues.value[col] = 1
    target.value = '1'
  } else if (val > 10) {
    inputValues.value[col] = 10
    target.value = '10'
  } else {
    inputValues.value[col] = val
  }
}

const isValid = computed(() => {
  if (
    selectedColumns.value.length < 2 ||
    selectedColumns.value.length > 3
  ) {
    return false
  }

  for (const col of selectedColumns.value) {
    const val = inputValues.value[col]
    if (val === undefined || val === null || isNaN(val) || val < 1 || val > 10) {
      return false
    }
  }

  if (kValue.value < 2 || kValue.value > 5) {
    return false
  }

  return true
})

const predict = async () => {
  isLoading.value = true
  error.value = null
  result.value = null
  plotUrl.value = null

  const payload: KMeansInput = {
    features: [...selectedColumns.value],
    k: kValue.value,
    normalize: false,
    user_input: { values: selectedColumns.value.map(c => inputValues.value[c]) }
  }

  console.log("Payload enviado:", payload)

  try {
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
