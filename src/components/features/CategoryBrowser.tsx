import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Plus } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { MockActivityService } from '../../data/mockActivities'
import type { Activity } from '../../data/mockActivities'
import {
  Activity as ActivityIcon,
  Mountain,
  Heart,
  Zap,
  Sparkles,
  Brain,
  Camera,
  Coffee,
  Music,
  Gamepad2,
  Utensils,
  Users,
  TreePine,
  Dumbbell,
  Car,
  Palette
} from 'lucide-react'

const CATEGORY_ICONS = {
  outdoor: TreePine,
  sports: Dumbbell, 
  travel: Car,
  games: Gamepad2,
  food: Utensils,
  social: Users,
  wellness: Heart,
  nature: TreePine,
  books: Brain,
  movies: Camera,
  art: Palette,
  music: Music,
  dance: Zap,
  creative: Sparkles,
  focus: Brain,
  culture: Mountain,
  entertainment: ActivityIcon,
  learning: Brain,
  indoor: Coffee,
}

interface CategoryBrowserProps {
  onActivitySelect?: (activity: Activity) => void
  className?: string
}

export const CategoryBrowser: React.FC<CategoryBrowserProps> = ({ 
  onActivitySelect,
  className = ''
}) => {
  const { currentTheme, themeId } = useTheme()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  // Get categories for current theme
  const categories = useMemo(() => {
    const categoryData = MockActivityService.getCategoriesForTheme(themeId)
    return categoryData.map(categoryKey => {
      const IconComponent = CATEGORY_ICONS[categoryKey as keyof typeof CATEGORY_ICONS] || ActivityIcon
      const count = MockActivityService.getCategoryCount(themeId, categoryKey)
      
      return {
        id: categoryKey,
        name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
        icon: IconComponent,
        count,
        color: getRandomColor()
      }
    })
  }, [themeId])

  // Get activities for selected category
  const activities = useMemo(() => {
    if (!selectedCategory) return []
    return MockActivityService.getActivitiesForCategory(themeId, selectedCategory)
      .filter((activity: Activity) => 
        activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        activity.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
  }, [themeId, selectedCategory, searchQuery])

  function getRandomColor() {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const handleCategorySelect = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
      setIsExpanded(false)
    } else {
      setSelectedCategory(categoryId)
      setIsExpanded(true)
    }
  }

  const handleActivitySelect = (activity: Activity) => {
    onActivitySelect?.(activity)
  }

  return (
    <div className={`category-browser ${className}`}>
      {/* Category Grid */}
      <div className="category-grid" style={{ 
        background: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }}>
        <div className="category-header">
          <div className="header-content">
            <h3 style={{ color: currentTheme.colors.text }}>Activity Categories</h3>
            <p style={{ color: currentTheme.colors.textSecondary }}>
              {categories.reduce((sum, cat) => sum + cat.count, 0)} activities available
            </p>
          </div>
        </div>

        <div className="categories-scroll">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isActive = selectedCategory === category.id
            
            return (
              <motion.button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`category-card ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? 
                    `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` : 
                    currentTheme.colors.surface,
                  borderColor: isActive ? currentTheme.colors.primary : currentTheme.colors.border,
                  color: isActive ? 'white' : currentTheme.colors.text
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="category-icon">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div className="category-info">
                  <span className="category-name">{category.name}</span>
                  <span 
                    className="category-count"
                    style={{ 
                      color: isActive ? 'rgba(255,255,255,0.9)' : currentTheme.colors.textSecondary
                    }}
                  >
                    {category.count} activities
                  </span>
                </div>
                {isActive && (
                  <motion.div 
                    className="active-indicator"
                    layoutId="activeCategoryIndicator"
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Activities List */}
      <AnimatePresence>
        {isExpanded && selectedCategory && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="activities-panel"
            style={{ 
              background: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border 
            }}
          >
            {/* Search Bar */}
            <div className="activities-header">
              <div className="search-container">
                <Search className="search-icon" style={{ color: currentTheme.colors.textSecondary }} />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{
                    background: currentTheme.colors.background,
                    borderColor: currentTheme.colors.border,
                    color: currentTheme.colors.text
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="clear-search"
                    style={{ color: currentTheme.colors.textSecondary }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setIsExpanded(false)}
                className="close-panel"
                style={{ color: currentTheme.colors.textSecondary }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Activities Grid */}
            <div className="activities-list">
              {activities.length === 0 ? (
                <div className="no-activities" style={{ color: currentTheme.colors.textSecondary }}>
                  {searchQuery ? 'No activities match your search' : 'No activities found'}
                </div>
              ) : (
                activities.map((activity: Activity) => (
                  <motion.div
                    key={activity.id}
                    className="activity-item"
                    style={{
                      background: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleActivitySelect(activity)}
                  >
                    <div className="activity-icon">
                      <span className="activity-emoji">{activity.icon}</span>
                    </div>
                    
                    <div className="activity-content">
                      <h4 className="activity-name" style={{ color: currentTheme.colors.text }}>
                        {activity.name}
                      </h4>
                      <p className="activity-description" style={{ color: currentTheme.colors.textSecondary }}>
                        {activity.description}
                      </p>
                      
                      <div className="activity-meta">
                        <div className="activity-tags">
                          {activity.tags.slice(0, 2).map((tag: string) => (
                            <span 
                              key={tag}
                              className="activity-tag"
                              style={{ 
                                background: `${currentTheme.colors.primary}15`,
                                color: currentTheme.colors.primary
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="activity-info">
                          <span className="duration" style={{ color: currentTheme.colors.textSecondary }}>
                            {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      className="add-activity"
                      style={{ 
                        background: currentTheme.colors.primary,
                        color: 'white'
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CategoryBrowser