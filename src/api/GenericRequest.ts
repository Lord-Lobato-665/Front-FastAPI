import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse  } from 'axios';

class GenericRequest {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: 'http://localhost:8000/api/v1',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

}

export const genericRequest = new GenericRequest();