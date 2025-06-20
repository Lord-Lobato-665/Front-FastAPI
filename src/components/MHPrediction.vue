<template>
  <section class="flex flex-col p-6 bg-white">
    <h2 class="text-3xl font-semibold mb-6 text-gray-800">
      Predicción de Salud Mental
    </h2>

    <div class="flex flex-col md:flex-row flex-1 rounded-lg overflow-hidden shadow-lg">
      <!-- Input y Resultado -->
      <div class="w-full md:w-1/2 p-6 flex flex-col justify-start">
        <div class="mb-6">
          <label
            for="hours"
            class="block text-sm font-medium text-gray-700 mb-2"
          >
            Horas promedio de uso diario de redes sociales
          </label>
          <input
            id="hours"
            v-model.number="usageHours"
            type="number"
            step="0.1"
            min="0"
            max="24"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ej. 3.5"
          />
        </div>

        <button
          @click="getPrediction"
          :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isLoading ? 'Calculando...' : 'Predecir Salud Mental' }}
        </button>

        <div v-if="prediction !== null" class="mt-8">
          <div
            class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 max-w-full"
          >
            <p class="text-blue-700">
              <span class="font-semibold">Resultado:</span>
              El puntaje predicho de salud mental es
              <span class="font-bold">{{ prediction.toFixed(2) }}</span>
              para {{ usageHours }} horas de uso diario.
            </p>
          </div>
          <div
            v-if="error"
            class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700"
          >
            {{ error }}
          </div>
        </div>
      </div>

      <!-- Gráfica -->
      <div
        class="w-full md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col"
      >
        <h3 class="text-xl font-semibold mb-4 text-gray-700">
          Gráfico de Regresión
        </h3>
        <img
          v-if="plotUrl"
          :src="plotUrl"
          alt="Gráfico de predicción de salud mental"
          class="max-w-full max-h-full rounded border border-gray-200"
        />
        <p v-else class="text-gray-500">Esperando información...</p>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mentalHealthService } from '../services/MentalHealth';

export default defineComponent({
  name: 'MentalHealthPrediction',
  setup() {
    const usageHours = ref<number>(3);
    const prediction = ref<number | null>(null);
    const plotUrl = ref<string | null>(null);
    const isLoading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const getPrediction = async () => {
      if (usageHours.value === null || usageHours.value < 0) {
        error.value = 'Por favor ingresa un valor válido (0-24 horas)';
        return;
      }

      isLoading.value = true;
      error.value = null;
      prediction.value = null;
      plotUrl.value = null;

      try {
        const data = await mentalHealthService.getPrediction(usageHours.value);
        prediction.value = data.prediccion;

        setTimeout(async () => {
          plotUrl.value = await mentalHealthService.getPlot();
          isLoading.value = false;
        }, 500);
      } catch (err) {
        console.error(err);
        error.value = 'Ocurrió un error al calcular la predicción. Intenta nuevamente.';
        isLoading.value = false;
      }
    };

    return {
      usageHours,
      prediction,
      plotUrl,
      isLoading,
      error,
      getPrediction
    };
  }
});
</script>