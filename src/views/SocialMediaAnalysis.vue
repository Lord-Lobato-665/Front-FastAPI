<template>
  <SocialMediaAnalysisComponent />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SocialMediaAnalysisComponent from '../components/SocialMediaAnalysis.vue';

export default defineComponent({
  name: 'LinearRegressionView',
  components: {
    SocialMediaAnalysisComponent
  }
})
</script>
