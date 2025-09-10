import { useState, useEffect } from 'react'
import { MoodTheme, MOOD_THEMES } from '../types/theme'

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<MoodTheme>(() => {
    // Initialize with saved theme or default
    const savedThemeId = localStorage.getItem('weekendly-theme')
    if (savedThemeId) {
      const theme = MOOD_THEMES.find(t => t.id === savedThemeId)
      if (theme) return theme
    }
    return MOOD_THEMES[0]
  })
  const [themeId, setThemeId] = useState<string>(() => {
    return localStorage.getItem('weekendly-theme') || MOOD_THEMES[0].id
  })
  const [forceRender, setForceRender] = useState(0)

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weekendly-theme' && e.newValue) {
        const theme = MOOD_THEMES.find(t => t.id === e.newValue)
        if (theme && theme.id !== themeId) {
          setThemeId(e.newValue)
          setCurrentTheme(theme)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [themeId])

  // ✅ FIX: Apply CSS variables immediately when theme changes
  useEffect(() => {
    const root = document.documentElement
    const colors = currentTheme.colors

    // Apply all CSS custom properties
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--gradient-primary', colors.gradient)
    
    // Force immediate style recalculation
    document.documentElement.offsetHeight; // Trigger reflow
  }, [currentTheme]) // ✅ Changed from [themeId] to [currentTheme]

  const changeTheme = (newThemeId: string) => {
    // Prevent unnecessary changes
    if (newThemeId === themeId) {
      return
    }
    
    const theme = MOOD_THEMES.find(t => t.id === newThemeId)
    if (theme) {
      // ✅ Update state immediately and synchronously
      setThemeId(newThemeId)
      setCurrentTheme(theme)
      
      // Save to localStorage
      localStorage.setItem('weekendly-theme', newThemeId)
      
      // Force React re-render
      setForceRender(prev => prev + 1)
      
      // ✅ Apply CSS variables immediately for instant feedback
      const root = document.documentElement
      const colors = theme.colors
      root.style.setProperty('--color-primary', colors.primary)
      root.style.setProperty('--color-secondary', colors.secondary)
      root.style.setProperty('--color-accent', colors.accent)
      root.style.setProperty('--color-background', colors.background)
      root.style.setProperty('--color-surface', colors.surface)
      root.style.setProperty('--color-text', colors.text)
      root.style.setProperty('--color-text-secondary', colors.textSecondary)
      root.style.setProperty('--color-border', colors.border)
      root.style.setProperty('--gradient-primary', colors.gradient)
    }
  }

  return {
    currentTheme,
    themeId,
    forceRender,
    changeTheme,
    availableThemes: MOOD_THEMES
  }
}
