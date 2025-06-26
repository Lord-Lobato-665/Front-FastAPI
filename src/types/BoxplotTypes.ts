export interface BoxplotColumn {
  columna: string;
  tipo: string;
}

export interface BoxplotSummary {
  min: number;
  max: number;
  q1: number;
  q3: number;
  mediana: number;
  media: number;
  desviacion_estandar: number;
  valor_usuario: number;
  posicion_usuario: string;
  interpretacion: string;
  recomendacion: string;
}

export interface BoxplotRequest {
  eje_y: string;
  sleep_time: number;
}