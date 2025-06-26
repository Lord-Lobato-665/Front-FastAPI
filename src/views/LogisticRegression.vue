<template>
  <LogisticPrediction />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LogisticPrediction from '../components/LogisticPredict.vue';

export default defineComponent({
  name: 'LogisticView',
  components: {
    LogisticPrediction
  }
})
</script>