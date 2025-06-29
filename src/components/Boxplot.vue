<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-6">
    <div class="mx-auto bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
      <!-- Header con gradiente mejorado -->
      <div class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white">
        <h2 class="text-3xl font-bold tracking-tight">Comparación con la distribución</h2>
        <p class="text-indigo-100 mt-2 opacity-90">Visualiza cómo tu valor se relaciona con la población general</p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Selección de columnas mejorada -->
        <div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            Selecciona una columna
          </h3>
          
          <!-- Columnas disponibles -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div 
              v-for="col in columnas" 
              :key="col.columna"
              @click="toggleColumn(col.columna, !selectedColumns.includes(col.columna))"
              :class="[
                'border-2 rounded-lg p-3 cursor-pointer transition-all duration-200',
                selectedColumns.includes(col.columna) 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : selectedColumns.length >= 1 
                    ? 'border-gray-200 bg-gray-50 opacity-50' 
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'
              ]"
            >
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-800">{{ columnTranslations[col.columna] ?? col.columna.replaceAll('_', ' ') }}</span>
                <input 
                  type="checkbox" 
                  :checked="selectedColumns.includes(col.columna)"
                  class="hidden"
                />
                <span 
                  v-if="selectedColumns.includes(col.columna)"
                  class="text-indigo-600"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </div>

          <!-- Columnas seleccionadas (mini cuadros) -->
          <div v-if="selectedColumns.length > 0" class="mb-6 animate-fade-in">
            <h4 class="text-md font-medium text-gray-700 mb-3 flex items-center gap-2">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Parámetros seleccionados:
            </h4>
            <div class="flex flex-wrap gap-3">
              <div 
                v-for="col in selectedColumns" 
                :key="'selected-'+col"
                class="bg-indigo-100 border border-indigo-200 rounded-lg p-3 shadow-sm flex items-center gap-3"
              >
                <span class="font-medium text-indigo-800">{{ columnTranslations[col] ?? col.replaceAll('_', ' ') }}</span>
                <input
                  type="number"
                  :step="col === 'Age' ? 1 : 0.01"
                  :min="col === 'Age' ? 10 : 1"
                  :max="col === 'Age' ? 30 : 10"
                  v-model.number="inputValues[col]"
                  @click.stop
                  class="w-20 border border-indigo-300 rounded px-2 py-1 text-indigo-800 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                  :placeholder="col === 'Age' ? '10-30' : '1-10'"
                />
                <button 
                  @click.stop="toggleColumn(col, false)"
                  class="text-indigo-600 hover:text-indigo-800"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje de error mejorado -->
        <div v-if="mensajeError" class="animate-fade-in p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
          <svg class="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h4 class="font-medium text-red-800">Error</h4>
            <p class="text-red-700">{{ mensajeError }}</p>
          </div>
        </div>

        <!-- Botón de acción mejorado -->
        <div class="pt-4" ref="analyzeButton">
          <button 
            @click="generarGraficaYScroll" 
            :disabled="!isValid || cargando"
            :class="[
              'w-full px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-300 relative overflow-hidden',
              !cargando 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            ]"
          >
            <!-- Efecto de onda -->
            <span class="absolute inset-0 overflow-hidden">
              <span class="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>
              <span class="absolute inset-0 ripple-effect"></span>
            </span>
            
            <span v-if="cargando" class="flex items-center justify-center gap-2 relative z-10">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generando...
            </span>
            <span v-else class="flex items-center justify-center gap-2 relative z-10">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Generar gráfica y resumen
            </span>
          </button>
        </div>

        <!-- Resultados mejorados -->
        <div v-if="resumen"
          class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-100 shadow-sm space-y-4 mt-8 animate-fade-in"
          ref="resultsSection">
          <h3 class="text-2xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
            <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Resumen estadístico detallado
          </h3>
          
          <div class="grid md:grid-cols-2 gap-4">
            <div v-for="(value, key) in estadisticasFiltradas" :key="key" 
              class="bg-white p-3 rounded-lg border border-gray-100 shadow-xs flex items-center">
              <div class="bg-indigo-100 p-2 rounded-lg mr-3">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <div class="font-medium text-gray-700 capitalize">{{ key.replace('_', ' ') }}:</div>
                <div class="text-indigo-600 font-semibold">{{ value }}</div>
              </div>
            </div>
          </div>
          
          <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mt-4">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="space-y-2">
                <p><strong class="text-blue-800">Ubicación:</strong> {{ typedPosition }}</p>
                <p><strong class="text-blue-800">Interpretación:</strong> {{ typedInterpretation }}</p>
                <p><strong class="text-blue-800">Recomendación:</strong> {{ typedRecommendation }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Imagen con mejor presentación -->
        <div v-if="graficaUrl" class="mt-8 animate-fade-in">
          <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
                Visualización de datos
              </h3>
              <button @click="descargarGrafica" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Descargar
              </button>
            </div>
            <img :src="graficaUrl" alt="Gráfico de Boxplot"
              class="w-full h-auto rounded-lg border border-gray-200 transition-all duration-300 hover:opacity-90" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { boxplotService } from "../services/BoxplotService";
import type { BoxplotColumn, BoxplotSummary } from "../types/BoxplotTypes";

const columnas = ref<BoxplotColumn[]>([]);
const selectedColumns = ref<string[]>([]);
const inputValues = ref<Record<string, number>>({});
const resumen = ref<BoxplotSummary | null>(null);
const graficaUrl = ref<string>("");
const mensajeError = ref<string>("");
const cargando = ref<boolean>(false);

// Referencias para el scroll
const analyzeButton = ref<HTMLElement | null>(null);
const resultsSection = ref<HTMLElement | null>(null);

// Textos animados
const typedPosition = ref('');
const typedInterpretation = ref('');
const typedRecommendation = ref('');

const columnTranslations: Record<string, string> = {
  Age: "Edad",
  Avg_Daily_Usage_Hours: "Horas promedio de uso diario",
  Sleep_Hours_Per_Night: "Horas de sueño por noche",
  Mental_Health_Score: "Puntaje de salud mental",
  Conflicts_Over_Social_Media: "Conflictos por redes sociales",
  Addicted_Score: "Puntaje de adicción"
};

const esEdad = computed(() =>
  ["edad", "age"].includes(selectedColumns.value[0]?.toLowerCase())
);

// Filtramos las estadísticas para mostrar solo las relevantes
const estadisticasFiltradas = computed(() => {
  if (!resumen.value) return {};
  const { interpretacion, recomendacion, posicion_usuario, ...stats } = resumen.value;
  return stats;
});

const isValid = computed(() => {
  return selectedColumns.value.length > 0 && 
         inputValues.value[selectedColumns.value[0]] !== undefined && 
         inputValues.value[selectedColumns.value[0]] !== null;
});

// Función para animación de escritura
function useTypewriter(text: string, speed = 30) {
  const displayText = ref('');
  let index = 0;
  let timer: ReturnType<typeof setTimeout>;

  function type() {
    if (index < text.length) {
      displayText.value += text[index];
      index++;
      timer = setTimeout(type, speed);
    }
  }
  
  // Limpiar y comenzar nueva animación
  displayText.value = '';
  index = 0;
  type();

  return displayText;
}

// Función para hacer scroll a los resultados
const scrollToResults = () => {
  nextTick(() => {
    if (resultsSection.value) {
      resultsSection.value.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
};

// Función combinada para generar gráfica y hacer scroll
const generarGraficaYScroll = async () => {
  await generarGrafica();
  scrollToResults();
};

// Observar cambios en el resumen para animar textos
watch(resumen, (newVal) => {
  if (newVal) {
    // Animar cada parte del texto
    const twPosition = useTypewriter(newVal.posicion_usuario);
    watch(twPosition, val => typedPosition.value = val);
    
    const twInterpretation = useTypewriter(newVal.interpretacion);
    watch(twInterpretation, val => typedInterpretation.value = val);
    
    const twRecommendation = useTypewriter(newVal.recomendacion);
    watch(twRecommendation, val => typedRecommendation.value = val);
  }
});

const obtenerCabeceras = async () => {
  try {
    columnas.value = await boxplotService.getAvailableColumns();
  } catch (error) {
    console.error("Error al obtener las cabeceras:", error);
    mensajeError.value = "Error al cargar las columnas disponibles";
  }
};

const toggleColumn = (col: string, checked: boolean) => {
  if (checked) {
    if (selectedColumns.value.length < 1) {
      selectedColumns.value = [col];
      inputValues.value[col] = col === 'Age' ? 15 : 5; // Valor por defecto
    }
  } else {
    selectedColumns.value = selectedColumns.value.filter(c => c !== col);
    delete inputValues.value[col];
  }
};

const generarGrafica = async () => {
  mensajeError.value = "";
  if (selectedColumns.value.length === 0 || inputValues.value[selectedColumns.value[0]] === undefined) return;

  const columna = selectedColumns.value[0];
  const valor = inputValues.value[columna];

  if (esEdad.value && (valor < 10 || valor > 30)) {
    mensajeError.value = "El valor de edad debe estar entre 10 y 30.";
    return;
  }

  const payload = {
    eje_y: columna,
    user_value: valor,
  };

  try {
    cargando.value = true;
    resumen.value = null;
    graficaUrl.value = "";
    typedPosition.value = '';
    typedInterpretation.value = '';
    typedRecommendation.value = '';

    resumen.value = await boxplotService.getSummaryStatistics(payload);
    graficaUrl.value = await boxplotService.generateBoxplot(payload);
  } catch (error) {
    mensajeError.value = "Error al generar la gráfica o el resumen.";
    console.error(error);
  } finally {
    cargando.value = false;
  }
};

const descargarGrafica = () => {
  if (!graficaUrl.value) return;
  const link = document.createElement('a');
  link.href = graficaUrl.value;
  link.download = `boxplot-${selectedColumns.value[0]}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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

.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>