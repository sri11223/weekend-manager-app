// src/components/layout/MinimalLayout.tsx - SIMPLIFIED THEME SWITCHING
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Search, Share2 } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import EnhancedWeekendTimeline from '../features/EnhancedWeekendTimeline'
import FloatingActivityBrowser from '../features/FloatingActivityBrowser'
import ThemeSelector from '../features/ThemeSelector'
import PlanSummary from '../features/PlanSummary'
import LongWeekendWidget from '../features/LongWeekendWidget'
import { ShareExportPanel } from '../features/ShareExportPanel'
import { useTheme } from '../../hooks/useTheme'
import { useScheduleStore } from '../../store/scheduleStore'
import { useWeekendStore } from '../../store/weekendStore'
import { mockActivitiesDatabase, MockActivityService } from '../../data/mockActivities'

// Category Icons
import { 
  Mountain, Zap, Users, Gamepad2, UtensilsCrossed, Palette as PaletteIcon,
  TreePine, Dumbbell, Car, Heart, Baby, BookOpen, Film, Sparkles, Target,
  Coffee, Music, Camera, Brain, Home, Lightbulb, Brush, Pen, Activity,
  Monitor, Mic, Compass, Waves, Camera as Photo, Clock
} from 'lucide-react'

const getCategoryIcon = (categoryKey: string) => {
  const iconMap: { [key: string]: any } = {
    outdoor: Mountain, sports: Dumbbell, travel: Car, games: Gamepad2, food: UtensilsCrossed,
    social: Users, wellness: Sparkles, nature: TreePine, books: BookOpen, movies: Film,
    art: PaletteIcon, music: Music, dance: Users, creative: PaletteIcon, entertainment: Film,
    culture: Camera, learning: BookOpen, indoor: Home, visual_arts: Brush, writing: Pen,
    movement: Activity, crafts: PaletteIcon, digital_creation: Monitor, performance: Mic,
    meditation: Target, study: BookOpen, brain_training: Brain, environment: TreePine, reading: BookOpen,
  }
  return iconMap[categoryKey] || PaletteIcon
}

