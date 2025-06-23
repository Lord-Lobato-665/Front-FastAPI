<template>
  <div class="min-h-screen bg-gray-100 p-6">
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
                  {{ header }}
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
import { ref, computed } from 'vue';
import Header from '../components/Header.vue';
import Paginator from '../components/Paginator.vue';

const headers = ref<string[]>([]);
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const rowsPerPage = 7;
const uploadMessage = ref('');
const uploadSuccess = ref(false);

const totalPages = computed(() => {
  return Math.ceil(tableData.value.length / rowsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  return tableData.value.slice(start, start + rowsPerPage);
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

    await readCSV(file);

  } catch (error) {
    uploadMessage.value = error instanceof Error ? error.message : 'Error desconocido al subir el archivo';
    uploadSuccess.value = false;
    console.error('Error:', error);
  }
};

const readCSV = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n');
        
        if (lines.length === 0) {
          throw new Error('El archivo CSV está vacío');
        }

        headers.value = lines[0].split(',').map(h => h.trim());
        
        tableData.value = lines.slice(1).filter(line => line.trim()).map(line => {
          const values = line.split(',');
          const row: any = {};
          headers.value.forEach((header, index) => {
            row[header] = values[index]?.trim() || '';
          });
          return row;
        });

        currentPage.value = 1;
        resolve();
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    reader.readAsText(file);
  });
};
</script>