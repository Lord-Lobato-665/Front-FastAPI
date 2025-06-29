<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="w-full px-4">
      <Header />

      <div class="bg-white shadow-md rounded-lg p-6">
        <input
          type="file"
          accept=".csv"
          @change="handleFileUpload"
          class="mb-4 p-2 border rounded w-full"
        />
        <p v-if="uploadMessage" class="mb-4" :class="uploadSuccess ? 'text-green-600' : 'text-red-600'">
          {{ uploadMessage }}
        </p>

        <div v-if="paginatedData.length" class="overflow-auto">
          <table class="min-w-[1200px] w-full border border-blue-300 mt-4 text-sm text-gray-800">
            <thead class="bg-blue-800 text-white">
              <tr>
                <th
                  v-for="header in headers"
                  :key="header"
                  class="text-left p-3 border-b border-blue-300 uppercase tracking-wide min-w-[150px]"
                >
                  {{ columnTranslations[header] ?? header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in paginatedData"
                :key="index"
                class="odd:bg-gray-100 even:bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <td
                  v-for="header in headers"
                  :key="header"
                  class="p-3 border-b border-blue-200"
                >
                  {{ row[header] }}
                </td>
              </tr>
            </tbody>
          </table>

          <Paginator
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:page="(val) => currentPage = val"
          />
        </div>

        <p v-else class="text-gray-500">No se ha cargado ningún archivo.</p>
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
const rowsPerPage = 7;
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

  // 🎯 NUEVAS columnas agregadas
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

    // ✅ CORRECTO: recarga desde el backend procesado
    await loadCSVData();

  } catch (error) {
    uploadMessage.value = error instanceof Error ? error.message : 'Error desconocido al subir el archivo';
    uploadSuccess.value = false;
    console.error('Error:', error);
  }
};
</script>
