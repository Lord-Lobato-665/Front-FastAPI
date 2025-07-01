<template>
  <div class="h-screen bg-gray-50 p-4">
    <div class="max-w-7xl mx-auto">
      <Header />

      <div class="bg-white shadow-sm rounded-xl p-6 mt-6 border border-gray-100">
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Subir archivo CSV</label>
          <div class="flex space-x-2">
            <input
              type="file"
              accept=".csv"
              @change="handleFileUpload"
              class="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
            />
          </div>
          <p v-if="uploadMessage" class="mt-2 text-sm" :class="uploadSuccess ? 'text-green-600' : 'text-red-600'">
            {{ uploadMessage }}
          </p>
        </div>

        <div v-if="paginatedData.length">
          <div class="relative overflow-hidden border border-gray-200 rounded-lg">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-blue-900">
                  <tr>
                    <th
                      v-for="header in headers"
                      :key="header"
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                    >
                      {{ columnTranslations[header] ?? header }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(row, index) in paginatedData"
                    :key="index"
                    class="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td
                      v-for="header in headers"
                      :key="header"
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ row[header] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between">
            <Paginator
              :current-page="currentPage"
              :total-pages="totalPages"
              @update:page="(val) => currentPage = val"
            />
          </div>
        </div>

        <div v-else class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">No hay datos disponibles</h3>
          <p class="mt-1 text-sm text-gray-500">Sube un archivo CSV para comenzar.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import Header from '../components/Header.vue';
import Paginator from '../components/Paginator.vue';

const headers = ref<string[]>([]);
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const rowsPerPage = 10;
const uploadMessage = ref('');
const uploadSuccess = ref(false);
const isLoading = ref(false);

const totalPages = computed(() => {
  return Math.ceil(tableData.value.length / rowsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  return tableData.value.slice(start, start + rowsPerPage);
});

const columnTranslations: Record<string, string> = {
  Student_ID: "ID del Estudiante",
  Age: "Edad",
  Country: "País",
  Avg_Daily_Usage_Hours: "Horas de uso diario",
  Sleep_Hours_Per_Night: "Horas de sueño por noche",
  Conflicts_Over_Social_Media: "Conflictos por redes sociales",

  Academic_Level_Graduate: "Nivel académico: Graduado",
  Academic_Level_High_School: "Nivel académico: Secundaria",
  Academic_Level_Undergraduate: "Nivel académico: Pregrado",

  Most_Used_Platform_Facebook: "Plataforma más usada: Facebook",
  Most_Used_Platform_Instagram: "Plataforma más usada: Instagram",
  Most_Used_Platform_KakaoTalk: "Plataforma más usada: KakaoTalk",
  Most_Used_Platform_LINE: "Plataforma más usada: LINE",
  Most_Used_Platform_LinkedIn: "Plataforma más usada: LinkedIn",
  Most_Used_Platform_Snapchat: "Plataforma más usada: Snapchat",
  Most_Used_Platform_TikTok: "Plataforma más usada: TikTok",
  Most_Used_Platform_Twitter: "Plataforma más usada: Twitter",
  Most_Used_Platform_VKontakte: "Plataforma más usada: VKontakte",
  Most_Used_Platform_WeChat: "Plataforma más usada: WeChat",
  Most_Used_Platform_WhatsApp: "Plataforma más usada: WhatsApp",
  Most_Used_Platform_YouTube: "Plataforma más usada: YouTube",

  Relationship_Status_Complicated: "Estado sentimental: Complicado",
  Relationship_Status_In_Relationship: "Estado sentimental: En pareja",
  Relationship_Status_Single: "Estado sentimental: Soltero",

  Gender_Female: "Género: Femenino",
  Gender_Male: "Género: Masculino",

  Mental_Health_Score: "Puntaje de salud mental",
  Addicted_Score: "Puntaje de adicción",
  Affects_Academic_Performance: "Afecta el rendimiento académico"
};

const loadCSVData = async () => {
  isLoading.value = true;
  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/read/csv');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Error al cargar el CSV');
    }

    const data = await response.json();
    
    if (data.length > 0) {
      headers.value = Object.keys(data[0]);
      tableData.value = data;
      uploadMessage.value = '';
    } else {
      uploadMessage.value = 'El CSV está vacío';
    }
  } catch (error) {
    uploadMessage.value = error instanceof Error ? error.message : 'Error desconocido';
    uploadSuccess.value = false;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadCSVData();
});

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    uploadMessage.value = 'Solo se permiten archivos .csv';
    uploadSuccess.value = false;
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://127.0.0.1:8000/api/v1/upload/csv', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Error al subir el archivo');
    }

    const result = await response.json();
    uploadMessage.value = result.message;
    uploadSuccess.value = true;

    await loadCSVData();

  } catch (error) {
    uploadMessage.value = error instanceof Error ? error.message : 'Error desconocido al subir el archivo';
    uploadSuccess.value = false;
    console.error('Error:', error);
  }
};
</script>