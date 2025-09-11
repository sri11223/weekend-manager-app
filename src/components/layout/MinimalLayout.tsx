import React, { useState, useEffect } from 'react'
import { Search, Film, Utensils, Gamepad2, MapPin, Users } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import EnhancedWeekendTimeline from '../features/EnhancedWeekendTimeline'
import FloatingActivityBrowser from '../features/FloatingActivityBrowser'
import ThemeSelector from '../features/ThemeSelector'
import PlanSummary from '../features/PlanSummary'
import { useTheme } from '../../hooks/useTheme'
import { useScheduleStore } from '../../store/scheduleStore'

const CATEGORIES = [
  { id: 'movies', name: 'Movies', icon: <Film className="w-4 h-4" />, color: 'bg-purple-500', count: 25 },
  { id: 'food', name: 'Food', icon: <Utensils className="w-4 h-4" />, color: 'bg-orange-500', count: 18 },
  { id: 'games', name: 'Games', icon: <Gamepad2 className="w-4 h-4" />, color: 'bg-blue-500', count: 15 },
  { id: 'outdoor', name: 'Outdoor', icon: <MapPin className="w-4 h-4" />, color: 'bg-green-500', count: 12 },
  { id: 'social', name: 'Social', icon: <Users className="w-4 h-4" />, color: 'bg-pink-500', count: 8 },
]

export const MinimalLayout: React.FC = () => {
  const { currentTheme, themeId, forceRender, isThemeReady } = useTheme()
  const { 
    scheduledActivities, 
    addActivity, 
    removeActivity, 
    moveActivity,
    clearAllActivities 
  } = useScheduleStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [activePanel, setActivePanel] = useState<string | null>(null)
  // const [showCommunity, setShowCommunity] = useState(false)
  // const [showBudget, setShowBudget] = useState(false)
  // const [showSocial, setShowSocial] = useState(false)
  // const [showLongWeekend, setShowLongWeekend] = useState(false)
  const [selectedDays] = useState<('saturday' | 'sunday')[]>(['saturday', 'sunday'])

  // Force re-render when theme changes
  const [renderKey, setRenderKey] = useState(0)

  useEffect(() => {
    setRenderKey(prev => prev + 1)
  }, [themeId, currentTheme])

  // Centralized activity management
  const handleAddActivity = (activity: any, timeSlot: string, day: 'saturday' | 'sunday') => {
    const success = addActivity(activity, timeSlot, day)
    if (!success) {
      // Show error notification
      console.log('⚠️ Failed to add activity - slot may be occupied')
    }
    return success
  }

  const handleRemoveActivity = (activityId: string) => {
    removeActivity(activityId)
  }

  const handleMoveActivity = (activityId: string, newTimeSlot: string, newDay: 'saturday' | 'sunday') => {
    return moveActivity(activityId, newTimeSlot, newDay)
  }

  const handleCategoryClick = (categoryId: string) => {
    setActivePanel(activePanel === categoryId ? null : categoryId)
  }

  const handleClosePanel = () => {
    setActivePanel(null)
  }

  const handleClearAll = () => {
    clearAllActivities()
  }

  // Show loading state while theme initializes
  if (!isThemeReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading theme...</p>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* ✅ FORCE COMPLETE RE-RENDER ON THEME CHANGE */}
      <div 
        key={`weekendly-${themeId}-${forceRender}-${renderKey}`}
        className="min-h-screen transition-all duration-300" 
        style={{ 
          backgroundColor: `var(--color-background, ${currentTheme.colors.background})`,
          color: `var(--color-text, ${currentTheme.colors.text})`
        }}
      >
        {/* Header */}
        <header 
          className="border-b px-6 py-4 transition-all duration-300"
          style={{ 
            background: `var(--color-primary, ${currentTheme.colors.primary})`,
            borderColor: `var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Weekendly</h1>
              <div className="text-sm text-white/80">Plan your perfect weekend</div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/60"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSelector />
              <button 
                onClick={handleClearAll}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </header>

        {/* Category Navigation */}
        <nav 
          className="border-b px-6 py-4 transition-all duration-300" 
          style={{ 
            backgroundColor: `var(--color-surface, ${currentTheme.colors.surface})`, 
            borderColor: `var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-6">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:scale-105
                    ${activePanel === category.id ? 'border-2' : 'hover:opacity-80'}
                  `}
                  style={{
                    backgroundColor: activePanel === category.id 
                      ? `var(--color-primary, ${currentTheme.colors.primary})20` 
                      : 'transparent',
                    borderColor: activePanel === category.id 
                      ? `var(--color-primary, ${currentTheme.colors.primary})` 
                      : 'transparent',
                    color: activePanel === category.id 
                      ? `var(--color-primary, ${currentTheme.colors.primary})` 
                      : `var(--color-text, ${currentTheme.colors.text})`
                  }}
                >
                  {category.icon}
                  <span className="hidden md:inline">{category.name}</span>
                  {category.count && (
                    <span 
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `var(--color-border, ${currentTheme.colors.border})`,
                        color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})`
                      }}
                    >
                      {category.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="text-sm" style={{ color: `var(--color-text-secondary, ${currentTheme.colors.textSecondary})` }}>
              This Weekend - Sep 14-15, 2024 - {scheduledActivities.filter(a => !a.completed).length} activities planned
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main 
          className="flex-1 flex min-h-0"
          style={{ 
            backgroundColor: `var(--color-background, ${currentTheme.colors.background})`,
            color: `var(--color-text, ${currentTheme.colors.text})`
          }}
        >
          {/* Timeline Container */}
          <section className="flex-1 p-6 overflow-hidden">
            <EnhancedWeekendTimeline
              scheduledActivities={scheduledActivities}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              onMoveActivity={handleMoveActivity}
              selectedDays={selectedDays}
            />
          </section>

          {/* Right Sidebar - Plan Summary */}
          <aside 
            className="w-80 border-l p-6 overflow-y-auto transition-all duration-300"
            style={{ 
              backgroundColor: `var(--color-surface, ${currentTheme.colors.surface})`,
              borderColor: `var(--color-border, ${currentTheme.colors.border})`
            }}
          >
            <PlanSummary 
              scheduledActivities={scheduledActivities}
              selectedDays={selectedDays}
              onRemoveActivity={handleRemoveActivity}
            />
          </aside>
        </main>

        {/* Floating Activity Browser */}
        <AnimatePresence mode="wait">
          {activePanel && (
            <FloatingActivityBrowser
              key={`browser-${activePanel}-${themeId}-${renderKey}`}
              category={activePanel}
              onClose={handleClosePanel}
              searchQuery={searchQuery}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              scheduledActivities={scheduledActivities}
            />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  )
}
