import React, { useState, useEffect } from 'react'
import { X, Search, Filter, Clock, DollarSign, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Activity } from './DraggableActivityCard'
import { enhancedMockService } from '../../services/enhancedMockService'
import { apiIntegrationService } from '../../services/apiIntegrationService'
import { useWeekendStore } from '../../store/weekendStore'

interface FloatingActivityBrowserProps {
  category: string
  onClose: () => void
  searchQuery?: string
}

const CATEGORY_CONFIGS = {
  movies: {
    title: 'Movies & Shows',
    description: 'Discover trending movies and shows',
    color: 'purple',
    bgGradient: 'from-purple-500 to-pink-500'
  },
  food: {
    title: 'Food & Dining',
    description: 'Find restaurants and food experiences',
    color: 'orange',
    bgGradient: 'from-orange-500 to-red-500'
  },
  games: {
    title: 'Games & Entertainment',
    description: 'Explore games and fun activities',
    color: 'blue',
    bgGradient: 'from-blue-500 to-indigo-500'
  },
  outdoor: {
    title: 'Outdoor Adventures',
    description: 'Get outside and explore nature',
    color: 'green',
    bgGradient: 'from-green-500 to-teal-500'
  },
  social: {
    title: 'Social Activities',
    description: 'Connect with friends and family',
    color: 'pink',
    bgGradient: 'from-pink-500 to-rose-500'
  }
}

const FloatingActivityBrowser: React.FC<FloatingActivityBrowserProps> = ({
  category,
  onClose,
  searchQuery = ''
}) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all')
  const { addActivity } = useWeekendStore()

  const config = CATEGORY_CONFIGS[category as keyof typeof CATEGORY_CONFIGS] || CATEGORY_CONFIGS.movies

  useEffect(() => {
    loadActivities()
  }, [category, localSearch, filter])

  const loadActivities = async () => {
    try {
      setLoading(true)
      let result: Activity[] = []

      // Get activities from mock service first
      if (localSearch.trim()) {
        const mockActivities = await enhancedMockService.getAllActivities()
        result = mockActivities.filter(activity => 
          activity.title.toLowerCase().includes(localSearch.toLowerCase()) ||
          activity.description.toLowerCase().includes(localSearch.toLowerCase())
        )
      } else {
        result = await enhancedMockService.getActivitiesByCategory(category)
      }

      // Add API results if available
      try {
        if (localSearch.trim()) {
          const apiActivities = await apiIntegrationService.searchActivities(localSearch, 10)
          result = [...result, ...apiActivities]
        } else {
          const apiActivities = await apiIntegrationService.getActivitiesByCategory(category, 15)
          result = [...result, ...apiActivities]
        }
      } catch (error) {
        console.log('API failed, using mock data only:', error)
      }

      // Apply filters
      if (filter === 'free') {
        result = result.filter(activity => activity.cost === 0)
      } else if (filter === 'paid') {
        result = result.filter(activity => activity.cost > 0)
      }

      // Remove duplicates and limit results
      const uniqueActivities = result.filter((activity, index, self) => 
        index === self.findIndex(a => a.id === activity.id)
      )

      setActivities(uniqueActivities.slice(0, 30))
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (activity: Activity, day: 'saturday' | 'sunday', timeSlot: string) => {
    const timeSlots = {
      'morning': '09:00',
      'afternoon': '14:00', 
      'evening': '19:00'
    }
    
    addActivity({
      ...activity,
      day,
      startTime: timeSlots[timeSlot as keyof typeof timeSlots] || '14:00'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${config.bgGradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{config.title}</h2>
              <p className="text-white/80 mt-1">{config.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/80" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="all">All Activities</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Activities</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-180px)] overflow-y-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((activity) => (
                <div key={activity.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      {activity.cost === 0 ? (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Free
                        </span>
                      ) : (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                          <DollarSign className="w-3 h-3 mr-1" />
                          ${activity.cost}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{activity.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {activity.duration}min
                      </div>
                      {activity.popularity && (
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-400" />
                          {activity.popularity}%
                        </div>
                      )}
                    </div>

                    {/* Quick Add Buttons */}
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-700 mb-2">Quick Add:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleQuickAdd(activity, 'saturday', 'afternoon')}
                          className="bg-blue-50 text-blue-700 text-xs px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Sat Afternoon
                        </button>
                        <button
                          onClick={() => handleQuickAdd(activity, 'sunday', 'evening')}
                          className="bg-purple-50 text-purple-700 text-xs px-3 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                        >
                          Sun Evening
                        </button>
                      </div>
                      <button
                        onClick={() => handleQuickAdd(activity, 'saturday', 'morning')}
                        className="w-full bg-gray-50 text-gray-700 text-xs px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Add to Morning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default FloatingActivityBrowser
