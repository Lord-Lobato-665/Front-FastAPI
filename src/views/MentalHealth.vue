<template>
      <MentalHealthPrediction />
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