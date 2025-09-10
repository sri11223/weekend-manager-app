import React, { useState, useEffect } from 'react'
import { Search, Hash } from 'lucide-react'
import { startOfWeek, addDays, format } from 'date-fns'
import DraggableActivityCard, { Activity } from '../features/DraggableActivityCard'
import WeekendThemeSelector from '../features/WeekendThemeSelector'
import MoodVibeTracker from '../features/MoodVibeTracker'
import { useWeekendTheme } from '../../hooks/useWeekendTheme'
import { enhancedMockService } from '../../services/enhancedMockService'
import { apiIntegrationService } from '../../services/apiIntegrationService'

interface SidebarChannel {
  id: string
  name: string
  icon: React.ReactNode
  count?: number
  type: 'channel' | 'category' | 'smart'
  color?: string
}


const ACTIVITY_CATEGORIES: SidebarChannel[] = [
  { id: 'entertainment', name: 'Movies & Shows', icon: <Hash className="w-4 h-4" />, count: 15, type: 'category', color: '#6366f1' },
  { id: 'food', name: 'Food & Dining', icon: <Hash className="w-4 h-4" />, count: 25, type: 'category', color: '#ec4899' },
  { id: 'outdoor', name: 'Outdoor Fun', icon: <Hash className="w-4 h-4" />, count: 18, type: 'category', color: '#10b981' },
  { id: 'culture', name: 'Events & Culture', icon: <Hash className="w-4 h-4" />, count: 12, type: 'category', color: '#f59e0b' },
  { id: 'social', name: 'Social & Games', icon: <Hash className="w-4 h-4" />, count: 8, type: 'category', color: '#8b5cf6' },
  { id: 'wellness', name: 'Wellness & Fitness', icon: <Hash className="w-4 h-4" />, count: 5, type: 'category', color: '#06b6d4' },
]

export const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVibes, setSelectedVibes] = useState<string[]>([])
  
  // Weekend theme state
  const { selectedTheme, setTheme, clearTheme } = useWeekendTheme()
  
  // Get current weekend dates
  const today = new Date()
  const weekStart = startOfWeek(today)
  const saturday = addDays(weekStart, 6)
  const sunday = addDays(weekStart, 7)

  // Load activities
  useEffect(() => {
    loadActivities()
  }, [selectedCategory, searchQuery, selectedTheme, selectedVibes])

  const loadActivities = async () => {
    try {
      setLoading(true)
      let result: Activity[] = []
      let apiActivities: Activity[] = []

      // Get API activities based on theme or category
      if (selectedTheme) {
        apiActivities = await apiIntegrationService.getActivitiesByTheme(selectedTheme.id, 10)
      } else if (selectedCategory !== 'all') {
        apiActivities = await apiIntegrationService.getActivitiesByCategory(selectedCategory, 8)
      }

      // Get mock activities
      if (searchQuery.trim()) {
        const allMockActivities = await enhancedMockService.getAllActivities()
        result = allMockActivities.filter(activity => 
          activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          activity.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        const searchApiActivities = await apiIntegrationService.searchActivities(searchQuery, 5)
        result = [...result, ...searchApiActivities]
      } else if (selectedCategory !== 'all') {
        result = await enhancedMockService.getActivitiesByCategory(selectedCategory)
      } else {
        result = await enhancedMockService.getAllActivities()
      }

      // Combine and deduplicate activities
      const combinedActivities = [...result, ...apiActivities]
      const uniqueActivities = combinedActivities.filter((activity, index, self) => 
        index === self.findIndex(a => a.id === activity.id)
      )

      // Apply vibe filtering to final results
      const filteredByVibes = uniqueActivities.filter(activity => {
        if (selectedVibes.length === 0) return true
        return selectedVibes.some(vibe => 
          activity.moodTags?.some(tag => tag.toLowerCase().includes(vibe.toLowerCase()))
        )
      })

      setActivities(filteredByVibes.slice(0, 25))
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

  // Update category counts dynamically
  const updateCategoryCounts = (allActivities: Activity[]) => {
    return ACTIVITY_CATEGORIES.map(category => ({
      ...category,
      count: allActivities.filter(activity => activity.category === category.id).length
    }))
  }

  const categoriesWithCounts = updateCategoryCounts(activities)

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Clean Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-500 mb-1">This Weekend</div>
        <div className="text-lg font-semibold text-gray-900 mb-2">
          {format(saturday, 'MMM d')} - {format(sunday, 'd, yyyy')}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{format(saturday, 'EEEE')}</span>
          <span>{format(sunday, 'EEEE')}</span>
        </div>
      </div>

      {/* Search Bar - Move to top */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Compact Categories */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All ({activities.length})
          </button>
          {categoriesWithCounts.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Weekend Theme Selector */}
      <div className="p-4 border-b border-gray-200">
        <WeekendThemeSelector 
          selectedTheme={selectedTheme}
          onThemeSelect={setTheme}
          onThemeClear={clearTheme}
        />
      </div>

      {/* Mood/Vibe Tracker */}
      <div className="p-4 border-b border-gray-200">
        <MoodVibeTracker 
          selectedVibes={selectedVibes}
          onVibesChange={setSelectedVibes}
        />
      </div>

      {/* Activities List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {searchQuery ? `Search Results` : 
               selectedCategory === 'all' ? 'All Activities' : 
               `${ACTIVITY_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'Activities'}`}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-md border">
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
                <div key={i} className="bg-white rounded-lg p-3 animate-pulse border">
                  <div className="bg-gray-200 h-16 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded mb-1"></div>
                  <div className="bg-gray-200 h-2 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium mb-1">No activities found</p>
              <p className="text-xs text-gray-400">Try adjusting your search</p>
            </div>
          ) : (
            <div className="space-y-2">
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
      </div>
    </aside>
  )
}
