<template>
  <KMeansPrediction />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KMeansPrediction from '../components/KMeansPredict.vue'

export default defineComponent({
  name: 'KMeansView',
  components: {
    KMeansPrediction
  }
})
</script>
