export interface KMeansInput {
  features: string[];
  k: number;
  normalize?: boolean;
  user_input?: {
    values: number[];
  };
}

export interface KMeansResponse {
  grafica_url: string;
  features_utilizados: string[];
  normalizacion_aplicada: boolean;
  columnas_binarias: string[];
  columnas_no_binarias: string[];
  descripcion_cluster: string[];
  user_info?: {
    cluster_asignado: number;
    valores_ingresados: number[];
    descripcion: string;
  };
}
