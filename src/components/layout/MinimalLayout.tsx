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
import LongWeekendBanner from '../features/LongWeekendBanner'
import { ShareExportPanel } from '../features/ShareExportPanel'
import { useTheme } from '../../hooks/useTheme'
import { useScheduleStore } from '../../store/scheduleStore'
import { MockActivityService } from '../../data/mockActivities'

// Category Icons
import { 
  Mountain, Users, Gamepad2, UtensilsCrossed, Palette as PaletteIcon,
  TreePine, Dumbbell, Car, BookOpen, Film, Sparkles, Target,
  Music, Camera, Brain, Home, Brush, Pen, Activity,
  Monitor, Mic
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
  
  // ✅ DEBUG: Log theme changes in component
  console.log(`🔍 MinimalLayout render - Theme: ${currentTheme?.name}, ID: ${themeId}, Colors:`, currentTheme?.colors)
  
  const { 
    getCurrentWeekendActivities,
    addActivity, 
    removeActivity, 
    clearAllActivities
  } = useScheduleStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [showShareExport, setShowShareExport] = useState(false)
  const [selectedDays] = useState<('saturday' | 'sunday')[]>(['saturday', 'sunday'])
  
  // ✅ DEFAULT SELECTED WEEKEND - CURRENT WEEKEND OR NEXT WEEKEND
  const getDefaultWeekend = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 6 = Saturday
    
    let saturday: Date
    let sunday: Date
    
    if (currentDay === 0) { // Sunday
      saturday = new Date(today)
      saturday.setDate(today.getDate() - 1) // Yesterday (Saturday)
      sunday = new Date(today) // Today (Sunday)
    } else if (currentDay === 6) { // Saturday
      saturday = new Date(today) // Today (Saturday)  
      sunday = new Date(today)
      sunday.setDate(today.getDate() + 1) // Tomorrow (Sunday)
    } else { // Monday-Friday: get next weekend
      const daysUntilSaturday = 6 - currentDay
      saturday = new Date(today)
      saturday.setDate(today.getDate() + daysUntilSaturday)
      sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)
    }
    
    return { saturday, sunday }
  }
  
  const selectedWeekend = getDefaultWeekend()
  
  // ✅ FORCE COMPONENT UPDATE WHEN THEME CHANGES
  const [forceUpdate, setForceUpdate] = useState(0)
  const [lastThemeId, setLastThemeId] = useState(themeId)

  // ✅ SIMPLE THEME CHANGE EFFECT - NO EXCESSIVE UPDATES
  useEffect(() => {
    if (themeId !== lastThemeId) {
      console.log(`🎨 Theme changed to: ${themeId}`, { 
        lastThemeId, 
        currentTheme: currentTheme?.name
      })
      setActivePanel(null)
      setLastThemeId(themeId)
      setForceUpdate(prev => prev + 1) // Force component re-render
    }
  }, [themeId, lastThemeId, currentTheme])  // ✅ CATEGORIES STATE - UPDATES IMMEDIATELY WHEN THEME CHANGES
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
  }, [themeId, isThemeReady, forceUpdate]) // ✅ Added forceUpdate as dependency

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
  }, [themeId, forceUpdate]) // ✅ Added forceUpdate as dependency

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

  if (!isThemeReady || !currentTheme) {
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
      <div 
        key={`layout-${themeId}-${forceUpdate}`}
        className="min-h-screen"
        style={{
          backgroundColor: `${currentTheme.colors.background} !important`,
          color: `${currentTheme.colors.text} !important`,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        {/* HEADER */}
        <header 
          className="border-b px-6 py-4"
          style={{
            background: currentTheme.colors.gradient,
            borderColor: currentTheme.colors.border,
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Weekendly</h1>
              <div className="text-sm text-white/80">
                Plan your perfect {themeDisplayName.toLowerCase()} weekend
              </div>
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
                  className="w-full pl-10 pr-4 py-2 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/20 text-white placeholder-white/60"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSelector />
              <button
                onClick={() => setShowShareExport(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div 
          className="flex"
          style={{ backgroundColor: `${currentTheme.colors.background} !important` }}
        >
          {/* SIDEBAR */}
          <nav 
            className="w-80 border-r p-6 h-screen overflow-y-auto"
            style={{
              backgroundColor: `${currentTheme.colors.surface} !important`,
              borderColor: `${currentTheme.colors.border} !important`,
            }}
          >
            <div className="space-y-6">
              {/* THEME INFO */}
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
                  {themeDisplayName.toUpperCase()} THEME
                </div>
                <div className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  {currentCategories.length} categories • {currentCategories.reduce((sum, cat) => sum + cat.count, 0)} activities
                </div>
              </div>

              <LongWeekendBanner />

              {/* CATEGORIES */}
              <div key={`categories-${themeId}-${forceUpdate}`}>
                <h2 className="text-lg font-semibold mb-4" style={{ color: currentTheme.colors.text }}>
                  Activity Categories ({currentCategories.length})
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {currentCategories.map((category) => (
                    <button
                      key={`${category.id}-${themeId}`}
                      onClick={() => handleCategoryClick(category.id)}
                      className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105"
                      style={{
                        borderColor: activePanel === category.id ? currentTheme.colors.accent : currentTheme.colors.border,
                        backgroundColor: activePanel === category.id ? `${currentTheme.colors.accent}20` : currentTheme.colors.background,
                        color: currentTheme.colors.text
                      }}
                    >
                      <category.icon className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                          {category.count} activities
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* WEEKEND SUMMARY */}
              <PlanSummary
                scheduledActivities={getCurrentWeekendActivities()}
                onRemoveActivity={handleRemoveActivity}
              />
            </div>
          </nav>

          {/* MAIN TIMELINE */}
          <div className="flex-1">
            <EnhancedWeekendTimeline
              scheduledActivities={getCurrentWeekendActivities() as any}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              selectedDays={selectedDays}
            />
          </div>
        </div>

        {/* FLOATING ACTIVITY BROWSER */}
        <AnimatePresence>
          {activePanel && (
            <FloatingActivityBrowser
              category={activePanel}
              onClose={handleClosePanel}
              searchQuery={searchQuery}
              onAddActivity={handleAddActivity}
              onRemoveActivity={handleRemoveActivity}
              scheduledActivities={getCurrentWeekendActivities()}
              themeId={themeId}
              selectedWeekend={selectedWeekend}
            />
          )}
        </AnimatePresence>

        {/* SHARE EXPORT PANEL */}
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