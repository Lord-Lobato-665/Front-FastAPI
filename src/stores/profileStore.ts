// src/stores/profileStore.ts
import { defineStore } from 'pinia';
import type { FormInputUser, CalculatedScores } from '../types/userProfile';
import { profileService } from '../services/ProfileService';

export const useProfileStore = defineStore('profile', {
  state: () => ({
    userData: null as (FormInputUser & CalculatedScores) | null,
  }),

  actions: {
    async submitForm(data: FormInputUser) {
      try {
        const calculated = await profileService.submitUserData(data);
        this.userData = { ...data, ...calculated };
        profileService.saveToLocalStorage(this.userData);
        return true;
      } catch (error) {
        console.error("Error submitting form:", error);
        return false;
      }
    },

    loadFromStorage() {
      this.userData = profileService.getFromLocalStorage();
    },

    logout() {
      profileService.clearLocalStorage();
      this.userData = null;
    },
  },
});