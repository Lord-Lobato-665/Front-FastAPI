<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full ">
      <!-- Tarjeta principal -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header con gradiente profesional -->
        <div
          class="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 p-6 text-white relative overflow-hidden">
          <div class="absolute inset-0 opacity-10"
            style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSg0NSkiPjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')">
          </div>
          <div class="relative z-10 flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold tracking-tight">Perfil de Usuario</h1>
              <p class="text-blue-100 opacity-90 mt-1">Complete su información para análisis personalizado</p>
            </div>
            <button v-if="hasProfile" @click="logout"
              class="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white backdrop-blur-sm transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>

        <!-- Contenido del formulario -->
        <div class="p-6 md:p-8">
          <form @submit.prevent="submitForm" class="space-y-8" v-if="!hasProfile">
            <!-- Sección 1: Datos básicos -->
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="h-10 w-1 bg-blue-600 rounded-r mr-3"></div>
                <h3 class="text-xl font-semibold text-gray-800">Información Personal</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Campo Edad -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Edad</label>
                  <div class="relative">
                    <input type="number" v-model.number="formData.Age" min="1" max="100"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required placeholder="Ej: 28 años">
                  </div>
                </div>

                <!-- Campo Horas redes -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Horas diarias en redes</label>
                  <div class="relative">
                    <input type="number" v-model.number="formData.Avg_Daily_Usage_Hours" step="0.1" min="0" max="24"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required placeholder="Ej: 3.5 horas">
                  </div>
                </div>

                <!-- Campo Horas sueño -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Horas de sueño</label>
                  <div class="relative">
                    <input type="number" v-model.number="formData.Sleep_Hours_Per_Night" step="0.1" min="0" max="24"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required placeholder="Ej: 7.5 horas">
                  </div>
                </div>

                <!-- Campo Conflictos -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Conflictos por redes</label>
                  <div class="relative">
                    <input type="number" v-model.number="formData.Conflicts_Over_Social_Media" min="0" max="10"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required placeholder="0-10 por semana">
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección 2: Nivel académico -->
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="h-10 w-1 bg-blue-600 rounded-r mr-3"></div>
                <h3 class="text-xl font-semibold text-gray-800">Nivel Académico</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" v-model="formData.Academic_Level_High_School" :value="true"
                    @change="handleAcademicLevelChange('High_School')"
                    class="h-5 w-5 text-blue-600 focus:ring-blue-500">
                  <div class="ml-3">
                    <span class="block font-medium text-gray-900">Preparatoria</span>
                    <span class="block text-sm text-gray-500">Bachillerato</span>
                  </div>
                </label>

                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" v-model="formData.Academic_Level_Undergraduate" :value="true"
                    @change="handleAcademicLevelChange('Undergraduate')"
                    class="h-5 w-5 text-blue-600 focus:ring-blue-500">
                  <div class="ml-3">
                    <span class="block font-medium text-gray-900">Licenciatura</span>
                    <span class="block text-sm text-gray-500">Universitario</span>
                  </div>
                </label>

                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" v-model="formData.Academic_Level_Graduate" :value="true"
                    @change="handleAcademicLevelChange('Graduate')" class="h-5 w-5 text-blue-600 focus:ring-blue-500">
                  <div class="ml-3">
                    <span class="block font-medium text-gray-900">Posgrado</span>
                    <span class="block text-sm text-gray-500">Maestría/Doctorado</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Sección 3: Plataforma favorita -->
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="h-10 w-1 bg-blue-600 rounded-r mr-3"></div>
                <h3 class="text-xl font-semibold text-gray-800">Plataforma más usada</h3>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <label v-for="platform in platforms" :key="platform.value"
                  class="relative flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" v-model="formData[`Most_Used_Platform_${platform.value}`]" :value="true"
                    @change="handlePlatformChange(platform.value)" class="absolute opacity-0 h-0 w-0">
                  <div class="h-8 w-8 mb-2" v-html="platform.icon"></div>
                  <span class="text-sm font-medium text-gray-700 text-center">{{ platform.label }}</span>
                </label>
              </div>
            </div>

            <!-- Sección 4: Género -->
            <div class="space-y-6">
              <div class="flex items-center">
                <div class="h-10 w-1 bg-blue-600 rounded-r mr-3"></div>
                <h3 class="text-xl font-semibold text-gray-800">Género</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" v-model="formData.Gender_Male" :value="true" @change="handleGenderChange('Male')"
                    class="h-5 w-5 text-blue-600 focus:ring-blue-500">
                  <div class="ml-3">
                    <span class="block font-medium text-gray-900">Masculino</span>
                    <span class="block text-sm text-gray-500">Hombre</span>
                  </div>
                </label>

                <label
                  class="flex items-center p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 cursor-pointer transition-all has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50">
                  <input type="radio" v-model="formData.Gender_Female" :value="true"
                    @change="handleGenderChange('Female')" class="h-5 w-5 text-blue-600 focus:ring-blue-500">
                  <div class="ml-3">
                    <span class="block font-medium text-gray-900">Femenino</span>
                    <span class="block text-sm text-gray-500">Mujer</span>
                  </div>
                </label>
              </div>
            </div>

            <!-- Botón de enviar -->
            <button type="submit"
              class="cursor-pointer w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              :disabled="isSubmitting" :class="{ 'opacity-70 cursor-not-allowed': isSubmitting }">
              <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ isSubmitting ? 'Procesando...' : 'Guardar Perfil' }}</span>
            </button>
          </form>

          <!-- Vista de resumen -->
          <div v-if="hasProfile" class="space-y-8">
            <div class="bg-gray-50 border border-gray-100 rounded-xl">
              <div class="flex items-center mb-6">
                <div class="h-10 w-1 bg-blue-600 rounded-r mr-3"></div>
                <h3 class="text-xl font-semibold text-gray-800">Resumen de tu perfil</h3>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Datos básicos -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                  <h4 class="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <span class="inline-flex items-center justify-center rounded-full bg-blue-100 p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.5" fill="white" />
                        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                          d="M4.5 19c1.5-3 5.5-5 7.5-5s6 2 7.5 5" fill="none" />
                      </svg>
                    </span>
                    Información Personal
                  </h4>
                  <ul class="space-y-3">
                    <li class="flex justify-between py-3 border-b border-gray-100">
                      <span class="text-gray-600">Edad</span>
                      <span class="font-medium text-gray-900">{{ userData?.Age }} años</span>
                    </li>
                    <li class="flex justify-between py-3 border-b border-gray-100">
                      <span class="text-gray-600">Horas en redes</span>
                      <span class="font-medium text-gray-900">{{ userData?.Avg_Daily_Usage_Hours }} hrs/día</span>
                    </li>
                    <li class="flex justify-between py-3 border-b border-gray-100">
                      <span class="text-gray-600">Horas de sueño</span>
                      <span class="font-medium text-gray-900">{{ userData?.Sleep_Hours_Per_Night }} hrs/noche</span>
                    </li>
                    <li class="flex justify-between py-3">
                      <span class="text-gray-600">Conflictos</span>
                      <span class="font-medium text-gray-900">{{ userData?.Conflicts_Over_Social_Media }} por
                        semana</span>
                    </li>
                  </ul>
                </div>

                <!-- Resultados -->
                <div class="bg-white p-6 rounded-xl shadow-sm">
                  <h4 class="font-semibold text-lg text-gray-800 mb-4 flex items-center gap-2">
                    <span class="inline-flex items-center justify-center rounded-full bg-blue-100 p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </span>
                    Resultados de Análisis
                  </h4>
                  <ul class="space-y-4">
                    <li>
                      <div class="flex justify-between items-center mb-1">
                        <span class="text-gray-600">Salud mental</span>
                        <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                          {{ userData?.Mental_Health_Interpretation }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all" :style="{
                          width: `${(userData?.Mental_Health_Score / 10) * 100}%`,
                          background: getBarGradient(userData?.Mental_Health_Score)
                        }"></div>
                      </div>
                    </li>

                    <li>
                      <div class="flex justify-between items-center mb-1">
                        <span class="text-gray-600">Nivel de adicción</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full" :class="{
                          'bg-green-100 text-green-800': userData?.Addiction_Level === 'Bajo',
                          'bg-yellow-100 text-yellow-800': userData?.Addiction_Level === 'Moderado',
                          'bg-red-100 text-red-800': userData?.Addiction_Level === 'Alto'
                        }">
                          {{ userData?.Addiction_Level }}
                        </span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all" :style="{
                          width: `${(userData?.Addiction_Score / 10) * 100}%`,
                          background: getBarGradient(userData?.Addiction_Score)
                        }"></div>
                      </div>
                    </li>

                    <li class="pt-2">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Afecta rendimiento</span>
                        <span class="px-2 py-1 text-xs font-medium rounded-full" :class="{
                          'bg-green-100 text-green-800': !userData?.Affects_Academic_Performance,
                          'bg-red-100 text-red-800': userData?.Affects_Academic_Performance
                        }">
                          {{ userData?.Affects_Academic_Performance ? 'Sí' : 'No' }}
                        </span>
                      </div>
                      <div class="mt-1 text-sm text-gray-600">
                        Probabilidad: <span class="font-medium">{{ (userData?.Academic_Performance_Probability *
                          100).toFixed(0) }}%</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <button @click="editProfile"
                class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useProfileStore } from '../stores/profileStore';
