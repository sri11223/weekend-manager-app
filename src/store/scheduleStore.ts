import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ScheduledActivity, Activity } from '../types/index'
import { databaseService } from '../services/database/DatabaseService'

// Using global ScheduledActivity type from types/index.ts

interface ScheduleState {
  // Store activities by weekend date keys (e.g., "2024-09-14_2024-09-15")
  weekendActivities: { [weekendKey: string]: ScheduledActivity[] }
  
  // Current selected weekend
  currentWeekend: { saturday: Date, sunday: Date }
  
  // Methods to work with date-specific storage
  setCurrentWeekend: (saturday: Date, sunday: Date) => void
  addActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => boolean
  removeActivity: (activityId: string) => void
  moveActivity: (activityId: string, newTimeSlot: string, newDay: 'saturday' | 'sunday') => boolean
  getActivitiesForDay: (day: 'saturday' | 'sunday') => ScheduledActivity[]
  getActivitiesForSlot: (day: 'saturday' | 'sunday', timeSlot: string) => ScheduledActivity[]
  isSlotOccupied: (day: 'saturday' | 'sunday', timeSlot: string) => boolean
  clearAllActivities: () => void
  getCurrentWeekendActivities: () => ScheduledActivity[]
}

// Time slot mapping for blocking logic
const TIME_SLOTS = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

// Helper function to calculate end time based on start time and duration
const calculateEndTime = (startTime: string, duration: number): string => {
  const startIndex = TIME_SLOTS.indexOf(startTime)
  if (startIndex === -1) return startTime
  
  const hoursToAdd = Math.ceil(duration / 60)
  const endIndex = Math.min(startIndex + hoursToAdd, TIME_SLOTS.length - 1)
  return TIME_SLOTS[endIndex]
}

// Helper function to generate weekend key for storage
const getWeekendKey = (saturday: Date, sunday: Date): string => {
  const satKey = saturday.toISOString().split('T')[0] // YYYY-MM-DD
  const sunKey = sunday.toISOString().split('T')[0]
  return `${satKey}_${sunKey}`
}

// Helper function to get current weekend (fallback)
const getCurrentWeekend = (): { saturday: Date, sunday: Date } => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysToSaturday = (6 - dayOfWeek) % 7
  const saturday = new Date(today)
  saturday.setDate(today.getDate() + daysToSaturday)
  const sunday = new Date(saturday)
  sunday.setDate(saturday.getDate() + 1)
  return { saturday, sunday }
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => {
      const { saturday, sunday } = getCurrentWeekend()
      return {
        weekendActivities: {},
        currentWeekend: { saturday, sunday },

        setCurrentWeekend: (saturday: Date, sunday: Date) => {
          set({ currentWeekend: { saturday, sunday } })
        },

        getCurrentWeekendActivities: () => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          return state.weekendActivities[weekendKey] || []
        },

        addActivity: (activity, timeSlot, day) => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          const currentActivities = state.weekendActivities[weekendKey] || []
          
          // Check if slot is already occupied
          const existingActivity = currentActivities.find(
            a => a.startTime === timeSlot && a.day === day
          )
          
          if (existingActivity) {
            console.log('Time slot already occupied')
            return false
          }
          
          // Create scheduled activity (using timeline-compatible properties)
          const scheduledActivity: any = {
            ...activity,
            id: `${activity.id}-${Date.now()}`,
            title: activity.name, // Convert name to title for timeline compatibility
            timeSlot: timeSlot,
            day,
            startTime: timeSlot,
            endTime: calculateEndTime(timeSlot, activity.duration)
          }
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: [...currentActivities, scheduledActivity]
            }
          }))
          
          return true
        },

        removeActivity: (activityId) => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          const currentActivities = state.weekendActivities[weekendKey] || []
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: currentActivities.filter(a => a.id !== activityId && a.scheduledId !== activityId)
            }
          }))
        },

        moveActivity: (activityId, newTimeSlot, newDay) => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          const currentActivities = state.weekendActivities[weekendKey] || []
          const activity = currentActivities.find(a => a.id === activityId || a.scheduledId === activityId)
          
          if (!activity) return false
          
          // Check if new slot is available
          const conflictingActivity = currentActivities.find(
            a => (a.id !== activityId && a.scheduledId !== activityId) && 
                 (a.startTime === newTimeSlot || (a as any).timeSlot === newTimeSlot) && a.day === newDay
          )
          
          if (conflictingActivity) return false
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: currentActivities.map(a =>
                (a.id === activityId || a.scheduledId === activityId)
                  ? { ...a, day: newDay, startTime: newTimeSlot, timeSlot: newTimeSlot, endTime: calculateEndTime(newTimeSlot, a.duration) }
                  : a
              )
            }
          }))
          
          return true
        },

        getActivitiesForDay: (day) => {
          const state = get()
          const currentActivities = state.getCurrentWeekendActivities()
          return currentActivities.filter(a => a.day === day)
        },

        getActivitiesForSlot: (day, timeSlot) => {
          const state = get()
          const currentActivities = state.getCurrentWeekendActivities()
          return currentActivities.filter(a => a.day === day && (a.startTime === timeSlot || (a as any).timeSlot === timeSlot))
        },

        isSlotOccupied: (day, timeSlot) => {
          const state = get()
          const currentActivities = state.getCurrentWeekendActivities()
          return currentActivities.some(a => a.day === day && (a.startTime === timeSlot || (a as any).timeSlot === timeSlot))
        },

        clearAllActivities: () => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: []
            }
          }))
        }
      }
    },
    {
      name: 'weekend-schedule-storage',
      version: 2
    }
  )
)
