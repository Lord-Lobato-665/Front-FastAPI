<template>
  <aside :class="[
    'fixed top-0 left-0 z-40 h-screen pt-20 border-r sm:translate-x-0 transition-[width] duration-300 ease-in-out',
    collapsed ? 'w-20' : 'w-64',
    'bg-blue-900 border-gray-200',
    mobileOpen ? '' : 'sm:block hidden'
  ]">
    <div class="h-full px-3 pb-4 ">
      <ul class="space-y-2 font-medium">
        <li v-for="item in menuItems" :key="item.name">
          <router-link :to="item.path" class="flex items-center p-2 text-white rounded-lg hover:bg-blue-500  group"
            active-class="bg-blue-600 font-semibold" exact>
            <component :is="item.icon" class="w-5 h-5 text-white " />
            <span v-if="!collapsed" class="ms-3">{{ item.label }}</span>
          </router-link>
        </li>
      </ul>
    </div>
    <button @click="$emit('toggle-collapse')"
      class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-200 p-1 rounded-md hover:bg-blue-300 cursor-pointer transition-colors">
      <svg :class="collapsed ? 'rotate-180' : ''" class="w-4 h-4 text-gray-700  transition-transform" fill="none"
        stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { LayoutDashboard, Brush, LineChart, Activity, TreeDeciduous, BarChart3, AlignHorizontalJustifyCenter, HeartPulse } from 'lucide-vue-next';

defineProps<{
  collapsed: boolean;
  mobileOpen: boolean;
}>();

const menuItems = [
  { name: 'DataView', label: 'Vista Principal de los Datos', path: '/', icon: LayoutDashboard },
  { name: 'DataCleaning', label: 'Limpieza de Datos', path: '/cleaning', icon: Brush },
  { name: 'LinearRegression', label: 'Regresión Lineal', path: '/linear-regression', icon: LineChart },
  { name: 'LogisticRegression', label: 'Regresión Logística', path: '/logistic-regression', icon: Activity },
  { name: 'Kmeans', label: 'Grupos y Pertenencia', path: '/kmeans', icon: TreeDeciduous },
  { name: 'AdvancedCharts', label: 'Graficación Avanzada', path: '/advanced-charts', icon: BarChart3 },
  { name: 'MentalHealth', label: 'Salud Mental', path: '/mental-health', icon: HeartPulse },
  { name: 'Boxplot', label: 'Boxplot', path: '/boxplot', icon: AlignHorizontalJustifyCenter },

];
</script>
