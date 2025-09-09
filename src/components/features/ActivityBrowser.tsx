import React, { useState, useMemo } from 'react'
import { Search, Filter, X, Grid, List } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { ActivityCard } from './ActivityCard'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import type { Activity, ActivityCategory, CostLevel, Mood } from '@/types'
import { ACTIVITY_CATEGORIES, CATEGORY_COLORS, COST_COLORS } from '@/constants'

interface ActivityBrowserProps {
  activities: Activity[]
  selectedActivities: Activity[]
  scheduledActivityIds: string[]
  onSelectActivity: (activity: Activity) => void
  onAddToSchedule?: (activity: Activity) => void
}

export const ActivityBrowser: React.FC<ActivityBrowserProps> = ({
  activities,
  selectedActivities,
  scheduledActivityIds,
  onSelectActivity,
  onAddToSchedule
}) => {
  // State for filtering and search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<ActivityCategory[]>([])
  const [selectedCosts, setSelectedCosts] = useState<CostLevel[]>([])
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)

  // Filter activities based on search and filters
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(activity.category)

      // Cost filter
      const matchesCost = selectedCosts.length === 0 || 
        selectedCosts.includes(activity.cost)

      // Mood filter
      const matchesMood = selectedMoods.length === 0 || 
        selectedMoods.includes(activity.mood)

      return matchesSearch && matchesCategory && matchesCost && matchesMood
    })
  }, [activities, searchQuery, selectedCategories, selectedCosts, selectedMoods])

  // Get unique values for filters
  const availableCategories = [...new Set(activities.map(a => a.category))]
  const availableCosts: CostLevel[] = ['free', 'low', 'medium', 'high']
  const availableMoods = [...new Set(activities.map(a => a.mood))]

  // Toggle filter selections
  const toggleCategory = (category: ActivityCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleCost = (cost: CostLevel) => {
    setSelectedCosts(prev => 
      prev.includes(cost) 
        ? prev.filter(c => c !== cost)
        : [...prev, cost]
    )
  }

  const toggleMood = (mood: Mood) => {
    setSelectedMoods(prev => 
      prev.includes(mood) 
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    )
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCategories([])
    setSelectedCosts([])
    setSelectedMoods([])
  }

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || 
                         selectedCosts.length > 0 || selectedMoods.length > 0

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant={showFilters ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Active
                    </span>
                  )}
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-red-500 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                )}

                <div className="text-sm text-gray-600">
                  {filteredActivities.length} of {activities.length} activities
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Options */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 border-t border-white/20 pt-4"
                >
                  {/* Category Filters */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Categories</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableCategories.map(category => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategories.includes(category)
                              ? 'text-white shadow-lg'
                              : 'bg-white/50 text-gray-700 hover:bg-white/70'
                          }`}
                          style={{
                            backgroundColor: selectedCategories.includes(category) 
                              ? CATEGORY_COLORS[category] 
                              : undefined
                          }}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cost Filters */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Cost</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableCosts.map(cost => (
                        <button
                          key={cost}
                          onClick={() => toggleCost(cost)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCosts.includes(cost)
                              ? 'text-white shadow-lg'
                              : 'bg-white/50 text-gray-700 hover:bg-white/70'
                          }`}
                          style={{
                            backgroundColor: selectedCosts.includes(cost) 
                              ? COST_COLORS[cost] 
                              : undefined
                          }}
                        >
                          {cost}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood Filters */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Mood</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableMoods.map(mood => (
                        <button
                          key={mood}
                          onClick={() => toggleMood(mood)}
                          className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedMoods.includes(mood)
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'bg-white/50 text-gray-700 hover:bg-white/70'
                          }`}
                        >
                          {mood}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid/List */}
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
      }>
        <AnimatePresence>
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              layout
            >
              <div className="relative">
                <ActivityCard
                  activity={activity}
                  size={viewMode === 'grid' ? 'md' : 'lg'}
                  isSelected={selectedActivities.some(a => a.id === activity.id)}
                  onSelect={onSelectActivity}
                />
                
                {/* Scheduled Badge */}
                {scheduledActivityIds.includes(activity.id) && (
                  <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    ✓ Scheduled
                  </div>
                )}

                {/* Quick Add Button */}
                {onAddToSchedule && !scheduledActivityIds.includes(activity.id) && (
                  <div className="absolute bottom-3 right-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onAddToSchedule(activity)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      + Schedule
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No Results Message */}
      {filteredActivities.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No activities found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search or filters to find more activities
          </p>
          <Button variant="secondary" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </motion.div>
      )}
    </div>
  )
}
