import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Clock, MapPin, Star } from 'lucide-react'
import { Activity, ActivityCategory } from '../../types'
import { enhancedMockService } from '../../services/enhancedMockService'

interface QuickActivityPopupProps {
  isOpen: boolean
  onClose: () => void
  onActivitySelect: (activity: Activity) => void
  timeSlot: string
  day: 'saturday' | 'sunday'
  title?: string
}

const CATEGORY_ICONS: Record<ActivityCategory, string> = {
  food: '🍽️',
  entertainment: '🎭',
  outdoor: '🌳',
  indoor: '🏠',
  social: '�',
  wellness: '🧘',
  culture: '🎨',
  sports: '💪',
  creative: '🎭',
  learning: '📚'
}

export const QuickActivityPopup: React.FC<QuickActivityPopupProps> = ({
  isOpen,
  onClose,
  onActivitySelect,
  timeSlot,
  day,
  title = 'Choose Activity'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  const categories: ActivityCategory[] = [
    'food', 'entertainment', 'outdoor', 'indoor', 
    'social', 'wellness', 'culture', 'sports', 
    'creative', 'learning'
  ]

  useEffect(() => {
    const loadActivities = async () => {
      if (isOpen) {
        setLoading(true)
        try {
          const allActivities = await enhancedMockService.getAllActivities()
          // Convert EnhancedActivity to Activity type
          const convertedActivities: Activity[] = allActivities.map(activity => ({
            id: activity.id,
            name: activity.name,
            description: activity.description,
            category: activity.category as ActivityCategory,
            duration: activity.duration,
            mood: activity.mood,
            icon: activity.icon,
            color: activity.color,
            indoor: activity.indoor,
            cost: activity.cost <= 10 ? 'free' : activity.cost <= 50 ? 'low' : activity.cost <= 100 ? 'medium' : 'high',
            difficulty: activity.difficulty,
            tags: activity.tags,
            location: activity.location || undefined,
            weatherDependent: activity.weatherPreference !== 'any'
          }))
          setActivities(convertedActivities)
        } catch (error) {
          console.error('Error loading activities:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    loadActivities()
  }, [isOpen])

  const filteredActivities = activities.filter((activity: Activity) => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const handleActivitySelect = (activity: Activity) => {
    onActivitySelect(activity)
    onClose()
    setSearchQuery('')
    setSelectedCategory('all')
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '100%', opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
          className="bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {day.charAt(0).toUpperCase() + day.slice(1)} at {timeSlot}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{CATEGORY_ICONS[category]}</span>
                  <span className="capitalize">{category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Activities List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2">No activities found</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Try adjusting your search or category filter
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredActivities.map((activity: Activity) => (
                  <motion.button
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleActivitySelect(activity)}
                    className="p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 text-left border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {activity.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{activity.duration} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            <span className="capitalize">{activity.cost}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{activity.indoor ? 'Indoor' : 'Outdoor'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default QuickActivityPopup