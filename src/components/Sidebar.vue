<template>
  <aside class="w-64 h-screen bg-blue-900 text-white flex flex-col shadow-lg">
    <div class="p-6 font-bold text-2xl border-b border-blue-700">IDYGS93</div>
    <nav class="flex-1 mt-4">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="block px-6 py-3 hover:bg-blue-700 transition-colors"
        active-class="bg-blue-700 font-semibold"
        exact
      >
        {{ item.label }}
      </router-link>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
const menuItems = [
  { name: 'DataView', label: 'Vista Principal de los Datos', path: '/' },
  { name: 'DataCleaning', label: 'Limpieza de Datos', path: '/cleaning' },
  { name: 'LinearRegression', label: 'Modelo de Regresión Lineal', path: '/linear-regression' },
  { name: 'LogisticRegression', label: 'Modelo de Regresión Logística', path: '/logistic-regression' },
  { name: 'Trees', label: 'Árboles', path: '/trees' },
  { name: 'AdvancedCharts', label: 'Graficación Avanzada', path: '/advanced-charts' },
];
</script>

<style scoped>
/* Puedes agregar estilos extra si quieres */
</style>
