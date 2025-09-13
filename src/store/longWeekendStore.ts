import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Activity } from '../types/index'

export interface LongWeekendActivity {
  id: string
  activityId: string
  title: string
  description: string
  category: string
  duration: number
  cost: number
  weatherPreference: string
  moodTags: string[]
  image: string
  day: 'friday' | 'saturday' | 'sunday' | 'monday'
  timeSlot: string
  startTime: string
  endTime: string
  isMainActivity?: boolean
  isBlocked?: boolean
  parentActivityId?: string
  spansDuration?: boolean
}

interface LongWeekendDates {
  friday: Date
  saturday: Date
  sunday: Date
  monday: Date
}

interface LongWeekendPlanState {
  // Storage by long weekend key (e.g., "2024-09-13_2024-09-16" for Fri-Mon)
  longWeekendActivities: { [longWeekendKey: string]: LongWeekendActivity[] }
  
  // Current selected long weekend
  currentLongWeekend: LongWeekendDates | null
  
  // Long weekend metadata
  upcomingHolidays: Array<{
    date: string
    localName: string
    name: string
    countryCode: string
  }>
  
  // Actions
  setCurrentLongWeekend: (dates: LongWeekendDates) => void
  addLongWeekendActivity: (activity: Activity, timeSlot: string, day: 'friday' | 'saturday' | 'sunday' | 'monday') => boolean
  removeLongWeekendActivity: (activityId: string) => void
  moveLongWeekendActivity: (activityId: string, newTimeSlot: string, newDay: 'friday' | 'saturday' | 'sunday' | 'monday') => boolean
  getActivitiesForLongWeekendDay: (day: 'friday' | 'saturday' | 'sunday' | 'monday') => LongWeekendActivity[]
  getActivitiesForLongWeekendSlot: (day: 'friday' | 'saturday' | 'sunday' | 'monday', timeSlot: string) => LongWeekendActivity[]
  isLongWeekendSlotOccupied: (day: 'friday' | 'saturday' | 'sunday' | 'monday', timeSlot: string) => boolean
  clearLongWeekendActivities: () => void
  getCurrentLongWeekendActivities: () => LongWeekendActivity[]
  setUpcomingHolidays: (holidays: Array<{date: string; localName: string; name: string; countryCode: string}>) => void
}

// Helper function to generate long weekend key for storage
const getLongWeekendKey = (dates: LongWeekendDates): string => {
  const friKey = dates.friday.toISOString().split('T')[0] // YYYY-MM-DD
  const monKey = dates.monday.toISOString().split('T')[0]
  return `${friKey}_${monKey}`
}

// Helper function to get current long weekend (fallback)
const getCurrentLongWeekend = (): LongWeekendDates => {
  const today = new Date()
  // Find next Friday
  const dayOfWeek = today.getDay()
  const daysToFriday = (5 - dayOfWeek + 7) % 7 || 7 // Next Friday (or today if Friday)
  const friday = new Date(today)
  friday.setDate(today.getDate() + daysToFriday)
  
  const saturday = new Date(friday)
  saturday.setDate(friday.getDate() + 1)
  
  const sunday = new Date(friday)
  sunday.setDate(friday.getDate() + 2)
  
  const monday = new Date(friday)
  monday.setDate(friday.getDate() + 3)
  
  return { friday, saturday, sunday, monday }
}

