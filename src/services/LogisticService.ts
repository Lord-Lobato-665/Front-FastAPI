import type { LogisticInput, LogisticResponse } from "../types/LogisticRegression";

const BASE_URL = "http://127.0.0.1:8000/api/v1";

class LogisticService {
    async predict(data: LogisticInput): Promise<LogisticResponse> {
        const res = await fetch(`${BASE_URL}/predict/logistic-multiple`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.detail || "Error al procesar la regresión logística");
        }
        return await res.json();
    }

    async getPlot(): Promise<string> {
        const res = await fetch(`${BASE_URL}/predict/logistic-multiple/plot`);
        if (!res.ok) {
            throw new Error("No se pudo cargar la imagen del gráfico");
        }
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    }

    async getNumericFeatures(): Promise<string[]> {
        const res = await fetch(`${BASE_URL}/predict/csv-heads`);
        if (!res.ok) {
            throw new Error("No se pudieron cargar las columnas");
        }
        const data = await res.json();
        
        return data.columnas
            .filter((c: any) => 
                ['int64', 'float64'].includes(c.tipo.toLowerCase()) &&
                !['student_id', 'id'].includes(c.columna.toLowerCase())
            )
            .map((c: any) => c.columna);
    }

  async getBinaryTargets(): Promise<string[]> {
    const res = await fetch(`${BASE_URL}/predict/csv-heads`);
    if (!res.ok) {
        throw new Error("No se pudieron cargar las columnas");
    }

    const data = await res.json();

    const binaryColumns = [
      "Academic_Level_Graduate",
      "Academic_Level_High_School",
      "Academic_Level_Undergraduate",
      "Most_Used_Platform_Facebook",
      "Most_Used_Platform_Instagram",
      "Most_Used_Platform_KakaoTalk",
      "Most_Used_Platform_LINE",
      "Most_Used_Platform_LinkedIn",
      "Most_Used_Platform_Snapchat",
      "Most_Used_Platform_TikTok",
      "Most_Used_Platform_Twitter",
      "Most_Used_Platform_VKontakte",
      "Most_Used_Platform_WeChat",
      "Most_Used_Platform_WhatsApp",
      "Most_Used_Platform_YouTube",
      "Relationship_Status_Complicated",
      "Relationship_Status_In_Relationship",
      "Relationship_Status_Single",
    ];

    return data.columnas
      .map((c: any) => c.columna)
      .filter(col => binaryColumns.includes(col));
}



}

export const logisticService = new LogisticService();