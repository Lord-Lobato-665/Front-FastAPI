import { genericRequest } from '../api/GenericRequest';

class HistogramasService {
  async getUsageHoursHistogram(user_value: number, bins: number): Promise<any> {
    return await genericRequest.get('/histogram/usage-hours', {
      params: {
        user_value,
        bins,
        color: 'coral',
        edgecolor: 'black',
      },
    });
  }

  async getSleepAcademicHistogram(user_value: number, bins: number, academic_level: string): Promise<any> {
    return await genericRequest.get('/histogram/sleep-academic', {
      params: {
        user_value,
        bins,
        color_highschool: 'red',
        color_undergrad: 'yellow',
        color_grad: 'blue',
        academic_level: academic_level || '',
      },
    });
  }

  async getHistogramPlotImage(grafica_url: string): Promise<string> {
    const blob = await genericRequest.get<Blob>(grafica_url, {
      responseType: 'blob'
    });
    return URL.createObjectURL(blob);
  }
}

export const histogramasService = new HistogramasService();
