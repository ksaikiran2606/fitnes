import api from './api'

export const dashboardService = {
  // Get dashboard analytics
  getDashboardAnalytics: async () => {
    const response = await api.get('/analytics/dashboard/')
    return response.data
  },

  // Get weekly charts data
  getWeeklyCharts: async () => {
    const response = await api.get('/analytics/weekly-charts/')
    return response.data
  }
}