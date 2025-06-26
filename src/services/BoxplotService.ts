import { genericRequest } from "../api/GenericRequest";
import type { BoxplotColumn, BoxplotSummary, BoxplotRequest } from "../types/BoxplotTypes";

class BoxplotService {
  /**
   * Obtiene las columnas disponibles para el boxplot
   * @returns Lista de columnas con sus tipos
   */
  async getAvailableColumns(): Promise<BoxplotColumn[]> {
    try {
      const response = await genericRequest.get<{ columnas: BoxplotColumn[] }>('/predict/csv-heads');
      return response.columnas.filter(
        col => col.tipo.toLowerCase().includes("int") && 
               col.columna.toLowerCase() !== "student_id"
      );
    } catch (error) {
      console.error('Error al obtener las columnas:', error);
      throw error;
    }
  }

  /**
   * Obtiene el resumen estadístico
   * @param payload Datos para generar el boxplot
   * @returns Resumen estadístico
   */
  async getSummaryStatistics(payload: BoxplotRequest): Promise<BoxplotSummary> {
    try {
      return await genericRequest.post<BoxplotSummary>('/boxplot/summary_statistics', payload);
    } catch (error) {
      console.error('Error al obtener el resumen:', error);
      throw error;
    }
  }

  /**
   * Genera la gráfica de boxplot
   * @param payload Datos para generar el boxplot
   * @returns URL de la imagen generada
   */
  async generateBoxplot(payload: BoxplotRequest): Promise<string> {
    try {
      const blob = await genericRequest.post<Blob>('/boxplot/sleep_vs_screen', payload, {
        responseType: 'blob'
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error al generar la gráfica:', error);
      throw error;
    }
  }
}

export const boxplotService = new BoxplotService();