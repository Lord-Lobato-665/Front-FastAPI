import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { FormInputUser, CalculatedScores } from '../types/UserProfile'
import { profileService } from '../services/ProfileService'

export const useProfileStore = defineStore('profile', () => {
  const userData = ref<(FormInputUser & CalculatedScores) | null>(null)

  const submitForm = async (data: FormInputUser) => {
    try {
      const calculated = await profileService.submitUserData(data)
      userData.value = { ...data, ...calculated }
      profileService.saveToLocalStorage(userData.value)
      return true
    } catch (error) {
      console.error('Error submitting form:', error)
      return false
    }
  }

  const loadFromStorage = () => {
    userData.value = profileService.getFromLocalStorage()
  }

  const logout = () => {
    profileService.clearLocalStorage()
    userData.value = null
  }

  return {
    userData,
    submitForm,
    loadFromStorage,
    logout,
  }
})
