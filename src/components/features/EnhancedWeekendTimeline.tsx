import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import { Clock, X, Plus } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { WeatherAnimation, getWeatherForTimeSlot } from '../animations/WeatherAnimations'
import { DayNightBackground, getDayNightTheme, getDayNightColors } from '../animations/DayNightTheme'
import StarryNightBackground from '../animations/StarryNightBackground'
import { TIME_SLOTS, TimeSlot } from '../../types/theme'
import { useTheme } from '../../hooks/useTheme'
import { useWeekendStore } from '../../store/weekendStore'

interface Activity {
  id: string
  title: string
  description: string
  duration: number
  category: string
  image?: string
  cost?: number
  originalDuration?: number
  isBlocked?: boolean
  originalId?: string
}

interface ScheduledActivity extends Activity {
  timeSlot: string
  day: 'saturday' | 'sunday' | 'friday' | 'monday'
}

interface EnhancedWeekendTimelineProps {
  scheduledActivities: ScheduledActivity[]
  onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday' | 'friday' | 'monday') => boolean
  onRemoveActivity: (activityId: string) => void
  onMoveActivity?: (activityId: string, newTimeSlot: string, newDay: 'saturday' | 'sunday' | 'friday' | 'monday') => boolean
  selectedDays: ('saturday' | 'sunday' | 'friday' | 'monday')[]
  selectedWeekend?: {
    saturday: Date
    sunday: Date
  }
  longWeekendDates?: {
    friday: Date
    saturday: Date
    sunday: Date
    monday: Date
  } | null
}

interface TimeSlotDropZoneProps {
  timeSlot: TimeSlot
  day: 'saturday' | 'sunday' | 'friday' | 'monday'
  activity?: ScheduledActivity
  isOccupied: boolean
  onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday' | 'friday' | 'monday') => boolean
  onRemoveActivity: (activityId: string) => void
  theme: any
  selectedDate?: Date
}

