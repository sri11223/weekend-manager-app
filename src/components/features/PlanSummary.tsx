import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDrag } from 'react-dnd'
import { Calendar, Clock, DollarSign, TrendingUp, X, Trash2, GripVertical } from 'lucide-react'
import { ScheduledActivity } from '../../types/index'
import { useTheme } from '../../hooks/useTheme'

interface PlanSummaryProps {
  scheduledActivities: ScheduledActivity[]
  onRemoveActivity?: (activityId: string) => void
  onMoveActivity?: (activityId: string, newTimeSlot: string, newDay: 'saturday' | 'sunday' | 'friday' | 'monday') => boolean
  className?: string
}

// Draggable Activity Item Component
interface DraggableActivityItemProps {
  activity: ScheduledActivity
  onRemoveActivity?: (activityId: string) => void
  currentTheme: any
  formatDuration: (minutes: number) => string
  getCategoryIcon: (category: string) => string
}

const DraggableActivityItem: React.FC<DraggableActivityItemProps> = ({
  activity,
  onRemoveActivity,
  currentTheme,
  formatDuration,
  getCategoryIcon
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'scheduled-activity',
    item: {
      type: 'scheduled-activity',
      id: activity.scheduledId || activity.id,
      originalDay: activity.day,
      originalTimeSlot: activity.startTime,
      activity: activity
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return (
    <div
      ref={drag as any}
      className={`flex items-center gap-2 p-2 rounded-md group hover:bg-opacity-80 transition-all cursor-move ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
      style={{ backgroundColor: `${currentTheme.colors.surface}60` }}
    >
      <GripVertical className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      <span className="text-sm flex-shrink-0">{getCategoryIcon(activity.category)}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium truncate" style={{ color: currentTheme.colors.text }}>
          {activity.name}
        </div>
        <div className="text-xs flex items-center gap-1 truncate" style={{ color: currentTheme.colors.textSecondary }}>
          <span>{activity.startTime}</span>
          <span>•</span>
          <span>{formatDuration(activity.duration)}</span>
          <span>•</span>
          <span>${activity.cost || 0}</span>
        </div>
      </div>
      {onRemoveActivity && (
        <button
          onClick={() => {
            console.log('🗑️ PlanSummary removing activity:', {
              name: activity.name,
              scheduledId: activity.scheduledId,
              id: activity.id,
              startTime: activity.startTime
            })
            onRemoveActivity(activity.scheduledId || activity.id)
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity"
          style={{ color: '#dc2626' }}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  )
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ 
  scheduledActivities, 
  onRemoveActivity,
  onMoveActivity,
  className = '' 
}) => {
  const { currentTheme } = useTheme()

  // Filter out blocked activities
  const mainActivities = scheduledActivities.filter(a => !a.isBlocked)
  const saturdayActivities = mainActivities.filter(a => a.day === 'saturday')
  const sundayActivities = mainActivities.filter(a => a.day === 'sunday')

  const totalActivities = mainActivities.length
  const totalCost = mainActivities.reduce((sum, activity) => sum + (Number(activity.cost) || 0), 0)
  const totalDuration = mainActivities.reduce((sum, activity) => sum + activity.duration, 0)

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'movies': return '🎬'
      case 'food': return '🍽️'
      case 'games': return '🎮'
      case 'outdoor': return '🌳'
      case 'social': return '👥'
      default: return '📋'
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentTheme.colors.primary }}
          >
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm" style={{ color: currentTheme.colors.text }}>
              Weekend Summary
            </h3>
            <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              Your planned activities overview
            </p>
          </div>
        </div>
        
        {totalActivities > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all activities?')) {
                console.log('🗑️ Clearing all activities:', mainActivities.map(a => ({ name: a.name, scheduledId: a.scheduledId, id: a.id })))
                mainActivities.forEach(activity => onRemoveActivity?.(activity.scheduledId || activity.id))
              }
            }}
            className="text-xs px-2 py-1 rounded-md flex items-center gap-1 hover:opacity-80"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Compact Stats - 3 columns */}
      <div className="grid grid-cols-3 gap-2">
        <div 
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${currentTheme.colors.primary}15` }}
        >
          <Calendar className="w-4 h-4 mx-auto mb-1" style={{ color: currentTheme.colors.primary }} />
          <div className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
            {totalActivities}
          </div>
          <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
            Activities
          </div>
        </div>
        
        <div 
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${currentTheme.colors.accent}15` }}
        >
          <DollarSign className="w-4 h-4 mx-auto mb-1" style={{ color: currentTheme.colors.accent }} />
          <div className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
            ${totalCost}
          </div>
          <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
            Budget
          </div>
        </div>
        
        <div 
          className="p-3 rounded-lg text-center"
          style={{ backgroundColor: `${currentTheme.colors.secondary}15` }}
        >
          <Clock className="w-4 h-4 mx-auto mb-1" style={{ color: currentTheme.colors.secondary }} />
          <div className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
            {formatDuration(totalDuration)}
          </div>
          <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
            Duration
          </div>
        </div>
      </div>

      {/* Day Sections - NO SCROLL, FIXED HEIGHT */}
      <div className="space-y-3">
        {/* Saturday */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentTheme.colors.primary }}
              />
              <h4 className="font-semibold text-sm" style={{ color: currentTheme.colors.text }}>
                Saturday
              </h4>
            </div>
            <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              {saturdayActivities.length} activities
            </span>
          </div>
          
          {/* FIXED: Remove max-height and overflow to prevent scrollbars */}
          <div className="space-y-2">
            {saturdayActivities.length === 0 ? (
              <p className="text-xs text-center py-4 italic" style={{ color: currentTheme.colors.textSecondary }}>
                No activities planned
              </p>
            ) : (
              saturdayActivities
                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                .slice(0, 3) // Show only first 3 activities to prevent overflow
                .map((activity) => (
                  <DraggableActivityItem
                    key={activity.id}
                    activity={activity}
                    onRemoveActivity={onRemoveActivity}
                    currentTheme={currentTheme}
                    formatDuration={formatDuration}
                    getCategoryIcon={getCategoryIcon}
                  />
                ))
            )}
            {/* Show "and X more" if there are more than 3 activities */}
            {saturdayActivities.length > 3 && (
              <p className="text-xs text-center py-1" style={{ color: currentTheme.colors.textSecondary }}>
                and {saturdayActivities.length - 3} more activities
              </p>
            )}
          </div>
        </div>

        {/* Sunday */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentTheme.colors.secondary }}
              />
              <h4 className="font-semibold text-sm" style={{ color: currentTheme.colors.text }}>
                Sunday
              </h4>
            </div>
            <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
              {sundayActivities.length} activities
            </span>
          </div>
          
          {/* FIXED: Remove max-height and overflow to prevent scrollbars */}
          <div className="space-y-2">
            {sundayActivities.length === 0 ? (
              <p className="text-xs text-center py-4 italic" style={{ color: currentTheme.colors.textSecondary }}>
                No activities planned
              </p>
            ) : (
              sundayActivities
                .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''))
                .slice(0, 3) // Show only first 3 activities to prevent overflow
                .map((activity) => (
                  <DraggableActivityItem
                    key={activity.id}
                    activity={activity}
                    onRemoveActivity={onRemoveActivity}
                    currentTheme={currentTheme}
                    formatDuration={formatDuration}
                    getCategoryIcon={getCategoryIcon}
                  />
                ))
            )}
            {/* Show "and X more" if there are more than 3 activities */}
            {sundayActivities.length > 3 && (
              <p className="text-xs text-center py-1" style={{ color: currentTheme.colors.textSecondary }}>
                and {sundayActivities.length - 3} more activities
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Empty State for limited space */}
      {totalActivities === 0 && (
        <div className="text-center py-6">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ backgroundColor: `${currentTheme.colors.primary}15` }}
          >
            <Calendar className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
          </div>
          <h4 className="font-medium text-sm mb-1" style={{ color: currentTheme.colors.text }}>
            No activities planned
          </h4>
          <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
            Drag activities here to get started
          </p>
        </div>
      )}
    </div>
  )
}

export default PlanSummary
