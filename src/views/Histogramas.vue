<template>
  <HistogramasComponent />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HistogramasComponent from '../components/Histogramas.vue';

export default defineComponent({
  name: 'LinearRegressionView',
  components: {
    HistogramasComponent
  }
})
</script>
