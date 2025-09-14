import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../../hooks/useTheme'
import { MOOD_THEMES } from '../../types/theme'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

describe('useTheme Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset DOM
    document.documentElement.style.cssText = ''
    document.body.style.cssText = ''
  })

  it('initializes with first theme when no saved theme', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.currentTheme).toEqual(MOOD_THEMES[0])
    expect(result.current.themeId).toBe(MOOD_THEMES[0].id)
  })

  

  it('ignores invalid theme IDs', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    const { result } = renderHook(() => useTheme())
    const initialTheme = result.current.themeId
    
    act(() => {
      result.current.changeTheme('invalid-theme-id')
    })
    
    expect(result.current.themeId).toBe(initialTheme)
  })

  it('skips change when same theme is selected', () => {
    mockLocalStorage.getItem.mockReturnValue('energetic')
    
    const { result } = renderHook(() => useTheme())
    
    act(() => {
      result.current.changeTheme('energetic')
    })
    
    // Should not call setItem again since it's the same theme
    expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
  })

  it('provides available themes', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.availableThemes).toEqual(MOOD_THEMES)
    expect(result.current.availableThemes.length).toBeGreaterThan(0)
  })

  it('sets isThemeReady to true after initialization', () => {
    const { result } = renderHook(() => useTheme())
    
    expect(result.current.isThemeReady).toBe(true)
  })
})
