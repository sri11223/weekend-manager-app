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
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Weekend Vibes</span>
          {selectedVibes.length > 0 && (
            <span className="text-xs text-gray-500">({selectedVibes.length}/{maxVibes})</span>
          )}
        </div>
        {!compact && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-purple-600 hover:text-purple-700 transition-colors"
          >
            {isExpanded ? 'Less' : 'More'}
          </button>
        )}
      </div>

      {/* Selected Vibes Display */}
      {selectedVibeData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {selectedVibeData.map((vibe) => (
            <motion.div
              key={vibe.id}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${vibe.gradient} text-white text-xs font-medium flex items-center gap-1.5 shadow-sm`}
            >
              <span>{vibe.emoji}</span>
              <span>{vibe.name}</span>
              <button
                onClick={() => onVibeToggle(vibe.id)}
                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
              >
                <span className="text-xs">×</span>
              </button>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Vibe Selector */}
      <AnimatePresence>
        {(isExpanded || compact) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`grid gap-2 ${compact ? 'grid-cols-5' : 'grid-cols-3'}`}>
              {AVAILABLE_VIBES.map((vibe, index) => {
                const isSelected = selectedVibes.includes(vibe.id)
                const canSelect = selectedVibes.length < maxVibes || isSelected

                return (
                  <motion.button
                    key={vibe.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => canSelect && onVibeToggle(vibe.id)}
                    disabled={!canSelect}
                    className={`p-2 rounded-lg border-2 transition-all text-left group ${
                      isSelected
                        ? `border-purple-300 bg-gradient-to-r ${vibe.gradient} text-white shadow-md`
                        : canSelect
                        ? 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                        : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                    } ${compact ? 'aspect-square' : ''}`}
                  >
                    <div className={`flex items-center gap-2 ${compact ? 'flex-col' : ''}`}>
                      <div className={`flex items-center justify-center ${compact ? 'text-lg' : 'text-base'}`}>
                        {isSelected ? vibe.emoji : vibe.icon}
                      </div>
                      <div className={`flex-1 min-w-0 ${compact ? 'text-center' : ''}`}>
                        <div className={`font-medium ${compact ? 'text-xs' : 'text-sm'} ${
                          isSelected ? 'text-white' : 'text-gray-900'
                        }`}>
                          {vibe.name}
                        </div>
                        {!compact && (
                          <div className={`text-xs ${
                            isSelected ? 'text-white/80' : 'text-gray-500'
                          } line-clamp-1`}>
                            {vibe.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Vibe Suggestions */}
      {!isExpanded && !compact && selectedVibes.length === 0 && (
        <div className="flex flex-wrap gap-1.5">
          {AVAILABLE_VIBES.slice(0, 4).map((vibe) => (
            <button
              key={vibe.id}
              onClick={() => onVibeToggle(vibe.id)}
              className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1"
            >
              <span className="text-xs">{vibe.emoji}</span>
              <span>{vibe.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MoodVibeTracker
