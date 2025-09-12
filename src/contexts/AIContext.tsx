// src/contexts/AIContext.tsx (RACE CONDITION FIX)
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import groqAIService from '../services/groqAIService'
import { useTheme } from '../hooks/useTheme'
import { weatherService } from '../services/weatherService'
import { Activity } from '../types/index'

interface AIContextType {
  location: string
  setLocation: (location: string) => void
  allActivities: Record<string, Activity[]>
  isGenerating: boolean
  categoryCounts: Record<string, number>
  regenerateAllActivities: () => Promise<void>
  generateCategoryActivities: (category: string) => Promise<Activity[]>
  refreshActivities: () => Promise<void>
  lastGenerated: Date | null
  error: string | null
}

const AIContext = createContext<AIContextType | undefined>(undefined)

interface AIProviderProps {
  children: ReactNode
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const { currentTheme, themeId, themeChangeTimestamp } = useTheme()
  
  // State
  const [location, setLocation] = useState('New York City')
  const [allActivities, setAllActivities] = useState<Record<string, Activity[]>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ✅ TRACK THEME CHANGES
  const [lastThemeChangeTimestamp, setLastThemeChangeTimestamp] = useState(0)

  // Get current context for AI
  const getCurrentContext = async (): Promise<import('../services/groqAIService').AIContext> => {
    try {
      const weather = await weatherService.getCurrentWeather(location)
      const currentHour = new Date().getHours()
      
      let timeOfDay: 'morning' | 'afternoon' | 'evening'
      if (currentHour < 12) timeOfDay = 'morning'
      else if (currentHour < 17) timeOfDay = 'afternoon'
      else timeOfDay = 'evening'

      return {
        location,
        theme: themeId, // ✅ Use current themeId directly
        weather: {
          temperature: weather.temperature,
          condition: weather.condition,
          isGoodForOutdoor: weatherService.isGoodWeatherForOutdoor(weather)
        },
        timeOfDay,
        budget: 150,
        userPreferences: []
      }
    } catch (error) {
      console.error('Weather service error:', error)
      return {
        location,
        theme: themeId, // ✅ Use current themeId directly
        weather: {
          temperature: 72,
          condition: 'clear',
          isGoodForOutdoor: true
        },
        timeOfDay: 'afternoon' as const,
        budget: 150,
        userPreferences: []
      }
    }
  }

  const getCurrentContextForTheme = async (themeId: string): Promise<import('../services/groqAIService').AIContext> => {
    try {
      const weather = await weatherService.getCurrentWeather(location)
      const currentHour = new Date().getHours()
      
      let timeOfDay: 'morning' | 'afternoon' | 'evening'
      if (currentHour < 12) timeOfDay = 'morning'
      else if (currentHour < 17) timeOfDay = 'afternoon'
      else timeOfDay = 'evening'

      return {
        location,
        theme: themeId, 
        weather: {
          temperature: weather.temperature,
          condition: weather.condition,
          isGoodForOutdoor: weatherService.isGoodWeatherForOutdoor(weather)
        },
        timeOfDay,
        budget: 150,
        userPreferences: []
      }
    } catch (error) {
      console.error('Weather service error:', error)
      return {
        location,
        theme: themeId, 
        weather: {
          temperature: 72,
          condition: 'clear',
          isGoodForOutdoor: true
        },
        timeOfDay: 'afternoon' as const,
        budget: 150,
        userPreferences: []
      }
    }
  }