const TimeSlotDropZone: React.FC<TimeSlotDropZoneProps> = ({
  timeSlot,
  day,
  activity,
  isOccupied,
  onAddActivity,
  onRemoveActivity,
  theme,
  selectedDate
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'activity',
    drop: (item: Activity) => {
      if (!isOccupied) {
        onAddActivity(item, timeSlot.id, day)
      }
    },
    canDrop: () => !isOccupied,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  const weather = getWeatherForTimeSlot(timeSlot.label, day, selectedDate)
  const dayNightPeriod = getDayNightTheme(timeSlot.label)
  const dayNightColors = getDayNightColors(dayNightPeriod, theme)

  return (
    <div
      ref={drop}
      className="relative min-h-[100px] p-4 rounded-xl transition-all duration-300 backdrop-blur-sm overflow-hidden"
      style={{
        background: isOver && canDrop
          ? `linear-gradient(135deg, ${theme.colors.accent}15, ${theme.colors.accent}25)`
          : activity
            ? activity.isBlocked
              ? `linear-gradient(135deg, ${theme.colors.primary}10, ${theme.colors.primary}20)`
              : dayNightColors.background
            : `linear-gradient(135deg, ${theme.colors.surface}80, ${dayNightColors.overlay})`,
        border: `2px ${activity ? 'solid' : 'dashed'} ${
          isOver && canDrop
            ? theme.colors.accent
            : activity
              ? activity.isBlocked
                ? `${theme.colors.primary}50`
                : dayNightColors.border
              : theme.colors.border
        }`,
        boxShadow: activity
          ? activity.isBlocked
            ? `0 4px 16px ${theme.colors.primary}20`
            : dayNightColors.shadow
          : isOver && canDrop
            ? `0 8px 32px ${theme.colors.accent}30`
            : '0 2px 8px rgba(0,0,0,0.05)',
        transform: isOver && canDrop ? 'scale(1.02)' : 'scale(1)',
        opacity: isOver && !canDrop ? 0.5 : 1
      }}
    >
      {/* Background Animations */}
      <DayNightBackground timeSlot={timeSlot.label} className="opacity-40" />
      <WeatherAnimation weather={weather} timeSlot={timeSlot.label} className="opacity-60" />
      <StarryNightBackground isNight={dayNightPeriod === 'night'} className="opacity-80" />

      {/* Time Label */}
      <div className="flex items-center gap-2 mb-2 relative z-10">
        <Clock className="w-4 h-4 transition-colors duration-300" style={{ color: theme.colors.textSecondary }} />
        <span className="text-sm font-medium transition-colors duration-300" style={{ color: theme.colors.text }}>
          {timeSlot.label}
        </span>
        {isOccupied && !activity && (
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600">
            Blocked
          </span>
        )}
      </div>

      {/* Activity Content */}
      {activity ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative"
        >
          {activity.isBlocked ? (
            // Blocked slot display with enhanced spanning visuals
            <div
              className="p-3 rounded-xl border-2 border-dashed opacity-75 relative overflow-hidden"
              style={{
                background: `linear-gradient(45deg, ${theme.colors.primary}08, ${theme.colors.primary}15)`,
                borderColor: `${theme.colors.primary}30`
              }}
            >
              {/* Continuation line indicator */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1 rounded-r"
                style={{ backgroundColor: `${theme.colors.primary}60` }}
              />
              
              {/* Visual connection lines */}
              <div 
                className="absolute top-0 left-2 right-2 h-0.5 opacity-30"
                style={{ backgroundColor: `${theme.colors.primary}` }}
              />
              <div 
                className="absolute bottom-0 left-2 right-2 h-0.5 opacity-30"
                style={{ backgroundColor: `${theme.colors.primary}` }}
              />

              <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                  <p className="text-sm font-medium" style={{ color: theme.colors.text }}>
                    {activity.title}
                  </p>
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                </div>
                <p className="text-xs" style={{ color: theme.colors.textSecondary }}>
                  ⏰ Continued from previous slot
                </p>
              </div>
            </div>
          ) : (
            // Main activity display with spanning indicators
            <div
              className="p-4 rounded-xl shadow-lg border backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.surface}95, ${theme.colors.primary}15)`,
                borderColor: `${theme.colors.primary}50`,
                boxShadow: `0 8px 32px ${theme.colors.primary}20, 0 4px 16px rgba(0,0,0,0.1)`
              }}
            >
              {/* Spanning activity indicator */}
              {activity.duration && activity.duration > 60 && (
                <div className="absolute top-0 right-0">
                  <div 
                    className="px-2 py-1 text-xs font-bold text-white rounded-bl-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.primary})`
                    }}
                  >
                    {Math.ceil(activity.duration / 60)}h
                  </div>
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm" style={{ color: theme.colors.text }}>
                      {activity.title}
                    </h4>
                    {activity.duration && activity.duration > 60 && (
                      <span 
                        className="px-2 py-0.5 text-xs font-bold rounded-full"
                        style={{ 
                          backgroundColor: `${theme.colors.accent}20`,
                          color: theme.colors.accent 
                        }}
                      >
                        SPANS {Math.ceil(activity.duration / 60)}h
                      </span>
                    )}
                  </div>
                  <p className="text-xs mb-2" style={{ color: theme.colors.textSecondary }}>
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs" style={{ color: theme.colors.textSecondary }}>
                    {activity.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-medium">
                          {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                        </span>
                      </div>
                    )}
                    {activity.cost !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 font-medium">${activity.cost}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveActivity(activity.id)
                  }}
                  className="p-2 rounded-full transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(135deg, #ff4757, #ff3742)',
                    boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)'
                  }}
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        // Empty slot
        <div 
          className="flex items-center justify-center h-16 transition-all duration-200" 
          style={{ color: theme.colors.textSecondary }}
        >
          {isOccupied ? (
            <div className="text-center">
              <span className="text-xs opacity-60">Slot Occupied</span>
            </div>
          ) : (
            <div className="text-center">
              <Plus className="w-5 h-5 mx-auto mb-1 opacity-60" />
              <span className="text-xs opacity-80">Drop activity here</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const EnhancedWeekendTimeline: React.FC<EnhancedWeekendTimelineProps> = ({
  scheduledActivities,
  onAddActivity,
  onRemoveActivity,
  onMoveActivity,
  selectedDays,
  selectedWeekend,
  longWeekendDates
}) => {
  const { currentTheme } = useTheme()
  const { isLongWeekendMode } = useWeekendStore()
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'night'>('all')

  const filteredTimeSlots = selectedTimeRange === 'all' 
    ? TIME_SLOTS 
    : TIME_SLOTS.filter(slot => slot.period === selectedTimeRange)

  // Helper functions
  const getActivityForSlot = (timeSlot: string, day: 'saturday' | 'sunday' | 'friday' | 'monday') => {
    return scheduledActivities.find(activity => 
      activity.timeSlot === timeSlot && activity.day === day
    )
  }

  const isSlotOccupied = (timeSlot: string, day: 'saturday' | 'sunday' | 'friday' | 'monday') => {
    return scheduledActivities.some(activity => 
      activity.timeSlot === timeSlot && activity.day === day
    )
  }

  const getActivitiesCount = (day: 'saturday' | 'sunday' | 'friday' | 'monday') => {
    return scheduledActivities.filter(a => a.day === day && !a.isBlocked).length
  }

  // ✅ Use selectedDays prop to determine which days to show
  const activeDays = selectedDays.length > 0 ? selectedDays : ['saturday', 'sunday'] as ('saturday' | 'sunday')[]

  console.log('🔍 Timeline Days DEBUG:', { 
    isLongWeekendMode, 
    selectedDays, 
    activeDays,
    source: 'EnhancedWeekendTimeline'
  })

  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium transition-colors duration-300" style={{ color: currentTheme.colors.text }}>
          Show:
        </span>
        {(['all', 'morning', 'afternoon', 'evening', 'night'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedTimeRange(period)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm hover:scale-105"
            style={{
              background: selectedTimeRange === period 
                ? `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`
                : `${currentTheme.colors.surface}80`,
              color: selectedTimeRange === period 
                ? 'white' 
                : currentTheme.colors.textSecondary,
              border: `1px solid ${selectedTimeRange === period 
                ? currentTheme.colors.primary
                : currentTheme.colors.border}`,
              boxShadow: selectedTimeRange === period 
                ? `0 4px 16px ${currentTheme.colors.primary}30`
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
            {/* Day Header */}
            <div 
              className="relative flex items-center gap-4 p-4 rounded-xl backdrop-blur-sm overflow-hidden transition-all duration-300" 
              style={{
                background: `linear-gradient(135deg, ${currentTheme.colors.surface}90, ${currentTheme.colors.primary}10)`,
                border: `1px solid ${currentTheme.colors.border}`,
                boxShadow: `0 4px 16px ${currentTheme.colors.primary}10`
              }}
            >
              <WeatherAnimation 
                weather={getWeatherForTimeSlot('12:00', day, 
                  day === 'saturday' ? selectedWeekend?.saturday :
                  day === 'sunday' ? selectedWeekend?.sunday :
                  day === 'friday' ? (longWeekendDates?.friday || selectedWeekend?.saturday) :
                  day === 'monday' ? (longWeekendDates?.monday || selectedWeekend?.sunday) :
                  selectedWeekend?.saturday
                )} 
                timeSlot="12:00"
                className="opacity-30" 
              />
              
              <div
                className="w-6 h-6 rounded-full shadow-lg relative z-10 transition-all duration-300"
                style={{ 
                  background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
                  boxShadow: `0 4px 12px ${currentTheme.colors.primary}40`
                }}
              />
              <h3 className="text-xl font-bold capitalize relative z-10 transition-colors duration-300" style={{ color: currentTheme.colors.text }}>
                {day}
              </h3>
              <div 
                className="px-3 py-1 rounded-full text-sm font-medium relative z-10 transition-all duration-300" 
                style={{ 
                  background: `${currentTheme.colors.accent}20`,
                  color: currentTheme.colors.accent
                }}
              >
                {getActivitiesCount(day)} activities
              </div>
              
              <div className="ml-auto flex items-center gap-2 relative z-10">
                <span className="text-sm font-medium transition-colors duration-300" style={{ color: currentTheme.colors.textSecondary }}>
                  {(() => {
                    const currentDate = 
                      day === 'saturday' ? selectedWeekend?.saturday :
                      day === 'sunday' ? selectedWeekend?.sunday :
                      day === 'friday' ? (longWeekendDates?.friday || selectedWeekend?.saturday) :
                      day === 'monday' ? (longWeekendDates?.monday || selectedWeekend?.sunday) :
                      selectedWeekend?.saturday;
                    const weather = getWeatherForTimeSlot('12:00', day, currentDate);
                    return (
                      <>
                        {weather === 'sunny' && '☀️ Sunny'}
                        {weather === 'rainy' && '🌧️ Rainy'}
                        {weather === 'snowy' && '❄️ Snowy'}
                        {weather === 'cloudy' && '☁️ Cloudy'}
                        {weather === 'partly-cloudy-night' && '⛅ Partly Cloudy'}
                        {weather === 'clear-night' && '🌙 Clear Night'}
                      </>
                    );
                  })()}
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
                      isOccupied={isSlotOccupied(timeSlot.id, day)}
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
          <div 
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-300" 
            style={{ backgroundColor: `var(--color-border, ${currentTheme.colors.border})` }}
          >
            <Clock className="w-8 h-8 transition-colors duration-300" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }} />
          </div>
          <h3 className="text-lg font-medium mb-2 transition-colors duration-300" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            No days selected
          </h3>
          <p className="transition-colors duration-300" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
            Select Saturday or Sunday to start planning your weekend
          </p>
        </div>
      )}
    </div>
  )
}

export default EnhancedWeekendTimeline
