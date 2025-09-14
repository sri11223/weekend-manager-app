import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Coffee, Sun, Sunset, Moon, Plus, X } from 'lucide-react'
import { useLongWeekendStore } from '../../store/longWeekendStore'
import FloatingActivityBrowser from './FloatingActivityBrowser'

interface LongWeekendTimelineProps {
  longWeekendDates: {
    friday: Date
    saturday: Date
    sunday: Date
    monday: Date
  }
  onClose: () => void
}

const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', icon: Coffee, time: '8AM - 12PM' },
  { id: 'afternoon', label: 'Afternoon', icon: Sun, time: '12PM - 6PM' },
  { id: 'evening', label: 'Evening', icon: Sunset, time: '6PM - 10PM' },
  { id: 'night', label: 'Night', icon: Moon, time: '10PM - 12AM' }
]

const DAYS = [
  { id: 'friday', label: 'Friday', color: 'from-amber-400 to-amber-600' },
  { id: 'saturday', label: 'Saturday', color: 'from-blue-400 to-blue-600' },
  { id: 'sunday', label: 'Sunday', color: 'from-purple-400 to-purple-600' },
  { id: 'monday', label: 'Monday', color: 'from-green-400 to-green-600' }
]

export const LongWeekendTimeline: React.FC<LongWeekendTimelineProps> = ({
  longWeekendDates,
  onClose
}) => {
  const [showActivityBrowser, setShowActivityBrowser] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<{day: string, timeSlot: string} | null>(null)
  
  const {
    setCurrentLongWeekend,
    addLongWeekendActivity,
    removeLongWeekendActivity,
    getCurrentLongWeekendActivities,
    getActivitiesForLongWeekendSlot
  } = useLongWeekendStore()

  // Set the current long weekend when component mounts
  React.useEffect(() => {
    setCurrentLongWeekend(longWeekendDates)
  }, [longWeekendDates, setCurrentLongWeekend])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const handleTimeSlotClick = (day: string, timeSlot: string) => {
    console.log(`Clicked ${day} ${timeSlot}`)
    setSelectedSlot({ day, timeSlot })
    setShowActivityBrowser(true)
  }

  const handleAddActivity = (activity: any, timeSlot: string, day: 'saturday' | 'sunday') => {
    // For long weekend, we already have the selected slot, but we'll use the passed parameters
    if (selectedSlot) {
      const success = addLongWeekendActivity(
        activity, 
        selectedSlot.timeSlot, 
        selectedSlot.day as 'friday' | 'saturday' | 'sunday' | 'monday'
      )
      if (success) {
        setShowActivityBrowser(false)
        setSelectedSlot(null)
      }
      return success
    }
    return false
  }

  const handleRemoveActivity = (activityId: string) => {
    removeLongWeekendActivity(activityId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Long Weekend Planning
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {formatDate(longWeekendDates.friday)} - {formatDate(longWeekendDates.monday)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Timeline Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-4 gap-4">
            {DAYS.map((day) => (
              <div key={day.id} className="space-y-3">
                {/* Day Header */}
                <div className={`bg-gradient-to-r ${day.color} text-white rounded-lg p-4 text-center`}>
                  <h3 className="font-bold text-lg">{day.label}</h3>
                  <p className="text-sm opacity-90">
                    {formatDate(longWeekendDates[day.id as keyof typeof longWeekendDates])}
                  </p>
                </div>

                {/* Time Slots */}
                <div className="space-y-2">
                  {TIME_SLOTS.map((slot) => {
                    const activities = getActivitiesForLongWeekendSlot(
                      day.id as 'friday' | 'saturday' | 'sunday' | 'monday', 
                      slot.id
                    )
                    const hasActivity = activities.length > 0
                    
                    return (
                      <motion.div
                        key={`${day.id}-${slot.id}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`rounded-lg p-3 border-2 transition-colors cursor-pointer min-h-[100px] ${
                          hasActivity 
                            ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600' 
                            : 'bg-gray-50 dark:bg-gray-700 border-dashed border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500'
                        }`}
                        onClick={() => !hasActivity && handleTimeSlotClick(day.id, slot.id)}
                      >
                        {hasActivity ? (
                          // Show scheduled activity
                          <div className="space-y-2">
                            {activities.map(activity => (
                              <div key={activity.id} className="flex items-center justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm text-purple-800 dark:text-purple-200">
                                    {activity.title}
                                  </h4>
                                  <p className="text-xs text-purple-600 dark:text-purple-300">
                                    {activity.category}
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleRemoveActivity(activity.id)
                                  }}
                                  className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                                >
                                  <X className="w-3 h-3 text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Show empty slot
                          <div className="flex flex-col items-center justify-center h-full">
                            <div className="flex items-center space-x-2 mb-2">
                              <slot.icon className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {slot.label}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                              {slot.time}
                            </span>
                            
                            {/* Add Activity Button */}
                            <div className="flex items-center justify-center w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                              <Plus className="w-4 h-4 text-purple-600 dark:text-purple-300" />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Long Weekend Mode</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Plan across 4 days for maximum fun!
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 font-medium">
              Save Plan
            </button>
          </div>
        </div>

        {/* Activity Browser Modal */}
        {showActivityBrowser && selectedSlot && (
          <FloatingActivityBrowser
            category="all"
            onClose={() => {
              setShowActivityBrowser(false)
              setSelectedSlot(null)
            }}
            onAddActivity={handleAddActivity}
            searchQuery=""
            themeId="cosmic"
            selectedWeekend={{
              saturday: longWeekendDates.saturday,
              sunday: longWeekendDates.sunday
            }}
            scheduledActivities={getCurrentLongWeekendActivities()}
            onRemoveActivity={handleRemoveActivity}
          />
        )}
      </motion.div>
    </motion.div>
  )
}

export default LongWeekendTimeline