<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden max-w-3xl">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 text-white text-center">
        <h2 class="text-3xl font-bold">Comparación con la distribución</h2>
        <p class="text-indigo-100 mt-2">Visualiza cómo tu valor se relaciona con la población general</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Selector de columna -->
        <div>
          <label class="block text-lg font-medium text-gray-800 mb-2">Selecciona una columna</label>
          <select v-model="columnaSeleccionada"
            class="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option disabled value="">-- Selecciona una columna --</option>
            <option v-for="(col, index) in columnas" :key="index" :value="col.columna">
              {{ columnTranslations[col.columna] ?? col.columna.replaceAll('_', ' ') }}
            </option>
          </select>
        </div>

        <!-- Input del valor -->
        <div v-if="columnaSeleccionada">
          <label class="block text-lg font-medium text-gray-800 mb-2">Ingresa tu valor</label>
          <input type="number" v-model.number="valorUsuario" :min="esEdad ? 10 : undefined"
            :max="esEdad ? 30 : undefined" placeholder="Ej. 10"
            class="w-full px-4 py-2 border border-indigo-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>

        <!-- Mensaje de error -->
        <div v-if="mensajeError" class="p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ mensajeError }}</span>
          </div>
        </div>

        <!-- Botón de acción -->
        <div class="pt-4">
          <button @click="generarGrafica" :disabled="!columnaSeleccionada || !valorUsuario || cargando"
            :class="[ 'w-full md:w-auto px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300',
                      !cargando ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed']">
            <span v-if="cargando" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              Generando...
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generar gráfica y resumen
            </span>
          </button>
        </div>

        <!-- Resultados -->
        <div v-if="resumen"
          class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm space-y-4 mt-8">
          <h3 class="text-2xl font-bold text-indigo-800 mb-4">Resumen estadístico detallado</h3>
          <div class="grid md:grid-cols-2 gap-4 text-gray-700 text-sm">
            <div><strong>Mínimo:</strong> {{ resumen.min }}</div>
            <div><strong>Máximo:</strong> {{ resumen.max }}</div>
            <div><strong>Q1 (25%):</strong> {{ resumen.q1 }}</div>
            <div><strong>Q3 (75%):</strong> {{ resumen.q3 }}</div>
            <div><strong>Mediana:</strong> {{ resumen.mediana }}</div>
            <div><strong>Media:</strong> {{ resumen.media }}</div>
            <div><strong>Desviación estándar:</strong> {{ resumen.desviacion_estandar }}</div>
            <div><strong>Tu valor:</strong> {{ resumen.valor_usuario }}</div>
          </div>
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
            <p><strong>Ubicación:</strong> {{ resumen.posicion_usuario }}</p>
            <p class="mt-2"><strong>Interpretación:</strong> {{ resumen.interpretacion }}</p>
            <p class="mt-2"><strong>Recomendación:</strong> {{ resumen.recomendacion }}</p>
          </div>
        </div>

        <!-- Imagen -->
        <div v-if="graficaUrl" class="mt-8">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <img :src="graficaUrl" alt="Gráfico de Boxplot"
              class="w-full h-auto rounded-lg border border-gray-200" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import { boxplotService } from "../services/BoxplotService";
import type { BoxplotColumn, BoxplotSummary } from "../types/BoxplotTypes";

const columnas = ref<BoxplotColumn[]>([]);
const columnaSeleccionada = ref("");
const valorUsuario = ref<number | null>(null);
const resumen = ref<BoxplotSummary | null>(null);
const graficaUrl = ref<string>("");
const mensajeError = ref<string>("");
const cargando = ref<boolean>(false);

const columnTranslations: Record<string, string> = {
  Age: "Edad",
  Avg_Daily_Usage_Hours: "Horas promedio de uso diario",
  Sleep_Hours_Per_Night: "Horas de sueño por noche",
  Mental_Health_Score: "Puntaje de salud mental",
  Conflicts_Over_Social_Media: "Conflictos por redes sociales",
  Addicted_Score: "Puntaje de adicción"
};

const esEdad = computed(() =>
  ["edad", "age"].includes(columnaSeleccionada.value.toLowerCase())
);

const obtenerCabeceras = async () => {
  try {
    columnas.value = await boxplotService.getAvailableColumns();
  } catch (error) {
    console.error("Error al obtener las cabeceras:", error);
    mensajeError.value = "Error al cargar las columnas disponibles";
  }
};

const generarGrafica = async () => {
  mensajeError.value = "";
  if (!columnaSeleccionada.value || valorUsuario.value === null) return;

  if (esEdad.value && (valorUsuario.value < 10 || valorUsuario.value > 30)) {
    mensajeError.value = "El valor de edad debe estar entre 10 y 30.";
    return;
  }

  const payload = {
    eje_y: columnaSeleccionada.value,
    user_value: valorUsuario.value,
  };

  try {
    cargando.value = true;
    resumen.value = null;
    graficaUrl.value = "";

    resumen.value = await boxplotService.getSummaryStatistics(payload);
    graficaUrl.value = await boxplotService.generateBoxplot(payload);
  } catch (error) {
    mensajeError.value = "Error al generar la gráfica o el resumen.";
    console.error(error);
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  obtenerCabeceras();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out;
}
</style>
