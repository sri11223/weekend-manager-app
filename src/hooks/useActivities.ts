import { useState, useEffect } from 'react'
import { mockActivitiesService, Activity } from '../services/mockActivitiesService'

interface UseActivitiesReturn {
  activities: Activity[]
  loading: boolean
  error: string | null
  getByCategory: (category: string) => Promise<Activity[]>
  searchActivities: (query: string) => Promise<Activity[]>
  getRecommendations: (weather?: string, budget?: number) => Promise<Activity[]>
}

export const useActivities = (): UseActivitiesReturn => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await mockActivitiesService.getAllActivities()
      setActivities(data)
    } catch (err) {
      setError('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  const getByCategory = async (category: string) => {
    try {
      return await mockActivitiesService.getActivitiesByCategory(category)
    } catch (err) {
      setError('Failed to load category activities')
      return []
    }
  }

  const searchActivities = async (query: string) => {
    try {
      return await mockActivitiesService.searchActivities(query)
    } catch (err) {
      setError('Failed to search activities')
      return []
    }
  }

  const getRecommendations = async (weather?: string, budget?: number) => {
    try {
      return await mockActivitiesService.getRecommendedActivities(weather || 'any', budget)
    } catch (err) {
      setError('Failed to load recommendations')
      return []
    }
  }

  return {
    activities,
    loading,
    error,
    getByCategory,
    searchActivities,
    getRecommendations
  }
}
