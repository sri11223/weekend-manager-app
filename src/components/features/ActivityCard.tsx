import React from 'react'
import { cn } from '@/utils/cn'
import type { Activity } from '@/types'
import { motion } from 'framer-motion'
import { CATEGORY_COLORS, COST_COLORS } from '@/constants'
import { Clock, MapPin, Zap, DollarSign } from 'lucide-react'

interface ActivityCardProps {
  activity: Activity
  isDragging?: boolean
  isSelected?: boolean
  onSelect?: (activity: Activity) => void
  size?: 'sm' | 'md' | 'lg'
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isDragging = false,
  isSelected = false,
  onSelect,
  size = 'md'
}) => {
  const categoryColor = CATEGORY_COLORS[activity.category] || CATEGORY_COLORS.indoor

  return (
    <motion.div
      whileHover={!isDragging ? { y: -8, scale: 1.02 } : {}}
      whileTap={!isDragging ? { scale: 0.98 } : {}}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className={cn({
        'opacity-30 rotate-3 scale-105': isDragging
      })}
    >
      <div
        className={cn(
          // Glassmorphism base
          'relative overflow-hidden cursor-pointer group',
          'bg-white/80 backdrop-blur-xl',
          'border border-white/20',
          'rounded-3xl',
          'shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
          'hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
          'transition-all duration-500 ease-out',
          
          // Selection state
          {
            'ring-4 ring-blue-400/50 ring-offset-2 ring-offset-white/50': isSelected,
            'bg-gradient-to-br from-white/90 to-white/70': !isSelected,
            'bg-gradient-to-br from-blue-50/90 to-white/80': isSelected
          },
          
          // Size variants
          {
            'p-4': size === 'sm',
            'p-6': size === 'md',
            'p-8': size === 'lg'
          }
        )}
        style={{
          background: isSelected 
            ? `linear-gradient(135deg, ${categoryColor}15, rgba(255,255,255,0.8))`
            : undefined
        }}
        onClick={() => onSelect?.(activity)}
      >
        {/* Gradient overlay for selected state */}
        {isSelected && (
          <div 
            className="absolute inset-0 opacity-20 rounded-3xl"
            style={{
              background: `linear-gradient(135deg, ${categoryColor}40, transparent)`
            }}
          />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {/* Header with icon and category */}
          <div className="flex items-start justify-between mb-4">
            <div 
              className="p-3 rounded-2xl shadow-lg transform group-hover:scale-110 transition-transform duration-300"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <span className="text-3xl block">{activity.icon}</span>
            </div>
            
            <div className="text-right">
              <span 
                className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg"
                style={{ backgroundColor: categoryColor }}
              >
                {activity.category}
              </span>
            </div>
          </div>

          {/* Title and description */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
              {activity.name}
            </h3>
            {size !== 'sm' && (
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                {activity.description}
              </p>
            )}
          </div>

          {/* Metadata badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              <Clock className="w-3 h-3" />
              {activity.duration}m
            </div>
            
            <div 
              className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
              style={{ backgroundColor: COST_COLORS[activity.cost] }}
            >
              <DollarSign className="w-3 h-3" />
              {activity.cost}
            </div>

            <div className="flex items-center gap-1 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
              <Zap className="w-3 h-3" />
              {activity.mood}
            </div>
          </div>

          {/* Location and indoor/outdoor */}
          {size !== 'sm' && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              {activity.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span className="truncate">{activity.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  {activity.indoor ? '🏠 Indoor' : '🌳 Outdoor'}
                </span>
                {activity.weatherDependent && (
                  <span className="text-amber-600">☀️</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute top-4 left-4">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
      </div>
    </motion.div>
  )
}
