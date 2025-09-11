import { useState, useEffect, useCallback } from 'react'
import { MoodTheme, MOOD_THEMES } from '../types/theme'

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<MoodTheme>(() => {
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
  const [isThemeReady, setIsThemeReady] = useState(false)

  // Enhanced CSS variable application
  const applyCSSVariables = useCallback((theme: MoodTheme) => {
    const root = document.documentElement
    const colors = theme.colors

    // Apply ALL CSS custom properties
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--gradient-primary', colors.gradient)

    // Also apply to body for immediate feedback
    document.body.style.backgroundColor = colors.background
    document.body.style.color = colors.text
    
    // Force immediate style recalculation
    document.documentElement.offsetHeight
    
    console.log('🎨 CSS Variables applied:', theme.name)
  }, [])

  // Apply theme on mount and changes
  useEffect(() => {
    applyCSSVariables(currentTheme)
    setIsThemeReady(true)
  }, [currentTheme, applyCSSVariables])

  // Enhanced changeTheme function
  const changeTheme = useCallback((newThemeId: string) => {
    console.log('🎨 Theme change requested:', newThemeId)
    
    if (newThemeId === themeId) {
      console.log('⚠️ Same theme, skipping')
      return
    }
    
    const newTheme = MOOD_THEMES.find(t => t.id === newThemeId)
    if (!newTheme) {
      console.error('❌ Theme not found:', newThemeId)
      return
    }

    console.log('✅ Applying new theme:', newTheme.name)
    
    // Update states FIRST
    setThemeId(newThemeId)
    setCurrentTheme(newTheme)
    setForceRender(prev => prev + 1)
    
    // Save to localStorage
    localStorage.setItem('weekendly-theme', newThemeId)
    
    // Apply CSS variables immediately
    applyCSSVariables(newTheme)
    
    // Force one more render cycle
    setTimeout(() => {
      setForceRender(prev => prev + 1)
    }, 10)
    
    console.log('🎉 Theme change complete!')
  }, [themeId, applyCSSVariables])

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weekendly-theme' && e.newValue) {
        const theme = MOOD_THEMES.find(t => t.id === e.newValue)
        if (theme && theme.id !== themeId) {
          setThemeId(e.newValue)
          setCurrentTheme(theme)
          setForceRender(prev => prev + 1)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [themeId])

  return {
    currentTheme,
    themeId,
    forceRender,
    isThemeReady,
    changeTheme,
    availableThemes: MOOD_THEMES
  }
}
