<template>
  <Boxplot />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Boxplot from '../components/Boxplot.vue'

export default defineComponent({
  name: 'BoxplotView',
  components: {
    Boxplot
  }
})
</script>
