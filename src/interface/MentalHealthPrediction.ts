export interface MentalHealthPrediction {
  prediccion: number;
  nivel_riesgo: string;
  rango_horas_ingresado: string;
  interpretacion: {
    descripcion: string;
    evaluacion: string;
    recomendaciones: string[];
  };
  estadisticas: {
    correlacion: number;
    uso_promedio_dataset: number;
    puntaje_promedio_dataset: number;
    coeficiente_regresion: number;
    intercepto: number;
  };
  grafica_url: string;
  modelo_info: {
    tipo: string;
    ecuacion: string;
    interpretacion_coeficiente: string;
  };
}