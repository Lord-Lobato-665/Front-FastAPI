// src/services/ProfileService.ts
import type { FormInputUser, CalculatedScores } from '../types/UserProfile';

const BASE_URL = "http://127.0.0.1:8000/api/v1";

class ProfileService {
  async submitUserData(data: FormInputUser): Promise<CalculatedScores> {
    const res = await fetch(`${BASE_URL}/prediction/user_form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.detail || "Error al procesar el formulario");
    }
    
    return await res.json();
  }

  saveToLocalStorage(data: FormInputUser & CalculatedScores): void {
    localStorage.setItem('userProfile', JSON.stringify(data));
  }

  getFromLocalStorage(): (FormInputUser & CalculatedScores) | null {
    const data = localStorage.getItem('userProfile');
    return data ? JSON.parse(data) : null;
  }

  clearLocalStorage(): void {
    localStorage.removeItem('userProfile');
  }
}

export const profileService = new ProfileService();