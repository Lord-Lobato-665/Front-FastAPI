import { createRouter, createWebHistory } from 'vue-router';
import DataView from '../views/DataView.vue';
import DataCleaning from '../views/DataCleaning.vue';
import LinearRegression from '../views/LinearRegression.vue';
import LogisticRegression from '../views/LogisticRegression.vue';
import Trees from '../views/Trees.vue';
import AdvancedCharts from '../views/AdvancedCharts.vue';
import Boxplot from '../views/Boxplot.vue';
import Kmeans from '../views/KmeansView.vue';
import MentalHealth from '../views/MentalHealth.vue';

const routes = [
  { path: '/', name: 'DataView', component: DataView },
  { path: '/cleaning', name: 'DataCleaning', component: DataCleaning },
  { path: '/linear-regression', name: 'LinearRegression', component: LinearRegression },
  { path: '/logistic-regression', name: 'LogisticRegression', component: LogisticRegression },
  { path: '/trees', name: 'Trees', component: Trees },
  { path: '/advanced-charts', name: 'AdvancedCharts', component: AdvancedCharts },
  { path: '/kmeans', name: 'Kmeans', component: Kmeans },
  { path: '/mental-health', name: 'MentalHealth', component: MentalHealth },
  { path: '/boxplot', name: 'Boxplot', component: Boxplot },
  { path: '/kmeans', name: 'Kmeans', component: Kmeans }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
