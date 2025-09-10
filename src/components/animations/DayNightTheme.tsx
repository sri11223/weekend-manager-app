import React from 'react'
import { motion } from 'framer-motion'

interface DayNightThemeProps {
  timeSlot: string
  className?: string
}

export const getDayNightTheme = (timeSlot: string) => {
  const hour = parseInt(timeSlot.split(':')[0])
  const isPM = timeSlot.includes('PM')
  const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour)

  if (hour24 >= 6 && hour24 < 12) {
    return 'morning'
  } else if (hour24 >= 12 && hour24 < 15) {
    return 'afternoon'
  } else if (hour24 >= 15 && hour24 < 18) {
    return 'evening'
  } else {
    return 'night'
  }
}

export const getDayNightColors = (period: string, baseTheme: any) => {
  switch (period) {
    case 'morning':
      return {
        background: `linear-gradient(135deg, 
          ${baseTheme.colors.surface}98, 
          rgba(251, 191, 36, 0.08), 
          ${baseTheme.colors.primary}05)`,
        border: baseTheme.colors.border,
        shadow: `0 8px 32px ${baseTheme.colors.primary}15, 0 4px 16px rgba(251, 191, 36, 0.1)`,
        overlay: 'rgba(251, 191, 36, 0.03)'
      }
    case 'afternoon':
      return {
        background: `linear-gradient(135deg, 
          ${baseTheme.colors.surface}98, 
          rgba(234, 179, 8, 0.06), 
          ${baseTheme.colors.primary}05)`,
        border: baseTheme.colors.border,
        shadow: `0 8px 32px ${baseTheme.colors.primary}15, 0 4px 16px rgba(234, 179, 8, 0.08)`,
        overlay: 'rgba(234, 179, 8, 0.02)'
      }
    case 'evening':
      return {
        background: `linear-gradient(135deg, 
          ${baseTheme.colors.surface}98, 
          rgba(234, 88, 12, 0.08), 
          ${baseTheme.colors.secondary}05)`,
        border: baseTheme.colors.border,
        shadow: `0 8px 32px ${baseTheme.colors.secondary}15, 0 4px 16px rgba(234, 88, 12, 0.1)`,
        overlay: 'rgba(234, 88, 12, 0.03)'
      }
    case 'night':
      return {
        background: `linear-gradient(135deg, 
          ${baseTheme.colors.surface}98, 
          rgba(30, 41, 59, 0.1), 
          ${baseTheme.colors.primary}08)`,
        border: baseTheme.colors.border,
        shadow: `0 8px 32px ${baseTheme.colors.primary}20, 0 4px 16px rgba(30, 41, 59, 0.08)`,
        overlay: 'rgba(30, 41, 59, 0.04)'
      }
    default:
      return {
        background: `linear-gradient(135deg, ${baseTheme.colors.surface}95, ${baseTheme.colors.primary}10)`,
        border: baseTheme.colors.border,
        shadow: `0 8px 32px ${baseTheme.colors.primary}20`,
        overlay: 'rgba(0,0,0,0.05)'
      }
  }
}

export const DayNightBackground: React.FC<DayNightThemeProps> = ({ 
  timeSlot, 
  className = '' 
}) => {
  const period = getDayNightTheme(timeSlot)

  const renderBackground = () => {
    switch (period) {
      case 'morning':
        return <MorningBackground />
      case 'afternoon':
        return <AfternoonBackground />
      case 'evening':
        return <EveningBackground />
      case 'night':
        return <NightBackground />
      default:
        return null
    }
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {renderBackground()}
    </div>
  )
}

const MorningBackground: React.FC = () => (
  <div className="absolute inset-0">
      {/* Subtle morning glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-100/8 via-yellow-50/5 to-transparent" />
    
    {/* Gentle light particles */}
    {[...Array(4)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-0.5 bg-amber-200/30 rounded-full"
        style={{
          left: `${25 + i * 15}%`,
          top: `${40 + (i % 2) * 20}%`,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 4 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
)

const AfternoonBackground: React.FC = () => (
  <div className="absolute inset-0">
    {/* Subtle daylight glow */}
    <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/6 via-amber-25/4 to-transparent" />
    
    {/* Minimal light dots */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-0.5 bg-yellow-200/25 rounded-full"
        style={{
          left: `${30 + i * 20}%`,
          top: `${35 + i * 10}%`,
        }}
        animate={{
          opacity: [0.15, 0.3, 0.15],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          delay: i * 0.5,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
)

const EveningBackground: React.FC = () => (
  <div className="absolute inset-0">
    {/* Subtle evening warmth */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100/6 via-red-50/4 to-transparent" />
    
    {/* Gentle warm glow */}
    {[...Array(2)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-orange-200/20 rounded-full"
        style={{
          left: `${40 + i * 20}%`,
          top: `${45 + i * 10}%`,
        }}
        animate={{
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: i * 1,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
)

const NightBackground: React.FC = () => (
  <div className="absolute inset-0">
    {/* Subtle night atmosphere */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/4 via-slate-50/2 to-transparent" />
    
    {/* Minimal stars */}
    {[...Array(3)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-0.5 h-0.5 bg-slate-200/30 rounded-full"
        style={{
          left: `${30 + i * 25}%`,
          top: `${30 + i * 15}%`,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          delay: i * 0.8,
          ease: "easeInOut",
        }}
      />
    ))}
  </div>
)

export default DayNightBackground
