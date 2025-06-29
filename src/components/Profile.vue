<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Header -->
      <div class="bg-blue-600 p-6 text-white flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold">Perfil del Usuario</h2>
          <p class="text-blue-100 mt-1">Completa tus datos para análisis personalizado</p>
        </div>
        <button 
          v-if="hasProfile"
          @click="logout"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white"
        >
          Cerrar sesión
        </button>
      </div>

      <div class="p-6">
        <!-- Formulario -->
        <form @submit.prevent="submitForm" class="space-y-6" v-if="!hasProfile">
          <!-- Sección 1: Datos básicos -->
          <div class="border-b pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Datos Básicos</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Edad</label>
                <input
                  type="number"
                  v-model.number="formData.Age"
                  min="1"
                  max="100"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Horas diarias de uso de redes sociales</label>
                <input
                  type="number"
                  v-model.number="formData.Avg_Daily_Usage_Hours"
                  step="0.1"
                  min="0"
                  max="24"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Horas de sueño por noche</label>
                <input
                  type="number"
                  v-model.number="formData.Sleep_Hours_Per_Night"
                  step="0.1"
                  min="0"
                  max="24"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700">Conflictos por redes sociales</label>
                <input
                  type="number"
                  v-model.number="formData.Conflicts_Over_Social_Media"
                  min="0"
                  max="10"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Sección 2: Nivel académico (radio buttons) -->
          <div class="border-b pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Nivel Académico</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Academic_Level_High_School"
                  :value="true"
                  @change="handleAcademicLevelChange('High_School')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Preparatoria/Bachillerato</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Academic_Level_Undergraduate"
                  :value="true"
                  @change="handleAcademicLevelChange('Undergraduate')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Licenciatura/Universitario</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Academic_Level_Graduate"
                  :value="true"
                  @change="handleAcademicLevelChange('Graduate')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Posgrado</span>
              </label>
            </div>
          </div>

          <!-- Sección 3: Plataforma más usada -->
          <div class="border-b pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Plataforma más usada</h3>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_Instagram"
                  :value="true"
                  @change="handlePlatformChange('Instagram')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Instagram</span>
              </label>        
            </div>
             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_Facebook"
                  :value="true"
                  @change="handlePlatformChange('Facebook')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Facebook</span>
              </label>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_Twitter"
                  :value="true"
                  @change="handlePlatformChange('Twitter')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Twitter</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_TikTok"
                  :value="true"
                  @change="handlePlatformChange('TikTok')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Tiktok</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_KakaoTalk"
                  :value="true"
                  @change="handlePlatformChange('KakaoTalk')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>KakaoTalk</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_Snapchat"
                  :value="true"
                  @change="handlePlatformChange('Snapchat')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Snapchat</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_LINE"
                  :value="true"
                  @change="handlePlatformChange('LINE')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>LINE</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_VKontakte"
                  :value="true"
                  @change="handlePlatformChange('VKontakte')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>VKontakte</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_LinkedIn"
                  :value="true"
                  @change="handlePlatformChange('LinkedIn')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>LinkedIn</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_WeChat"
                  :value="true"
                  @change="handlePlatformChange('WeChat')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>WeChat</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_WhatsApp"
                  :value="true"
                  @change="handlePlatformChange('whatsApp')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>whatsApp</span>
              </label>
            </div>

             <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Most_Used_Platform_YouTube"
                  :value="true"
                  @change="handlePlatformChange('YouTube')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>YouTube</span>
              </label>
            </div>
          </div>

          <!-- Sección 4: Género -->
          <div class="border-b pb-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Género</h3>
            <div class="space-y-2">
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Gender_Male"
                  :value="true"
                  @change="handleGenderChange('Male')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Masculino</span>
              </label>
              <label class="flex items-center space-x-2">
                <input
                  type="radio"
                  v-model="formData.Gender_Female"
                  :value="true"
                  @change="handleGenderChange('Female')"
                  class="h-4 w-4 text-blue-600"
                />
                <span>Femenino</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting">Procesando...</span>
            <span v-else>Guardar Perfil</span>
          </button>
        </form>

        <!-- Vista de resumen -->
        <div v-if="hasProfile" class="space-y-6">
          <div class="bg-blue-50 p-6 rounded-lg">
            <h3 class="text-xl font-bold text-blue-800 mb-4">Resumen de tu perfil</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-700 mb-2">Datos básicos</h4>
                <ul class="space-y-1">
                  <li><span class="font-medium">Edad:</span> {{ userData?.Age }}</li>
                  <li><span class="font-medium">Horas diarias de uso de redes sociales:</span> {{ userData?.Avg_Daily_Usage_Hours }}</li>
                  <li><span class="font-medium">Horas de sueño:</span> {{ userData?.Sleep_Hours_Per_Night }}</li>
                  <li><span class="font-medium">Conflictos:</span> {{ userData?.Conflicts_Over_Social_Media }}</li>
                </ul>
              </div>

              <div>
                <h4 class="font-medium text-gray-700 mb-2">Resultados calculados</h4>
                <ul class="space-y-1">
                  <li>
                    <span class="font-medium">Salud mental:</span> 
                    {{ userData?.Mental_Health_Score }} ({{ userData?.Mental_Health_Interpretation }})
                  </li>
                  <li>
                    <span class="font-medium">Nivel de adicción:</span> 
                    {{ userData?.Addiction_Score }} ({{ userData?.Addiction_Level }})
                  </li>
                  <li>
                    <span class="font-medium">Afecta rendimiento académico:</span> 
                    {{ userData?.Affects_Academic_Performance ? 'Sí' : 'No' }} 
                    ({{ (userData?.Academic_Performance_Probability * 100).toFixed(0) }}% de probabilidad)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              @click="editProfile"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Editar Perfil
            </button>
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

</style>