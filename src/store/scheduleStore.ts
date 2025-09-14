import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ScheduledActivity, Activity } from '../types'

// Using global ScheduledActivity type from types/index.ts

interface ScheduleState {
  // Store activities by weekend date keys (e.g., "2024-09-14_2024-09-15")
  weekendActivities: { [weekendKey: string]: ScheduledActivity[] }
  
  // Current selected weekend (can be Date objects or strings after persistence)
  currentWeekend: { saturday: Date | string, sunday: Date | string }
  
  // Methods to work with date-specific storage
  setCurrentWeekend: (saturday: Date, sunday: Date) => void
  addActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => boolean
  removeActivity: (activityId: string) => void
  moveActivity: (activityId: string, newTimeSlot: string, newDay: 'saturday' | 'sunday' | 'friday' | 'monday') => boolean
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
const areSlotsBetweenOccupied = (currentActivities: ScheduledActivity[], startTime: string, endTime: string, day: 'saturday' | 'sunday' | 'friday' | 'monday'): boolean => {
  const slotsInRange = getTimeSlotsBetween(startTime, endTime)
  
  return slotsInRange.some(slot => 
    currentActivities.some(activity => 
      activity.day === day && 
      (activity.startTime === slot || (activity as any).timeSlot === slot)
    )
  )
}

// Helper function to generate weekend key for storage
const getWeekendKey = (saturday: Date | string, sunday: Date | string): string => {
  // Handle both Date objects and string representations
  const satKey = saturday instanceof Date 
    ? saturday.toISOString().split('T')[0] 
    : new Date(saturday).toISOString().split('T')[0]
  const sunKey = sunday instanceof Date 
    ? sunday.toISOString().split('T')[0] 
    : new Date(sunday).toISOString().split('T')[0]
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
          try {
            const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
            return state.weekendActivities[weekendKey] || []
          } catch (error) {
            console.warn('Error getting current weekend activities, using fallback:', error)
            // Fallback: reinitialize with current weekend if dates are corrupted
            const { saturday, sunday } = getCurrentWeekend()
            set({ currentWeekend: { saturday, sunday } })
            const weekendKey = getWeekendKey(saturday, sunday)
            return state.weekendActivities[weekendKey] || []
          }
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
          const newId = `${activity.id}-${Date.now()}`
          const scheduledActivity: any = {
            ...activity,
            id: newId,
            scheduledId: newId, // Ensure scheduledId matches id
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
              const blockingId = `${activity.id}-${Date.now()}-block-${i}`
              const blockingActivity: any = {
                ...activity,
                id: blockingId,
                scheduledId: blockingId, // Ensure scheduledId matches id
                title: activity.name,
                timeSlot: occupiedSlots[i],
                day,
                startTime: occupiedSlots[i],
                endTime: endTime,
                isBlocked: true, // Mark as a continuation/blocking slot
                isMainActivity: false,
                parentActivityId: newId, // Reference to main activity using the consistent ID
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
          
          if (!activityToRemove) {
            console.log(`❌ Activity not found for ID: ${activityId}`)
            return
          }
          
          // Determine which activities to remove
          let activitiesToRemove: string[] = []
          
          if (activityToRemove.isMainActivity) {
            // Removing a main activity - also remove all its blocking activities
            const mainId = activityToRemove.id
            activitiesToRemove = currentActivities
              .filter(a => a.id === mainId || a.parentActivityId === mainId)
              .map(a => a.id)
          } else if (activityToRemove.isBlocked && activityToRemove.parentActivityId) {
            // Removing a blocking activity - remove the main activity and all related blocks
            const parentId = activityToRemove.parentActivityId
            activitiesToRemove = currentActivities
              .filter(a => a.id === parentId || a.parentActivityId === parentId)
              .map(a => a.id)
          } else {
            // Regular single activity
            activitiesToRemove = [activityToRemove.id]
          }
          
          // Also include scheduledId matching for backward compatibility
          const scheduledIdsToRemove = [activityId]
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: currentActivities.filter(a => 
                !activitiesToRemove.includes(a.id) && 
                !scheduledIdsToRemove.includes(a.scheduledId || '') &&
                !scheduledIdsToRemove.includes(a.id)
              )
            }
          }))
          
          console.log(`✅ Removed ${activitiesToRemove.length} activity/activities for ID: ${activityId}`)
        },

        moveActivity: (activityId, newTimeSlot, newDay) => {
          const state = get()
          const weekendKey = getWeekendKey(state.currentWeekend.saturday, state.currentWeekend.sunday)
          const currentActivities = state.weekendActivities[weekendKey] || []
          const activity = currentActivities.find(a => a.scheduledId === activityId || a.id === activityId)
          
          if (!activity) {
            console.log(`❌ Activity not found for move: ${activityId}`)
            return false
          }
          
          // Calculate new end time and check for conflicts
          const newEndTime = calculateEndTime(newTimeSlot, activity.duration)
          const durationHours = Math.ceil(activity.duration / 60)
          
          // Check if any slots in the new time range are occupied (excluding current activity group)
          if (areSlotsBetweenOccupied(currentActivities, newTimeSlot, newEndTime, newDay)) {
            // Filter out activities that belong to the current activity group before checking conflicts
            const otherActivities = currentActivities.filter(a => {
              // Exclude the main activity and its blocking activities
              const isMainActivity = a.id === activityId || a.scheduledId === activityId
              const isBlockingActivity = activity.isMainActivity 
                ? a.parentActivityId === activity.id
                : a.parentActivityId === activity.parentActivityId || a.id === activity.parentActivityId
              return !isMainActivity && !isBlockingActivity
            })
            
            if (areSlotsBetweenOccupied(otherActivities, newTimeSlot, newEndTime, newDay)) {
              console.log(`❌ New time slot range is occupied`)
              return false
            }
          }
          
          // Step 1: Remove the old activity and all its related blocking activities
          let activitiesToRemove: string[] = []
          
          if (activity.isMainActivity) {
            // Moving a main activity - remove it and all its blocks
            const mainId = activity.scheduledId || activity.id
            activitiesToRemove = currentActivities
              .filter(a => (a.scheduledId || a.id) === mainId || a.parentActivityId === mainId)
              .map(a => a.scheduledId || a.id)
          } else if (activity.isBlocked && activity.parentActivityId) {
            // Moving a blocking activity - remove the main activity and all related blocks
            const parentId = activity.parentActivityId
            activitiesToRemove = currentActivities
              .filter(a => (a.scheduledId || a.id) === parentId || a.parentActivityId === parentId)
              .map(a => a.scheduledId || a.id)
          } else {
            // Regular single activity
            activitiesToRemove = [activity.scheduledId || activity.id]
          }
          
          // Get the original activity data for recreation
          const originalActivity = activity.isMainActivity ? activity : currentActivities.find(a => (a.scheduledId || a.id) === activity.parentActivityId)
          if (!originalActivity) {
            console.log(`❌ Could not find original activity data`)
            return false
          }
          
          // Step 2: Create new activity and blocking slots in the new position
          const newMainId = `${originalActivity.id.split('-')[0]}-${Date.now()}-moved`
          const newMainActivity: ScheduledActivity = {
            ...originalActivity,
            id: newMainId,
            scheduledId: newMainId,
            day: newDay,
            startTime: newTimeSlot,
            endTime: newEndTime,
            isMainActivity: true,
            isBlocked: false,
            parentActivityId: undefined,
            spansDuration: durationHours > 1
          }
          
          const newActivities = [newMainActivity]
          
          // Create new blocking activities if needed
          if (durationHours > 1) {
            const occupiedSlots = getTimeSlotsBetween(newTimeSlot, newEndTime)
            
            for (let i = 1; i < occupiedSlots.length; i++) {
              const blockingId = `${newMainId}-block-${i}`
              const blockingActivity: ScheduledActivity = {
                ...originalActivity,
                id: blockingId,
                scheduledId: blockingId,
                day: newDay,
                startTime: occupiedSlots[i],
                endTime: newEndTime,
                isBlocked: true,
                isMainActivity: false,
                parentActivityId: newMainId,
                spansDuration: false
              }
              newActivities.push(blockingActivity)
            }
          }
          
          // Step 3: Update the store
          const otherActivities = currentActivities.filter(a => !activitiesToRemove.includes(a.scheduledId || a.id))
          
          set(state => ({
            weekendActivities: {
              ...state.weekendActivities,
              [weekendKey]: [...otherActivities, ...newActivities]
            }
          }))
          
          console.log(`✅ Moved activity "${originalActivity.name}" from ${activity.startTime} to ${newTimeSlot}, spanning ${durationHours} hour(s)`)
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
