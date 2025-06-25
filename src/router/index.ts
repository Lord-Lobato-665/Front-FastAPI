import { createRouter, createWebHistory } from 'vue-router';
import DataView from '../views/DataView.vue';
import DataCleaning from '../views/DataCleaning.vue';
import LinearRegression from '../views/LinearRegression.vue';
import LogisticRegression from '../views/LogisticRegression.vue';
import Trees from '../views/Trees.vue';
import AdvancedCharts from '../views/AdvancedCharts.vue';
import Boxplot from '../views/Boxplot.vue';

const routes = [
  { path: '/', name: 'DataView', component: DataView },
  { path: '/cleaning', name: 'DataCleaning', component: DataCleaning },
  { path: '/linear-regression', name: 'LinearRegression', component: LinearRegression },
  { path: '/logistic-regression', name: 'LogisticRegression', component: LogisticRegression },
  { path: '/trees', name: 'Trees', component: Trees },
  { path: '/advanced-charts', name: 'AdvancedCharts', component: AdvancedCharts },
  { path: '/boxplot', name: 'Boxplot', component: Boxplot },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
