// src/hooks/useTheme.ts - FIXED FOR INSTANT COLOR CHANGES
import { useState, useEffect, useCallback, useRef } from 'react'
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

  const [isThemeReady, setIsThemeReady] = useState(false)
  const [themeChangeTimestamp, setThemeChangeTimestamp] = useState(Date.now())
  const [forceRender, setForceRender] = useState(0)
  const isApplyingTheme = useRef(false)

  // ✅ APPLY CSS VARIABLES IMMEDIATELY WITH FORCE UPDATE
  const applyCSSVariables = useCallback((theme: MoodTheme, force = false) => {
    if (isApplyingTheme.current && !force) return
    isApplyingTheme.current = true

    try {
      const root = document.documentElement
      const body = document.body
      const colors = theme.colors

      console.log(`🎨 APPLYING COLORS for theme: ${theme.name}`, colors)

      // ✅ IMMEDIATELY REMOVE OLD TRANSITIONS
      root.style.transition = 'none'
      body.style.transition = 'none'

      // ✅ APPLY ALL CSS VARIABLES AT ONCE
      const cssVars = {
        '--theme-primary': colors.primary,
        '--theme-secondary': colors.secondary,
        '--theme-accent': colors.accent,
        '--theme-background': colors.background,
        '--theme-surface': colors.surface,
        '--theme-text': colors.text,
        '--theme-text-secondary': colors.textSecondary,
        '--theme-border': colors.border,
        '--theme-gradient': colors.gradient,
        '--theme-primary-light': `${colors.primary}20`,
        '--theme-primary-dark': `${colors.primary}dd`,
        '--theme-hover': `${colors.primary}10`,
      }

      // Apply all CSS variables synchronously
      Object.entries(cssVars).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })

      // ✅ FORCE IMMEDIATE VISUAL CHANGES
      body.style.backgroundColor = colors.background
      body.style.color = colors.text

      // Force DOM repaint
      root.offsetHeight
      body.offsetHeight

      // ✅ RE-ENABLE TRANSITIONS AFTER A BRIEF DELAY
      setTimeout(() => {
        root.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }, 50)

      console.log(`✅ Colors APPLIED immediately for: ${theme.name}`)

    } catch (error) {
      console.error('❌ Error applying CSS variables:', error)
    } finally {
      isApplyingTheme.current = false
    }
  }, [])

  // ✅ INITIALIZE THEME IMMEDIATELY ON MOUNT
  useEffect(() => {
    console.log(`🚀 INITIALIZING theme: ${currentTheme.name}`)
    applyCSSVariables(currentTheme, true)
    setIsThemeReady(true)
  }, [currentTheme, applyCSSVariables])

  // ✅ INSTANT THEME CHANGE WITH IMMEDIATE COLOR UPDATE
  const changeTheme = useCallback((newThemeId: string) => {
    console.log(`🎨 CHANGING theme from ${currentTheme.name} to ${newThemeId}`)

    const newTheme = MOOD_THEMES.find(theme => theme.id === newThemeId)
    if (!newTheme) {
      console.warn(`❌ Theme ${newThemeId} not found`)
      return
    }

    const timestamp = Date.now()

    // ✅ UPDATE STATE IMMEDIATELY
    setCurrentTheme(newTheme)
    setThemeId(newThemeId)
    setThemeChangeTimestamp(timestamp)
    setForceRender(prev => prev + 1)

    // ✅ APPLY COLORS IMMEDIATELY - NO DELAYS
    applyCSSVariables(newTheme, true)

    // ✅ SAVE TO LOCALSTORAGE
    localStorage.setItem('weekendly-theme', newThemeId)

    // ✅ DISPATCH EVENTS FOR COMPONENTS
    const eventData = { 
      themeId: newThemeId, 
      theme: newTheme, 
      timestamp,
      colors: newTheme.colors 
    }

    window.dispatchEvent(new CustomEvent('weekendly-theme-change', { detail: eventData }))
    window.dispatchEvent(new CustomEvent('weekendly-categories-update', { detail: eventData }))
    window.dispatchEvent(new CustomEvent('weekendly-force-update', { detail: eventData }))

    // ✅ FORCE PAGE RELOAD FOR COMPLETE THEME CHANGE
    console.log('🔄 FORCING PAGE RELOAD for complete theme change')
    setTimeout(() => {
      window.location.reload()
    }, 200) // Short delay to let state updates complete

    console.log(`✅ Theme CHANGED successfully to: ${newTheme.name}`)
  }, [currentTheme, applyCSSVariables])

  // ✅ LISTEN FOR STORAGE CHANGES (MULTI-TAB SUPPORT)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weekendly-theme' && e.newValue) {
        const theme = MOOD_THEMES.find(t => t.id === e.newValue)
        if (theme && theme.id !== themeId) {
          console.log(`🔄 Storage change detected: ${e.newValue}`)
          changeTheme(e.newValue)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [themeId, changeTheme])

  // ✅ ADDITIONAL COLOR REFRESH ON THEME READY
  useEffect(() => {
    if (isThemeReady && currentTheme) {
      console.log(`🎨 Theme ready, refreshing colors: ${currentTheme.name}`)
      applyCSSVariables(currentTheme, true)
    }
  }, [isThemeReady, currentTheme, applyCSSVariables])

  return {
    currentTheme,
    themeId,
    isThemeReady,
    changeTheme,
    themeChangeTimestamp,
    availableThemes: MOOD_THEMES,
    forceRender,
    applyCSSVariables // Export for manual color refresh
  }
}