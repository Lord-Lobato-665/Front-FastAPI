export interface LinearMultiFeatureRequest {
  features: Record<string, number>;
  target: string;
}

export interface LinearMultiFeatureResponse {
  features_utilizados: string[];
  prediccion: number;
  grafica_url: string;
  resumen: string;
}