export const useLongWeekendStore = create<LongWeekendPlanState>()(
  persist(
    (set, get) => ({
      longWeekendActivities: {},
      currentLongWeekend: null,
      upcomingHolidays: [],
      
      setCurrentLongWeekend: (dates) => {
        set({ currentLongWeekend: dates })
        console.log('📅 Set current long weekend:', {
          friday: dates.friday.toDateString(),
          saturday: dates.saturday.toDateString(),
          sunday: dates.sunday.toDateString(),
          monday: dates.monday.toDateString()
        })
      },
      
      addLongWeekendActivity: (activity, timeSlot, day) => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        const currentActivities = state.longWeekendActivities[longWeekendKey] || []
        
        // Check if slot is already occupied
        const isOccupied = currentActivities.some(
          existing => existing.day === day && existing.timeSlot === timeSlot
        )
        
        if (isOccupied) {
          console.log('❌ Long weekend slot already occupied:', { day, timeSlot })
          return false
        }
        
        // Create new activity
        const newActivity: LongWeekendActivity = {
          id: `lw-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          activityId: activity.id,
          title: activity.name,
          description: activity.description,
          category: activity.category,
          duration: activity.duration,
          cost: typeof activity.cost === 'string' ? 0 : (activity.cost || 0),
          weatherPreference: activity.weatherDependent ? 'sunny' : 'any',
          moodTags: activity.tags || [],
          image: activity.icon || '',
          day,
          timeSlot,
          startTime: timeSlot,
          endTime: timeSlot,
        }
        
        const updatedActivities = [...currentActivities, newActivity]
        
        set({
          longWeekendActivities: {
            ...state.longWeekendActivities,
            [longWeekendKey]: updatedActivities
          }
        })
        
        console.log('✅ Added long weekend activity:', newActivity)
        return true
      },
      
      removeLongWeekendActivity: (activityId) => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        const currentActivities = state.longWeekendActivities[longWeekendKey] || []
        const updatedActivities = currentActivities.filter(activity => activity.id !== activityId)
        
        set({
          longWeekendActivities: {
            ...state.longWeekendActivities,
            [longWeekendKey]: updatedActivities
          }
        })
        
        console.log('🗑️ Removed long weekend activity:', activityId)
      },
      
      moveLongWeekendActivity: (activityId, newTimeSlot, newDay) => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        const currentActivities = state.longWeekendActivities[longWeekendKey] || []
        
        // Check if new slot is occupied
        const isNewSlotOccupied = currentActivities.some(
          existing => existing.day === newDay && existing.timeSlot === newTimeSlot && existing.id !== activityId
        )
        
        if (isNewSlotOccupied) {
          console.log('❌ Cannot move - new long weekend slot occupied:', { newDay, newTimeSlot })
          return false
        }
        
        const updatedActivities = currentActivities.map(activity =>
          activity.id === activityId
            ? { ...activity, day: newDay, timeSlot: newTimeSlot, startTime: newTimeSlot, endTime: newTimeSlot }
            : activity
        )
        
        set({
          longWeekendActivities: {
            ...state.longWeekendActivities,
            [longWeekendKey]: updatedActivities
          }
        })
        
        console.log('📅 Moved long weekend activity:', { activityId, newDay, newTimeSlot })
        return true
      },
      
      getActivitiesForLongWeekendDay: (day) => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        const activities = state.longWeekendActivities[longWeekendKey] || []
        return activities.filter(activity => activity.day === day)
      },
      
      getActivitiesForLongWeekendSlot: (day, timeSlot) => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        const activities = state.longWeekendActivities[longWeekendKey] || []
        return activities.filter(activity => activity.day === day && activity.timeSlot === timeSlot)
      },
      
      isLongWeekendSlotOccupied: (day, timeSlot) => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        const activities = state.longWeekendActivities[longWeekendKey] || []
        return activities.some(activity => activity.day === day && activity.timeSlot === timeSlot)
      },
      
      clearLongWeekendActivities: () => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        set({
          longWeekendActivities: {
            ...state.longWeekendActivities,
            [longWeekendKey]: []
          }
        })
        
        console.log('🧹 Cleared long weekend activities')
      },
      
      getCurrentLongWeekendActivities: () => {
        const state = get()
        const longWeekend = state.currentLongWeekend || getCurrentLongWeekend()
        const longWeekendKey = getLongWeekendKey(longWeekend)
        
        return state.longWeekendActivities[longWeekendKey] || []
      },
      
      setUpcomingHolidays: (holidays) => {
        set({ upcomingHolidays: holidays })
        console.log('📅 Set upcoming holidays:', holidays)
      }
    }),
    {
      name: 'weekendly-long-weekend-storage',
      version: 1,
    }
  )
)

export default useLongWeekendStore