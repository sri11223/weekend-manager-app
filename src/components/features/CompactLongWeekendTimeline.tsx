import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Plus, X, Star, GripVertical } from 'lucide-react'
import { useDrag, useDrop } from 'react-dnd'
import { useWeekendStore } from '../../store/weekendStore'
import { useTheme } from '../../hooks/useTheme'

interface LongWeekendActivity {
  id: string
  title: string
  description: string
  duration: number
  category: string
  day: string
  timeSlot: string
  cost?: number
}

interface CompactLongWeekendTimelineProps {
  isVisible: boolean
  onClose: () => void
  holidays: Array<{date: string; localName: string; name: string}>
}

const COMPACT_TIME_SLOTS = [
  { id: 'morning', label: '9AM-12PM', period: 'Morning' },
  { id: 'afternoon', label: '12PM-6PM', period: 'Afternoon' }, 
  { id: 'evening', label: '6PM-10PM', period: 'Evening' }
]

const DAY_NAMES = {
  friday: 'Friday',
  saturday: 'Saturday', 
  sunday: 'Sunday',
  monday: 'Monday'
}

// Draggable Activity Component
interface DraggableLongWeekendActivityProps {
  activity: LongWeekendActivity
  onRemove: (activityId: string) => void
  currentTheme: any
}

const DraggableLongWeekendActivity: React.FC<DraggableLongWeekendActivityProps> = ({
  activity,
  onRemove,
  currentTheme
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'long-weekend-activity',
    item: activity,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag as any}
      className={`flex items-center justify-between p-2 rounded-lg cursor-move transition-all ${
        isDragging ? 'opacity-50 scale-105' : ''
      }`}
      style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
    >
      <div className="flex items-center gap-2">
        <GripVertical className="w-3 h-3 text-gray-400" />
        <div>
          <div 
            className="font-medium text-sm"
            style={{ color: currentTheme.colors.text }}
          >
            {activity.title}
          </div>
          <div 
            className="text-xs"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            {activity.duration}min • {activity.category}
          </div>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onRemove(activity.id)
        }}
        className="p-1 rounded hover:bg-red-100 transition-colors"
      >
        <X className="w-3 h-3 text-red-500" />
      </button>
    </div>
  )
}

// Droppable Time Slot Component  
interface DroppableTimeSlotProps {
  day: string
  timeSlot: any
  activities: LongWeekendActivity[]
  onAddActivity: (day: string, timeSlot: string) => void
  onMoveActivity: (activity: LongWeekendActivity, newDay: string, newTimeSlot: string) => void
  onRemoveActivity: (activityId: string) => void
  currentTheme: any
}

