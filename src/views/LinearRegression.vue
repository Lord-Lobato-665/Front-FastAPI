<template>
  <LRegressionComponent/>
</template>

<script lang="ts" >
import { defineComponent } from 'vue'
import LRegressionComponent from '../components/LRegressionComponent.vue';

export default defineComponent({
  name: 'LinearRegressionView',
  components: {
    LRegressionComponent
  }
})
</script>

