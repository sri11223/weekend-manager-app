import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Clock, Plus, X } from 'lucide-react'
import { Activity } from '../../types/activity'
import { TIME_SLOTS, TimeSlot } from '../../types/theme'
import { useTheme } from '../../hooks/useTheme'
import { motion, AnimatePresence } from 'framer-motion'

interface ScheduledActivity extends Activity {
  timeSlot: string
  day: 'saturday' | 'sunday'
}

interface EnhancedWeekendTimelineProps {
  scheduledActivities: ScheduledActivity[]
  onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => void
  onRemoveActivity: (activityId: string) => void
  selectedDays: ('saturday' | 'sunday' | 'friday' | 'monday')[]
}

interface TimeSlotDropZoneProps {
  timeSlot: TimeSlot
  day: 'saturday' | 'sunday'
  activity?: ScheduledActivity
  onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => void
  onRemoveActivity: (activityId: string) => void
  theme: any
}

const TimeSlotDropZone: React.FC<TimeSlotDropZoneProps> = ({
  timeSlot,
  day,
  activity,
  onAddActivity,
  onRemoveActivity,
  theme
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'activity',
    drop: (item: Activity) => {
      onAddActivity(item, timeSlot.id, day)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const getPeriodColor = (period: string) => {
    switch (period) {
      case 'morning':
        return 'bg-yellow-50 border-yellow-200'
      case 'afternoon':
        return 'bg-blue-50 border-blue-200'
      case 'evening':
        return 'bg-orange-50 border-orange-200'
      case 'night':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div
      ref={drop}
      className={`
        relative min-h-[80px] p-3 rounded-lg border-2 transition-all duration-200
        ${activity ? 'border-solid' : 'border-dashed'}
        ${isOver ? 'border-blue-400 bg-blue-50' : getPeriodColor(timeSlot.period)}
        ${!activity ? 'hover:border-gray-300' : ''}
      `}
      style={{
        borderColor: isOver ? theme.colors.accent : undefined,
        backgroundColor: isOver ? `${theme.colors.accent}10` : undefined
      }}
    >
      {/* Time Label */}
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">{timeSlot.label}</span>
      </div>

      {activity ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative"
        >
          <div
            className="p-3 rounded-lg shadow-sm border"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1" style={{ color: theme.colors.text }}>
                  {activity.title}
                </h4>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  {activity.description}
                </p>
                {activity.duration && (
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" style={{ color: theme.colors.textSecondary }} />
                    <span className="text-xs" style={{ color: theme.colors.textSecondary }}>
                      {activity.duration} min
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemoveActivity(activity.id)}
                className="p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-12 text-gray-400">
          <div className="text-center">
            <Plus className="w-5 h-5 mx-auto mb-1" />
            <span className="text-xs">Drop activity here</span>
          </div>
        </div>
      )}
    </div>
  )
}

const EnhancedWeekendTimeline: React.FC<EnhancedWeekendTimelineProps> = ({
  scheduledActivities,
  onAddActivity,
  onRemoveActivity,
  selectedDays
}) => {
  const { currentTheme } = useTheme()
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all')

  const filteredTimeSlots = selectedTimeRange === 'all' 
    ? TIME_SLOTS 
    : TIME_SLOTS.filter(slot => slot.period === selectedTimeRange)

  const getActivityForSlot = (timeSlot: string, day: 'saturday' | 'sunday') => {
    return scheduledActivities.find(activity => 
      activity.timeSlot === timeSlot && activity.day === day
    )
  }

  const activeDays = selectedDays.filter(day => day === 'saturday' || day === 'sunday') as ('saturday' | 'sunday')[]

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium" style={{ color: currentTheme.colors.text }}>
          Show:
        </span>
        {['all', 'morning', 'afternoon', 'evening', 'night'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedTimeRange(period as any)}
            className={`
              px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedTimeRange === period 
                ? 'text-white' 
                : 'hover:bg-gray-100'
              }
            `}
            style={{
              backgroundColor: selectedTimeRange === period ? currentTheme.colors.primary : 'transparent',
              color: selectedTimeRange === period ? 'white' : currentTheme.colors.textSecondary
            }}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline Grid */}
      <div className="grid gap-6">
        {activeDays.map((day) => (
          <div key={day} className="space-y-4">
            {/* Day Header */}
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: day === 'saturday' ? '#3B82F6' : '#EC4899' }}
              />
              <h3 className="text-xl font-bold capitalize" style={{ color: currentTheme.colors.text }}>
                {day}
              </h3>
              <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                {scheduledActivities.filter(a => a.day === day).length} activities planned
              </div>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredTimeSlots.map((timeSlot) => (
                  <motion.div
                    key={`${day}-${timeSlot.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TimeSlotDropZone
                      timeSlot={timeSlot}
                      day={day}
                      activity={getActivityForSlot(timeSlot.id, day)}
                      onAddActivity={onAddActivity}
                      onRemoveActivity={onRemoveActivity}
                      theme={currentTheme}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeDays.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: currentTheme.colors.border }}>
            <Clock className="w-8 h-8" style={{ color: currentTheme.colors.textSecondary }} />
          </div>
          <h3 className="text-lg font-medium mb-2" style={{ color: currentTheme.colors.text }}>
            No days selected
          </h3>
          <p style={{ color: currentTheme.colors.textSecondary }}>
            Select Saturday or Sunday to start planning your weekend
          </p>
        </div>
      )}
    </div>
  )
}

export default EnhancedWeekendTimeline
