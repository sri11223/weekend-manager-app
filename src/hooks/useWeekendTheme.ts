import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { WeekendTheme } from '../components/features/WeekendThemeSelector'

interface WeekendThemeState {
  selectedTheme: WeekendTheme | null
  themePreferences: {
    preferredMoods: string[]
    preferredCategories: string[]
    recentThemes: string[]
  }
  
  // Actions
  setTheme: (theme: WeekendTheme) => void
  clearTheme: () => void
  addRecentTheme: (themeId: string) => void
  updatePreferences: (moods: string[], categories: string[]) => void
}

export const useWeekendTheme = create<WeekendThemeState>()(
  persist(
    (set, get) => ({
      selectedTheme: null,
      themePreferences: {
        preferredMoods: [],
        preferredCategories: [],
        recentThemes: []
      },

      setTheme: (theme) => {
        set({ selectedTheme: theme })
        get().addRecentTheme(theme.id)
        get().updatePreferences(theme.mood, theme.suggestedCategories)
      },

      clearTheme: () => {
        set({ selectedTheme: null })
      },

      addRecentTheme: (themeId) => {
        set((state) => ({
          themePreferences: {
            ...state.themePreferences,
            recentThemes: [
              themeId,
              ...state.themePreferences.recentThemes.filter(id => id !== themeId)
            ].slice(0, 5) // Keep only last 5 themes
          }
        }))
      },

      updatePreferences: (moods, categories) => {
        set((state) => {
          const currentMoods = state.themePreferences.preferredMoods
          const currentCategories = state.themePreferences.preferredCategories
          
          // Add new preferences while keeping existing ones
          const updatedMoods = Array.from(new Set([...currentMoods, ...moods]))
          const updatedCategories = Array.from(new Set([...currentCategories, ...categories]))
          
          return {
            themePreferences: {
              ...state.themePreferences,
              preferredMoods: updatedMoods.slice(0, 10), // Limit to 10
              preferredCategories: updatedCategories.slice(0, 8) // Limit to 8
            }
          }
        })
      }
    }),
    {
      name: 'weekend-theme-storage',
      version: 1
    }
  )
)
