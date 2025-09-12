import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { FixedSizeList as List } from 'react-window'
import { Activity } from '../../types/index'
import { useTheme } from '../../hooks/useTheme'

interface VirtualizedActivityListProps {
  activities: Activity[]
  onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => boolean
  searchQuery?: string
  category?: string
  itemHeight?: number
  height?: number
  onLoadMore?: () => void
  hasMore?: boolean
  loading?: boolean
}

interface ActivityItemProps {
  index: number
  style: React.CSSProperties
  data: {
    activities: Activity[]
    onAddActivity: (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday') => boolean
    theme: any
    searchQuery?: string
  }
}

const ActivityItem: React.FC<ActivityItemProps> = ({ index, style, data }) => {
  const { activities, onAddActivity, theme, searchQuery } = data
  const activity = activities[index]
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('9am')
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday')

  if (!activity) return null

  const handleAdd = () => {
    const success = onAddActivity(activity, selectedTimeSlot, selectedDay)
    if (success) {
      // Show success feedback
      console.log(`✅ Added ${activity.name} to ${selectedDay} at ${selectedTimeSlot}`)
    }
  }

  const highlightText = (text: string, query?: string) => {
    if (!query) return text
    const regex = new RegExp(`(${query})`, 'gi')
    const parts = text.split(regex)
    return parts.map((part, i) => 
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div style={style} className="px-2">
      <div 
        className="border rounded-lg p-4 mb-2 transition-all hover:shadow-md cursor-pointer"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              {highlightText(activity.name, searchQuery)}
            </h3>
            <p className="text-sm opacity-75 mb-2">
              {highlightText(activity.description, searchQuery)}
            </p>
            <div className="flex items-center space-x-4 text-xs">
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                {activity.duration}min
              </span>
              <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                {activity.cost}
              </span>
              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                {activity.difficulty}
              </span>
              {activity.indoor && (
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                  Indoor
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{activity.icon}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? '▼' : '▶'}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.colors.border }}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Day</label>
                <select 
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as 'saturday' | 'sunday')}
                  className="w-full p-2 border rounded-md"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                >
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <select 
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  style={{
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    color: theme.colors.text
                  }}
                >
                  {['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'].map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {activity.tags.map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAdd()
                }}
                className="px-4 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: theme.colors.primary }}
              >
                Add to Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const VirtualizedActivityList: React.FC<VirtualizedActivityListProps> = ({
  activities,
  onAddActivity,
  searchQuery,
  category,
  itemHeight = 120,
  height = 600,
  onLoadMore,
  hasMore = false,
  loading = false
}) => {
  const { currentTheme } = useTheme()
  const listRef = useRef<List>(null)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filter activities based on search query
  const filteredActivities = useMemo(() => {
    if (!searchQuery) return activities
    
    const query = searchQuery.toLowerCase()
    return activities.filter(activity => 
      activity.name.toLowerCase().includes(query) ||
      activity.description.toLowerCase().includes(query) ||
      activity.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }, [activities, searchQuery])

  // Memoized item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    activities: filteredActivities,
    onAddActivity,
    theme: currentTheme,
    searchQuery
  }), [filteredActivities, onAddActivity, currentTheme, searchQuery])

  // Handle infinite scrolling
  const handleItemsRendered = useCallback(({ visibleStopIndex }: { visibleStopIndex: number }) => {
    if (
      hasMore && 
      !loadingMore && 
      visibleStopIndex >= filteredActivities.length - 5 && 
      onLoadMore
    ) {
      setLoadingMore(true)
      onLoadMore()
      setTimeout(() => setLoadingMore(false), 1000) // Prevent rapid calls
    }
  }, [hasMore, loadingMore, filteredActivities.length, onLoadMore])

  // Reset scroll position when search changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(0)
    }
  }, [searchQuery, category])

  if (filteredActivities.length === 0) {
    return (
      <div 
        className="flex items-center justify-center h-64 text-center"
        style={{ color: currentTheme.colors.textSecondary }}
      >
        <div>
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-medium mb-2">No activities found</h3>
          <p className="text-sm">
            {searchQuery 
              ? `No activities match "${searchQuery}"`
              : 'No activities available in this category'
            }
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <List
        ref={listRef}
        height={height}
        itemCount={filteredActivities.length}
        itemSize={itemHeight}
        itemData={itemData}
        onItemsRendered={handleItemsRendered}
        overscanCount={5} // Render 5 extra items for smooth scrolling
        className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
      >
        {ActivityItem}
      </List>
      
      {/* Loading indicator for infinite scroll */}
      {(loading || loadingMore) && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center py-4">
          <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-lg">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading more activities...</span>
          </div>
        </div>
      )}
      
      {/* Performance stats (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {filteredActivities.length} items • Virtual rendering
        </div>
      )}
    </div>
  )
}
