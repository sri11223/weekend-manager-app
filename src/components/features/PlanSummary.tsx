import React from 'react'
import { Clock, MapPin, DollarSign, Calendar, TrendingUp, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { ScheduledActivity } from '../../types/index'
import { useTheme } from '../../hooks/useTheme'

// Using global ScheduledActivity type from types/index.ts

interface PlanSummaryProps {
  scheduledActivities: ScheduledActivity[]
  selectedDays: string[]
  onRemoveActivity?: (activityId: string) => void
  className?: string
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ 
  scheduledActivities, 
  onRemoveActivity,
  className = '' 
}) => {
  const { currentTheme } = useTheme()

  // Calculate statistics
  const totalActivities = scheduledActivities.length
  const totalCost = scheduledActivities.reduce((sum: number, activity) => sum + (Number(activity.cost) || 0), 0)
  const totalDuration = scheduledActivities.reduce((sum, activity) => sum + activity.duration, 0)
  
  const saturdayActivities = scheduledActivities.filter(a => a.day === 'saturday').length
  const sundayActivities = scheduledActivities.filter(a => a.day === 'sunday').length
  
  const categoryStats = scheduledActivities.reduce((acc, activity) => {
    acc[activity.category] = (acc[activity.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'

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
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `var(--color-primary, ${currentTheme.colors.primary})` }}
        >
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-lg font-bold" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
          Weekend Summary
        </h3>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, var(--color-surface, ${currentTheme.colors.surface})90, var(--color-primary, ${currentTheme.colors.primary})10)`,
            border: `1px solid var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" style={{ color: `var(--color-primary, ${currentTheme.colors.primary})` }} />
            <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              Activities
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            {totalActivities}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, var(--color-surface, ${currentTheme.colors.surface})90, var(--color-accent, ${currentTheme.colors.accent})10)`,
            border: `1px solid var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4" style={{ color: `var(--color-accent, ${currentTheme.colors.accent})` }} />
            <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              Budget
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            {totalCost}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, var(--color-surface, ${currentTheme.colors.surface})90, var(--color-secondary, ${currentTheme.colors.secondary})10)`,
            border: `1px solid var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" style={{ color: `var(--color-secondary, ${currentTheme.colors.secondary})` }} />
            <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              Duration
            </span>
          </div>
          <div className="text-2xl font-bold" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            {formatDuration(totalDuration)}
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-4 rounded-xl backdrop-blur-sm"
          style={{
            background: `linear-gradient(135deg, var(--color-surface, ${currentTheme.colors.surface})90, var(--color-primary, ${currentTheme.colors.primary})10)`,
            border: `1px solid var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4" style={{ color: `var(--color-primary, ${currentTheme.colors.primary})` }} />
            <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              Top Category
            </span>
          </div>
          <div className="text-lg font-bold flex items-center gap-1" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            <span>{getCategoryIcon(topCategory)}</span>
            <span className="capitalize">{topCategory}</span>
          </div>
        </motion.div>
      </div>

      {/* Day Breakdown */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
          Day Breakdown
        </h4>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `var(--color-surface, ${currentTheme.colors.surface})` }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-primary, ${currentTheme.colors.primary})` }} />
              <span className="font-medium" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>Saturday</span>
            </div>
            <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              {saturdayActivities} activities
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: `var(--color-surface, ${currentTheme.colors.surface})` }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `var(--color-secondary, ${currentTheme.colors.secondary})` }} />
              <span className="font-medium" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>Sunday</span>
            </div>
            <span className="text-sm font-medium" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              {sundayActivities} activities
            </span>
          </div>
        </div>
      </div>

      {/* Activity List */}
      {scheduledActivities.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            Planned Activities
          </h4>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {scheduledActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.02, x: 4 }}
                className="group flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm hover:shadow-md transition-all"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.colors.surface}90, ${currentTheme.colors.primary}05)`,
                  border: `1px solid ${currentTheme.colors.border}`
                }}
              >
                <div className="text-lg">{getCategoryIcon(activity.category)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" style={{ color: currentTheme.colors.text }}>
                    {activity.name}
                  </div>
                  <div className="text-xs flex items-center gap-2" style={{ color: currentTheme.colors.textSecondary }}>
                    <span className="capitalize">{activity.day}</span>
                    <span>•</span>
                    <span>{activity.startTime}</span>
                    <span>•</span>
                    <span>{formatDuration(activity.duration)}</span>
                    {activity.cost !== undefined && (
                      <>
                        <span>•</span>
                        <span className={Number(activity.cost) === 0 ? 'text-green-600 font-medium' : 'text-blue-600 font-medium'}>
                          {Number(activity.cost) === 0 ? 'FREE' : `$${activity.cost}`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {onRemoveActivity && !activity.completed && (
                  <button
                    onClick={() => onRemoveActivity(activity.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-100 transition-all"
                    style={{ color: '#ef4444' }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {scheduledActivities.length === 0 && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center" 
               style={{ backgroundColor: `var(--color-border, ${currentTheme.colors.border})` }}>
            <Calendar className="w-6 h-6" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }} />
          </div>
          <h4 className="font-medium mb-1" style={{ color: `var(--color-text, ${currentTheme.colors.text})` }}>
            No activities planned yet
          </h4>
          <p className="text-sm" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
            Start adding activities to see your weekend summary
          </p>
        </div>
      )}
    </div>
  )
}

export default PlanSummary
