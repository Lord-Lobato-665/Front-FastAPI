import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
    try {
      const response: AxiosResponse<T> = await this.instance.get(url, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message || 'Error en la petición GET';
    }
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.post(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message || 'Error en la petición POST';
    }
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.put(url, data, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message || 'Error en la petición PUT';
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.instance.delete(url, config);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message || 'Error en la petición DELETE';
    }
  }
}

export const genericRequest = new GenericRequest();