import api from './api'

export const dietService = {
  // Meals
  getMeals: async () => {
    const response = await api.get('/diet/meals/')
    return response.data
  },

  getTodayMeals: async () => {
    const response = await api.get('/diet/meals/today_meals/')
    return response.data
  },

  createMeal: async (mealData) => {
    const response = await api.post('/diet/meals/', mealData)
    return response.data
  },

  updateMeal: async (id, mealData) => {
    const response = await api.put(`/diet/meals/${id}/`, mealData)
    return response.data
  },

  deleteMeal: async (id) => {
    const response = await api.delete(`/diet/meals/${id}/`)
    return response.data
  },

  // Nutrition
  getDailyNutrition: async () => {
    const response = await api.get('/diet/nutrition/')
    return response.data
  },

  getWeeklySummary: async () => {
    const response = await api.get('/diet/meals/weekly_summary/')
    return response.data
  }
}