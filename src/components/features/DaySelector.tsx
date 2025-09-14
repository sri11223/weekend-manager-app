import React, { useState } from 'react'
import { Calendar, Sun, Moon, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '../../hooks/useTheme'

interface DaySelectorProps {
  selectedWeekend?: { saturday: Date; sunday: Date }
  onWeekendChange?: (weekend: { saturday: Date; sunday: Date }) => void
  className?: string
}

export const DaySelector: React.FC<DaySelectorProps> = ({ 
  selectedWeekend, 
  onWeekendChange,
  className = ''
}) => {
  const { currentTheme } = useTheme()
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday')

  // Get current weekend if not provided
  const weekend = selectedWeekend || (() => {
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
  })()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const navigateWeekend = (direction: 'prev' | 'next') => {
    const newSaturday = new Date(weekend.saturday)
    const newSunday = new Date(weekend.sunday)
    
    if (direction === 'prev') {
      newSaturday.setDate(newSaturday.getDate() - 7)
      newSunday.setDate(newSunday.getDate() - 7)
    } else {
      newSaturday.setDate(newSaturday.getDate() + 7)
      newSunday.setDate(newSunday.getDate() + 7)
    }
    
    const newWeekend = { saturday: newSaturday, sunday: newSunday }
    onWeekendChange?.(newWeekend)
  }

  return (
    <div className={`day-selector ${className}`}>
      {/* Weekend Navigator */}
      <div className="weekend-navigator" style={{ 
        background: `linear-gradient(135deg, ${currentTheme.colors.surface}, ${currentTheme.colors.background})`,
        borderColor: currentTheme.colors.border 
      }}>
        <button
          onClick={() => navigateWeekend('prev')}
          className="nav-btn"
          style={{ color: currentTheme.colors.primary }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="weekend-info">
          <Calendar className="w-4 h-4" style={{ color: currentTheme.colors.primary }} />
          <span className="weekend-range" style={{ color: currentTheme.colors.text }}>
            {formatDate(weekend.saturday)} - {formatDate(weekend.sunday)}
          </span>
        </div>
        
        <button
          onClick={() => navigateWeekend('next')}
          className="nav-btn"
          style={{ color: currentTheme.colors.primary }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day Toggle */}
      <div className="day-toggle" style={{ 
        background: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }}>
        <motion.button
          onClick={() => setSelectedDay('saturday')}
          className={`day-btn ${selectedDay === 'saturday' ? 'active' : ''}`}
          style={{
            background: selectedDay === 'saturday' ? 
              `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` : 
              'transparent',
            color: selectedDay === 'saturday' ? 'white' : currentTheme.colors.textSecondary
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="day-icon">
            <Sun className="w-5 h-5" />
          </div>
          <div className="day-content">
            <span className="day-name">Saturday</span>
            <span className="day-date">{formatDate(weekend.saturday)}</span>
          </div>
          {selectedDay === 'saturday' && (
            <motion.div 
              className="active-indicator"
              layoutId="activeDay"
              style={{ background: 'white' }}
            />
          )}
        </motion.button>
        
        <motion.button
          onClick={() => setSelectedDay('sunday')}
          className={`day-btn ${selectedDay === 'sunday' ? 'active' : ''}`}
          style={{
            background: selectedDay === 'sunday' ? 
              `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})` : 
              'transparent',
            color: selectedDay === 'sunday' ? 'white' : currentTheme.colors.textSecondary
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="day-icon">
            <Moon className="w-5 h-5" />
          </div>
          <div className="day-content">
            <span className="day-name">Sunday</span>
            <span className="day-date">{formatDate(weekend.sunday)}</span>
          </div>
          {selectedDay === 'sunday' && (
            <motion.div 
              className="active-indicator"
              layoutId="activeDay"
              style={{ background: 'white' }}
            />
          )}
        </motion.button>
      </div>

      {/* Selected Day Info */}
      <div className="selected-day-info" style={{ 
        background: `${currentTheme.colors.primary}10`,
        borderColor: `${currentTheme.colors.primary}30` 
      }}>
        <div className="info-content">
          <span className="info-label" style={{ color: currentTheme.colors.textSecondary }}>
            Planning for
          </span>
          <span className="info-value" style={{ color: currentTheme.colors.text }}>
            {selectedDay === 'saturday' ? 'Saturday' : 'Sunday'} - {formatDate(selectedDay === 'saturday' ? weekend.saturday : weekend.sunday)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default DaySelector