import { genericRequest } from "../api/GenericRequest";
import type { LinearMultiFeatureRequest, LinearMultiFeatureResponse, SocialMediaAnalysisRequest } from "../types/LRegressionInterface";

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
  async socialMediaAnalysis(data: SocialMediaAnalysisRequest): Promise<any> {
    try {
      const query = new URLSearchParams({
        age_range: data.age_range,
        academic_level: data.academic_level,
        ...(data.country ? { country: data.country } : {})
      });
      return await genericRequest.get<any>(`/social-media/analysis?${query.toString()}`);
    } catch (error) {
      console.error('Error en análisis de redes sociales:', error);
      throw error;
    }
  }


  async getSocialMediaAnalysisPlot(): Promise<string> {
    try {
      const blob = await genericRequest.get<Blob>('/social-media/analysis/correlation-chart', {
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