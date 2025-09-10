import { useState, useEffect } from 'react'
import { MoodTheme, MOOD_THEMES } from '../types/theme'

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<MoodTheme>(MOOD_THEMES[0])

  useEffect(() => {
    // Load saved theme from localStorage
    const savedThemeId = localStorage.getItem('weekendly-theme')
    if (savedThemeId) {
      const theme = MOOD_THEMES.find(t => t.id === savedThemeId)
      if (theme) {
        setCurrentTheme(theme)
      }
    }
  }, [])

  useEffect(() => {
    // Apply CSS custom properties for the current theme
    const root = document.documentElement
    const colors = currentTheme.colors

    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--gradient-primary', colors.gradient)

    // Save to localStorage
    localStorage.setItem('weekendly-theme', currentTheme.id)
  }, [currentTheme])

  const changeTheme = (themeId: string) => {
    const theme = MOOD_THEMES.find(t => t.id === themeId)
    if (theme) {
      setCurrentTheme(theme)
    }
  }

  return {
    currentTheme,
    changeTheme,
    availableThemes: MOOD_THEMES
  }
}
