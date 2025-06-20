<template>
  <div class="container mx-auto p-6">
    <h1 class="text-4xl font-bold mb-6 mt-3 text-gray-800 text-center">Regresión Lineal</h1>
      <MentalHealthPrediction />
      </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MentalHealthPrediction from '../components/MHPrediction.vue';

export default defineComponent({
  name: 'DataAnalysisView',
  components: {
    MentalHealthPrediction
  }
});
</script>