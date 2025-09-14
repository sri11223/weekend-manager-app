import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

// Mock providers for testing
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      {children}
    </DndProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock activity data for testing
export const mockActivity = {
  id: 'test-activity-1',
  name: 'Test Activity',
  description: 'A test activity for unit testing',
  duration: 60, // 1 hour in minutes (to avoid blocking issues in tests)
  category: 'entertainment' as const,
  mood: 'energetic' as const,
  icon: 'game',
  color: '#3b82f6',
  indoor: false,
  cost: 'free' as const,
  difficulty: 'easy' as const,
  tags: ['test', 'fun'],
  weatherDependent: false,
}

export const mockScheduledActivity = {
  ...mockActivity,
  timeSlot: '10am',
  day: 'saturday' as const,
}

// Mock theme for testing
export const mockTheme = {
  id: 'test-theme',
  name: 'Test Theme',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  },
}

// Helper functions for testing
export const createMockEvent = (type: string, properties = {}) => {
  const event = new Event(type, { bubbles: true })
  Object.assign(event, properties)
  return event
}

export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0))
}
