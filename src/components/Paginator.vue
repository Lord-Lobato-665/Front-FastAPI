<template>
  <div class="flex items-center justify-between mt-6 text-sm text-gray-700">
    <button
      :disabled="currentPage === 1"
      @click="prevPage"
      class="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
    >
      Anterior
    </button>

    <span class="mx-4">
      Página {{ currentPage }} de {{ totalPages }}
    </span>

    <button
      :disabled="currentPage === totalPages"
      @click="nextPage"
      class="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
    >
      Siguiente
    </button>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  currentPage: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  (e: 'update:page', value: number): void;
}>();

const prevPage = () => {
  if (props.currentPage > 1) emit('update:page', props.currentPage - 1);
};

const nextPage = () => {
  if (props.currentPage < props.totalPages) emit('update:page', props.currentPage + 1);
};
</script>