import type { FormInputUser } from '../types/userProfile';

const profileStore = useProfileStore();
const isSubmitting = ref(false);
const formData = ref<FormInputUser>({
  Age: undefined,
  Avg_Daily_Usage_Hours: undefined,
  Sleep_Hours_Per_Night: undefined,
  Conflicts_Over_Social_Media: undefined,
});

function getBarGradient(score?: number) {
  if (score === undefined) return 'linear-gradient(to right, #e5e7eb, #e5e7eb)';
  if (score < 3) return 'linear-gradient(to right, #22c55e, #bef264)';
  if (score < 6) return 'linear-gradient(to right, #fde047, #fbbf24)';
  if (score < 8) return 'linear-gradient(to right, #fb923c, #f87171)';
  return 'linear-gradient(to right, #16a34a, #4ade80)';
}

const platforms = [
  {
    value: 'Instagram',
    label: 'Instagram',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-pink-500">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
    `,
  },
  {
    value: 'Facebook',
    label: 'Facebook',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-blue-600">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
    `,
  },
  {
    value: 'TikTok',
    label: 'TikTok',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-gray-800">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
    `,
  },
  {
    value: 'WhatsApp',
    label: 'WhatsApp',
    icon: `
    <svg viewBox="0 0 32 32" class="w-full h-full text-green-500" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M16.005 2.667c-7.364 0-13.338 5.974-13.338 13.338 0 2.352.621 4.65 1.797 6.667L2.667 29.333l6.805-1.797c1.933 1.13 4.117 1.732 6.533 1.732 7.364 0 13.333-5.969 13.333-13.333S23.369 2.667 16.005 2.667Zm0 24c-1.938 0-3.83-.528-5.467-1.528l-.391-.234-4.008 1.063 1.063-3.984-.257-.406a10.578 10.578 0 0 1-1.617-5.546c0-5.84 4.761-10.6 10.6-10.6s10.6 4.761 10.6 10.6-4.761 10.6-10.6 10.6Zm5.406-7.873c-.297-.148-1.75-.867-2.023-.967s-.469-.148-.664.148-.762.967-.933 1.166c-.171.195-.336.222-.633.074s-1.238-.457-2.355-1.457c-.87-.777-1.457-1.735-1.63-2.027-.172-.296-.018-.457.13-.605.133-.133.297-.336.445-.504.148-.171.196-.296.297-.495.099-.198.05-.371-.025-.52-.074-.148-.664-1.6-.91-2.192-.24-.576-.481-.498-.664-.508l-.566-.01c-.197 0-.519.074-.79.37s-1.036 1.012-1.036 2.467 1.06 2.857 1.209 3.054c.148.198 2.093 3.195 5.074 4.48.709.305 1.263.487 1.694.623.712.227 1.36.195 1.872.118.571-.085 1.75-.715 1.997-1.406.247-.69.247-1.28.173-1.406-.074-.124-.271-.198-.57-.347Z"/>
    </svg>
  `,
  },
  {
    value: 'YouTube',
    label: 'YouTube',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-red-600">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
    `,
  },
  {
    value: 'LinkedIn',
    label: 'LinkedIn',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1-4.96 0 2.5 2.5 0 0 1 4.96 0ZM.5 8.5h4.96v14H.5v-14ZM8.5 8.5H13v2h.06c.63-1.2 2.18-2.46 4.44-2.46 4.75 0 5.63 3.13 5.63 7.2V22.5h-4.96v-6.5c0-1.55 0-3.53-2.15-3.53s-2.49 1.68-2.49 3.42v6.61H8.5v-14Z"/>
    </svg>
  `,
  },
  {
    value: 'Twitter',
    label: 'Twitter',
    icon: `
      <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-sky-500">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
    `,
  },
  {
    value: 'Snapchat',
    label: 'Snapchat',
    icon: `
    <svg viewBox="0 0 256 256" class="w-full h-full text-[#FFFC00]" fill="currentColor">
      <path d="M243,194.5c-7.2,6.7-17.5,7.4-26.6,8-5.7.4-11.7.8-15.2,2.7s-6.8,6.7-10.2,11.3c-5.4,7.4-11.5,15.8-21.2,18.3s-18.6-1.9-26.8-5.7c-5.3-2.5-10.8-5.1-15-5.1s-9.7,2.6-15,5.1-13.7,6.4-21.2,6.4a27.7,27.7,0,0,1-5.6-.7c-9.7-2.5-15.8-10.9-21.2-18.3-3.4-4.6-6.8-9.4-10.2-11.3s-9.5-2.3-15.2-2.7c-9.1-.6-19.4-1.3-26.6-8a8,8,0,0,1,2.1-13.1c.3-.1,12.5-6,24.5-21.3a105.5,105.5,0,0,0,17.3-32.7l-19.9-8a8,8,0,1,1,6-14.8l18,7.2A160.5,160.5,0,0,0,64,80a64,64,0,0,1,128,0,160.5,160.5,0,0,0,3,31.8l18-7.2a8,8,0,0,1,6,14.8l-19.9,8a105.5,105.5,0,0,0,17.3,32.7c12.1,15.3,24.3,21.3,24.5,21.3a8,8,0,0,1,2.1,13.1Z"/>
    </svg>
  `,
  },
  {
    value: 'KakaoTalk',
    label: 'KakaoTalk',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-[#FEE500]" fill="currentColor">
      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.07l-2.517 3.784 5.337-3.067c1.146.214 2.34.328 3.571.328 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z"/>
    </svg>
  `,
  },
  {
    value: 'LINE',
    label: 'LINE',
    icon: `
  <svg viewBox="0 0 24 24" class="w-full h-full text-[#00C300]" fill="currentColor">
      <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.522 4.82 3.889 6.07l-2.517 3.784 5.337-3.067c1.146.214 2.34.328 3.571.328 4.97 0 9-3.186 9-7.115C21 6.185 16.97 3 12 3z"/>
    </svg>
  `,
  },
  {
    value: 'VKontakte',
    label: 'VKontakte',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-[#0077FF]" fill="currentColor">
      <path d="M12.7 17.3c.4.4.7.7 1.1.7.4 0 .6-.2.6-.5 0-.2-.1-.4-.3-.7-.5-.6-1.1-1.2-1.6-1.8-.3-.4-.6-.8-.9-1.2-.1-.2-.2-.4-.1-.6.1-.2.3-.3.5-.3h1.6c.3 0 .5-.2.5-.5v-.4c0-1.3-.4-2.2-1.2-2.6-.6-.3-1.3-.4-2.1-.4h-.1c-.3 0-.5.2-.5.5v3.1c0 .3-.2.5-.5.5h-.4c-.3 0-.5-.2-.5-.5V8.5c0-.3-.2-.5-.5-.5h-.4c-.3 0-.5.2-.5.5v3.1c0 .3-.2.5-.5.5h-.4c-.3 0-.5-.2-.5-.5V8.5c0-.3-.2-.5-.5-.5h-.4c-.3 0-.5.2-.5.5v4.8c0 .8.3 1.6.9 2.1l2.2 2.4c.3.3.6.6 1 .6.4 0 .7-.3.7-.6v-.4c0-.2-.1-.4-.3-.6l-1.8-2.1c-.4-.5-.7-.9-.7-1.5 0-.3.2-.5.5-.5h1.1c.3 0 .5.2.5.5 0 .2 0 .3.1.4.3.5.6.9 1 1.4zM12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  `,
  },
  {
    value: 'WeChat',
    label: 'WeChat',
    icon: `
    <svg viewBox="0 0 24 24" class="w-full h-full text-[#09B83E]" fill="currentColor">
      <path d="M8.9 12.3c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6.2 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
      <path d="M12 2C6.5 2 2 6.5 2 12c0 2.4.8 4.6 2.3 6.4L2 22l5.3-1.4c1.6.9 3.5 1.4 5.4 1.4 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.4-4.8-1.2l-.4-.2-3.5.9.9-3.4-.2-.4C3.4 14.3 3 12.7 3 11c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/>
    </svg>
  `,
  }]

// Cargar datos al montar el componente
onMounted(() => {
  profileStore.loadFromStorage();
});

const hasProfile = computed(() => profileStore.userData !== null);
const userData = computed(() => profileStore.userData);

const handleAcademicLevelChange = (level: string) => {
  // Resetear todos los valores de nivel académico
  formData.value.Academic_Level_Graduate = false;
  formData.value.Academic_Level_High_School = false;
  formData.value.Academic_Level_Undergraduate = false;

  // Establecer el valor seleccionado
  formData.value[`Academic_Level_${level}` as keyof FormInputUser] = true;
};

const handlePlatformChange = (platform: string) => {
  // Resetear todas las plataformas
  const platformKeys = Object.keys(formData.value).filter(key =>
    key.startsWith('Most_Used_Platform_')
  );
  platformKeys.forEach(key => {
    formData.value[key as keyof FormInputUser] = false;
  });

  // Establecer la plataforma seleccionada
  formData.value[`Most_Used_Platform_${platform}` as keyof FormInputUser] = true;
};

const handleGenderChange = (gender: string) => {
  // Resetear ambos géneros
  formData.value.Gender_Female = false;
  formData.value.Gender_Male = false;

  // Establecer el género seleccionado
  formData.value[`Gender_${gender}` as keyof FormInputUser] = true;
};

const submitForm = async () => {
  isSubmitting.value = true;
  try {
    const success = await profileStore.submitForm(formData.value);
    if (success) {
      // Resetear el formulario
      formData.value = {
        Age: undefined,
        Avg_Daily_Usage_Hours: undefined,
        Sleep_Hours_Per_Night: undefined,
        Conflicts_Over_Social_Media: undefined,
        Academic_Level_High_School: false,
        Academic_Level_Undergraduate: false,
        Academic_Level_Graduate: false,
        Most_Used_Platform_Instagram: false,
        Most_Used_Platform_Facebook: false,
        Most_Used_Platform_Twitter: false,
        Most_Used_Platform_TikTok: false,
        Most_Used_Platform_KakaoTalk: false,
        Most_Used_Platform_Snapchat: false,
        Most_Used_Platform_LINE: false,
        Most_Used_Platform_VKontakte: false,
        Most_Used_Platform_LinkedIn: false,
        Most_Used_Platform_WeChat: false,
        Most_Used_Platform_WhatsApp: false,
        Most_Used_Platform_YouTube: false,
        Relationship_Status_Complicated: false,
        Relationship_Status_In_Relationship: false,
        Relationship_Status_Single: false,
        Gender_Female: false,
        Gender_Male: false,
      };
    }
  } finally {
    isSubmitting.value = false;
  }
};

const editProfile = () => {
  if (profileStore.userData) {
    formData.value = { ...profileStore.userData };
    profileStore.logout();
  }
};

const logout = () => {
  profileStore.logout();
};
</script>

<style scoped>
/* Efectos de hover y focus mejorados */
input:focus,
button:focus {
  outline: none;
  transition: all 0.2s ease;
}

/* Efecto de elevación al hover */
button:hover {
  transform: translateY(-1px);
}

/* Transiciones suaves para todos los elementos interactivos */
button,
label,
input {
  transition: all 0.2s ease;
}

/* Animación para el botón de carga */
@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.02);
  }
}

button[type="submit"]:not(:disabled):hover {
  animation: pulse 1.5s infinite;
}
</style>