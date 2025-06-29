import { createRouter, createWebHistory } from 'vue-router';
import DataView from '../views/DataView.vue';
import DataCleaning from '../views/DataCleaning.vue';
import LinearRegression from '../views/LinearRegression.vue';
import SocialMedia from '../views/SocialMediaAnalysis.vue';
import LogisticRegression from '../views/LogisticRegression.vue';
import Trees from '../views/Trees.vue';
import Boxplot from '../views/Boxplot.vue';
import Kmeans from '../views/KmeansView.vue';
import MentalHealth from '../views/MentalHealth.vue';
import Profile from '../views/Profile.vue';

const routes = [
  { path: '/', name: 'DataView', component: DataView },
  { path: '/cleaning', name: 'DataCleaning', component: DataCleaning },
  { path: '/linear-regression', name: 'LinearRegression', component: LinearRegression },
  { path: '/social-media', name: 'SocialMedia', component: SocialMedia },
  { path: '/logistic-regression', name: 'LogisticRegression', component: LogisticRegression },
  { path: '/trees', name: 'Trees', component: Trees },
  { path: '/kmeans', name: 'Kmeans', component: Kmeans },
  { path: '/mental-health', name: 'MentalHealth', component: MentalHealth },
  { path: '/boxplot', name: 'Boxplot', component: Boxplot },
  { path: '/kmeans', name: 'Kmeans', component: Kmeans },
  { path: '/profile', name: 'Profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
