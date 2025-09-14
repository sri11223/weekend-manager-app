import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Zap, Coffee, Sun, Moon, Star, Smile, Brain, Users, Target } from 'lucide-react'

export interface Vibe {
  id: string
  name: string
  emoji: string
  icon: React.ReactNode
  color: string
  gradient: string
  description: string
}

export const AVAILABLE_VIBES: Vibe[] = [
  {
    id: 'happy',
    name: 'Happy',
    emoji: '😊',
    icon: <Smile className="w-4 h-4" />,
    color: '#fbbf24',
    gradient: 'from-yellow-400 to-orange-500',
    description: 'Joyful and uplifting activities'
  },
  {
    id: 'relaxed',
    name: 'Relaxed',
    emoji: '😌',
    icon: <Coffee className="w-4 h-4" />,
    color: '#10b981',
    gradient: 'from-green-400 to-teal-500',
    description: 'Calm and peaceful experiences'
  },
  {
    id: 'energetic',
    name: 'Energetic',
    emoji: '⚡',
    icon: <Zap className="w-4 h-4" />,
    color: '#f59e0b',
    gradient: 'from-orange-400 to-red-500',
    description: 'High-energy and active pursuits'
  },
  {
    id: 'romantic',
    name: 'Romantic',
    emoji: '💕',
    icon: <Heart className="w-4 h-4" />,
    color: '#ec4899',
    gradient: 'from-pink-400 to-rose-500',
    description: 'Intimate and loving moments'
  },
  {
    id: 'creative',
    name: 'Creative',
    emoji: '🎨',
    icon: <Star className="w-4 h-4" />,
    color: '#8b5cf6',
    gradient: 'from-purple-400 to-indigo-500',
    description: 'Artistic and imaginative activities'
  },
  {
    id: 'social',
    name: 'Social',
    emoji: '👥',
    icon: <Users className="w-4 h-4" />,
    color: '#06b6d4',
    gradient: 'from-cyan-400 to-blue-500',
    description: 'Fun with friends and family'
  },
  {
    id: 'focused',
    name: 'Focused',
    emoji: '🎯',
    icon: <Target className="w-4 h-4" />,
    color: '#6366f1',
    gradient: 'from-indigo-400 to-purple-500',
    description: 'Productive and goal-oriented'
  },
  {
    id: 'peaceful',
    name: 'Peaceful',
    emoji: '🧘',
    icon: <Moon className="w-4 h-4" />,
    color: '#64748b',
    gradient: 'from-slate-400 to-gray-500',
    description: 'Mindful and serene activities'
  },
  {
    id: 'adventurous',
    name: 'Adventurous',
    emoji: '🌟',
    icon: <Sun className="w-4 h-4" />,
    color: '#f97316',
    gradient: 'from-orange-500 to-amber-500',
    description: 'Exciting new experiences'
  },
  {
    id: 'intellectual',
    name: 'Intellectual',
    emoji: '🧠',
    icon: <Brain className="w-4 h-4" />,
    color: '#7c3aed',
    gradient: 'from-violet-500 to-purple-600',
    description: 'Learning and mental stimulation'
  }
]

interface MoodVibeTrackerProps {
  selectedVibes: string[]
  onVibeToggle: (vibeId: string) => void
  maxVibes?: number
  compact?: boolean
}

