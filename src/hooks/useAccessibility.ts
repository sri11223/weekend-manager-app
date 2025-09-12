import { useEffect, useRef, useState, useCallback } from 'react'

// Hook for managing focus and keyboard navigation
export const useFocusManagement = () => {
  const focusableElements = useRef<HTMLElement[]>([])
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1)

  const updateFocusableElements = useCallback((container: HTMLElement) => {
    const selectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')

    focusableElements.current = Array.from(
      container.querySelectorAll(selectors)
    ) as HTMLElement[]
  }, [])

  const focusFirst = useCallback(() => {
    if (focusableElements.current.length > 0) {
      focusableElements.current[0].focus()
      setCurrentFocusIndex(0)
    }
  }, [])

  const focusLast = useCallback(() => {
    const lastIndex = focusableElements.current.length - 1
    if (lastIndex >= 0) {
      focusableElements.current[lastIndex].focus()
      setCurrentFocusIndex(lastIndex)
    }
  }, [])

  const focusNext = useCallback(() => {
    const nextIndex = (currentFocusIndex + 1) % focusableElements.current.length
    if (focusableElements.current[nextIndex]) {
      focusableElements.current[nextIndex].focus()
      setCurrentFocusIndex(nextIndex)
    }
  }, [currentFocusIndex])

  const focusPrevious = useCallback(() => {
    const prevIndex = currentFocusIndex <= 0 
      ? focusableElements.current.length - 1 
      : currentFocusIndex - 1
    if (focusableElements.current[prevIndex]) {
      focusableElements.current[prevIndex].focus()
      setCurrentFocusIndex(prevIndex)
    }
  }, [currentFocusIndex])

  return {
    updateFocusableElements,
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    currentFocusIndex
  }
}

// Hook for keyboard navigation
export const useKeyboardNavigation = (
  onEscape?: () => void,
  onEnter?: () => void,
  onArrowKeys?: (direction: 'up' | 'down' | 'left' | 'right') => void
) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'Escape':
        onEscape?.()
        break
      case 'Enter':
        if (event.target instanceof HTMLButtonElement || 
            event.target instanceof HTMLAnchorElement) {
          onEnter?.()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        onArrowKeys?.('up')
        break
      case 'ArrowDown':
        event.preventDefault()
        onArrowKeys?.('down')
        break
      case 'ArrowLeft':
        event.preventDefault()
        onArrowKeys?.('left')
        break
      case 'ArrowRight':
        event.preventDefault()
        onArrowKeys?.('right')
        break
      case 'Tab':
        // Let default tab behavior work, but track focus
        break
    }
  }, [onEscape, onEnter, onArrowKeys])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return { handleKeyDown }
}

// Hook for screen reader announcements
export const useScreenReader = () => {
  const [announcements, setAnnouncements] = useState<string[]>([])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncements(prev => [...prev, message])
    
    // Create temporary element for screen reader announcement
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message
    
    document.body.appendChild(announcement)
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  const announceNavigation = useCallback((location: string) => {
    announce(`Navigated to ${location}`)
  }, [announce])

  const announceAction = useCallback((action: string) => {
    announce(action, 'assertive')
  }, [announce])

  return {
    announce,
    announceNavigation,
    announceAction,
    announcements
  }
}

// Hook for focus trapping (modals, dropdowns)
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLElement>(null)
  const { updateFocusableElements, focusFirst, focusLast } = useFocusManagement()

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    updateFocusableElements(container)
    focusFirst()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const focusableElements = container.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isActive, updateFocusableElements, focusFirst])

  return containerRef
}

// Hook for accessible form validation
export const useAccessibleForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { announce } = useScreenReader()

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: error }))
    announce(`Error in ${fieldName}: ${error}`, 'assertive')
  }, [announce])

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  const getFieldProps = useCallback((fieldName: string) => ({
    'aria-invalid': errors[fieldName] ? 'true' : 'false',
    'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined
  }), [errors])

  return {
    errors,
    setFieldError,
    clearFieldError,
    getFieldProps
  }
}

// Hook for accessible loading states
export const useAccessibleLoading = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const { announce } = useScreenReader()

  const startLoading = useCallback((message: string = 'Loading...') => {
    setIsLoading(true)
    setLoadingMessage(message)
    announce(message)
  }, [announce])

  const stopLoading = useCallback((completionMessage?: string) => {
    setIsLoading(false)
    setLoadingMessage('')
    if (completionMessage) {
      announce(completionMessage)
    }
  }, [announce])

  return {
    isLoading,
    loadingMessage,
    startLoading,
    stopLoading
  }
}

// Color contrast utilities
export const getContrastRatio = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    const rgb = parseInt(color.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

export const meetsWCAGContrast = (
  foreground: string, 
  background: string, 
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = getContrastRatio(foreground, background)
  return level === 'AA' ? ratio >= 4.5 : ratio >= 7
}
