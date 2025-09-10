import React, { useState } from 'react'
import { Search, Calendar, Share2, Plus, Film, Utensils, Gamepad2, MapPin, Users, DollarSign } from 'lucide-react'
import { AnimatePresence } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import EnhancedWeekendTimeline from '../features/EnhancedWeekendTimeline'
// import { WeekendSummary } from '../features/WeekendSummary'
import FloatingActivityBrowser from '../features/FloatingActivityBrowser'
import ThemeSelector from '../features/ThemeSelector'
import LongWeekendPlanner from '../features/LongWeekendPlanner'
import PlanSummary from '../features/PlanSummary'
import { useTheme } from '../../hooks/useTheme'
// import CommunityPanel from '../features/CommunityPanel'
// import BudgetTracker from '../features/BudgetTracker'
// import SocialPlanning from '../features/SocialPlanning'

interface CategoryButton {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  count?: number
}

const CATEGORIES: CategoryButton[] = [
  { id: 'movies', name: 'Movies', icon: <Film className="w-4 h-4" />, color: 'bg-purple-500', count: 25 },
  { id: 'food', name: 'Food', icon: <Utensils className="w-4 h-4" />, color: 'bg-orange-500', count: 18 },
  { id: 'games', name: 'Games', icon: <Gamepad2 className="w-4 h-4" />, color: 'bg-blue-500', count: 15 },
  { id: 'outdoor', name: 'Outdoor', icon: <MapPin className="w-4 h-4" />, color: 'bg-green-500', count: 12 },
  { id: 'social', name: 'Social', icon: <Users className="w-4 h-4" />, color: 'bg-pink-500', count: 8 },
]

export const MinimalLayout: React.FC = () => {
  const { currentTheme, themeId, forceRender } = useTheme()
  // console.log('🏠 MinimalLayout render with theme:', currentTheme.name, 'ID:', themeId, 'Render:', forceRender)
  const [searchQuery, setSearchQuery] = useState('')
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [showCommunity, setShowCommunity] = useState(false)
  const [showBudget, setShowBudget] = useState(false)
  const [showSocial, setShowSocial] = useState(false)
  const [showLongWeekend, setShowLongWeekend] = useState(false)
  const [scheduledActivities, setScheduledActivities] = useState<any[]>([])
  const [selectedDays, setSelectedDays] = useState<('saturday' | 'sunday' | 'friday' | 'monday')[]>(['saturday', 'sunday'])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday')

  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'quick-add') {
      setActivePanel('all') // Show all activities for quick add
    } else {
      setActivePanel(activePanel === categoryId ? null : categoryId)
    }
  }

  const handleClosePanel = () => {
    setActivePanel(null)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div key={`${themeId}-${forceRender}`} className="min-h-screen" style={{ backgroundColor: `var(--color-background, ${currentTheme.colors.background})` }}>
      {/* Clean Header Bar */}
      <div 
        className="border-b px-6 py-4"
        style={{ 
          background: `var(--color-primary, ${currentTheme.colors.primary})`,
          borderColor: `var(--color-border, ${currentTheme.colors.border})`
        }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">Weekendly</h1>
            <div className="text-sm text-white/80">
              Plan your perfect weekend
            </div>
          </div>

          {/* Search Bar */}
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

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowLongWeekend(true)}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity text-white"
            >
              <Calendar className="w-5 h-5" />
              <span className="hidden md:inline">Long Weekend</span>
            </button>
            <button 
              onClick={() => setShowCommunity(true)}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity text-white"
            >
              <Users className="w-5 h-5" />
              <span className="hidden md:inline">Community</span>
            </button>
            <button 
              onClick={() => setShowBudget(true)}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity text-white"
            >
              <DollarSign className="w-5 h-5" />
              <span className="hidden md:inline">Budget</span>
            </button>
            <button 
              onClick={() => setShowSocial(true)}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity text-white"
            >
              <Share2 className="w-5 h-5" />
              <span className="hidden md:inline">Collaborate</span>
            </button>
            <ThemeSelector />
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="border-b px-6 py-4" style={{ backgroundColor: `var(--color-surface, ${currentTheme.colors.surface})`, borderColor: `var(--color-border, ${currentTheme.colors.border})` }}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => handleCategoryClick('quick-add')}
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg transition-all hover:scale-105"
              style={{ backgroundColor: `var(--color-primary, ${currentTheme.colors.primary})` }}
            >
              <Plus className="w-5 h-5" />
              <span>Add Activity</span>
            </button>
            
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:scale-105
                  ${activePanel === category.id 
                    ? 'border-2' 
                    : 'hover:opacity-80'
                  }
                `}
                style={{
                  backgroundColor: activePanel === category.id ? `var(--color-primary, ${currentTheme.colors.primary})20` : 'transparent',
                  borderColor: activePanel === category.id ? `var(--color-primary, ${currentTheme.colors.primary})` : 'transparent',
                  color: activePanel === category.id ? `var(--color-primary, ${currentTheme.colors.primary})` : `var(--color-text, ${currentTheme.colors.text})`
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
            This Weekend • Sep 14-15, 2024
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-1 flex min-h-0"
        style={{ 
          backgroundColor: `var(--color-background, ${currentTheme.colors.background})`,
          color: `var(--color-text, ${currentTheme.colors.text})`
        }}
      >
        {/* Timeline Container */}
        <div className="flex-1 p-6 overflow-hidden">
          <EnhancedWeekendTimeline
            scheduledActivities={scheduledActivities}
            onAddActivity={(activity, timeSlot, day) => {
              const newActivity = { 
                ...activity, 
                timeSlot, 
                day, 
                id: `${activity.id}-${Date.now()}` 
              }
              setScheduledActivities([...scheduledActivities, newActivity])
            }}
            onRemoveActivity={(activityId) => {
              setScheduledActivities(scheduledActivities.filter(a => a.id !== activityId))
            }}
            selectedDays={selectedDays}
          />
        </div>

        {/* Right Sidebar - Plan Summary */}
        <div 
          className="w-80 border-l p-6 overflow-y-auto"
          style={{ 
            backgroundColor: `var(--color-surface, ${currentTheme.colors.surface})`,
            borderColor: `var(--color-border, ${currentTheme.colors.border})`
          }}
        >
          <PlanSummary scheduledActivities={scheduledActivities} />
        </div>
      </div>

      {/* Floating Activity Browser */}
      <AnimatePresence>
        {activePanel && activePanel !== 'quick-add' && (
          <FloatingActivityBrowser
            category={activePanel}
            onClose={handleClosePanel}
            searchQuery={searchQuery}
          />
        )}
      </AnimatePresence>

      {/* Community Panel - Temporarily disabled */}
      {showCommunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Community Features</h2>
            <p className="text-gray-600 mb-4">Coming soon! Share and discover weekend plans from other users.</p>
            <button 
              onClick={() => setShowCommunity(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Budget Tracker - Temporarily disabled */}
      {showBudget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Budget Tracker</h2>
            <p className="text-gray-600 mb-4">Coming soon! Track your weekend spending and stay on budget.</p>
            <button 
              onClick={() => setShowBudget(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Social Planning - Temporarily disabled */}
      {showSocial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Social Planning</h2>
            <p className="text-gray-600 mb-4">Coming soon! Plan your weekend together with friends and family.</p>
            <button 
              onClick={() => setShowSocial(false)}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Long Weekend Planner */}
      {showLongWeekend && (
        <LongWeekendPlanner onClose={() => setShowLongWeekend(false)} />
      )}
      </div>
    </DndProvider>
  )
}