  // ✅ ENHANCED REGENERATION - Handle race conditions
  const regenerateAllActivities = async (forceRegenerate = false, targetThemeId?: string) => {
    // ✅ If force regenerate (theme change), reset isGenerating first
    if (forceRegenerate && isGenerating) {
      console.log('🔄 Force regenerate: Resetting generation state')
      setIsGenerating(false)
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    if (isGenerating && !forceRegenerate) return
    
    setIsGenerating(true)
    const useThemeId = targetThemeId || themeId
    console.log(`🎨 Regenerating activities for theme: ${useThemeId}`)
    
    try {
      // Clear cache for fresh generation
      groqAIService.clearCache()
      
      // Load mock activities directly - no AI needed
      const { MockActivityService } = await import('../data/mockActivities')
      const { getThemeCategoriesConfig } = await import('../config/themeCategories')
      
      const themeCategories = getThemeCategoriesConfig(useThemeId)
      const newActivities: Record<string, Activity[]> = {}
      
      themeCategories.forEach(category => {
        const mockActivities = MockActivityService.getActivitiesForCategory(useThemeId, category.id)
        newActivities[category.id] = mockActivities
      })
      setAllActivities(newActivities)
      setCategoryCounts(groqAIService.getCategoryCounts(newActivities))
      setLastGenerated(new Date())
      
      // Dispatch events for immediate UI updates
      window.dispatchEvent(new CustomEvent('weekendly-force-update', {
        detail: {
          theme: currentTheme?.name,
          themeId: currentTheme?.id,
          timestamp: Date.now(),
          activities: newActivities,
          source: 'ai-regeneration'
        }
      }))
      
      window.dispatchEvent(new CustomEvent('weekendly-activities-updated', {
        detail: { activities: newActivities, timestamp: Date.now() }
      }))
      
      console.log(`✅ Activities generated for ${currentTheme?.name}`)
      
    } catch (error) {
      console.error('❌ Failed to regenerate activities:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate activities for specific category
  const generateCategoryActivities = async (category: string): Promise<Activity[]> => {
    try {
      const context = await getCurrentContext()
      const activities = await groqAIService.generateActivities({
        category,
        count: 15,
        context
      })
      
      setAllActivities(prev => ({
        ...prev,
        [category]: activities
      }))
      
      setCategoryCounts(prev => ({
        ...prev,
        [category]: activities.length
      }))
      
      return activities
      
    } catch (err) {
      console.error(`❌ Failed to generate ${category} activities:`, err)
      return allActivities[category] || []
    }
  }

  // ✅ SMART THEME CHANGE DETECTION - Use timestamp
  useEffect(() => {
    if (themeChangeTimestamp > lastThemeChangeTimestamp && themeChangeTimestamp > 0) {
      console.log(`🎭 Theme change detected: ${currentTheme?.name}`)
      
      // FORCE REGENERATE for theme changes
      regenerateAllActivities(true).then(() => {
        console.log(`✅ Activities updated for: ${currentTheme?.name}`)
      }).catch((error) => {
        console.error('❌ Theme regeneration failed:', error)
      })
    }
    
    // Update timestamp tracking
    setLastThemeChangeTimestamp(themeChangeTimestamp)
  }, [themeChangeTimestamp, currentTheme, themeId])

  // IMMEDIATE THEME RESPONSE - Mock data + AI regeneration
  useEffect(() => {
    const handleThemeChange = async (event: CustomEvent) => {
      const { themeName, themeId: newThemeId, timestamp } = event.detail
      console.log(` Theme change: ${themeName} (${newThemeId})`)
      
      // IMMEDIATE MOCK DATA for instant UI update - use theme-specific categories
      const { getThemeCategoriesConfig } = await import('../config/themeCategories')
      const themeCategories = getThemeCategoriesConfig(newThemeId)
      const mockCounts: Record<string, number> = {}
      themeCategories.forEach(cat => {
        mockCounts[cat.id] = 8
      })
      setCategoryCounts(mockCounts)
      
      // Force UI update immediately
      window.dispatchEvent(new CustomEvent('weekendly-force-update', {
        detail: { theme: themeName, themeId: newThemeId, timestamp, source: 'theme-change' }
      }))
      
      if (timestamp > lastThemeChangeTimestamp) {
        setLastThemeChangeTimestamp(timestamp)
        // Wait for theme state to update before regenerating
        setTimeout(() => {
          regenerateAllActivities(true, newThemeId)
        }, 100)
      }
    }
    window.addEventListener('weekendly-theme-change', handleThemeChange as any)
    return () => {
      window.removeEventListener('weekendly-theme-change', handleThemeChange as any)
    }
  }, [lastThemeChangeTimestamp])

  // INITIAL LOAD
  useEffect(() => {
    if (themeId && currentTheme && Object.keys(allActivities).length === 0) {
      console.log(` Loading activities for: ${currentTheme.name}`)
      setLastThemeChangeTimestamp(Date.now())
      regenerateAllActivities(false) // Normal initial load
    }
  }, [themeId, currentTheme])

  // DEBUG LOGGING
  useEffect(() => {
    // Reduced logging - only log when needed
    // console.log('🔍 AIContext State:', { themeId, isGenerating, activitiesCount: Object.keys(allActivities).length })
  }, [themeId, currentTheme, themeChangeTimestamp, lastThemeChangeTimestamp, isGenerating, allActivities, categoryCounts])

  const value: AIContextType = {
    location,
    setLocation,
    allActivities,
    isGenerating,
    categoryCounts,
    regenerateAllActivities: () => regenerateAllActivities(false),
    generateCategoryActivities,
    refreshActivities: () => regenerateAllActivities(true), // Force refresh
    lastGenerated,
    error
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = (): AIContextType => {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}
