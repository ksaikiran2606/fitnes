import api from './api'

export const waterService = {
  // Water Intake
  getWaterIntakes: async () => {
    const response = await api.get('/water/intake/')
    return response.data
  },

  getTodayIntake: async () => {
    const response = await api.get('/water/intake/today_intake/')
    return response.data
  },

  createWaterIntake: async (intakeData) => {
    const response = await api.post('/water/intake/', intakeData)
    return response.data
  },

  deleteWaterIntake: async (id) => {
    const response = await api.delete(`/water/intake/${id}/`)
    return response.data
  },

  // Water Goals
  getWaterGoals: async () => {
    const response = await api.get('/water/goals/')
    return response.data
  },

  getWeeklySummary: async () => {
    const response = await api.get('/water/intake/weekly_summary/')
    return response.data
  }
}