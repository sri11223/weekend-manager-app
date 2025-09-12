// src/features/FloatingActivityBrowser.tsx - UPDATED WITH MOCK DATA
import React, { useState, useEffect } from 'react'
import { X, Search, Filter, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Activity } from './DraggableActivityCard'
import DraggableActivityItem from './DraggableActivityItem'
import { useDrop } from 'react-dnd'
import { mockActivitiesDatabase, MockActivityService } from '../../data/mockActivities'

interface FloatingActivityBrowserProps {
  category: string
  onClose: () => void
  searchQuery?: string
  onAddActivity?: (activity: any, timeSlot: string, day: 'saturday' | 'sunday') => boolean
  onRemoveActivity?: (activityId: string) => void
  scheduledActivities?: any[]
  themeId?: string
}

// ✅ THEME-AWARE CATEGORY CONFIGS WITH MOCK DATA MAPPING
const getThemeCategoryConfig = (category: string, themeId: string) => {
  // Theme-based descriptions
  const themeDescriptions = {
    adventurous: 'thrilling and exciting',
    relaxed: 'peaceful and calming', 
    energetic: 'high-energy and dynamic',
    romantic: 'intimate and romantic',
    focus: 'focused and productive',
    creative_flow: 'creative and inspiring'
  }

  const themePrefix = themeDescriptions[themeId as keyof typeof themeDescriptions] || 'amazing'

  // Category configurations with theme awareness
  const categoryConfigs: { [key: string]: any } = {
    // Adventurous theme categories
    outdoor: {
      title: 'Outdoor Adventures',
      description: `${themePrefix} outdoor experiences and nature activities`,
      color: 'green',
      bgGradient: 'from-green-500 to-teal-500'
    },
    sports: {
      title: 'Sports & Fitness',
      description: `${themePrefix} sports and fitness activities`,
      color: 'red',
      bgGradient: 'from-red-500 to-orange-500'
    },
    travel: {
      title: 'Travel & Exploration',
      description: `${themePrefix} travel and exploration experiences`,
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    games: {
      title: 'Games & Entertainment',
      description: `${themePrefix} gaming and entertainment activities`,
      color: 'purple',
      bgGradient: 'from-purple-500 to-indigo-500'
    },
    food: {
      title: 'Food & Dining',
      description: `${themePrefix} culinary experiences and dining`,
      color: 'orange',
      bgGradient: 'from-orange-500 to-red-500'
    },
    social: {
      title: 'Social Activities',
      description: `${themePrefix} social experiences and gatherings`,
      color: 'pink',
      bgGradient: 'from-pink-500 to-rose-500'
    },

    // Relaxed theme categories
    wellness: {
      title: 'Wellness & Health',
      description: `${themePrefix} wellness and self-care activities`,
      color: 'emerald',
      bgGradient: 'from-emerald-500 to-teal-500'
    },
    nature: {
      title: 'Nature & Outdoors',
      description: `${themePrefix} nature and peaceful outdoor activities`,
      color: 'green',
      bgGradient: 'from-green-400 to-emerald-500'
    },
    books: {
      title: 'Reading & Literature',
      description: `${themePrefix} reading and literary activities`,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-purple-500'
    },
    movies: {
      title: 'Movies & Shows',
      description: `${themePrefix} movies and entertainment`,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    art: {
      title: 'Arts & Crafts',
      description: `${themePrefix} artistic and creative activities`,
      color: 'pink',
      bgGradient: 'from-pink-500 to-rose-500'
    },

    // Energetic theme categories
    music: {
      title: 'Music & Audio',
      description: `${themePrefix} music and audio experiences`,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-orange-500'
    },
    dance: {
      title: 'Dance & Movement',
      description: `${themePrefix} dance and movement activities`,
      color: 'pink',
      bgGradient: 'from-pink-500 to-purple-500'
    },

    // Romantic theme categories
    culture: {
      title: 'Cultural Activities',
      description: `${themePrefix} cultural and artistic experiences`,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-purple-500'
    },

    // Focus theme categories
    meditation: {
      title: 'Meditation & Mindfulness',
      description: `${themePrefix} meditation and mindfulness practices`,
      color: 'blue',
      bgGradient: 'from-blue-500 to-indigo-500'
    },
    study: {
      title: 'Study & Learning',
      description: `${themePrefix} learning and educational activities`,
      color: 'green',
      bgGradient: 'from-green-500 to-teal-500'
    },
    brain_training: {
      title: 'Brain Training',
      description: `${themePrefix} cognitive and brain training exercises`,
      color: 'purple',
      bgGradient: 'from-purple-500 to-indigo-500'
    },
    environment: {
      title: 'Environment & Workspace',
      description: `${themePrefix} environment and workspace optimization`,
      color: 'gray',
      bgGradient: 'from-gray-500 to-slate-500'
    },
    reading: {
      title: 'Reading & Research',
      description: `${themePrefix} reading and research activities`,
      color: 'blue',
      bgGradient: 'from-blue-500 to-cyan-500'
    },
    writing: {
      title: 'Writing & Documentation',
      description: `${themePrefix} writing and documentation tasks`,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-purple-500'
    },

    // Creative Flow theme categories
    visual_arts: {
      title: 'Visual Arts',
      description: `${themePrefix} visual arts and creative expression`,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    movement: {
      title: 'Movement & Flow',
      description: `${themePrefix} movement and physical expression`,
      color: 'orange',
      bgGradient: 'from-orange-500 to-red-500'
    },
    crafts: {
      title: 'Crafts & Making',
      description: `${themePrefix} crafts and hands-on creation`,
      color: 'brown',
      bgGradient: 'from-amber-600 to-orange-600'
    },
    digital_creation: {
      title: 'Digital Creation',
      description: `${themePrefix} digital arts and technology creation`,
      color: 'blue',
      bgGradient: 'from-blue-500 to-purple-500'
    },
    performance: {
      title: 'Performance Arts',
      description: `${themePrefix} performance and expressive arts`,
      color: 'red',
      bgGradient: 'from-red-500 to-pink-500'
    },

    // Generic fallback
    entertainment: {
      title: 'Entertainment',
      description: `${themePrefix} entertainment activities`,
      color: 'purple',
      bgGradient: 'from-purple-500 to-pink-500'
    },
    learning: {
      title: 'Learning & Education',
      description: `${themePrefix} learning and educational experiences`,
      color: 'blue',
      bgGradient: 'from-blue-500 to-teal-500'
    },
    indoor: {
      title: 'Indoor Activities',
      description: `${themePrefix} indoor experiences and activities`,
      color: 'gray',
      bgGradient: 'from-gray-500 to-slate-500'
    },
    creative: {
      title: 'Creative Activities',
      description: `${themePrefix} creative and artistic pursuits`,
      color: 'pink',
      bgGradient: 'from-pink-500 to-purple-500'
    }
  }

  return categoryConfigs[category] || {
    title: category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: `${themePrefix} ${category} activities`,
    color: 'blue',
    bgGradient: 'from-blue-500 to-purple-500'
  }
}

// ✅ UNIFIED TIME SLOT MAPPING
const TIME_SLOT_MAP = [
  { display: '6:00 AM', id: '6am' },
  { display: '7:00 AM', id: '7am' },
  { display: '8:00 AM', id: '8am' },
  { display: '9:00 AM', id: '9am' },
  { display: '10:00 AM', id: '10am' },
  { display: '11:00 AM', id: '11am' },
  { display: '12:00 PM', id: '12pm' },
  { display: '1:00 PM', id: '1pm' },
  { display: '2:00 PM', id: '2pm' },
  { display: '3:00 PM', id: '3pm' },
  { display: '4:00 PM', id: '4pm' },
  { display: '5:00 PM', id: '5pm' },
  { display: '6:00 PM', id: '6pm' },
  { display: '7:00 PM', id: '7pm' },
  { display: '8:00 PM', id: '8pm' },
  { display: '9:00 PM', id: '9pm' },
  { display: '10:00 PM', id: '10pm' },
  { display: '11:00 PM', id: '11pm' }
]

const FloatingActivityBrowser: React.FC<FloatingActivityBrowserProps> = ({
  category,
  onClose,
  searchQuery = '',
  onAddActivity,
  onRemoveActivity,
  scheduledActivities = [],
  themeId = 'adventurous'
}) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [filter, setFilter] = useState<'all' | 'free' | 'paid'>('all')
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday')

  // ✅ THEME-AWARE CONFIG
  const config = getThemeCategoryConfig(category, themeId)

  // ✅ LOAD ACTIVITIES FROM MOCK DATA
  useEffect(() => {
    loadMockActivities()
  }, [category, themeId, localSearch, filter])

  const loadMockActivities = () => {
    try {
      setLoading(true)
      console.log(`🎨 Loading ${category} activities from mock data for theme: ${themeId}`)

      // ✅ GET ACTIVITIES FROM MOCK DATA
      const mockActivities = MockActivityService.getActivitiesForCategory(themeId, category)

      if (mockActivities.length === 0) {
        console.warn(`❌ No activities found for category: ${category} in theme: ${themeId}`)
        setActivities([])
        setLoading(false)
        return
      }

      // ✅ CONVERT MOCK ACTIVITIES TO COMPONENT ACTIVITIES
      let result: Activity[] = mockActivities.map(mockActivity => ({
        id: mockActivity.id,
        title: mockActivity.name,
        description: mockActivity.description,
        category: mockActivity.category,
        duration: mockActivity.duration,
        cost: typeof mockActivity.cost === 'string' ? 
          (mockActivity.cost === 'free' ? 0 : 
           mockActivity.cost === 'low' ? 15 : 
           mockActivity.cost === 'medium' ? 35 : 65) : 
          mockActivity.cost,
        weatherPreference: mockActivity.weatherDependent ? 'outdoor' : 'any',
        moodTags: [mockActivity.mood],
        image: mockActivity.icon || '🎯',
        rating: 4 + Math.random(),
        location: 'Various locations',
        isApiGenerated: false,
        apiSource: 'mock-data',
        // Additional mock data fields
        difficulty: mockActivity.difficulty,
        indoor: mockActivity.indoor,
        tags: mockActivity.tags || []
      }))

      // ✅ APPLY SEARCH FILTER
      if (localSearch.trim()) {
        result = result.filter(activity =>
          activity.title.toLowerCase().includes(localSearch.toLowerCase()) ||
          activity.description.toLowerCase().includes(localSearch.toLowerCase()) ||
          activity.tags.some(tag => tag.toLowerCase().includes(localSearch.toLowerCase())) ||
          activity.moodTags.some(mood => mood.toLowerCase().includes(localSearch.toLowerCase()))
        )
      }

      // ✅ APPLY COST FILTER
      if (filter === 'free') {
        result = result.filter(activity => activity.cost === 0)
      } else if (filter === 'paid') {
        result = result.filter(activity => activity.cost > 0)
      }

      setActivities(result)
      console.log(`✅ Loaded ${result.length} mock activities for ${category} (${themeId} theme)`)

    } catch (error) {
      console.error('❌ Failed to load mock activities:', error)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }

  // ✅ SYNC HELPER FUNCTIONS
  const convertTimeToId = (timeString: string): string => {
    const slot = TIME_SLOT_MAP.find(s => s.display === timeString)
    return slot ? slot.id : timeString.toLowerCase().replace(/[:\s]/g, '')
  }

  const isSlotOccupied = (timeSlotId: string, day: 'saturday' | 'sunday'): boolean => {
    return scheduledActivities.some(activity => 
      activity.timeSlot === timeSlotId && activity.day === day
    )
  }

  const getActivityForSlot = (timeSlotId: string, day: 'saturday' | 'sunday') => {
    return scheduledActivities.find(activity => 
      activity.timeSlot === timeSlotId && activity.day === day
    )
  }

  // Handle schedule activity from modal
  const handleScheduleActivity = (activity: Activity, day: 'saturday' | 'sunday', timeSlot: string) => {
    if (onAddActivity) {
      const convertedTimeSlot = convertTimeToId(timeSlot)
      const success = onAddActivity(activity, convertedTimeSlot, day)
      if (success) {
        console.log('✅ Activity scheduled successfully in popup')
      } else {
        console.log('⚠️ Failed to schedule - slot may be occupied')
      }
    }
  }

  const handleQuickAdd = (activity: Activity, day: 'saturday' | 'sunday', timeSlot: string) => {
    if (onAddActivity) {
      const convertedTimeSlot = convertTimeToId(timeSlot)
      onAddActivity(activity, convertedTimeSlot, day)
    }
  }

  // ✅ GET ACTIVITY COUNT FOR DISPLAY
  const totalActivitiesCount = MockActivityService.getCategoryCount(themeId, category)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ✅ THEME-AWARE HEADER WITH MOCK DATA INFO */}
        <div className={`bg-gradient-to-r ${config.bgGradient} p-6 text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{config.title}</h2>
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {themeId.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ')} Theme
                </span>
                <span className="px-3 py-1 bg-white/25 rounded-full text-sm font-bold">
                  {totalActivitiesCount} Activities
                </span>
              </div>
              <p className="text-white/80 mt-1">{config.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-white/80">
                  Loaded from comprehensive activity database
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${config.title.toLowerCase()}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/80" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as 'all' | 'free' | 'paid')}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="all">All Activities</option>
                <option value="free">Free Only</option>
                <option value="paid">Paid Activities</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content with Timeline Sidebar */}
        <div className="flex h-[calc(100%-180px)]">
          {/* ✅ ACTIVITIES LIST WITH MOCK DATA */}
          <div className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 rounded-xl p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filters. 
                  {totalActivitiesCount > 0 && ` There are ${totalActivitiesCount} activities available in this category.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4 mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    {config.title} ({activities.length} found)
                  </h3>
                  <div className="text-sm text-gray-500">
                    From {themeId.replace(/_/g, ' ')} theme database
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((activity) => (
                    <DraggableActivityItem
                      key={activity.id}
                      activity={activity}
                      onQuickAdd={handleQuickAdd}
                      scheduledActivities={scheduledActivities || []}
                      onRemoveActivity={onRemoveActivity}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ✅ ENHANCED VISUAL TIMELINE SIDEBAR - KEEPING ORIGINAL DESIGN */}
          <div className="w-96 border-l border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${config.bgGradient} flex items-center justify-center shadow-xl`}>
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Weekend Timeline</h3>
                  <p className="text-gray-600 text-sm">Drag & drop to schedule</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-gray-900 text-sm font-medium">
                  {scheduledActivities?.filter(a => !a.isBlocked).length || 0} activities
                </div>
                <div className="text-gray-500 text-xs">planned</div>
              </div>
            </div>

            {/* Tab-based Timeline Selection */}
            <div className="space-y-6">
              {/* Day Tabs */}
              <div className="flex bg-gray-100 rounded-2xl p-2">
                <button
                  onClick={() => setSelectedDay('saturday')}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedDay === 'saturday'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedDay === 'saturday' ? 'bg-white' : 'bg-blue-400'}`}></div>
                    Saturday
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedDay === 'saturday' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {scheduledActivities?.filter(a => a.day === 'saturday' && !a.isBlocked).length || 0}
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setSelectedDay('sunday')}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm transition-all duration-300 ${
                    selectedDay === 'sunday'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-xl transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${selectedDay === 'sunday' ? 'bg-white' : 'bg-purple-400'}`}></div>
                    Sunday
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedDay === 'sunday' 
                        ? 'bg-white/20 text-white' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      {scheduledActivities?.filter(a => a.day === 'sunday' && !a.isBlocked).length || 0}
                    </span>
                  </div>
                </button>
              </div>

              {/* Selected Day Timeline */}
              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                  selectedDay === 'saturday'
                    ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'
                    : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full animate-pulse ${
                      selectedDay === 'saturday' ? 'bg-blue-400' : 'bg-purple-400'
                    }`}></div>
                    <h4 className="text-lg font-bold text-gray-900 capitalize">{selectedDay}</h4>
                    <span className="text-sm text-gray-600">
                      {selectedDay === 'saturday' ? 'Sep 14' : 'Sep 15'}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    selectedDay === 'saturday'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}>
                    {scheduledActivities?.filter(a => a.day === selectedDay && !a.isBlocked).length || 0} activities
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {TIME_SLOT_MAP.map((slot) => {
                    const activity = getActivityForSlot(slot.id, selectedDay)
                    const isOccupied = isSlotOccupied(slot.id, selectedDay)

                    return (
                      <SynchronizedTimeSlotDropZone
                        key={`${selectedDay}-${slot.id}`}
                        time={slot.display}
                        timeSlotId={slot.id}
                        day={selectedDay}
                        activity={activity}
                        isOccupied={isOccupied}
                        onAddActivity={handleScheduleActivity}
                        onRemoveActivity={onRemoveActivity}
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ✅ KEEP THE EXISTING SYNCHRONIZED TIME SLOT DROP ZONE COMPONENT
interface SynchronizedTimeSlotDropZoneProps {
  time: string
  timeSlotId: string
  day: 'saturday' | 'sunday'
  activity?: any
  isOccupied: boolean
  onAddActivity: (activity: any, day: 'saturday' | 'sunday', timeSlot: string) => void
  onRemoveActivity?: (activityId: string) => void
}

const SynchronizedTimeSlotDropZone: React.FC<SynchronizedTimeSlotDropZoneProps> = ({
  time,
  day,
  activity,
  isOccupied,
  onAddActivity,
  onRemoveActivity
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'activity',
    drop: (item: Activity) => {
      if (!isOccupied) {
        onAddActivity(item, day, time)
      }
    },
    canDrop: () => !isOccupied,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  })

  const dayColor = day === 'saturday' ? 'blue' : 'purple'
  const timeHour = parseInt(time.split(':')[0])
  const isPM = time.includes('PM')
  const is24Hour = isPM ? timeHour + 12 : timeHour

  // Dynamic background based on time of day
  const getTimeGradient = () => {
    if (is24Hour >= 6 && is24Hour < 12) return 'from-amber-50 to-yellow-50' // Morning
    if (is24Hour >= 12 && is24Hour < 17) return 'from-blue-50 to-sky-50' // Afternoon
    if (is24Hour >= 17 && is24Hour < 21) return 'from-orange-50 to-red-50' // Evening
    return 'from-indigo-50 to-purple-50' // Night
  }

  return (
    <motion.div
      ref={drop as any}
      whileHover={{ scale: canDrop ? 1.02 : 1, y: canDrop ? -2 : 0 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative rounded-xl border-2 transition-all duration-300 min-h-[80px] overflow-hidden
        ${isOver && canDrop
          ? `border-${dayColor}-400 bg-${dayColor}-50 shadow-lg scale-105` 
          : activity 
            ? activity.isBlocked
              ? 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 shadow-sm'
              : `border-${dayColor}-300 bg-gradient-to-br ${getTimeGradient()} shadow-md hover:shadow-lg` 
            : isOccupied
              ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50 opacity-75'
              : `border-gray-200 bg-gradient-to-br ${getTimeGradient()} hover:border-${dayColor}-300 hover:shadow-md`
        }
      `}
    >
      {/* Time Header */}
      <div className={`px-4 py-2 bg-gradient-to-r ${day === 'saturday' ? 'from-blue-500 to-blue-600' : 'from-purple-500 to-purple-600'} text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-bold text-sm">{time}</span>
          </div>
          {activity && !activity.isBlocked && onRemoveActivity && (
            <button 
              onClick={(e) => {
                e.stopPropagation()
                onRemoveActivity(activity.id)
              }}
              className="p-1 rounded-full hover:bg-white/20 transition-colors group"
            >
              <X className="w-3 h-3 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3">
        {activity ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {activity.isBlocked ? (
              <div className="text-center py-2">
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-xs">⏳</span>
                </div>
                <p className="text-xs font-medium text-gray-600">Continued Activity</p>
                <p className="text-xs text-gray-500">{activity.title}</p>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-gray-900 text-sm leading-tight flex-1">
                    {activity.title}
                  </h4>
                  {activity.cost !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                      activity.cost === 0 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {activity.cost === 0 ? 'FREE' : `$${activity.cost}`}
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {activity.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="font-medium">
                      {Math.floor(activity.duration / 60)}h {activity.duration % 60}m
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {activity.category && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        dayColor === 'blue' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-purple-100 text-purple-700'
                      }`}>
                        {activity.category}
                      </span>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-4">
            {isOccupied ? (
              <div className="space-y-2">
                <div className="w-8 h-8 mx-auto rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-red-500 text-xs">🚫</span>
                </div>
                <p className="text-xs font-medium text-red-600">Slot Occupied</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className={`w-8 h-8 mx-auto rounded-full ${
                  dayColor === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                } flex items-center justify-center`}>
                  <span className={`${
                    dayColor === 'blue' ? 'text-blue-500' : 'text-purple-500'
                  } text-xs`}>📅</span>
                </div>
                <p className={`text-xs font-medium ${
                  dayColor === 'blue' ? 'text-blue-600' : 'text-purple-600'
                }`}>
                  {isOver && canDrop ? 'Drop here!' : 'Available'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Overlays */}
      {isOver && canDrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 backdrop-blur-sm rounded-xl flex items-center justify-center ${
            dayColor === 'blue' 
              ? 'bg-gradient-to-br from-blue-400/20 to-blue-500/20' 
              : 'bg-gradient-to-br from-purple-400/20 to-purple-500/20'
          }`}
        >
          <div className={`text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg ${
            dayColor === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
          }`}>
            ✨ Drop Here!
          </div>
        </motion.div>
      )}

      {isOver && !canDrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-500/20 backdrop-blur-sm rounded-xl flex items-center justify-center"
        >
          <div className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg">
            ❌ Slot Occupied!
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default FloatingActivityBrowser