export const MoodVibeTracker: React.FC<MoodVibeTrackerProps> = ({
  selectedVibes,
  onVibeToggle,
  maxVibes = 3,
  compact = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const selectedVibeData = AVAILABLE_VIBES.filter(vibe => selectedVibes.includes(vibe.id))

  return (
    <div className="space-y-4">
      {/* Header - Mobile Optimized */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
            <Star className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-base font-bold text-gray-800 dark:text-gray-200">Choose Your Mood</span>
            {selectedVibes.length > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {selectedVibes.length} of {maxVibes} selected
              </div>
            )}
          </div>
        </div>
        {!compact && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 transition-all duration-200"
          >
            {isExpanded ? 'Show Less' : 'Show All'}
          </motion.button>
        )}
      </div>

      {/* Selected Vibes Display - Enhanced */}
      {selectedVibeData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Your Selected Vibes:
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedVibeData.map((vibe) => (
              <motion.div
                key={vibe.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-xl bg-gradient-to-r ${vibe.gradient} text-white text-sm font-medium flex items-center gap-2 shadow-lg backdrop-blur-sm relative overflow-hidden`}
                style={{
                  boxShadow: `0 4px 16px ${vibe.color}40`
                }}
              >
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white/40"></div>
                  <div className="absolute bottom-1 left-1 w-2 h-2 rounded-full bg-white/30"></div>
                </div>
                
                <span className="relative z-10 text-base">{vibe.emoji}</span>
                <span className="relative z-10">{vibe.name}</span>
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onVibeToggle(vibe.id)}
                  className="relative z-10 ml-1 hover:bg-white/20 rounded-full p-1 transition-all duration-200 flex items-center justify-center"
                >
                  <span className="text-sm leading-none">×</span>
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Vibe Selector - Mobile Optimized */}
      <AnimatePresence>
        {(isExpanded || compact) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`grid gap-3 ${
              compact 
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5' 
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {AVAILABLE_VIBES.map((vibe, index) => {
                const isSelected = selectedVibes.includes(vibe.id)
                const canSelect = selectedVibes.length < maxVibes || isSelected

                return (
                  <motion.button
                    key={vibe.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => canSelect && onVibeToggle(vibe.id)}
                    disabled={!canSelect}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-left group overflow-hidden backdrop-blur-sm ${
                      isSelected
                        ? `border-transparent bg-gradient-to-br ${vibe.gradient} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                        : canSelect
                        ? 'border-gray-200 bg-white/80 hover:border-gray-300 hover:shadow-md hover:bg-white transform hover:scale-102'
                        : 'border-gray-100 bg-gray-50/50 opacity-50 cursor-not-allowed'
                    } ${compact ? 'aspect-square min-h-[100px]' : 'min-h-[120px]'}`}
                    style={{
                      boxShadow: isSelected 
                        ? `0 8px 32px ${vibe.color}40, 0 4px 16px rgba(0,0,0,0.1)`
                        : undefined
                    }}
                  >
                    {/* Background Pattern */}
                    {isSelected && (
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/30"></div>
                        <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-white/20"></div>
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-white/10 transform -translate-x-1/2 -translate-y-1/2"></div>
                      </div>
                    )}

                    <div className={`relative z-10 flex h-full ${compact ? 'flex-col items-center justify-center text-center' : 'flex-col justify-between'}`}>
                      {/* Icon/Emoji */}
                      <div className={`flex items-center justify-center mb-2 ${compact ? 'mb-1' : 'mb-3'}`}>
                        <div className={`p-2 rounded-full ${
                          isSelected 
                            ? 'bg-white/20 backdrop-blur-sm' 
                            : 'bg-gray-100 group-hover:bg-gray-200'
                        } transition-all duration-300`}>
                          <div className={compact ? 'text-lg' : 'text-xl'}>
                            {isSelected ? vibe.emoji : vibe.icon}
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`flex-1 ${compact ? 'text-center' : ''}`}>
                        <div className={`font-bold ${compact ? 'text-sm' : 'text-base'} mb-1 ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        } transition-colors duration-300`}>
                          {vibe.name}
                        </div>
                        {!compact && (
                          <div className={`text-xs leading-relaxed ${
                            isSelected ? 'text-white/90' : 'text-gray-600'
                          } transition-colors duration-300`}>
                            {vibe.description}
                          </div>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </motion.div>
                      )}

                      {/* Disabled Overlay */}
                      {!canSelect && !isSelected && (
                        <div className="absolute inset-0 bg-gray-100/70 rounded-2xl flex items-center justify-center">
                          <span className="text-xs text-gray-500 font-medium">Max reached</span>
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Vibe Suggestions - Enhanced Mobile */}
      {!isExpanded && !compact && selectedVibes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Quick Picks:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {AVAILABLE_VIBES.slice(0, 4).map((vibe) => (
              <motion.button
                key={vibe.id}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onVibeToggle(vibe.id)}
                className="p-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 flex flex-col items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="text-lg">{vibe.emoji}</span>
                <span className="font-medium">{vibe.name}</span>
              </motion.button>
            ))}
          </div>
          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(true)}
              className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
            >
              <span>View all moods</span>
              <Star className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default MoodVibeTracker
