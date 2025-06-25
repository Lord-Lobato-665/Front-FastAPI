<template>
  <div>
    <h1>Cabeceras del CSV</h1>
    <ul v-if="columnas.length > 0">
      <li v-for="(col, index) in columnas" :key="index">
        {{ col.columna }} - Tipo: {{ col.tipo }}
      </li>
    </ul>
    <p v-else>Cargando o no se han encontrado cabeceras.</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      columnas: []
    }
  },
  mounted() {
    this.obtenerCabeceras()
  },
  methods: {
    async obtenerCabeceras() {
      try {
        const response = await axios.get('http://localhost:8000/predict/csv-heads') // Ajusta URL si es necesario
        this.columnas = response.data.columnas
      } catch (error) {
        console.error("Error al obtener las cabeceras:", error)
      }
    }
  }
}
</script>
