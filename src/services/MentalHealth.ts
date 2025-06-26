import { genericRequest } from "../api/GenericRequest";
import type { MentalHealthPrediction } from "../types/MentalHealthPrediction";

class MentalHealthService {
  async getPrediction(hours: number): Promise<MentalHealthPrediction> {
    try {
      return await genericRequest.get<MentalHealthPrediction>(
        `/predict/mental_health?avg_daily_usage=${hours}`
      );
    } catch (error) {
      console.error('Error getting prediction:', error);
      throw error;
    }
  }

  async getPlot(): Promise<string> {
    try {
      const blob = await genericRequest.get<Blob>('/predict/mental_health/plot', {
        responseType: 'blob'
      });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error getting plot:', error);
      throw error;
    }
  }
}

export const mentalHealthService = new MentalHealthService();