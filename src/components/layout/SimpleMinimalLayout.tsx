import React, { useState, useMemo, useCallback } from 'react'
import { Search, Share2, ChevronLeft, ChevronRight, Calendar, X } from 'lucide-react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTheme } from '../../hooks/useTheme'
import { useScheduleStore } from '../../store/scheduleStore'
import { useWeekendStore } from '../../store/weekendStore'
import { MockActivityService } from '../../data/mockActivities'
import EnhancedWeekendTimeline from '../features/EnhancedWeekendTimeline'
import FloatingActivityBrowser from '../features/FloatingActivityBrowser'
import ThemeSelector from '../features/ThemeSelector'
import PlanSummary from '../features/PlanSummary'
import LongWeekendWidget from '../features/LongWeekendWidget'
import CompactLongWeekendTimeline from '../features/CompactLongWeekendTimeline'
import { ShareExportPanel } from '../features/ShareExportPanel'
import { SimplePerformanceTest } from '../performance/SimplePerformanceTest'
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

  // Check if a date is part of a long weekend (Friday or Monday adjacent to weekend)
  const isLongWeekendDay = (date: Date) => {
    const { upcomingHolidays } = useWeekendStore.getState()
    const day = date.getDay()
    
    // Temporary: Add mock holiday for testing Friday Sep 13, 2025 → Monday Sep 16, 2025
    const mockHolidays = [
      {
        date: '2025-09-16', // Monday Sep 16
        localName: 'Test Holiday',
        name: 'Test Holiday',
        countryCode: 'IN'
      }
    ]
    
    const allHolidays = upcomingHolidays.length > 0 ? upcomingHolidays : mockHolidays
    
    // Debug logging
    console.log('🔍 Checking long weekend for:', date.toDateString(), 'day:', day, 'holidays:', allHolidays.length)
    
    // Only mark as long weekend if there's actually a holiday that creates one
    if (day === 5) { // Friday
      // Check if there's a holiday on the following Monday that makes this a 4-day weekend
      const monday = new Date(date)
      monday.setDate(monday.getDate() + 3) // Friday + 3 days = Monday
      
      const hasMonHoliday = allHolidays.some(holiday => {
        const holidayDate = new Date(holiday.date)
        const match = holidayDate.toDateString() === monday.toDateString()
        if (match) console.log('✅ Found Monday holiday for Friday:', date.toDateString(), '→', holiday.localName)
        return match
      })
      
      return hasMonHoliday
    }
    
    if (day === 1) { // Monday
      // Check if there's a holiday on this Monday (making Sat-Sun-Mon a 3-day weekend)
      // OR if there was a holiday on the previous Friday (making Fri-Sat-Sun-Mon a 4-day weekend)
      const friday = new Date(date)
      friday.setDate(friday.getDate() - 3) // Monday - 3 days = Friday
      
      const hasHoliday = allHolidays.some(holiday => {
        const holidayDate = new Date(holiday.date)
        const mondayMatch = holidayDate.toDateString() === date.toDateString()
        const fridayMatch = holidayDate.toDateString() === friday.toDateString()
        if (mondayMatch || fridayMatch) {
          console.log('✅ Found holiday for Monday:', date.toDateString(), '→', holiday.localName)
        }
        return mondayMatch || fridayMatch
      })
      
      return hasHoliday
    }
    
    return false
  }

  const isSelectedWeekend = (date: Date) => {
    return (
      date.toDateString() === selectedWeekend.saturday.toDateString() ||
      date.toDateString() === selectedWeekend.sunday.toDateString()
    )
  }
  
  const handleDateClick = useCallback((date: Date) => {
    console.log('📅 Date clicked:', date.toDateString(), 'day:', date.getDay())
    
    // Check if this is a long weekend day
    if (isLongWeekendDay(date)) {
      console.log('🎉 Long weekend day detected!')
      const { upcomingHolidays } = useWeekendStore.getState()
      const day = date.getDay()
      
      let friday: Date, saturday: Date, sunday: Date, monday: Date
      
      if (day === 5) { // Friday
        friday = date
        saturday = new Date(date)
        saturday.setDate(date.getDate() + 1)
        sunday = new Date(date)
        sunday.setDate(date.getDate() + 2)
        monday = new Date(date)
        monday.setDate(date.getDate() + 3)
      } else if (day === 1) { // Monday
        monday = date
        sunday = new Date(date)
        sunday.setDate(date.getDate() - 1)
        saturday = new Date(date)
        saturday.setDate(date.getDate() - 2)
        friday = new Date(date)
        friday.setDate(date.getDate() - 3)
      } else {
        // Handle other weekend days (should not happen with current logic but safety fallback)
        console.log('⚠️ Unexpected day for long weekend:', day)
        return
      }
      
      console.log('🗓️ Setting long weekend dates:', {
        friday: friday.toDateString(),
        saturday: saturday.toDateString(), 
        sunday: sunday.toDateString(),
        monday: monday.toDateString()
      })
      
      // Instead of showing separate popup, integrate with main timeline
      // Set the weekend to include the Friday and Monday data
      setSelectedWeekend({ saturday, sunday })
      
      // Enable long weekend mode - the main timeline will now show 4 days
      setLongWeekendMode(true, ['friday', 'saturday', 'sunday', 'monday'])
      setUpcomingHolidays(upcomingHolidays)
      
      // Store long weekend dates for the main timeline to use
      setLongWeekendDates({ friday, saturday, sunday, monday })
      
      // Persist to localStorage
      try {
        localStorage.setItem('weekendly-selected-weekend', JSON.stringify({
          saturday: saturday.toISOString(),
          sunday: sunday.toISOString()
        }))
        localStorage.setItem('weekendly-long-weekend-dates', JSON.stringify({
          friday: friday.toISOString(),
          saturday: saturday.toISOString(),
          sunday: sunday.toISOString(),
          monday: monday.toISOString()
        }))
        console.log('🗓️ Saved long weekend to localStorage')
      } catch (e) {
        console.error('Failed to save to localStorage:', e)
      }
      
      console.log('🎉 Long weekend mode enabled! Main timeline will show 4 days')
      return
    }
    
    if (isWeekend(date)) {
      // Regular weekend mode - disable long weekend mode
      setLongWeekendMode(false)
      setLongWeekendDates(null)
      
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
        localStorage.removeItem('weekendly-long-weekend-dates') // Clear long weekend data
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
  }, [setSelectedWeekend])
  
  const { 
    getCurrentWeekendActivities,
    setCurrentWeekend,
    addActivity: addRegularActivity, 
    removeActivity, 
    moveActivity,
    clearAllActivities 
  } = useScheduleStore()

  const {
    setLongWeekendMode,
    setUpcomingHolidays,
    isLongWeekendMode
  } = useWeekendStore()

  // Memoize scheduled activities to prevent unnecessary re-renders
  const scheduledActivities = useMemo(() => getCurrentWeekendActivities(), [getCurrentWeekendActivities])

  // Extended addActivity that handles both regular weekends and long weekends
  const addActivity = useCallback((activity: any, timeSlot: string, day: 'saturday' | 'sunday' | 'friday' | 'monday') => {
    // For regular weekend days, use the regular store
    if (day === 'saturday' || day === 'sunday') {
      return addRegularActivity(activity, timeSlot, day)
    }
    
    // For Friday/Monday (long weekend days), we'll handle them differently
    // For now, just return true to avoid errors - you can implement long weekend storage later
    console.log('Long weekend activity added:', { activity, timeSlot, day })
    return true
  }, [addRegularActivity])

  // Long weekend click handler
  const [showLongWeekendTimeline, setShowLongWeekendTimeline] = useState(false)
  const [longWeekendDates, setLongWeekendDates] = useState<{friday: Date, saturday: Date, sunday: Date, monday: Date} | null>(null)
  const [currentHolidays, setCurrentHolidays] = useState<Array<{date: string; localName: string; name: string; countryCode: string}>>([])
  
  // Performance testing (debug mode)
  const [showPerformanceTest, setShowPerformanceTest] = useState(false)

  // Reset long weekend mode on component mount to ensure clean state
  React.useEffect(() => {
    // Only reset if not already in the middle of long weekend planning
    if (isLongWeekendMode && !showLongWeekendTimeline) {
      console.log('🔄 Resetting long weekend mode on component mount')
      setLongWeekendMode(false)
    }
  }, [isLongWeekendMode, showLongWeekendTimeline, setLongWeekendMode]) // Dependencies for proper effect management

  const handleLongWeekendClick = useCallback((holidays: Array<{date: string; localName: string; name: string; countryCode: string}>) => {
    console.log('🎉 Long weekend clicked!', holidays)
    
    // Enable long weekend mode
    setLongWeekendMode(true, ['friday', 'saturday', 'sunday', 'monday'])
    setUpcomingHolidays(holidays)
    setCurrentHolidays(holidays)
    
    // Show the compact timeline modal
    setShowLongWeekendTimeline(true)
  }, [setLongWeekendMode, setUpcomingHolidays])

  const handleCloseLongWeekendTimeline = useCallback(() => {
    setShowLongWeekendTimeline(false)
  }, [])

  const handleCloseFullLongWeekendTimeline = useCallback(() => {
    setLongWeekendMode(false)
    setLongWeekendDates(null)
  }, [setLongWeekendMode])
  
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showShareExport, setShowShareExport] = useState(false)

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
              <h1 
                className="text-2xl font-bold text-white cursor-pointer transition-all duration-300 hover:text-white/80"
                onDoubleClick={() => setShowPerformanceTest(true)}
                title="Double-click to open performance test dashboard"
              >
                Weekendly
              </h1>
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
                onClick={clearAllActivities}
                className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </header>

        {/* Long Weekend Mode Indicator */}
        {isLongWeekendMode && longWeekendDates && (
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Long Weekend Planning Mode</h3>
                  <p className="text-sm text-white/80">
                    {formatDate(longWeekendDates.friday)} - {formatDate(longWeekendDates.monday)} 
                    (4 days of fun!)
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseFullLongWeekendTimeline}
                className="flex items-center space-x-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
              >
                <span>Exit Long Weekend Mode</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

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
            
            {/* Long Weekend Widget in the gap */}
            <div className="flex items-center ml-4 pl-4 border-l" style={{ borderColor: currentTheme.colors.border }}>
              <LongWeekendWidget 
                theme={currentTheme}
                onLongWeekendClick={handleLongWeekendClick}
              />
            </div>
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
                    const isLongWeekend = isLongWeekendDay(date)
                    
                    return (
                      <button
                        key={index}
                        onClick={() => handleDateClick(date)}
                        className={`relative text-center p-1 text-xs rounded transition-colors ${
                          isWeekendDay ? 'cursor-pointer hover:bg-gray-100' : 'cursor-default'
                        } ${isToday ? 'ring-1 ring-blue-400' : ''} ${isLongWeekend && isCurrentMonth ? 'mb-6' : ''}`}
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
                        disabled={!isWeekendDay && !isLongWeekend}
                      >
                        {date.getDate()}
                        
                        {/* Long Weekend Indicator - Clear Box with Text */}
                        {isLongWeekend && isCurrentMonth && (
                          <div className="absolute -bottom-5 left-0 right-0 mx-auto">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] px-1 py-0.5 rounded text-center font-medium whitespace-nowrap shadow-sm">
                              Long Weekend
                            </div>
                          </div>
                        )}
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
                scheduledActivities={scheduledActivities}
                onRemoveActivity={removeActivity}
                onMoveActivity={moveActivity}
              />
            </div>
          </nav>

          {/* MAIN TIMELINE */}
          <div className="flex-1">
            <EnhancedWeekendTimeline
              scheduledActivities={scheduledActivities as any}
              onAddActivity={addActivity}
              onRemoveActivity={removeActivity}
              onMoveActivity={moveActivity}
              selectedDays={isLongWeekendMode ? ['friday', 'saturday', 'sunday', 'monday'] : ['saturday', 'sunday']}
              selectedWeekend={selectedWeekend}
              longWeekendDates={longWeekendDates}
            />
          </div>
        </div>

        {/* FLOATING PANELS */}
        {activePanel && (
          <FloatingActivityBrowser
            category={activePanel}
            onClose={() => setActivePanel(null)}
            onAddActivity={addActivity}
            onMoveActivity={moveActivity}
            searchQuery={searchQuery}
            themeId={themeId} // ✅ Pass current theme
            selectedWeekend={selectedWeekend} // ✅ Pass selected weekend dates
            scheduledActivities={scheduledActivities}
            onRemoveActivity={removeActivity}
            key={activePanel} // ✅ Only remount when category changes, not theme
          />
        )}

        {/* Compact Long Weekend Timeline Modal */}
        <CompactLongWeekendTimeline
          isVisible={showLongWeekendTimeline}
          onClose={handleCloseLongWeekendTimeline}
          holidays={currentHolidays}
        />

        {/* Performance Test Dashboard Modal */}
        {showPerformanceTest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full h-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b flex-shrink-0">
                <h2 className="text-xl font-bold">Performance Test Dashboard</h2>
                <button
                  onClick={() => setShowPerformanceTest(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto">
                <SimplePerformanceTest />
              </div>
            </div>
          </div>
        )}

        {/* Remove separate Long Weekend Timeline Modal - now integrated into main timeline */}

        {/* Share Export Panel */}
        {showShareExport && (
          <ShareExportPanel
            onClose={() => setShowShareExport(false)}
          />
        )}
      </div>
    </DndProvider>
  )
}

export default React.memo(SimpleMinimalLayout)