export const MinimalLayout: React.FC = () => {
  const { currentTheme, themeId, isThemeReady } = useTheme()
  const { 
    scheduledActivities, 
    addActivity, 
    removeActivity, 
    clearAllActivities
  } = useScheduleStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [showShareExport, setShowShareExport] = useState(false)
  const [selectedDays] = useState<('saturday' | 'sunday')[]>(['saturday', 'sunday'])

  // ✅ CATEGORIES STATE - UPDATES IMMEDIATELY WHEN THEME CHANGES
  const currentCategories = useMemo(() => {
    if (!themeId || !isThemeReady) return []
    
    try {
      const categories = MockActivityService.getCategoriesForTheme(themeId)
      console.log(`🔄 Building categories for theme: ${themeId}`, categories)

      return categories.map((categoryKey) => {
        const IconComponent = getCategoryIcon(categoryKey)
        const count = MockActivityService.getCategoryCount(themeId, categoryKey)

        return {
          id: categoryKey,
          name: categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `${categoryKey.replace(/_/g, ' ')} activities`,
          icon: IconComponent,
          count: count,
        }
      })
    } catch (error) {
      console.error('❌ Error building categories:', error)
      return []
    }
  }, [themeId, isThemeReady])

  // ✅ THEME DISPLAY NAME
  const themeDisplayName = useMemo(() => {
    const themeMap = {
      adventurous: 'Adventure Ready',
      relaxed: 'Calm & Peaceful', 
      energetic: 'Energetic Vibes',
      romantic: 'Romantic Mood',
      focus: 'Focus Mode',
      creative_flow: 'Creative Flow'
    }
    return themeMap[themeId as keyof typeof themeMap] || 'Weekend Planner'
  }, [themeId])

  // ✅ CLOSE PANEL WHEN THEME CHANGES
  useEffect(() => {
    setActivePanel(null)
  }, [themeId])

  // Event handlers
  const handleAddActivity = useCallback((activity: any, timeSlot: string, day: 'saturday' | 'sunday') => {
    return addActivity(activity, timeSlot, day)
  }, [addActivity])

  const handleRemoveActivity = useCallback((activityId: string) => {
    removeActivity(activityId)
  }, [removeActivity])

  const handleCategoryClick = useCallback((categoryId: string) => {
    console.log(`🎯 Category clicked: ${categoryId}`)
    setActivePanel(activePanel === categoryId ? null : categoryId)
  }, [activePanel])

  const handleClosePanel = useCallback(() => {
    setActivePanel(null)
  }, [])

  const handleClearAll = useCallback(() => {
    clearAllActivities()
  }, [clearAllActivities])

  if (!isThemeReady) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: currentTheme?.colors.background || '#f0f0f0' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4" style={{ 
            borderColor: currentTheme?.colors.primary || '#000', 
            borderTopColor: 'transparent' 
          }}></div>
          <p style={{ color: currentTheme?.colors.textSecondary || '#666' }}>Loading theme...</p>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      {/* ✅ MAIN CONTAINER WITH FORCE RE-RENDER */}
      <div 
        key={`layout-${themeId}-${renderKey}-${themeDisplayName}`}
        className="min-h-screen"
        style={{
          backgroundColor: currentTheme.colors.background,
          color: currentTheme.colors.text,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* ✅ HEADER WITH FORCED COLOR UPDATES */}
        <header 
          ref={headerRef}
          key={`header-${themeId}-${renderKey}`}
          className="border-b px-6 py-4"
          style={{
            background: currentTheme.colors.gradient,
            borderColor: currentTheme.colors.border,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Weekendly</h1>

              <div className="text-sm text-white/80">
                Plan your perfect {themeDisplayName.toLowerCase()} weekend
              </div>

              {/* Live Status */}
              <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-white/80">
                  {currentCategories.reduce((sum, cat) => sum + cat.count, 0)} activities • Live
                </span>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                <input
                  type="text"
                  placeholder={`Search ${themeDisplayName.toLowerCase()} activities...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/60 transition-all duration-300"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSelector />

              <button 
                onClick={() => setShowShareExport(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-white/80 hover:text-white transition-all duration-300 hover:bg-white/10 rounded-lg"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button 
                onClick={handleClearAll}
                className="text-sm text-white/80 hover:text-white transition-colors hover:bg-white/10 px-3 py-1 rounded"
              >
                Clear All
              </button>
            </div>
          </div>
        </header>

        {/* ✅ CATEGORIES NAV WITH FORCED COLOR UPDATES */}
        <nav 
          ref={navRef}
          key={`nav-${themeId}-${renderKey}-${themeDisplayName}`}
          className="border-b px-6 py-4"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border,
            color: currentTheme.colors.text,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex flex-col space-y-3">
              {/* ✅ THEME STATUS WITH PROPER NAME */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span 
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    {themeDisplayName} THEME
                  </span>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    Render: {renderKey} | Theme: {themeId}
                  </span>
                </div>

                <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                  {currentCategories.length} categories • {currentCategories.reduce((sum, cat) => sum + cat.count, 0)} activities
                </div>
              </div>

              {/* ✅ CATEGORIES WITH THEME COLORS */}
              <div 
                key={`categories-${themeId}-${renderKey}`}
                className="flex items-center space-x-4 overflow-x-auto pb-2"
              >
                {currentCategories.map((category) => {
                  const IconComponent = category.icon
                  const isActive = activePanel === category.id

                  return (
                    <button
                      key={`${category.id}-${themeId}-${renderKey}`}
                      onClick={() => handleCategoryClick(category.id)}
                      className="group flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 whitespace-nowrap min-w-fit border"
                      style={{
                        backgroundColor: isActive 
                          ? currentTheme.colors.primary
                          : 'transparent',
                        borderColor: isActive 
                          ? currentTheme.colors.primary
                          : currentTheme.colors.border,
                        color: isActive 
                          ? 'white' 
                          : currentTheme.colors.text,
                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isActive ? `0 4px 12px ${currentTheme.colors.primary}30` : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = `${currentTheme.colors.primary}15`
                          e.currentTarget.style.borderColor = currentTheme.colors.primary
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.borderColor = currentTheme.colors.border
                        }
                      }}
                    >
                      <IconComponent className="w-4 h-4 flex-shrink-0" />

                      <span className="hidden md:inline font-medium">
                        {category.name}
                      </span>

                      <span 
                        className="text-xs px-2 py-1 rounded-full font-bold flex-shrink-0"
                        style={{
                          backgroundColor: category.count > 0 
                            ? (isActive ? 'rgba(255,255,255,0.25)' : `${currentTheme.colors.primary}20`)
                            : currentTheme.colors.border,
                          color: category.count > 0 
                            ? (isActive ? 'white' : currentTheme.colors.primary)
                            : currentTheme.colors.textSecondary,
                        }}
                      >
                        {category.count}
                      </span>
                    </button>
                  )
                })}

                {currentCategories.length === 0 && (
                  <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    🔄 Loading categories for {themeId}...
                  </div>
                )}
              </div>
            </div>

            <div 
              className="text-sm"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              This Weekend - Sep 14-15, 2024 - {scheduledActivities.filter(a => !a.completed).length} activities planned
            </div>
          </div>
        </nav>

        {/* ✅ MAIN CONTENT */}
        <main 
          className="flex-1 flex min-h-0"
          style={{ 
            backgroundColor: currentTheme.colors.background,
            color: currentTheme.colors.text,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <section className="flex-1 p-6 overflow-hidden">
            <LongWeekendBanner />
            <EnhancedWeekendTimeline
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              scheduledActivities={scheduledActivities}
              selectedDays={selectedDays}
            />
          </section>

          <aside 
            className="w-80 border-l p-6 overflow-y-auto"
            style={{ 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
              color: currentTheme.colors.text,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <PlanSummary 
              scheduledActivities={scheduledActivities}
              onRemoveActivity={handleRemoveActivity}
            />
          </aside>
        </main>

        {/* Floating Browser */}
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
              themeId={themeId}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareExport && (
            <ShareExportPanel
              onClose={() => setShowShareExport(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </DndProvider>
  )
}