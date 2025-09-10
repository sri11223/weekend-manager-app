import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Clock, Plus, X } from 'lucide-react'
import { WeatherAnimation, getWeatherForTimeSlot, getDayWeather } from '../animations/WeatherAnimations'
import { DayNightBackground, getDayNightTheme, getDayNightColors } from '../animations/DayNightTheme'
// import { Activity } from '../../types/activity'

interface Activity {
  id: string
  title: string
  description: string
  duration: number
  category: string
  image?: string
  cost?: number
}
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


  const weather = getWeatherForTimeSlot(timeSlot.label, day)
  const dayNightPeriod = getDayNightTheme(timeSlot.label)
  const dayNightColors = getDayNightColors(dayNightPeriod, theme)

  return (
    <div
      ref={drop}
      className="relative min-h-[80px] p-4 rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
      style={{
        background: isOver 
          ? `linear-gradient(135deg, var(--color-accent, ${theme.colors.accent})15, var(--color-accent, ${theme.colors.accent})25)`
          : activity
            ? dayNightColors.background
            : `linear-gradient(135deg, var(--color-surface, ${theme.colors.surface})80, ${dayNightColors.overlay})`,
        border: `2px ${activity ? 'solid' : 'dashed'} ${isOver 
          ? `var(--color-accent, ${theme.colors.accent})` 
          : activity 
            ? dayNightColors.border
            : `var(--color-border, ${theme.colors.border})`}`,
        boxShadow: activity 
          ? dayNightColors.shadow
          : isOver
            ? `0 8px 32px var(--color-accent, ${theme.colors.accent})30`
            : '0 2px 8px rgba(0,0,0,0.05)',
        transform: isOver ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {/* Day/Night Background Animation */}
      <DayNightBackground timeSlot={timeSlot.label} className="opacity-40" />
      
      {/* Weather Animation */}
      <WeatherAnimation weather={weather} className="opacity-60" />
      
      {/* Time Label */}
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <Clock className="w-4 h-4" style={{ color: `var(--color-text-secondary, ${theme.colors.textSecondary})` }} />
        <span className="text-sm font-medium" style={{ color: `var(--color-text, ${theme.colors.text})` }}>{timeSlot.label}</span>
      </div>

      {activity ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative"
        >
          <div
            className="p-4 rounded-xl shadow-lg border backdrop-blur-sm hover:shadow-xl transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, var(--color-surface, ${theme.colors.surface})95, var(--color-primary, ${theme.colors.primary})08)`,
              borderColor: `var(--color-primary, ${theme.colors.primary})40`,
              boxShadow: `0 8px 32px var(--color-primary, ${theme.colors.primary})15, 0 4px 16px rgba(0,0,0,0.1)`
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm mb-1" style={{ color: `var(--color-text, ${theme.colors.text})` }}>
                  {activity.title}
                </h4>
                <p className="text-xs" style={{ color: `var(--color-text-secondary, ${theme.colors.textSecondary})` }}>
                  {activity.description}
                </p>
                {activity.duration && (
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3" style={{ color: `var(--color-text-secondary, ${theme.colors.textSecondary})` }} />
                    <span className="text-xs" style={{ color: `var(--color-text-secondary, ${theme.colors.textSecondary})` }}>
                      {activity.duration} min
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemoveActivity(activity.id)}
                className="p-2 rounded-full transition-all duration-200 hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, #ff4757, #ff3742)`,
                  boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)'
                }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-12 transition-all duration-200" style={{ color: `var(--color-text-secondary, ${theme.colors.textSecondary})` }}>
          <div className="text-center">
            <Plus className="w-5 h-5 mx-auto mb-1 opacity-60" />
            <span className="text-xs opacity-80">Drop activity here</span>
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
    return scheduledActivities?.find(activity => 
      activity.timeSlot === timeSlot && activity.day === day
    )
  }

  const activeDays = selectedDays.filter(day => day === 'saturday' || day === 'sunday') as ('saturday' | 'sunday')[]

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
          Show:
        </span>
        {['all', 'morning', 'afternoon', 'evening', 'night'].map((period) => (
          <button
            key={period}
            onClick={() => setSelectedTimeRange(period as any)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105"
            style={{
              background: selectedTimeRange === period 
                ? `linear-gradient(135deg, var(--color-primary, ${currentTheme.colors.primary}), var(--color-secondary, ${currentTheme.colors.secondary}))`
                : `var(--color-surface, ${currentTheme.colors.surface})80`,
              color: selectedTimeRange === period 
                ? 'white' 
                : `var(--color-text-secondary, ${currentTheme.colors.textSecondary})`,
              border: `1px solid ${selectedTimeRange === period 
                ? `var(--color-primary, ${currentTheme.colors.primary})` 
                : `var(--color-border, ${currentTheme.colors.border})`}`,
              boxShadow: selectedTimeRange === period 
                ? `0 4px 16px var(--color-primary, ${currentTheme.colors.primary})30`
                : '0 2px 8px rgba(0,0,0,0.05)'
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
            {/* Day Header with Weather Animation */}
            <div className="relative flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm overflow-hidden" style={{
              background: `linear-gradient(135deg, var(--color-surface, ${currentTheme.colors.surface})90, var(--color-primary, ${currentTheme.colors.primary})10)`,
              border: `1px solid var(--color-border, ${currentTheme.colors.border})`,
              boxShadow: `0 4px 16px var(--color-primary, ${currentTheme.colors.primary})10`
            }}>
              {/* Day-level Weather Animation */}
              <WeatherAnimation weather={getDayWeather(day)} className="opacity-30" />
              
              <div
                className="w-6 h-6 rounded-full shadow-lg relative z-10"
                style={{ 
                  background: `linear-gradient(135deg, var(--color-primary, ${currentTheme.colors.primary}), var(--color-secondary, ${currentTheme.colors.secondary}))`,
                  boxShadow: `0 4px 12px var(--color-primary, ${currentTheme.colors.primary})40`
                }}
              />
              <h3 className="text-xl font-bold capitalize relative z-10" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
                {day}
              </h3>
              <div className="px-3 py-1 rounded-full text-sm font-medium relative z-10" style={{ 
                background: `var(--color-accent, ${currentTheme.colors.accent})20`,
                color: `var(--color-accent, ${currentTheme.colors.accent})`
              }}>
                {scheduledActivities?.filter(a => a.day === day).length || 0} activities
              </div>
              
              {/* Weather indicator */}
              <div className="ml-auto flex items-center gap-2 relative z-10">
                <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
                  {getDayWeather(day) === 'sunny' && '☀️ Sunny'}
                  {getDayWeather(day) === 'rainy' && '🌧️ Rainy'}
                  {getDayWeather(day) === 'snowy' && '❄️ Snowy'}
                  {getDayWeather(day) === 'cloudy' && '☁️ Cloudy'}
                </span>
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
