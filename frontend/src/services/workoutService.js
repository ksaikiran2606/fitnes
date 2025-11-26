import api from './api'

export const workoutService = {
  // Workout Plans
  getWorkoutPlans: async () => {
    const response = await api.get('/workouts/plans/')
    return response.data
  },

  createWorkoutPlan: async (planData) => {
    const response = await api.post('/workouts/plans/', planData)
    return response.data
  },

  updateWorkoutPlan: async (id, planData) => {
    const response = await api.put(`/workouts/plans/${id}/`, planData)
    return response.data
  },

  deleteWorkoutPlan: async (id) => {
    const response = await api.delete(`/workouts/plans/${id}/`)
    return response.data
  },

  // Exercises
  addExercise: async (planId, exerciseData) => {
    const response = await api.post(`/workouts/plans/${planId}/add-exercise/`, exerciseData)
    return response.data
  },

  getExercises: async () => {
    const response = await api.get('/workouts/exercises/')
    return response.data
  },

  updateExercise: async (id, exerciseData) => {
    const response = await api.put(`/workouts/exercises/${id}/`, exerciseData)
    return response.data
  },

  deleteExercise: async (id) => {
    const response = await api.delete(`/workouts/exercises/${id}/`)
    return response.data
  },

  // Workout Sessions
  getWorkoutSessions: async () => {
    const response = await api.get('/workouts/sessions/')
    return response.data
  },

  createWorkoutSession: async (sessionData) => {
    const response = await api.post('/workouts/sessions/', sessionData)
    return response.data
  },

  getWeeklyProgress: async () => {
    const response = await api.get('/workouts/sessions/weekly-progress/')
    return response.data
  }
}