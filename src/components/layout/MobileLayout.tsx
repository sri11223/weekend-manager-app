import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Calendar, Clock, Star, Grid3X3 } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useIsMobile, useIsSmallScreen } from '../../hooks/useMediaQuery'
import { useScheduleStore } from '../../store/scheduleStore'
import { Activity } from '../../types/index'
import { Activity as MockActivity } from '../../data/mockActivities'
import ThemeSelector from '../features/ThemeSelector'
import DaySelector from '../features/DaySelector'
import PlanSummary from '../features/PlanSummary'
import EnhancedWeekendTimeline from '../features/EnhancedWeekendTimeline'
import CategoryBrowser from '../features/CategoryBrowser'

export const MobileLayout: React.FC = () => {
  const { currentTheme } = useTheme()
  const isMobile = useIsMobile()
  const isSmallScreen = useIsSmallScreen()
  const { 
    addActivity, 
    removeActivity, 
    moveActivity,
    getCurrentWeekendActivities,
    setCurrentWeekend 
  } = useScheduleStore()
  
  const [selectedWeekend, setSelectedWeekend] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    let saturday: Date, sunday: Date
    
    if (dayOfWeek === 0) { // Sunday
      saturday = new Date(today)
      saturday.setDate(today.getDate() - 1)
      sunday = new Date(today)
    } else if (dayOfWeek === 6) { // Saturday
      saturday = new Date(today)
      sunday = new Date(today)
      sunday.setDate(today.getDate() + 1)
    } else { // Weekday - get next weekend
      const daysUntilSaturday = 6 - dayOfWeek
      saturday = new Date(today)
      saturday.setDate(today.getDate() + daysUntilSaturday)
      sunday = new Date(saturday)
      sunday.setDate(saturday.getDate() + 1)
    }
    
    return { saturday, sunday }
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'browse' | 'plan' | 'timeline' | 'summary'>('browse')
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday')

  // Get current activities
  const scheduledActivities = getCurrentWeekendActivities()

  // Add some test activities for demonstration (only once)
  useEffect(() => {
    if (scheduledActivities.length === 0) {
      // Add a few test activities
      const testActivity1: Activity = {
        id: 'test-1',
        name: 'Morning Coffee',
        description: 'Start the day with a perfect cup of coffee',
        category: 'food',
        duration: 60,
        mood: 'relaxed',
        icon: '☕',
        color: '#8B5CF6',
        indoor: true,
        cost: 'low',
        difficulty: 'easy',
        tags: ['coffee', 'morning'],
        weatherDependent: false
      }
      
      const testActivity2: Activity = {
        id: 'test-2',
        name: 'Park Walk',
        description: 'Enjoy a peaceful walk in the park',
        category: 'outdoor',
        duration: 90,
        mood: 'peaceful',
        icon: '🌳',
        color: '#10B981',
        indoor: false,
        cost: 'free',
        difficulty: 'easy',
        tags: ['walking', 'nature'],
        weatherDependent: true
      }

      // Add activities to both days for testing
      handleAddActivity(testActivity1, '8am', 'saturday')
      handleAddActivity(testActivity2, '10am', 'saturday')
      handleAddActivity(testActivity1, '9am', 'sunday')
    }
  }, []) // Empty dependency array to run only once

  const handleAddActivity = (activity: Activity, timeSlot: string, day: 'saturday' | 'sunday' | 'friday' | 'monday') => {
    // For mobile layout, we only support saturday and sunday
    if (day === 'friday' || day === 'monday') {
      return false
    }
    return addActivity(activity, timeSlot, day as 'saturday' | 'sunday')
  }

  const handleRemoveActivity = (activityId: string) => {
    removeActivity(activityId)
  }

  const handleWeekendChange = (weekend: { saturday: Date; sunday: Date }) => {
    setSelectedWeekend(weekend)
    setCurrentWeekend(weekend.saturday, weekend.sunday)
  }

  const handleActivitySelect = (mockActivity: MockActivity) => {
    // Convert MockActivity to Activity type for the schedule store
    const activity: Activity = {
      ...mockActivity,
      category: mockActivity.category as any, // Type assertion for category
      mood: mockActivity.mood as any, // Type assertion for mood
      cost: mockActivity.cost as any, // Type assertion for cost
      difficulty: mockActivity.difficulty as any // Type assertion for difficulty
    }
    
    // For now, just close menu and show a simple alert
    setIsMenuOpen(false)
    console.log('Selected activity:', activity)
    
    // Could add to current day at next available slot
    const nextSlot = '10am' // This would be calculated based on available slots
    const success = handleAddActivity(activity, nextSlot, 'saturday')
    
    if (success) {
      // Show success feedback
      console.log('Activity added successfully!')
    }
  }

  if (!isMobile && !isSmallScreen) {
    // Return null for desktop - let desktop layout handle
    return null
  }

  return (
    <div className="mobile-layout" style={{ 
      background: `linear-gradient(180deg, ${currentTheme.colors.background}, ${currentTheme.colors.surface})`,
      color: currentTheme.colors.text,
      minHeight: '100vh'
    }}>
      {/* Mobile Header */}
      <header className="mobile-header" style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
        borderBottomColor: currentTheme.colors.border 
      }}>
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">Weekend Harmony</h1>
            <p className="app-subtitle">Plan your perfect weekend</p>
          </div>
          
          <div className="header-actions">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="menu-btn"
              style={{ background: 'rgba(255, 255, 255, 0.2)' }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Theme Selector */}
        <div className="mobile-theme-section">
          <ThemeSelector />
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-menu-overlay"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="mobile-menu"
              style={{ 
                background: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="menu-header">
                <h2 style={{ color: currentTheme.colors.text }}>Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  style={{ color: currentTheme.colors.textSecondary }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="menu-nav">
                <button 
                  onClick={() => { setActiveTab('browse'); setIsMenuOpen(false); }} 
                  className="menu-item" 
                  style={{ 
                    color: currentTheme.colors.text,
                    background: activeTab === 'browse' ? `${currentTheme.colors.primary}15` : 'transparent',
                    borderRadius: '8px'
                  }}
                >
                  <Grid3X3 className="w-4 h-4" />
                  Browse Activities
                </button>
                <button 
                  onClick={() => { setActiveTab('timeline'); setIsMenuOpen(false); }} 
                  className="menu-item" 
                  style={{ 
                    color: currentTheme.colors.text,
                    background: activeTab === 'timeline' ? `${currentTheme.colors.primary}15` : 'transparent',
                    borderRadius: '8px'
                  }}
                >
                  <Clock className="w-4 h-4" />
                  Timeline
                </button>
                <button 
                  onClick={() => { setActiveTab('summary'); setIsMenuOpen(false); }} 
                  className="menu-item" 
                  style={{ 
                    color: currentTheme.colors.text,
                    background: activeTab === 'summary' ? `${currentTheme.colors.primary}15` : 'transparent',
                    borderRadius: '8px'
                  }}
                >
                  <Star className="w-4 h-4" />
                  Summary
                </button>
                <button 
                  onClick={() => { setActiveTab('plan'); setIsMenuOpen(false); }} 
                  className="menu-item" 
                  style={{ 
                    color: currentTheme.colors.text,
                    background: activeTab === 'plan' ? `${currentTheme.colors.primary}15` : 'transparent',
                    borderRadius: '8px'
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  Calendar & Plan
                </button>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="mobile-main">
        <AnimatePresence mode="wait">
          {/* Browse Tab Content */}
          {activeTab === 'browse' && (
            <motion.div
              key="browse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <section className="mobile-section browse-section" style={{ 
                background: 'transparent',
                borderColor: 'transparent',
                boxShadow: 'none'
              }}>
                <CategoryBrowser 
                  onActivitySelect={handleActivitySelect}
                />
              </section>
            </motion.div>
          )}

          {/* Plan Tab Content */}
          {activeTab === 'plan' && (
            <motion.div
              key="plan"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Weekend Summary Card */}
              <section className="mobile-section summary-section" style={{ 
                background: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border 
              }}>
                <div className="section-header">
                  <div className="section-title">
                    <Star className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                    <h2 style={{ color: currentTheme.colors.text }}>Weekend Summary</h2>
                  </div>
                </div>
                <div className="section-content">
                  <PlanSummary 
                    scheduledActivities={scheduledActivities}
                    onRemoveActivity={handleRemoveActivity}
                  />
                </div>
              </section>

              {/* Day Selector */}
              <section className="mobile-section day-selector-section">
                <DaySelector 
                  selectedWeekend={selectedWeekend}
                  onWeekendChange={handleWeekendChange}
                />
              </section>

              {/* Day Toggle Controls */}
              <section className="mobile-section" style={{ 
                background: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border 
              }}>
                <div className="section-content">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm border border-gray-200 dark:border-gray-600">
                      <div className="flex">
                        <button
                          onClick={() => setSelectedDay('saturday')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedDay === 'saturday'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          Saturday Activities
                        </button>
                        <button
                          onClick={() => setSelectedDay('sunday')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedDay === 'sunday'
                              ? 'bg-blue-500 text-white shadow-md'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          Sunday Activities
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Activities for selected day */}
                  {(() => {
                    const dayActivities = scheduledActivities.filter(activity => {
                      return activity.day === selectedDay
                    })

                    if (dayActivities.length > 0) {
                      return (
                        <div className="space-y-3">
                          {dayActivities.map((activity) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                      {activity.category[0].toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {activity.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {activity.category} • {activity.duration} min
                                  </p>
                                </div>
                                <div className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                  {activity.startTime} - {activity.endTime}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )
                    } else {
                      return (
                        <div className="text-center py-12">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500 dark:text-gray-400">
                            No activities scheduled for {selectedDay}
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Tap Browse to add some activities!
                          </p>
                        </div>
                      )
                    }
                  })()}
                </div>
              </section>

              {/* Compact Calendar */}
              <section className="mobile-section calendar-section" style={{ 
                background: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border 
              }}>
                <div className="section-header">
                  <div className="section-title">
                    <Calendar className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                    <h2 style={{ color: currentTheme.colors.text }}>Calendar</h2>
                  </div>
                </div>
                <div className="section-content">
                  {/* Mini calendar will go here */}
                  <div className="mini-calendar">
                    <p style={{ color: currentTheme.colors.textSecondary }}>
                      Calendar view for {selectedWeekend.saturday.toDateString()} - {selectedWeekend.sunday.toDateString()}
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {/* Timeline Tab Content */}
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <section className="mobile-section timeline-section" style={{ 
                background: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border 
              }}>
                <div className="section-header">
                  <div className="section-title">
                    <Clock className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                    <h2 style={{ color: currentTheme.colors.text }}>Timeline</h2>
                  </div>
                </div>
                <div className="section-content timeline-content">
                  <EnhancedWeekendTimeline
                    scheduledActivities={scheduledActivities}
                    onAddActivity={handleAddActivity}
                    onRemoveActivity={handleRemoveActivity}
                    selectedDays={['saturday', 'sunday']}
                    selectedWeekend={selectedWeekend}
                  />
                </div>
              </section>
            </motion.div>
          )}

          {/* Summary Tab Content */}
          {activeTab === 'summary' && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <section className="mobile-section summary-detail-section" style={{ 
                background: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border 
              }}>
                <div className="section-header">
                  <div className="section-title">
                    <Star className="w-5 h-5" style={{ color: currentTheme.colors.primary }} />
                    <h2 style={{ color: currentTheme.colors.text }}>Detailed Summary</h2>
                  </div>
                </div>
                <div className="section-content">
                  <PlanSummary 
                    scheduledActivities={scheduledActivities}
                    onRemoveActivity={handleRemoveActivity}
                  />
                  
                  {/* Additional summary info */}
                  <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '12px', background: `${currentTheme.colors.primary}10` }}>
                    <h3 style={{ color: currentTheme.colors.text, margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: '600' }}>
                      Weekend Overview
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: currentTheme.colors.textSecondary }}>Total Activities:</span>
                        <span style={{ color: currentTheme.colors.text, fontWeight: '600' }}>{scheduledActivities.length}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: currentTheme.colors.textSecondary }}>Total Time:</span>
                        <span style={{ color: currentTheme.colors.text, fontWeight: '600' }}>
                          {Math.floor(scheduledActivities.reduce((sum, act) => sum + act.duration, 0) / 60)}h {scheduledActivities.reduce((sum, act) => sum + act.duration, 0) % 60}m
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: currentTheme.colors.textSecondary }}>Weekend:</span>
                        <span style={{ color: currentTheme.colors.text, fontWeight: '600' }}>
                          {selectedWeekend.saturday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {selectedWeekend.sunday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Bar */}
      <div className="mobile-bottom-bar" style={{ 
        background: currentTheme.colors.surface,
        borderTopColor: currentTheme.colors.border 
      }}>
        <button 
          className={`bottom-bar-btn ${activeTab === 'browse' ? 'active' : ''}`}
          style={{ color: activeTab === 'browse' ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
          onClick={() => setActiveTab('browse')}
        >
          <Grid3X3 className="w-5 h-5" />
          <span>Browse</span>
        </button>
        <button 
          className={`bottom-bar-btn ${activeTab === 'plan' ? 'active' : ''}`}
          style={{ color: activeTab === 'plan' ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
          onClick={() => setActiveTab('plan')}
        >
          <Calendar className="w-5 h-5" />
          <span>Plan</span>
        </button>
        <button 
          className={`bottom-bar-btn ${activeTab === 'timeline' ? 'active' : ''}`}
          style={{ color: activeTab === 'timeline' ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
          onClick={() => setActiveTab('timeline')}
        >
          <Clock className="w-5 h-5" />
          <span>Timeline</span>
        </button>
        <button 
          className={`bottom-bar-btn ${activeTab === 'summary' ? 'active' : ''}`}
          style={{ color: activeTab === 'summary' ? currentTheme.colors.primary : currentTheme.colors.textSecondary }}
          onClick={() => setActiveTab('summary')}
        >
          <Star className="w-5 h-5" />
          <span>Summary</span>
        </button>
      </div>
    </div>
  )
}

export default MobileLayout