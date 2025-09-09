import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Activity, ScheduledActivity, WeekendPlan, PlanTheme } from '@/types'
import { SAMPLE_ACTIVITIES } from '@/constants'

interface WeekendStore {
  // State
  currentPlan: WeekendPlan | null
  activities: Activity[]
  selectedActivities: Activity[]
  loading: boolean
  error: string | null

  // Actions - Plan Management
  createNewPlan: (name: string, theme: PlanTheme) => void
  updatePlan: (updates: Partial<WeekendPlan>) => void
  deletePlan: () => void
  loadPlan: (planId: string) => void

  // Actions - Activity Management
  addToSelected: (activity: Activity) => void
  removeFromSelected: (activityId: string) => void
  clearSelected: () => void
  addActivityToPlan: (activity: Activity, day: 'saturday' | 'sunday' | 'friday' | 'monday', startTime: string) => void
  removeActivityFromPlan: (scheduledId: string) => void
  updateScheduledActivity: (scheduledId: string, updates: Partial<ScheduledActivity>) => void
  reorderActivities: (day: 'saturday' | 'sunday' | 'friday' | 'monday', oldIndex: number, newIndex: number) => void

  // Computed
  getActivitiesByDay: (day: 'saturday' | 'sunday' | 'friday' | 'monday') => ScheduledActivity[]
  getRecommendedActivities: () => Activity[]
  calculatePlanCost: () => number
  getPlanDuration: () => number
}

export const useWeekendStore = create<WeekendStore>()(
  persist(
    (set, get) => ({
      // Initial State
      currentPlan: null,
      activities: SAMPLE_ACTIVITIES,
      selectedActivities: [],
      loading: false,
      error: null,

      // Plan Management
      createNewPlan: (name: string, theme: PlanTheme) => {
        const newPlan: WeekendPlan = {
          id: crypto.randomUUID(),
          name,
          theme,
          createdAt: new Date(),
          updatedAt: new Date(),
          activities: [],
          isLongWeekend: false
        }
        set({ currentPlan: newPlan })
      },

      updatePlan: (updates: Partial<WeekendPlan>) => {
        set((state) => ({
          currentPlan: state.currentPlan 
            ? { ...state.currentPlan, ...updates, updatedAt: new Date() }
            : null
        }))
      },

      deletePlan: () => {
        set({ currentPlan: null, selectedActivities: [] })
      },

      loadPlan: (planId: string) => {
        // In a real app, this would fetch from API/database
        console.log('Loading plan:', planId)
      },

      // Activity Management
      addToSelected: (activity: Activity) => {
        set((state) => ({
          selectedActivities: state.selectedActivities.some(a => a.id === activity.id)
            ? state.selectedActivities
            : [...state.selectedActivities, activity]
        }))
      },

      removeFromSelected: (activityId: string) => {
        set((state) => ({
          selectedActivities: state.selectedActivities.filter(a => a.id !== activityId)
        }))
      },

      clearSelected: () => {
        set({ selectedActivities: [] })
      },

      addActivityToPlan: (activity: Activity, day: 'saturday' | 'sunday' | 'friday' | 'monday', startTime: string) => {
        const scheduledActivity: ScheduledActivity = {
          ...activity,
          scheduledId: crypto.randomUUID(),
          day,
          startTime,
          endTime: calculateEndTime(startTime, activity.duration),
          completed: false
        }

        set((state) => ({
          currentPlan: state.currentPlan
            ? {
                ...state.currentPlan,
                activities: [...state.currentPlan.activities, scheduledActivity],
                updatedAt: new Date()
              }
            : null
        }))
      },

      removeActivityFromPlan: (scheduledId: string) => {
        set((state) => ({
          currentPlan: state.currentPlan
            ? {
                ...state.currentPlan,
                activities: state.currentPlan.activities.filter(a => a.scheduledId !== scheduledId),
                updatedAt: new Date()
              }
            : null
        }))
      },

      updateScheduledActivity: (scheduledId: string, updates: Partial<ScheduledActivity>) => {
        set((state) => ({
          currentPlan: state.currentPlan
            ? {
                ...state.currentPlan,
                activities: state.currentPlan.activities.map(a =>
                  a.scheduledId === scheduledId ? { ...a, ...updates } : a
                ),
                updatedAt: new Date()
              }
            : null
        }))
      },

      reorderActivities: (day: 'saturday' | 'sunday' | 'friday' | 'monday', oldIndex: number, newIndex: number) => {
        set((state) => {
          if (!state.currentPlan) return state

          const dayActivities = state.currentPlan.activities.filter(a => a.day === day)
          const otherActivities = state.currentPlan.activities.filter(a => a.day !== day)
          
          const reorderedDayActivities = [...dayActivities]
          const [removed] = reorderedDayActivities.splice(oldIndex, 1)
          reorderedDayActivities.splice(newIndex, 0, removed)

          return {
            currentPlan: {
              ...state.currentPlan,
              activities: [...otherActivities, ...reorderedDayActivities],
              updatedAt: new Date()
            }
          }
        })
      },

      // Computed Values
      getActivitiesByDay: (day: 'saturday' | 'sunday' | 'friday' | 'monday') => {
        const state = get()
        return state.currentPlan?.activities.filter(a => a.day === day) || []
      },

      getRecommendedActivities: () => {
        const state = get()
        // Simple recommendation logic based on selected activities
        if (state.selectedActivities.length === 0) {
          return state.activities.slice(0, 3)
        }
        
        // Recommend activities from similar categories
        const selectedCategories = state.selectedActivities.map(a => a.category)
        return state.activities.filter(a => 
          !state.selectedActivities.some(s => s.id === a.id) &&
          selectedCategories.includes(a.category)
        ).slice(0, 3)
      },

      calculatePlanCost: () => {
        const state = get()
        if (!state.currentPlan) return 0

        return state.currentPlan.activities.reduce((total, activity) => {
          const costMap = { free: 0, low: 15, medium: 30, high: 60 }
          return total + (costMap[activity.cost] || 0)
        }, 0)
      },

      getPlanDuration: () => {
        const state = get()
        if (!state.currentPlan) return 0

        return state.currentPlan.activities.reduce((total, activity) => {
          return total + activity.duration
        }, 0)
      }
    }),
    {
      name: 'weekend-store',
      version: 1
    }
  )
)

// Helper function to calculate end time
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, 0, 0)
  
  const endDate = new Date(startDate.getTime() + durationMinutes * 60000)
  
  return `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`
}