const DroppableTimeSlot: React.FC<DroppableTimeSlotProps> = ({
  day,
  timeSlot,
  activities,
  onAddActivity,
  onMoveActivity,
  onRemoveActivity,
  currentTheme
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['long-weekend-activity', 'activity'],
    drop: (item: any) => {
      if (item.type === 'long-weekend-activity' || item.day) {
        // Moving existing long weekend activity
        onMoveActivity(item, day, timeSlot.id)
      } else {
        // Adding new activity from browser
        const newActivity: LongWeekendActivity = {
          id: `${item.id}-${Date.now()}`,
          title: item.title,
          description: item.description,
          duration: item.duration,
          category: item.category,
          day,
          timeSlot: timeSlot.id,
          cost: item.cost
        }
        onMoveActivity(newActivity, day, timeSlot.id)
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  const hasActivity = activities.length > 0

  return (
    <motion.div
      ref={drop as any}
      className={`min-h-[120px] rounded-2xl border-2 border-dashed transition-all cursor-pointer ${
        isOver && canDrop
          ? 'border-blue-400 bg-blue-50'
          : hasActivity
          ? 'border-gray-200 bg-white shadow-sm'
          : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
      }`}
      whileHover={{ scale: 1.02 }}
      onClick={() => !hasActivity && onAddActivity(day, timeSlot.id)}
    >
      {/* Time Slot Header */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
          <span 
            className="text-xs font-medium"
            style={{ color: currentTheme.colors.text }}
          >
            {timeSlot.period}
          </span>
        </div>
        <span 
          className="text-xs"
          style={{ color: currentTheme.colors.textSecondary }}
        >
          {timeSlot.label}
        </span>
      </div>

      {/* Activities or Add Button */}
      {hasActivity ? (
        <div className="p-3 space-y-2">
          {activities.map((activity) => (
            <DraggableLongWeekendActivity
              key={activity.id}
              activity={activity}
              onRemove={onRemoveActivity}
              currentTheme={currentTheme}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center p-3">
          {isOver && canDrop ? (
            <div className="flex flex-col items-center">
              <Plus className="w-8 h-8 mb-2 text-blue-500" />
              <span className="text-sm text-blue-600 font-medium">Drop here to schedule</span>
            </div>
          ) : (
            <>
              <Plus 
                className="w-8 h-8 mb-2 opacity-50"
                style={{ color: currentTheme.colors.textSecondary }}
              />
              <span 
                className="text-sm opacity-50"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                Add activity
              </span>
            </>
          )}
        </div>
      )}
    </motion.div>
  )
}

const CompactLongWeekendTimeline: React.FC<CompactLongWeekendTimelineProps> = ({
  isVisible,
  onClose,
  holidays
}) => {
  const { currentTheme } = useTheme()
  const { 
    isLongWeekendMode, 
    longWeekendDays,
    setLongWeekendMode 
  } = useWeekendStore()

  const [selectedActivities, setSelectedActivities] = useState<LongWeekendActivity[]>([])
  const [activeSlot, setActiveSlot] = useState<{day: string, slot: string} | null>(null)

  const handleAddActivity = (day: string, timeSlot: string) => {
    setActiveSlot({ day, slot: timeSlot })
    // This would open an activity picker modal in real implementation
    console.log(`Add activity for ${day} ${timeSlot}`)
  }

  const handleRemoveActivity = (activityId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId))
  }

  const handleMoveActivity = (activity: LongWeekendActivity, newDay: string, newTimeSlot: string) => {
    setSelectedActivities(prev => {
      // Remove activity from its current position if it exists
      const filteredActivities = prev.filter(a => a.id !== activity.id)
      
      // Add activity to new position
      const updatedActivity = {
        ...activity,
        day: newDay,
        timeSlot: newTimeSlot
      }
      
      return [...filteredActivities, updatedActivity]
    })
  }

  const getActivitiesForSlot = (day: string, timeSlot: string) => {
    return selectedActivities.filter(a => a.day === day && a.timeSlot === timeSlot)
  }

  const formatDate = (dayName: string) => {
    // In real implementation, this would use actual dates based on holiday
    const today = new Date()
    const dayIndex = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(dayName.toLowerCase())
    const date = new Date(today)
    date.setDate(today.getDate() + (dayIndex - today.getDay()))
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden"
        style={{ 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border 
        }}
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 50 }}
      >
        {/* Header */}
        <div 
          className="p-6 border-b"
          style={{ borderColor: currentTheme.colors.border }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
              >
                <Star className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
              </div>
              <div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.colors.text }}
                >
                  🎉 Long Weekend Planner
                </h2>
                <p 
                  className="text-sm"
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  {holidays.length > 0 && `${holidays[0].localName} • `}
                  {longWeekendDays.length} days of fun
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" style={{ color: currentTheme.colors.textSecondary }} />
            </button>
          </div>
        </div>

        {/* Compact Timeline Grid */}
        <div className="p-6">
          <div className="grid gap-6" style={{ 
            gridTemplateColumns: `repeat(${longWeekendDays.length}, 1fr)` 
          }}>
            {longWeekendDays.map((day) => (
              <div key={day} className="space-y-4">
                {/* Day Header */}
                <div className="text-center">
                  <div 
                    className="text-lg font-bold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {DAY_NAMES[day as keyof typeof DAY_NAMES] || day.charAt(0).toUpperCase() + day.slice(1)}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    {formatDate(day)}
                  </div>
                </div>

                {/* Time Slots for This Day */}
                <div className="space-y-3">
                  {COMPACT_TIME_SLOTS.map((timeSlot) => {
                    const activities = getActivitiesForSlot(day, timeSlot.id)

                    return (
                      <DroppableTimeSlot
                        key={`${day}-${timeSlot.id}`}
                        day={day}
                        timeSlot={timeSlot}
                        activities={activities}
                        onAddActivity={handleAddActivity}
                        onMoveActivity={handleMoveActivity}
                        onRemoveActivity={handleRemoveActivity}
                        currentTheme={currentTheme}
                      />
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLongWeekendMode(false)}
                className="px-4 py-2 rounded-lg border transition-colors hover:bg-gray-50"
                style={{ 
                  borderColor: currentTheme.colors.border,
                  color: currentTheme.colors.textSecondary 
                }}
              >
                Cancel
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div 
                className="text-sm"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                {selectedActivities.length} activities planned
              </div>
              <button
                onClick={() => {
                  console.log('Save long weekend plan:', selectedActivities)
                  onClose()
                }}
                className="px-6 py-2 rounded-lg font-medium text-white transition-colors"
                style={{ backgroundColor: currentTheme.colors.primary }}
              >
                Save Plan
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CompactLongWeekendTimeline