import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Mountain, Heart, Users, Zap, BookOpen, Coffee, Palette } from 'lucide-react'

export interface WeekendTheme {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  gradient: string
  mood: string[]
  suggestedCategories: string[]
  color: string
}

const WEEKEND_THEMES: WeekendTheme[] = [
  {
    id: 'lazy',
    name: 'Lazy Weekend',
    description: 'Cozy, low-energy activities for maximum relaxation',
    icon: <Coffee className="w-6 h-6" />,
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    mood: ['peaceful', 'relaxed', 'cozy'],
    suggestedCategories: ['food', 'entertainment', 'wellness'],
    color: '#f59e0b'
  },
  {
    id: 'adventurous',
    name: 'Adventurous Weekend',
    description: 'High-energy outdoor activities and new experiences',
    icon: <Mountain className="w-6 h-6" />,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    mood: ['energetic', 'adventurous', 'exciting'],
    suggestedCategories: ['outdoor', 'sports', 'culture'],
    color: '#10b981'
  },
  {
    id: 'romantic',
    name: 'Romantic Weekend',
    description: 'Intimate activities perfect for couples and date nights',
    icon: <Heart className="w-6 h-6" />,
    gradient: 'from-pink-400 via-rose-500 to-red-500',
    mood: ['romantic', 'intimate', 'peaceful'],
    suggestedCategories: ['food', 'culture', 'entertainment'],
    color: '#ec4899'
  },
  {
    id: 'family',
    name: 'Family Weekend',
    description: 'Kid-friendly activities for quality family time',
    icon: <Users className="w-6 h-6" />,
    gradient: 'from-blue-400 via-indigo-500 to-purple-500',
    mood: ['family', 'social', 'fun'],
    suggestedCategories: ['outdoor', 'entertainment', 'culture'],
    color: '#6366f1'
  },
  {
    id: 'productive',
    name: 'Productive Weekend',
    description: 'Learning and self-improvement activities',
    icon: <BookOpen className="w-6 h-6" />,
    gradient: 'from-violet-400 via-purple-500 to-indigo-500',
    mood: ['focused', 'intellectual', 'creative'],
    suggestedCategories: ['learning', 'wellness', 'creative'],
    color: '#8b5cf6'
  },
  {
    id: 'creative',
    name: 'Creative Weekend',
    description: 'Artistic and creative pursuits to inspire your soul',
    icon: <Palette className="w-6 h-6" />,
    gradient: 'from-fuchsia-400 via-pink-500 to-rose-500',
    mood: ['creative', 'inspiring', 'artistic'],
    suggestedCategories: ['culture', 'creative', 'wellness'],
    color: '#d946ef'
  }
]

interface WeekendThemeSelectorProps {
  selectedTheme: string | null
  onThemeSelect: (theme: WeekendTheme) => void
  onClearTheme: () => void
}

export const WeekendThemeSelector: React.FC<WeekendThemeSelectorProps> = ({
  selectedTheme,
  onThemeSelect,
  onClearTheme
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const selectedThemeData = WEEKEND_THEMES.find(theme => theme.id === selectedTheme)

  return (
    <div className="mb-6">
      {/* Theme Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-bold text-gray-900">Weekend Vibe</h3>
        </div>
        {selectedTheme && (
          <button
            onClick={onClearTheme}
            className="text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear Theme
          </button>
        )}
      </div>

      {/* Selected Theme Display */}
      {selectedThemeData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 p-4 rounded-2xl bg-gradient-to-r ${selectedThemeData.gradient} text-white shadow-lg`}
        >
          <div className="flex items-center gap-3">
            {selectedThemeData.icon}
            <div>
              <h4 className="font-bold text-lg">{selectedThemeData.name}</h4>
              <p className="text-white/90 text-sm">{selectedThemeData.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Theme Selector */}
      <div className="space-y-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors flex items-center justify-between"
        >
          <span className="text-sm font-medium text-gray-700">
            {selectedTheme ? 'Change Weekend Theme' : 'Choose Your Weekend Vibe'}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Zap className="w-4 h-4 text-gray-400" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-2 gap-3 overflow-hidden"
            >
              {WEEKEND_THEMES.map((theme, index) => (
                <motion.button
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    onThemeSelect(theme)
                    setIsExpanded(false)
                  }}
                  className={`p-3 rounded-xl border-2 transition-all text-left group hover:scale-105 ${
                    selectedTheme === theme.id
                      ? 'border-purple-300 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${theme.gradient} text-white group-hover:scale-110 transition-transform`}>
                      {theme.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-semibold text-gray-900 text-sm leading-tight">
                        {theme.name}
                      </h5>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>
                  
                  {/* Mood Tags */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {theme.mood.slice(0, 2).map((mood) => (
                      <span
                        key={mood}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
                      >
                        {mood}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default WeekendThemeSelector
