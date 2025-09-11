import { useState, useEffect } from 'react'
import { Activity } from '../types'
import { defaultActivities } from '../data/activities'

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
    const loadActivities = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Load all activities from default data
        setActivities(defaultActivities)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activities')
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [])

  const getByCategory = async (category: string): Promise<Activity[]> => {
    try {
      return defaultActivities.filter(activity => activity.category === category)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get activities by category')
      return []
    }
  }

  const searchActivities = async (query: string): Promise<Activity[]> => {
    try {
      return defaultActivities.filter(activity => 
        activity.name.toLowerCase().includes(query.toLowerCase()) ||
        activity.description.toLowerCase().includes(query.toLowerCase())
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search activities')
      return []
    }
  }

  const getRecommendations = async (weather?: string, budget?: number): Promise<Activity[]> => {
    try {
      return defaultActivities.filter(activity => {
        const weatherMatch = !weather || weather === 'any' || !activity.weatherDependent
        const budgetMatch = !budget || activity.cost === 'free' || activity.cost === 'low'
        return weatherMatch && budgetMatch
      }).slice(0, 6)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get recommendations')
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
