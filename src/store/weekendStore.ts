import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ScheduledActivity {
  id: string
  activityId: string
  title: string
  category: string
  duration: number
  cost: number
  weatherPreference: string
  moodTags: string[]
  description: string
  image: string
  day: 'saturday' | 'sunday'
  timeSlot: string
  startTime: string
  endTime: string
  [key: string]: any
}

interface WeekendPlanState {
  scheduledActivities: ScheduledActivity[]
  totalCost: number
  
  // Long Weekend State
  isLongWeekendMode: boolean
  longWeekendDays: string[]
  upcomingHolidays: Array<{
    date: string;
    localName: string;
    name: string;
    countryCode: string;
  }>
  
  // Actions
  addActivity: (activity: any, day: 'saturday' | 'sunday', timeSlot: string) => void
  removeActivity: (id: string) => void
  moveActivity: (id: string, newDay: 'saturday' | 'sunday', newTimeSlot: string) => void
  clearSchedule: () => void
  getActivitiesForDay: (day: 'saturday' | 'sunday') => ScheduledActivity[]
  getActivityForSlot: (day: 'saturday' | 'sunday', timeSlot: string) => ScheduledActivity | null
  calculateTotalCost: () => number
  hasTimeConflict: (day: 'saturday' | 'sunday', timeSlot: string, duration: number) => boolean
  
  // Long Weekend Actions
  setLongWeekendMode: (enabled: boolean, days?: string[]) => void
  setUpcomingHolidays: (holidays: Array<{date: string; localName: string; name: string; countryCode: string}>) => void
  getAvailableDays: () => string[]
}

const TIME_SLOTS = {
  '9:00 AM': { start: 9, duration: 3 },
  '12:00 PM': { start: 12, duration: 3 },
  '3:00 PM': { start: 15, duration: 3 },
  '6:00 PM': { start: 18, duration: 3 },
  '9:00 PM': { start: 21, duration: 3 }
}

export const useWeekendStore = create<WeekendPlanState>()(
  persist(
    (set, get) => ({
      scheduledActivities: [],
      totalCost: 0,
      
      // Long Weekend State
      isLongWeekendMode: false,
      longWeekendDays: ['saturday', 'sunday'],
      upcomingHolidays: [],

      addActivity: (activity, day, timeSlot) => {
        const newScheduledActivity: ScheduledActivity = {
          id: `${activity.id}-${day}-${timeSlot}-${Date.now()}`,
          activityId: activity.id,
          title: activity.title,
          category: activity.category,
          duration: activity.duration,
          cost: activity.cost,
          weatherPreference: activity.weatherPreference,
          moodTags: activity.moodTags || [],
          description: activity.description,
          image: activity.image,
          day,
          timeSlot,
          startTime: timeSlot,
          endTime: calculateEndTime(timeSlot, activity.duration),
          ...activity
        }

        set((state) => {
          const newActivities = [...state.scheduledActivities, newScheduledActivity]
          return {
            scheduledActivities: newActivities,
            totalCost: calculateTotalCostFromActivities(newActivities)
          }
        })
      },

      removeActivity: (id) => {
        set((state) => {
          const newActivities = state.scheduledActivities.filter(a => a.id !== id)
          return {
            scheduledActivities: newActivities,
            totalCost: calculateTotalCostFromActivities(newActivities)
          }
        })
      },

      moveActivity: (id, newDay, newTimeSlot) => {
        set((state) => {
          const newActivities = state.scheduledActivities.map(activity => 
            activity.id === id 
              ? { 
                  ...activity, 
                  day: newDay, 
                  timeSlot: newTimeSlot,
                  startTime: newTimeSlot,
                  endTime: calculateEndTime(newTimeSlot, activity.duration)
                }
              : activity
          )
          return {
            scheduledActivities: newActivities,
            totalCost: calculateTotalCostFromActivities(newActivities)
          }
        })
      },

      clearSchedule: () => {
        set({ scheduledActivities: [], totalCost: 0 })
      },

      getActivitiesForDay: (day) => {
        return get().scheduledActivities.filter(activity => activity.day === day)
      },

      getActivityForSlot: (day, timeSlot) => {
        return get().scheduledActivities.find(
          activity => activity.day === day && activity.timeSlot === timeSlot
        ) || null
      },

      calculateTotalCost: () => {
        return calculateTotalCostFromActivities(get().scheduledActivities)
      },

      hasTimeConflict: (day, timeSlot, duration) => {
        const activities = get().getActivitiesForDay(day)
        const slotInfo = TIME_SLOTS[timeSlot as keyof typeof TIME_SLOTS]
        
        if (!slotInfo) return false

        const newStart = slotInfo.start
        const newEnd = newStart + (duration / 60) // Convert minutes to hours

        return activities.some(activity => {
          const activitySlotInfo = TIME_SLOTS[activity.timeSlot as keyof typeof TIME_SLOTS]
          if (!activitySlotInfo) return false

          const activityStart = activitySlotInfo.start
          const activityEnd = activityStart + (activity.duration / 60)

          // Check for overlap
          return (newStart < activityEnd && newEnd > activityStart)
        })
      },

      // Long Weekend Actions
      setLongWeekendMode: (enabled, days) => {
        set(() => ({
          isLongWeekendMode: enabled,
          longWeekendDays: days || ['saturday', 'sunday', 'monday', 'friday']
        }))
      },

      setUpcomingHolidays: (holidays) => {
        set(() => ({
          upcomingHolidays: holidays
        }))
      },

      getAvailableDays: () => {
        const state = get()
        return state.isLongWeekendMode 
          ? state.longWeekendDays 
          : ['saturday', 'sunday']
      }
    }),
    {
      name: 'weekend-planner-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migration from version 0 to 1
          return {
            scheduledActivities: [],
            totalCost: 0
          }
        }
        return persistedState
      }
    }
  )
)

// Helper functions
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [time, period] = startTime.split(' ')
  const [hours, minutes] = time.split(':').map(Number)
  
  let hour24 = hours
  if (period === 'PM' && hours !== 12) hour24 += 12
  if (period === 'AM' && hours === 12) hour24 = 0

  const endHour24 = hour24 + Math.floor(durationMinutes / 60)
  const endMinutes = minutes + (durationMinutes % 60)
  
  let finalHour = endHour24
  let finalMinutes = endMinutes
  
  if (finalMinutes >= 60) {
    finalHour += 1
    finalMinutes -= 60
  }

  const finalPeriod = finalHour >= 12 ? 'PM' : 'AM'
  const displayHour = finalHour > 12 ? finalHour - 12 : (finalHour === 0 ? 12 : finalHour)
  
  return `${displayHour}:${finalMinutes.toString().padStart(2, '0')} ${finalPeriod}`
}

function calculateTotalCostFromActivities(activities: ScheduledActivity[]): number {
  return activities.reduce((total, activity) => total + activity.cost, 0)
}
