import { genericRequest } from "../api/GenericRequest";
import type { LinearMultiFeatureRequest, LinearMultiFeatureResponse } from "../types/LRegressionInterface";

class LinearRegressionService {
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
}

export const linearRegressionService = new LinearRegressionService();