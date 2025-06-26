// src/services/LinearRegressionService.ts
import { genericRequest } from "../api/GenericRequest";

import type {
  CsvColumnInfo,
  LinearMultiFeatureRequest,
  LinearMultiFeatureResponse,
  SocialMediaAnalysis
} from "../interface/LRegressionInterface";  

/**
 * Servicio para manejar las operaciones de regresión lineal
 */
class LinearRegressionService {
  /**
   * Obtiene las columnas disponibles en el CSV
   * @returns Lista de columnas con sus tipos de datos
   */
  async getCsvColumns(): Promise<CsvColumnInfo[]> {
    try {
      const response = await genericRequest.get<{ columnas: CsvColumnInfo[] }>('/predict/csv-heads');
      return response.columnas;
    } catch (error) {
      console.error('Error al obtener columnas CSV:', error);
      throw error;
    }
  }

  /**
   * Realiza una predicción con múltiples características
   * @param data Objeto con features y target
   * @returns Resultado de la predicción
   */
  async predictMultipleFeatures(data: LinearMultiFeatureRequest): Promise<LinearMultiFeatureResponse> {
    try {
      return await genericRequest.post<LinearMultiFeatureResponse>('/predict/linear-multiple', data);
    } catch (error) {
      console.error('Error en predicción múltiple:', error);
      throw error;
    }
  }

  /**
   * Obtiene la gráfica de la última predicción múltiple
   * @returns URL de la imagen generada
   */
  async getMultipleFeaturesPlot(): Promise<string> {
    try {
      const blob = await genericRequest.get<Blob>('/predict/linear-multiple/plot', {
        responseType: 'blob'
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error al obtener gráfica:', error);
      throw error;
    }
  }

  /**
   * Obtiene análisis de redes sociales con filtros
   * @param params Filtros para el análisis
   * @returns Datos del análisis
   */
  async getSocialMediaAnalysis(params: {
    age_range?: string;
    country?: string;
    academic_level?: string;
  }): Promise<SocialMediaAnalysis> {
    try {
      return await genericRequest.get<SocialMediaAnalysis>('/social-media/analysis', { params });
    } catch (error) {
      console.error('Error en análisis de redes:', error);
      throw error;
    }
  }

  /**
   * Obtiene el gráfico de correlación del análisis
   * @returns URL de la imagen generada
   */
  async getCorrelationChart(): Promise<string> {
    try {
      const blob = await genericRequest.get<Blob>('/social-media/analysis/correlation-chart', {
        responseType: 'blob'
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error al obtener gráfico de correlación:', error);
      throw error;
    }
  }
}

export const linearRegressionService = new LinearRegressionService();