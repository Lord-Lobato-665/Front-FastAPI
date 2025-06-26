import type { KMeansInput, KMeansResponse } from "../types/KMeans";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

class KMeansService {
  async predict(data: KMeansInput): Promise<KMeansResponse> {
    const res = await fetch(`${BASE_URL}/predict/kmeans`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Error al procesar predicción");
    }

    return await res.json();
  }

  async getPlot(): Promise<string> {
    const res = await fetch(`${BASE_URL}/predict/kmeans/plot`);
    if (!res.ok) {
      throw new Error("No se pudo cargar la imagen del gráfico");
    }

    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }

  async getHeaders(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/predict/csv-heads`);
    if (!res.ok) {
      throw new Error("No se pudieron cargar las columnas");
    }

    const data = await res.json();
    return data.columnas
      .filter((c: any) => ["int64", "float64"].includes(c.tipo.toLowerCase()))
      .map((c: any) => c.columna);
  }
}

export const kmeansService = new KMeansService();
