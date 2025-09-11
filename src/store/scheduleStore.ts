import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ScheduledActivity, Activity } from '../types/index'

// Using global ScheduledActivity type from types/index.ts

interface ScheduleState {
  scheduledActivities: ScheduledActivity[]
  addActivity: (activity: any, timeSlot: string, day: 'saturday' | 'sunday') => boolean
  removeActivity: (activityId: string) => void
  moveActivity: (activityId: string, newTimeSlot: string, newDay: 'saturday' | 'sunday') => boolean
  getActivitiesForDay: (day: 'saturday' | 'sunday') => ScheduledActivity[]
  getActivitiesForSlot: (day: 'saturday' | 'sunday', timeSlot: string) => ScheduledActivity[]
  isSlotOccupied: (day: 'saturday' | 'sunday', timeSlot: string) => boolean
  clearAllActivities: () => void
}

// Time slot mapping for blocking logic
const TIME_SLOTS = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      scheduledActivities: [],

      addActivity: (activity, timeSlot, day) => {
        const state = get()
        
        // Check if slot is already occupied
        if (state.isSlotOccupied(day, timeSlot)) {
          console.log('⚠️ Time slot already occupied')
          return false
        }

        const duration = activity.duration || 60
        const hoursToBlock = Math.ceil(duration / 60)
        const currentIndex = TIME_SLOTS.indexOf(timeSlot)
        
        if (currentIndex === -1) return false

        const newActivities: Activity[] = []
        const mainId = `${activity.id}-${Date.now()}`
        
        // Main activity
        newActivities.push({
          ...activity,
          timeSlot,
          day,
          id: mainId,
          originalDuration: duration
        })
        
        // Block subsequent slots for multi-hour activities
        if (hoursToBlock > 1) {
          for (let i = 1; i < hoursToBlock && currentIndex + i < TIME_SLOTS.length; i++) {
            const nextTimeSlot = TIME_SLOTS[currentIndex + i]
            
            // Check if next slot is available
            if (state.isSlotOccupied(day, nextTimeSlot)) {
              console.log(`⚠️ Cannot block ${nextTimeSlot} - already occupied`)
              return false // Prevent partial blocking
            }
            
            newActivities.push({
              ...activity,
              id: `${mainId}-block-${i}`,
              title: `${activity.title} (continued)`,
              description: `Part ${i + 1} of ${activity.title}`,
              timeSlot: nextTimeSlot,
              day,
              isBlocked: true,
              originalId: mainId,
              duration: 60
            })
          }
        }

        set(state => ({
          scheduledActivities: [...state.scheduledActivities, ...newActivities]
        }))
        
        console.log(`✅ Added activity: ${activity.title} (${hoursToBlock}h blocked)`)
        return true
      },

      removeActivity: (activityId) => {
        set(state => {
          // Remove main activity and any blocked time slots
          const baseId = activityId.includes('-block-') ? activityId.split('-block-')[0] : activityId
          const filtered = state.scheduledActivities.filter(a => 
            a.id !== activityId && 
            a.originalId !== baseId && 
            !a.id.startsWith(`${baseId}-block-`)
          )
          
          console.log(`🗑️ Removed activity: ${activityId}`)
          return { scheduledActivities: filtered }
        })
      },

      moveActivity: (activityId, newTimeSlot, newDay) => {
        const state = get()
        const activity = state.scheduledActivities.find(a => a.id === activityId)
        
        if (!activity || activity.isBlocked) return false
        
        // Remove old activity first
        state.removeActivity(activityId)
        
        // Add to new location
        return state.addActivity(activity, newTimeSlot, newDay)
      },

      getActivitiesForDay: (day) => {
        return get().scheduledActivities.filter(a => a.day === day)
      },

      getActivitiesForSlot: (day, timeSlot) => {
        return get().scheduledActivities.filter(a => a.day === day && a.timeSlot === timeSlot)
      },

      isSlotOccupied: (day, timeSlot) => {
        return get().scheduledActivities.some(a => a.day === day && a.timeSlot === timeSlot)
      },

      clearAllActivities: () => {
        set({ scheduledActivities: [] })
      }
    }),
    {
      name: 'weekendly-schedule',
      version: 1
    }
  )
)
