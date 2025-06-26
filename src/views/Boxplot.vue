<template>
  <div
    class="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md max-w-3xl mx-auto mt-10 animate-fade-in"
  >
    <h2
      class="text-3xl font-bold text-center text-blue-800 mb-8 tracking-tight"
    >
      📊 Comparación con la distribución
    </h2>

    <!-- Selector de columna -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2"
        >Selecciona una columna:</label
      >
      <select
        v-model="columnaSeleccionada"
        class="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option disabled value="">-- Selecciona una columna --</option>
        <option
          v-for="(col, index) in columnas"
          :key="index"
          :value="col.columna"
        >
          {{ col.columna }} — Tipo: {{ col.tipo }}
        </option>
      </select>
    </div>

    <!-- Input del valor -->
    <div v-if="columnaSeleccionada" class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2"
        >Ingresa tu valor:</label
      >
      <input
        type="number"
        v-model.number="valorUsuario"
        :min="esEdad ? 10 : undefined"
        :max="esEdad ? 30 : undefined"
        placeholder="Ej. 10"
        class="w-full px-4 py-2 border border-blue-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Mensaje de error -->
    <p v-if="mensajeError" class="text-red-600 mb-4 text-sm animate-shake">
      ⚠️ {{ mensajeError }}
    </p>

    <!-- Botón de acción -->
    <div class="text-center mb-6">
      <button
        :disabled="!columnaSeleccionada || !valorUsuario || cargando"
        @click="generarGrafica"
        class="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          v-if="!cargando"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <svg v-else class="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="white"
            stroke-width="4"
          />
          <path class="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        {{ cargando ? "Generando..." : "Generar gráfica y resumen" }}
      </button>
    </div>

    <!-- Resumen ultra-descriptivo -->
    <transition name="fade">
      <div
        v-if="resumen"
        class="bg-white border border-blue-200 rounded-lg p-5 shadow-md space-y-4"
      >
        <h3 class="text-xl font-bold text-blue-700">
          📋 Resumen estadístico detallado
        </h3>

        <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Mínimo:</strong> {{ resumen.min }}</div>
          <div><strong>Máximo:</strong> {{ resumen.max }}</div>
          <div><strong>Q1 (25%):</strong> {{ resumen.q1 }}</div>
          <div><strong>Q3 (75%):</strong> {{ resumen.q3 }}</div>
          <div><strong>Mediana (Q2):</strong> {{ resumen.mediana }}</div>
          <div><strong>Media:</strong> {{ resumen.media }}</div>
          <div>
            <strong>Desviación estándar:</strong>
            {{ resumen.desviacion_estandar }}
          </div>
          <div><strong>Tu valor:</strong> {{ resumen.valor_usuario }}</div>
        </div>

        <div
          class="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-blue-800"
        >
          <p><strong>📌 Ubicación:</strong> {{ resumen.posicion_usuario }}</p>
          <p class="mt-2">
            <strong>📖 Interpretación:</strong><br />{{
              resumen.interpretacion
            }}
          </p>
          <p class="mt-2">
            <strong>✅ Recomendación:</strong><br />{{ resumen.recomendacion }}
          </p>
        </div>
      </div>
    </transition>

    <!-- Imagen -->
    <transition name="fade">
      <div v-if="graficaUrl" class="mt-8 text-center">
        <h3 class="text-xl font-bold mb-3 text-blue-700">
          📈 Gráfica generada
        </h3>
        <img
          :src="graficaUrl"
          alt="Boxplot generado"
          class="mx-auto border border-gray-200 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 max-w-full"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const columnas = ref<{ columna: string; tipo: string }[]>([]);
const columnaSeleccionada = ref("");
const valorUsuario = ref<number | null>(null);
const resumen = ref<any>(null);
const graficaUrl = ref<string>("");
const mensajeError = ref<string>("");
const cargando = ref<boolean>(false);

const esEdad = computed(() =>
  ["edad", "age"].includes(columnaSeleccionada.value.toLowerCase())
);

const obtenerCabeceras = async () => {
  try {
    const response = await axios.get(
      "http://127.0.0.1:8001/api/v1/predict/csv-heads"
    );
    columnas.value = response.data.columnas.filter(
      (col: any) =>
        col.tipo.toLowerCase().includes("int") &&
        col.columna.toLowerCase() !== "student_id"
    );
  } catch (error) {
    console.error("Error al obtener las cabeceras:", error);
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
    sleep_time: valorUsuario.value,
  };

  try {
    cargando.value = true;
    resumen.value = null;
    graficaUrl.value = "";

    const resumenResp = await axios.post(
      "http://127.0.0.1:8001/api/v1/boxplot/summary_statistics",
      payload
    );
    resumen.value = resumenResp.data;

    const plotResp = await axios.post(
      "http://127.0.0.1:8001/api/v1/boxplot/sleep_vs_screen",
      payload,
      {
        responseType: "blob",
      }
    );

    graficaUrl.value = URL.createObjectURL(plotResp.data);
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
}
.animate-shake {
  animation: shake 0.4s ease;
}
</style>
