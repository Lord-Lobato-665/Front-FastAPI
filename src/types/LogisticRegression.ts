export interface LogisticInput {
    features: Record<string, number>;
    target: string;
}

export interface LogisticResponse {
    features_utilizados: string[];
    prediccion_clase: number;
    descripcion_prediccion: string;
    probabilidad_clase_positiva: number;
    nivel_de_riesgo:number;
    interpretacion_general: string;
    analisis_individual:string[];
    comentario_target: string;
    grafica_url: string;
}
