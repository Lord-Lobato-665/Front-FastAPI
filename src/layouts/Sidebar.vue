<template>
  <aside :class="[
    'fixed top-0 left-0 z-40 h-screen pt-15 transition-all duration-300 ease-in-out',
    'bg-gradient-to-b from-blue-800 to-blue-900 shadow-xl',
    collapsed ? 'w-20' : 'w-64',
    mobileOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
  ]">
    <div class="h-full px-3 pb-4 overflow-y-auto">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.name">
          <router-link 
            :to="item.path" 
            :class="[
              'flex items-center p-3 rounded-lg transition-all duration-200',
              'text-blue-100 hover:bg-blue-700 hover:text-white',
              'group relative overflow-hidden',
              collapsed ? 'justify-center' : ''
            ]"
            active-class="!bg-blue-600 !text-white font-medium shadow-md"
            exact
          >
            <!-- Icono con efecto -->
            <div :class="[
              'p-2 rounded-lg transition-all',
              'group-hover:bg-white/10',
              collapsed ? 'mr-0' : 'mr-3'
            ]">
              <component 
                :is="item.icon" 
                :class="[
                  'w-5 h-5 transition-transform',
                  'group-hover:scale-110',
                  collapsed ? 'mx-auto' : ''
                ]" 
              />
            </div>
            
            <!-- Texto del menú -->
            <span v-if="!collapsed" class="flex-1 whitespace-nowrap">
              {{ item.label }}
            </span>
            
            <!-- Efecto de onda al hacer clic -->
            <span class="absolute inset-0 overflow-hidden">
              <span class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
              <span class="absolute inset-0 ripple-effect"></span>
            </span>
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Botón para colapsar -->
    <button 
      @click="$emit('toggle-collapse')"
      :class="[
        'absolute bottom-4 left-1/2 -translate-x-1/2 p-2 rounded-full cursor-pointer',
        'bg-white/20 hover:bg-white/30 transition-colors duration-200',
        'shadow-md hover:shadow-lg',
        'flex items-center justify-center'
      ]"
      aria-label="Toggle sidebar"
    >
      <svg 
        :class="[
          'w-5 h-5 text-white transition-transform duration-300',
          collapsed ? 'rotate-180' : ''
        ]" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  </aside>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
import { 
  LayoutDashboard, 
  LineChart, 
  Activity, 
  BarChart3, 
  AlignHorizontalJustifyCenter, 
  HeartPulse, 
  Group 
} from 'lucide-vue-next';

defineProps<{
  collapsed: boolean;
  mobileOpen: boolean;
}>();

const menuItems = [
  { name: 'DataView', label: 'Vista Principal', path: '/', icon: LayoutDashboard },
  { name: 'MentalHealth', label: 'Salud Mental', path: '/mental-health', icon: HeartPulse },
  { name: 'LinearRegression', label: 'Regresión Lineal', path: '/linear-regression', icon: LineChart },
  { name: 'SocialMedia', label: 'Analisis de Redes Sociales', path: '/social-media', icon: LineChart },
  { name: 'LogisticRegression', label: 'Regresión Logística', path: '/logistic-regression', icon: Activity },
  { name: 'Kmeans', label: 'Análisis de Grupos', path: '/kmeans', icon: Group },
  //{ name: 'AdvancedCharts', label: 'Gráficos Avanzados', path: '/advanced-charts', icon: BarChart3 },
  { name: 'Boxplot', label: 'Análisis Boxplot', path: '/boxplot', icon: AlignHorizontalJustifyCenter },
];

defineEmits(['toggle-collapse']);
</script>

<style scoped>
.ripple-effect {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: ripple 0.6s linear;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Scrollbar personalizada */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>