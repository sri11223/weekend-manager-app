import React, { useState, useEffect } from 'react'
import { Calendar, Plus, Clock, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

interface Holiday {
  id: string
  name: string
  date: Date
  type: 'national' | 'regional' | 'cultural'
  longWeekendDays: string[]
}

interface LongWeekendPlannerProps {
  onClose: () => void
}

const UPCOMING_HOLIDAYS: Holiday[] = [
  {
    id: 'diwali-2024',
    name: 'Diwali',
    date: new Date('2024-11-01'),
    type: 'national',
    longWeekendDays: ['Friday', 'Saturday', 'Sunday', 'Monday']
  },
  {
    id: 'christmas-2024',
    name: 'Christmas',
    date: new Date('2024-12-25'),
    type: 'national',
    longWeekendDays: ['Saturday', 'Sunday', 'Monday']
  },
  {
    id: 'new-year-2025',
    name: 'New Year',
    date: new Date('2025-01-01'),
    type: 'national',
    longWeekendDays: ['Saturday', 'Sunday', 'Monday']
  }
]

const LONG_WEEKEND_SUGGESTIONS = {
  '3-day': [
    'City exploration and food tours',
    'Weekend getaway to nearby destinations',
    'Home renovation projects',
    'Learn a new skill or hobby',
    'Visit family and friends'
  ],
  '4-day': [
    'Road trip to multiple cities',
    'Mountain or beach vacation',
    'Digital detox retreat',
    'Complete a creative project',
    'Organize and declutter your space'
  ]
}

const LongWeekendPlanner: React.FC<LongWeekendPlannerProps> = ({ onClose }) => {
  const { currentTheme } = useTheme()
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null)
  const [customDays, setCustomDays] = useState<string[]>(['Saturday', 'Sunday'])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilHoliday = (date: Date) => {
    const today = new Date()
    const diffTime = date.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getSuggestions = (days: string[]) => {
    const dayCount = days.length
    if (dayCount >= 4) return LONG_WEEKEND_SUGGESTIONS['4-day']
    if (dayCount >= 3) return LONG_WEEKEND_SUGGESTIONS['3-day']
    return ['Regular weekend activities', 'Local exploration', 'Rest and relaxation']
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: currentTheme.colors.surface }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{ 
            borderColor: currentTheme.colors.border,
            background: currentTheme.colors.gradient
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                🗓️ Long Weekend Planner
              </h2>
              <p className="text-white/80">
                Plan ahead for holidays and extended weekends
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Holidays */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
                <Calendar className="w-5 h-5" />
                Upcoming Holidays
              </h3>

              <div className="space-y-3">
                {UPCOMING_HOLIDAYS.map((holiday) => {
                  const daysUntil = getDaysUntilHoliday(holiday.date)
                  const isUpcoming = daysUntil > 0

                  return (
                    <motion.div
                      key={holiday.id}
                      className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all
                        ${selectedHoliday?.id === holiday.id ? 'border-solid' : 'border-dashed'}
                        ${isUpcoming ? 'opacity-100' : 'opacity-50'}
                      `}
                      style={{
                        borderColor: selectedHoliday?.id === holiday.id 
                          ? currentTheme.colors.primary 
                          : currentTheme.colors.border,
                        backgroundColor: selectedHoliday?.id === holiday.id 
                          ? `${currentTheme.colors.primary}10` 
                          : currentTheme.colors.background
                      }}
                      onClick={() => setSelectedHoliday(holiday)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold" style={{ color: currentTheme.colors.text }}>
                            {holiday.name}
                          </h4>
                          <p className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                            {formatDate(holiday.date)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span
                              className="px-2 py-1 text-xs rounded-full"
                              style={{
                                backgroundColor: `${currentTheme.colors.accent}20`,
                                color: currentTheme.colors.accent
                              }}
                            >
                              {holiday.longWeekendDays.length} days
                            </span>
                            {isUpcoming && (
                              <span className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                                {daysUntil} days away
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs" style={{ color: currentTheme.colors.textSecondary }}>
                            {holiday.longWeekendDays.join(' → ')}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Custom Long Weekend */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: currentTheme.colors.text }}>
                <Plus className="w-5 h-5" />
                Custom Long Weekend
              </h3>

              <div
                className="p-4 rounded-xl border-2 border-dashed"
                style={{ borderColor: currentTheme.colors.border }}
              >
                <h4 className="font-semibold mb-3" style={{ color: currentTheme.colors.text }}>
                  Select Your Days
                </h4>
                
                <div className="grid grid-cols-2 gap-2">
                  {['Friday', 'Saturday', 'Sunday', 'Monday'].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        if (customDays.includes(day)) {
                          setCustomDays(customDays.filter(d => d !== day))
                        } else {
                          setCustomDays([...customDays, day])
                        }
                      }}
                      className={`
                        p-3 rounded-lg text-sm font-medium transition-all
                        ${customDays.includes(day) ? 'text-white' : ''}
                      `}
                      style={{
                        backgroundColor: customDays.includes(day) 
                          ? currentTheme.colors.primary 
                          : currentTheme.colors.background,
                        color: customDays.includes(day) 
                          ? 'white' 
                          : currentTheme.colors.text
                      }}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                <div className="mt-3 text-center">
                  <span className="text-sm" style={{ color: currentTheme.colors.textSecondary }}>
                    {customDays.length} day{customDays.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {(selectedHoliday || customDays.length > 0) && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: currentTheme.colors.text }}>
                💡 Suggestions for {selectedHoliday ? selectedHoliday.longWeekendDays.length : customDays.length}-Day Weekend
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getSuggestions(selectedHoliday ? selectedHoliday.longWeekendDays : customDays).map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg border"
                    style={{
                      backgroundColor: currentTheme.colors.background,
                      borderColor: currentTheme.colors.border
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: currentTheme.colors.primary,
                          color: 'white'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: currentTheme.colors.text }}>
                          {suggestion}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex gap-3">
            <button
              className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: currentTheme.colors.primary,
                color: 'white'
              }}
              onClick={() => {
                // TODO: Implement planning functionality
                alert('Planning feature coming soon!')
              }}
            >
              Start Planning
            </button>
            
            <button
              className="px-6 py-3 rounded-xl font-semibold border transition-all hover:scale-[1.02]"
              style={{
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.text
              }}
              onClick={onClose}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default LongWeekendPlanner
