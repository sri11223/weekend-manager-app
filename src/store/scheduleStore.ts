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

// Helper function to get time slots between start and end
const getTimeSlotsBetween = (startTime: string, endTime: string): string[] => {
  const startIndex = TIME_SLOTS.indexOf(startTime)
  const endIndex = TIME_SLOTS.indexOf(endTime)
  
  if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
    return [startTime] // Return just the start slot if invalid range
  }
  
  return TIME_SLOTS.slice(startIndex, endIndex)
}

// Helper function to check if any time slots in a range are occupied
const areSlotsBetweenOccupied = (currentActivities: ScheduledActivity[], startTime: string, endTime: string, day: 'saturday' | 'sunday'): boolean => {
  const slotsInRange = getTimeSlotsBetween(startTime, endTime)
  
  return slotsInRange.some(slot => 
    currentActivities.some(activity => 
      activity.day === day && 
      (activity.startTime === slot || (activity as any).timeSlot === slot)
    )
  )
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
          
          // Calculate end time and duration in hours
          const endTime = calculateEndTime(timeSlot, activity.duration)
          const durationHours = Math.ceil(activity.duration / 60)
          
          // Check if any slots in the time range are occupied
          if (areSlotsBetweenOccupied(currentActivities, timeSlot, endTime, day)) {
            console.log('One or more time slots in the duration range are already occupied')
            return false
          }
          
          // Create the main scheduled activity
          const scheduledActivity: any = {
            ...activity,
            id: `${activity.id}-${Date.now()}`,
            title: activity.name, // Convert name to title for timeline compatibility
            timeSlot: timeSlot,
            day,
            startTime: timeSlot,
            endTime: endTime,
            isMainActivity: true, // Mark as the primary activity
            spansDuration: durationHours > 1 // Flag for multi-hour activities
          }
          
          const activitiesToAdd = [scheduledActivity]
          
          // Create blocking activities for subsequent time slots if duration > 1 hour
          if (durationHours > 1) {
            const occupiedSlots = getTimeSlotsBetween(timeSlot, endTime)
            
            // Create blocking activities for each subsequent slot (skip the first one)
            for (let i = 1; i < occupiedSlots.length; i++) {
              const blockingActivity: any = {
                ...activity,
                id: `${activity.id}-${Date.now()}-block-${i}`,
                title: activity.name,
                timeSlot: occupiedSlots[i],
                day,
                startTime: occupiedSlots[i],
                endTime: endTime,
                isBlocked: true, // Mark as a continuation/blocking slot
                isMainActivity: false,
                parentActivityId: scheduledActivity.id, // Reference to main activity
                spansDuration: false
              }
              activitiesToAdd.push(blockingActivity)
            }
          }
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: [...currentActivities, ...activitiesToAdd]
            }
          }))
          
          console.log(`✅ Added activity "${activity.name}" spanning ${durationHours} hour(s) from ${timeSlot} to ${endTime}`)
          return true
        },

        removeActivity: (activityId) => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          const currentActivities = state.weekendActivities[weekendKey] || []
          
          // Find the activity to remove
          const activityToRemove = currentActivities.find(a => a.id === activityId || a.scheduledId === activityId)
          
          if (!activityToRemove) return
          
          // If removing a main activity, also remove all its blocking activities
          // If removing a blocking activity, remove the main activity and all related blocks
          const mainActivityId = activityToRemove.isMainActivity 
            ? activityToRemove.id 
            : activityToRemove.parentActivityId
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: currentActivities.filter(a => 
                a.id !== activityId && 
                a.scheduledId !== activityId &&
                a.id !== mainActivityId &&
                a.parentActivityId !== mainActivityId
              )
            }
          }))
          
          console.log(`✅ Removed activity and all related blocking slots for ID: ${activityId}`)
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
          // A slot is occupied if there's any activity (main or blocking) in that slot
          return currentActivities.some(a => 
            a.day === day && 
            (a.startTime === timeSlot || (a as any).timeSlot === timeSlot)
          )
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
