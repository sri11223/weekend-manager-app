import React, { useState, useMemo } from 'react'
import { Search, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTheme } from '../../hooks/useTheme'
import { useScheduleStore } from '../../store/scheduleStore'
import { MockActivityService } from '../../data/mockActivities'
import EnhancedWeekendTimeline from '../features/EnhancedWeekendTimeline'
import FloatingActivityBrowser from '../features/FloatingActivityBrowser'
import ThemeSelector from '../features/ThemeSelector'
import PlanSummary from '../features/PlanSummary'
import {
  Activity,
  Mountain,
  Heart,
  Zap,
  Sparkles,
  Brain,
} from 'lucide-react'

const CATEGORY_ICONS = {
  outdoor: Activity,
  sports: Activity, 
  travel: Mountain,
  games: Activity,
  food: Activity,
  social: Activity,
  wellness: Heart,
  nature: Activity,
  books: Activity,
  movies: Activity,
  art: Activity,
  music: Activity,
  dance: Zap,
  creative: Sparkles,
  focus: Brain,
}

export const SimpleMinimalLayout: React.FC = () => {
  const { currentTheme, themeId, isThemeReady } = useTheme()

  // ✅ DYNAMIC CALENDAR STATE
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedWeekend, setSelectedWeekend] = useState<{ saturday: Date, sunday: Date }>(() => {
    // ✅ TRY TO RESTORE FROM LOCALSTORAGE FIRST
    try {
      const saved = localStorage.getItem('weekendly-selected-weekend')
      if (saved) {
        const parsed = JSON.parse(saved)
        const saturday = new Date(parsed.saturday)
        const sunday = new Date(parsed.sunday)
        
        // Validate the dates are valid and not too old (within 2 months)
        const now = new Date()
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())
        if (saturday >= twoMonthsAgo && sunday >= twoMonthsAgo) {
          console.log('🗓️ Restored weekend from localStorage:', {
            saturday: saturday.toDateString(),
            sunday: sunday.toDateString()
          })
          return { saturday, sunday }
        }
      }
    } catch (error) {
      console.warn('Failed to restore weekend from localStorage:', error)
    }
    
    // ✅ IMPROVED WEEKEND CALCULATION - Always get current weekend or previous if it's Monday-Friday
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
    
    let saturday: Date
    let sunday: Date
    
    if (dayOfWeek === 0) {
      // It's Sunday - current weekend is yesterday (Sat) and today (Sun)
      saturday = new Date(today)
      saturday.setDate(today.getDate() - 1)
      sunday = new Date(today)
    } else if (dayOfWeek === 6) {
      // It's Saturday - current weekend is today (Sat) and tomorrow (Sun)  
      saturday = new Date(today)
      sunday = new Date(today)
      sunday.setDate(today.getDate() + 1)
    } else {
      // It's Monday-Friday - get the most recent weekend (last Sat-Sun)
      const daysSinceSaturday = dayOfWeek === 0 ? 1 : dayOfWeek + 1 // Days since last Saturday
      saturday = new Date(today)
      saturday.setDate(today.getDate() - daysSinceSaturday)
      sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)
    }
    
    console.log('🗓️ Initial weekend calculation:', {
      today: today.toDateString(),
      dayOfWeek,
      saturday: saturday.toDateString(),
      sunday: sunday.toDateString()
    })
    
    return { saturday, sunday }
  })
  
  // ✅ Calendar utilities
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday
    
    const days = []
    const current = new Date(startDate)
    
    // Generate 35 days (5 weeks)
    for (let i = 0; i < 35; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }
  
  const isWeekend = (date: Date) => {
    const day = date.getDay()
    return day === 0 || day === 6 // Sunday or Saturday
  }
  
  const isSelectedWeekend = (date: Date) => {
    return (
      date.toDateString() === selectedWeekend.saturday.toDateString() ||
      date.toDateString() === selectedWeekend.sunday.toDateString()
    )
  }
  
  const handleDateClick = (date: Date) => {
    if (isWeekend(date)) {
      // Find the weekend pair for clicked date
      let saturday, sunday
      if (date.getDay() === 6) { // Clicked Saturday
        saturday = date
        sunday = new Date(date)
        sunday.setDate(date.getDate() + 1)
      } else { // Clicked Sunday
        sunday = date
        saturday = new Date(date)
        saturday.setDate(date.getDate() - 1)
      }
      
      const newWeekend = { saturday, sunday }
      setSelectedWeekend(newWeekend)
      
      // ✅ PERSIST TO LOCALSTORAGE
      try {
        localStorage.setItem('weekendly-selected-weekend', JSON.stringify({
          saturday: saturday.toISOString(),
          sunday: sunday.toISOString()
        }))
        console.log('🗓️ Saved weekend to localStorage:', {
          saturday: saturday.toDateString(),
          sunday: sunday.toDateString()
        })
      } catch (error) {
        console.warn('Failed to save weekend to localStorage:', error)
      }
      
      // Update store with new weekend
      setCurrentWeekend(saturday, sunday)
    }
  }
  const { 
    getCurrentWeekendActivities,
    setCurrentWeekend,
    addActivity, 
    removeActivity, 
    clearAllActivities 
  } = useScheduleStore()
  
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  // Sync selected weekend with store on component mount and when selectedWeekend changes
  React.useEffect(() => {
    setCurrentWeekend(selectedWeekend.saturday, selectedWeekend.sunday)
    
    // ✅ ALSO PERSIST TO LOCALSTORAGE ON MOUNT (for initial weekend)
    try {
      localStorage.setItem('weekendly-selected-weekend', JSON.stringify({
        saturday: selectedWeekend.saturday.toISOString(),
        sunday: selectedWeekend.sunday.toISOString()
      }))
    } catch (error) {
      console.warn('Failed to save initial weekend to localStorage:', error)
    }
  }, [selectedWeekend, setCurrentWeekend])

  // ✅ Force component to update when localStorage theme changes
  React.useEffect(() => {
    const checkThemeChange = () => {
      const storageTheme = localStorage.getItem('weekendly-theme')
      if (storageTheme !== themeId) {
        console.log('🚨 THEME MISMATCH! Storage:', storageTheme, 'Hook:', themeId)
        // Instead of page reload, let's try to force re-mount this component
                window.location.reload()
      }
    }
    
    const interval = setInterval(checkThemeChange, 500)
    return () => clearInterval(interval)
  }, [themeId])

  // ✅ DEBUG: Log when component renders (reduced logging)
  console.log('🔥 SimpleMinimalLayout:', currentTheme?.name || 'undefined', 'ID:', themeId)

  // ✅ FORCE RE-RENDER on theme change
  const [renderKey, setRenderKey] = useState(0)
  
  // ✅ Simple theme change detection without excessive polling
  React.useEffect(() => {
    console.log('� SIMPLE render for theme:', themeId, currentTheme?.name)
    setRenderKey(prev => prev + 1)
    
    // ✅ FORCE DOM update by directly manipulating styles (ONCE per theme change)
    if (currentTheme?.colors) {
      document.documentElement.style.setProperty('--theme-background', currentTheme.colors.background)
      document.documentElement.style.setProperty('--theme-surface', currentTheme.colors.surface)
      document.documentElement.style.setProperty('--theme-primary', currentTheme.colors.primary)
      document.documentElement.style.setProperty('--theme-text', currentTheme.colors.text)
      
      // ✅ FORCE body background directly
      document.body.style.backgroundColor = currentTheme.colors.background
      document.body.style.background = currentTheme.colors.background
      
      console.log('✅ Applied theme:', themeId, 'Background:', currentTheme.colors.background)
    }
  }, [themeId]) // ✅ ONLY depend on themeId, not currentTheme to avoid loops

  // Get theme name
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

  // Get categories for current theme
  const currentCategories = useMemo(() => {
    if (!themeId || !isThemeReady) return []
    
    const categories = MockActivityService.getCategoriesForTheme(themeId)
    return categories.map(categoryKey => {
      const IconComponent = CATEGORY_ICONS[categoryKey as keyof typeof CATEGORY_ICONS] || Activity
      const count = MockActivityService.getCategoryCount(themeId, categoryKey)
      
      return {
        id: categoryKey,
        name: categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        icon: IconComponent,
        count: count,
      }
    })
  }, [themeId, isThemeReady])

  if (!isThemeReady || !currentTheme) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Dynamic styles object
  const dynamicStyles = {
    container: {
      backgroundColor: `var(--theme-background, ${currentTheme.colors.background})`,
      color: `var(--theme-text, ${currentTheme.colors.text})`,
      minHeight: '100vh',
      transition: 'all 0.3s ease-in-out'
    },
    header: {
      background: currentTheme.colors.gradient,
      borderColor: currentTheme.colors.border,
    },
    sidebar: {
      backgroundColor: `var(--theme-surface, ${currentTheme.colors.surface})`,
      borderColor: currentTheme.colors.border,
    },
    categoryButton: (isActive: boolean) => ({
      borderColor: isActive ? currentTheme.colors.accent : currentTheme.colors.border,
      backgroundColor: isActive ? `${currentTheme.colors.accent}20` : currentTheme.colors.background,
      color: currentTheme.colors.text
    })
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        key={`simple-layout-${themeId}-${renderKey}`}
        style={dynamicStyles.container}
      >
        {/* HEADER */}
        <header 
          className="border-b px-6 py-4"
          style={dynamicStyles.header}
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
                onClick={() => console.log('Share clicked')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button
                onClick={clearAllActivities}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </header>

        {/* CATEGORIES BAR - Under Navbar */}
        <div 
          className="border-b px-6 py-4 overflow-x-auto"
          style={{ 
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border 
          }}
        >
          <div className="flex gap-3 min-w-max">
            {currentCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActivePanel(activePanel === category.id ? null : category.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 hover:scale-105 whitespace-nowrap"
                  style={dynamicStyles.categoryButton(activePanel === category.id)}
                >
                  <IconComponent className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
                  <span className="font-medium">{category.name}</span>
                  <span 
                    className="text-xs px-2 py-1 rounded-full" 
                    style={{ 
                      backgroundColor: `${currentTheme.colors.primary}20`,
                      color: currentTheme.colors.primary 
                    }}
                  >
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex" style={{ backgroundColor: currentTheme.colors.background }}>
          {/* SIDEBAR - Only Theme Info and Budget */}
          <nav 
            className="w-80 border-r h-screen flex flex-col"
            style={dynamicStyles.sidebar}
          >
            {/* TOP SECTION - THEME INFO (FIXED) */}
            <div className="p-6 border-b" style={{ borderColor: currentTheme.colors.border }}>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: currentTheme.colors.text }}>
                  {themeDisplayName.toUpperCase()} THEME
                </div>
                <div className="text-sm mt-1" style={{ color: currentTheme.colors.textSecondary }}>
                  {currentCategories.length} categories • {currentCategories.reduce((sum, cat) => sum + cat.count, 0)} activities
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION - DYNAMIC CALENDAR */}
            <div className="flex-1 p-6">
              <div className="text-center mb-4">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => {
                      const prev = new Date(selectedDate)
                      prev.setMonth(prev.getMonth() - 1)
                      setSelectedDate(prev)
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronLeft size={16} style={{ color: currentTheme.colors.text }} />
                  </button>
                  
                  <h3 className="text-lg font-semibold" style={{ color: currentTheme.colors.text }}>
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  
                  <button
                    onClick={() => {
                      const next = new Date(selectedDate)
                      next.setMonth(next.getMonth() + 1)
                      setSelectedDate(next)
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <ChevronRight size={16} style={{ color: currentTheme.colors.text }} />
                  </button>
                </div>
                
                <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                  Selected: {formatDate(selectedWeekend.saturday)} - {formatDate(selectedWeekend.sunday)}
                </p>
              </div>
              
              {/* Dynamic Calendar */}
              <div 
                className="p-4 rounded-xl border"
                style={{ 
                  backgroundColor: currentTheme.colors.background,
                  borderColor: currentTheme.colors.border 
                }}
              >
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div 
                      key={day} 
                      className="text-center text-xs font-medium p-1"
                      style={{ color: currentTheme.colors.textSecondary }}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Dynamic Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {generateCalendarDays().map((date, index) => {
                    const isCurrentMonth = date.getMonth() === selectedDate.getMonth()
                    const isWeekendDay = isWeekend(date)
                    const isSelected = isSelectedWeekend(date)
                    const isToday = date.toDateString() === new Date().toDateString()
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`text-center p-1 text-xs rounded transition-colors ${
                          isWeekendDay ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'
                        } ${isToday ? 'ring-1 ring-blue-400' : ''}`}
                        style={{ 
                          color: isCurrentMonth 
                            ? (isSelected ? 'white' : currentTheme.colors.text)
                            : currentTheme.colors.textSecondary,
                          backgroundColor: isSelected 
                            ? (date.getDay() === 6 ? currentTheme.colors.primary : currentTheme.colors.secondary)
                            : isToday
                            ? currentTheme.colors.surface
                            : 'transparent',
                          fontWeight: isSelected || isToday ? 'bold' : 'normal'
                        }}
                        disabled={!isWeekendDay}
                      >
                        {date.getDate()}
                      </button>
                    )
                  })}
                </div>
                
                {/* Weekend Selection Info */}
                <div className="mt-4 text-center">
                  <p className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                    Click on weekend dates to change your plan
                  </p>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION - WEEKEND SUMMARY/BUDGET (FIXED) */}
            <div className="p-6 border-t" style={{ borderColor: currentTheme.colors.border }}>
              <PlanSummary
                scheduledActivities={getCurrentWeekendActivities()}
                onRemoveActivity={removeActivity}
              />
            </div>
          </nav>

          {/* MAIN TIMELINE */}
          <div className="flex-1">
            <EnhancedWeekendTimeline
              scheduledActivities={getCurrentWeekendActivities() as any}
              onAddActivity={addActivity}
              onRemoveActivity={removeActivity}
              selectedDays={['saturday', 'sunday']}
              selectedWeekend={selectedWeekend}
            />
          </div>
        </div>

        {/* FLOATING PANELS */}
        {activePanel && (
          <FloatingActivityBrowser
            category={activePanel}
            onClose={() => setActivePanel(null)}
            onAddActivity={addActivity}
            searchQuery={searchQuery}
            themeId={themeId} // ✅ Pass current theme
            selectedWeekend={selectedWeekend} // ✅ Pass selected weekend dates
            scheduledActivities={getCurrentWeekendActivities()}
            onRemoveActivity={removeActivity}
            key={`${activePanel}-${themeId}`} // ✅ Force re-render when theme changes
          />
        )}
      </div>
    </DndProvider>
  )
}

export default SimpleMinimalLayout