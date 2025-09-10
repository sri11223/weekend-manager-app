import React, { useState, useEffect } from 'react'
import { Search, Plus, Hash, Filter } from 'lucide-react'
import { format, addDays, startOfWeek } from 'date-fns'
import { DraggableActivityCard, Activity } from '../features/DraggableActivityCard'
import { enhancedMockService } from '../../services/enhancedMockService'

interface SidebarChannel {
  id: string
  name: string
  icon: React.ReactNode
  count?: number
  type: 'channel' | 'category' | 'smart'
  color?: string
}

const SIDEBAR_CHANNELS: SidebarChannel[] = [
  { id: 'all', name: 'all', icon: <Hash className="w-4 h-4" />, count: 45, type: 'channel' },
  { id: 'weekend', name: 'weekend', icon: <Hash className="w-4 h-4" />, count: 25, type: 'channel' },
  { id: 'family', name: 'family', icon: <Hash className="w-4 h-4" />, count: 12, type: 'channel' },
]

const ACTIVITY_CATEGORIES: SidebarChannel[] = [
  { id: 'movies', name: 'Movies & Shows', icon: <Hash className="w-4 h-4" />, count: 15, type: 'category', color: '#6366f1' },
  { id: 'food', name: 'Food & Dining', icon: <Hash className="w-4 h-4" />, count: 25, type: 'category', color: '#ec4899' },
  { id: 'outdoor', name: 'Outdoor Fun', icon: <Hash className="w-4 h-4" />, count: 18, type: 'category', color: '#10b981' },
  { id: 'events', name: 'Events & Culture', icon: <Hash className="w-4 h-4" />, count: 12, type: 'category', color: '#f59e0b' },
]

export const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  
  // Get current weekend dates
  const today = new Date()
  const weekStart = startOfWeek(today)
  const saturday = addDays(weekStart, 6)
  const sunday = addDays(weekStart, 7)

  // Load activities
  useEffect(() => {
    loadActivities()
  }, [selectedCategory, searchQuery])

  const loadActivities = async () => {
    try {
      setLoading(true)
      let result: Activity[] = []

      if (searchQuery.trim()) {
        result = await enhancedMockService.advancedSearch({ query: searchQuery })
      } else if (selectedCategory === 'all') {
        result = await enhancedMockService.getAllActivities()
      } else {
        result = await enhancedMockService.getActivitiesByCategory(selectedCategory)
      }

      setActivities(result.slice(0, 20)) // Limit to 20 activities
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSearchQuery('')
  }

  return (
    <aside className="w-80 bg-white/25 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-lg">
      {/* Mini Calendar */}
      <div className="p-6 border-b border-white/20">
        <div className="bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-2xl p-5 border border-white/30">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">This Weekend</div>
          <div className="text-xl font-bold text-gray-900 mb-1">
            {format(saturday, 'MMM d')} - {format(sunday, 'd, yyyy')}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-blue-600 font-medium">{format(saturday, 'EEEE')}</span>
            <span className="text-purple-600 font-medium">{format(sunday, 'EEEE')}</span>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="p-4 border-b border-white/20">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search activities, movies, games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all text-sm font-medium"
          />
        </div>
        
        {/* Quick Stats */}
        <div className="text-xs text-gray-600 text-center">
          {activities.length} activities available
        </div>
      </div>

      {/* Enhanced Categories Filter */}
      <div className="p-4 border-b border-white/20">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Browse Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                : 'bg-white/50 text-gray-700 hover:bg-white/70 hover:shadow-md'
            }`}
          >
            <span>🎯 All Activities</span>
            <span className="text-xs opacity-75">{activities.length}</span>
          </button>
          {ACTIVITY_CATEGORIES.map((category) => {
            const categoryCount = activities.filter(a => a.category.toLowerCase().includes(category.id)).length;
            const emoji = {
              'movies': '🎬',
              'food': '🍽️', 
              'outdoor': '🌲',
              'events': '🎭'
            }[category.id] || '📋';
            
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`w-full p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 hover:shadow-md'
                }`}
              >
                <span>{emoji} {category.name}</span>
                <span className="text-xs opacity-75">{categoryCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/80 backdrop-blur-sm rounded-lg p-2 z-10">
          <h3 className="text-sm font-bold text-gray-800">
            {searchQuery ? `🔍 Search Results` : 
             selectedCategory === 'all' ? '🎯 All Activities' : 
             `${ACTIVITY_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Activities'}`}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              {activities.length}
            </span>
            {loading && (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white/30 rounded-xl p-3 animate-pulse">
                <div className="bg-gray-300 h-24 rounded-lg mb-2"></div>
                <div className="bg-gray-300 h-3 rounded mb-1"></div>
                <div className="bg-gray-300 h-2 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm font-medium mb-1">No activities found</p>
            <p className="text-xs text-gray-400">Try a different search term or category</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <DraggableActivityCard
                key={activity.id}
                activity={activity}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}
