import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Mock IndexedDB for testing
const mockIndexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn(),
  cmp: vi.fn(),
}

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})

// Mock ResizeObserver
const mockResizeObserver = vi.fn()
mockResizeObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})

beforeAll(() => {
  // Setup global mocks
  Object.defineProperty(window, 'indexedDB', {
    value: mockIndexedDB,
    writable: true,
  })

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  })

  Object.defineProperty(window, 'IntersectionObserver', {
    value: mockIntersectionObserver,
    writable: true,
  })

  Object.defineProperty(window, 'ResizeObserver', {
    value: mockResizeObserver,
    writable: true,
  })

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})
