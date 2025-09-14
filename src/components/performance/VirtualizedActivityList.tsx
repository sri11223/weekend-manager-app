import React, { useMemo } from 'react'
import { Activity } from '../../types/index'
import { useTheme } from '../../hooks/useTheme'

interface VirtualizedActivityListProps {
  activities: Activity[]
  onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => boolean
  searchQuery?: string
  category?: string
  height?: number
}

export const VirtualizedActivityList: React.FC<VirtualizedActivityListProps> = ({
  activities,
  onAddActivity,
  searchQuery = '',
  category,
  height = 400
}) => {
  const { currentTheme } = useTheme()

  const filteredActivities = useMemo(() => {
    let filtered = activities

    if (category && category !== 'all') {
      filtered = filtered.filter(activity => activity.category === category)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.category.toLowerCase().includes(query) ||
        activity.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [activities, category, searchQuery])

  const handleAddActivity = (activity: Activity) => {
    onAddActivity(activity, '9am', 'saturday')
  }

  return (
    <div 
      className="overflow-y-auto p-4 space-y-3"
      style={{ height, backgroundColor: currentTheme.colors.surface }}
    >
      <div className="text-sm text-gray-600 mb-4">
        Showing {filteredActivities.length} of {activities.length} activities
      </div>
      
      {filteredActivities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center space-x-3 p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
          style={{ 
            backgroundColor: currentTheme.colors.background,
            borderColor: currentTheme.colors.border
          }}
          onClick={() => handleAddActivity(activity)}
        >
          <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-2xl" 
               style={{ backgroundColor: activity.color + '20' }}>
            {activity.icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm truncate" style={{ color: currentTheme.colors.text }}>
              {activity.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {activity.category} • {activity.duration}min • {activity.cost}
            </p>
            <div className="flex flex-wrap gap-1 mt-1">
              {activity.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{ 
                    backgroundColor: currentTheme.colors.accent + '20',
                    color: currentTheme.colors.accent
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <button
              className="px-3 py-1 text-xs rounded-md font-medium hover:shadow-sm transition-shadow"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: 'white'
              }}
            >
              Add
            </button>
          </div>
        </div>
      ))}
      
      {filteredActivities.length === 0 && (
        <div className="text-center py-8">
          <p style={{ color: currentTheme.colors.textSecondary }}>
            No activities found
          </p>
        </div>
      )}
    </div>
  )
}