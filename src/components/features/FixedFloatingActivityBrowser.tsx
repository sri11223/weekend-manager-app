import React, { useState, useEffect } from 'react'
import { Search, X, Plus, Clock, MapPin, Star, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import { useDrag } from 'react-dnd'
import { useTheme } from '../../hooks/useTheme'
import { apiIntegrationService } from '../../services/apiIntegrationService'
import { enhancedMockService } from '../../services/enhancedMockService'

interface ActivityData {
  id: string
  title: string
  description: string
  category: string
  duration: number
  image?: string
  rating?: number
  location?: string
  tags?: string[]
  cost?: number | string
  mood?: string
  icon?: string
  color?: string
  indoor?: boolean
}

interface FixedFloatingActivityBrowserProps {
  category: string
  onClose: () => void
  searchQuery?: string
  onAddActivity: (activity: ActivityData, timeSlot?: string, day?: 'saturday' | 'sunday') => void
}

interface DraggableActivityCardProps {
  activity: ActivityData
  onAddActivity: (activity: ActivityData) => void
  theme: any
}

const DraggableActivityCard: React.FC<DraggableActivityCardProps> = ({ 
  activity, 
  onAddActivity, 
  theme 
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'activity',
    item: activity,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  return (
    <motion.div
      ref={drag as any}
      className={`
        relative p-4 rounded-xl border cursor-move transition-all duration-200
        ${isDragging ? 'opacity-50 scale-95' : 'hover:shadow-lg hover:scale-[1.02]'}
      `}
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Activity Image */}
      {activity.image && (
        <div className="w-full h-32 mb-3 rounded-lg overflow-hidden">
          <img
            src={activity.image}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Activity Content */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm" style={{ color: theme.colors.text }}>
          {activity.title}
        </h3>
        
        <p className="text-xs line-clamp-2" style={{ color: theme.colors.textSecondary }}>
          {activity.description}
        </p>

        {/* Activity Meta */}
        <div className="flex items-center gap-3 text-xs" style={{ color: theme.colors.textSecondary }}>
          {activity.duration && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{activity.duration}m</span>
            </div>
          )}
          
          {activity.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-20">{activity.location}</span>
            </div>
          )}

          {activity.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span>{activity.rating}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {activity.tags && activity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {activity.tags.slice(0, 2).map((tag: string, index: number) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${theme.colors.primary}20`,
                  color: theme.colors.primary
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Button */}
      <button
        onClick={() => onAddActivity(activity)}
        className="absolute top-2 right-2 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        style={{
          backgroundColor: theme.colors.primary,
          color: 'white'
        }}
      >
        <Plus className="w-4 h-4" />
      </button>

      {/* Drag Indicator */}
      <div className="absolute bottom-2 right-2 opacity-50">
        <div className="grid grid-cols-2 gap-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: theme.colors.textSecondary }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const FixedFloatingActivityBrowser: React.FC<FixedFloatingActivityBrowserProps> = ({
  category,
  onClose,
  searchQuery: initialSearchQuery = '',
  onAddActivity
}) => {
  const { currentTheme } = useTheme()
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'trending' | 'nearby' | 'quick'>('all')

  useEffect(() => {
    loadActivities()
  }, [category, searchQuery, selectedFilter])

  const convertToActivityData = (activity: any): ActivityData => {
    return {
      id: activity.id,
      title: activity.title || activity.name,
      description: activity.description,
      category: activity.category,
      duration: activity.duration,
      image: activity.image,
      rating: activity.rating,
      location: activity.location,
      tags: activity.tags || activity.moodTags,
      cost: activity.cost,
      mood: activity.mood,
      icon: activity.icon,
      color: activity.color,
      indoor: activity.indoor
    }
  }

  const loadActivities = async () => {
    try {
      setLoading(true)
      let result: any[] = []

      if (searchQuery.trim()) {
        // Search across all sources
        const mockActivities = await enhancedMockService.getAllActivities()
        const searchResults = mockActivities.filter(activity =>
          activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        
        const apiResults = await apiIntegrationService.searchActivities(searchQuery, 10)
        result = [...searchResults, ...apiResults]
      } else if (category !== 'all') {
        // Get activities by category
        const mockActivities = await enhancedMockService.getActivitiesByCategory(category)
        const apiActivities = await apiIntegrationService.getActivitiesByCategory(category, 15)
        result = [...mockActivities, ...apiActivities]
      } else {
        // Get all activities
        const allActivities = await enhancedMockService.getAllActivities()
        result = allActivities
      }

      // Don't filter by mood initially - show all activities
      // const currentMood = currentTheme.mood
      // if (currentMood && currentMood !== 'all') {
      //   result = result.filter(activity => {
      //     const activityMoods = activity.tags || activity.moodTags || []
      //     return activityMoods.some((tag: string) => 
      //       tag.toLowerCase().includes(currentMood.toLowerCase())
      //     ) || activity.mood === currentMood
      //   })
      // }

      // Apply filters
      if (selectedFilter === 'trending') {
        result = result.filter(activity => 
          (activity.rating && activity.rating >= 4.0) || 
          (activity.tags && activity.tags.includes('popular'))
        )
      } else if (selectedFilter === 'nearby') {
        result = result.filter(activity => 
          activity.location || 
          (activity.tags && activity.tags.includes('local'))
        )
      } else if (selectedFilter === 'quick') {
        result = result.filter(activity => activity.duration <= 60)
      }

      // Remove duplicates and limit results
      const uniqueActivities = result.filter((activity, index, self) =>
        index === self.findIndex(a => a.id === activity.id)
      )

      const convertedActivities = uniqueActivities.slice(0, 20).map(convertToActivityData)
      setActivities(convertedActivities)
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryTitle = () => {
    switch (category) {
      case 'movies': return '🎬 Movies & Entertainment'
      case 'food': return '🍽️ Food & Dining'
      case 'games': return '🎮 Games & Fun'
      case 'outdoor': return '🌳 Outdoor Activities'
      case 'social': return '👥 Social Activities'
      case 'all': return '✨ All Activities'
      default: return '✨ All Activities'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-6xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: currentTheme.colors.surface }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{ 
            borderColor: currentTheme.colors.border,
            background: currentTheme.colors.gradient
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {getCategoryTitle()}
              </h2>
              <p className="text-white/80">
                Drag activities to your timeline or click + to add • Mood: {currentTheme.name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-4 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All', icon: Filter },
                { id: 'trending', label: 'Trending', icon: Star },
                { id: 'nearby', label: 'Nearby', icon: MapPin },
                { id: 'quick', label: 'Quick', icon: Clock }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                    ${selectedFilter === filter.id 
                      ? 'bg-white text-gray-900' 
                      : 'bg-white/20 text-white hover:bg-white/30'
                    }
                  `}
                >
                  <filter.icon className="w-4 h-4" />
                  <span className="hidden md:inline">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2" 
                   style={{ borderColor: currentTheme.colors.primary }} />
              <span className="ml-3" style={{ color: currentTheme.colors.text }}>
                Loading activities...
              </span>
            </div>
          ) : activities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {activities.map((activity) => (
                <DraggableActivityCard
                  key={activity.id}
                  activity={activity}
                  onAddActivity={onAddActivity}
                  theme={currentTheme}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                   style={{ backgroundColor: currentTheme.colors.border }}>
                <Search className="w-8 h-8" style={{ color: currentTheme.colors.textSecondary }} />
              </div>
              <h3 className="text-lg font-medium mb-2" style={{ color: currentTheme.colors.text }}>
                No activities found
              </h3>
              <p style={{ color: currentTheme.colors.textSecondary }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div 
          className="p-4 border-t text-center"
          style={{ 
            borderColor: currentTheme.colors.border,
            backgroundColor: currentTheme.colors.background
          }}
        >
          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
            💡 <strong>Tip:</strong> Drag activities directly to time slots or use the + button for quick adding
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FixedFloatingActivityBrowser
