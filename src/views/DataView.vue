<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="w-full px-4">
      <Header />

      <div class="bg-white shadow-md rounded-lg p-6">
        <input
          type="file"
          accept=".xlsx, .xls"
          @change="handleFileUpload"
          class="mb-4 p-2 border rounded w-full"
        />

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
import * as XLSX from 'xlsx';
import { ref, computed } from 'vue';
import Header from '../components/Header.vue';
import Paginator from '../components/Paginator.vue';

const headers = ref<string[]>([]);
const tableData = ref<any[]>([]);
const currentPage = ref(1);
const rowsPerPage = 7;

const totalPages = computed(() => {
  return Math.ceil(tableData.value.length / rowsPerPage);
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage;
  return tableData.value.slice(start, start + rowsPerPage);
});

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);

    tableData.value = json;
    headers.value = Object.keys(json[0] || {});
    currentPage.value = 1;
  };
  reader.readAsArrayBuffer(file);
};
</script>

