export interface CsvColumnInfo {
  columna: string;
  tipo: string;
}

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

export interface SocialMediaAnalysis {
  summary: {
    total_students: number;
    avg_daily_usage_hours: number;
    affects_performance_percentage: number;
    avg_mental_health_score: number;
    avg_addiction_score: number;
    avg_sleep_hours: number;
  };
  platform_analysis: {
    top_platforms: Record<string, number>;
    platform_usage_distribution: Record<string, number>;
  };
  usage_impact: {
    by_usage_category: Array<{
      Usage_Category: string;
      Mental_Health_Score: number;
      Addicted_Score: number;
      Affects_Academic_Performance: number;
    }>;
    correlation_usage_mental_health: number;
    correlation_usage_addiction: number;
    correlation_usage_sleep: number;
  };
  demographic_filters: {
    age_range: string;
    country: string;
    academic_level: string;
  };
  correlation_chart_url: string;
  insights: {
    performance_impact: string;
    mental_health_tip: string;
    sleep_quality: string;
  };
}