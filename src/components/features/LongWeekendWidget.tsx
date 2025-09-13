import React, { useState, useEffect } from 'react'
import { Calendar, Clock, MapPin, ChevronRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiManager } from '../../services/externalApis'
import { useWeekendStore } from '../../store/weekendStore'

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

interface LongWeekendWidgetProps {
  onLongWeekendClick?: (holidays: Holiday[]) => void;
  theme: {
    colors: {
      primary: string;
      surface: string;
      border: string;
      text: string;
      textSecondary: string;
    }
  }
}

const LongWeekendWidget: React.FC<LongWeekendWidgetProps> = ({ 
  onLongWeekendClick, 
  theme 
}) => {
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([])
  const [isLongWeekend, setIsLongWeekend] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [nextLongWeekend, setNextLongWeekend] = useState<Holiday | null>(null)
  
  const { setUpcomingHolidays: updateStoreHolidays } = useWeekendStore()

  useEffect(() => {
    checkLongWeekendStatus()
  }, [])

  const checkLongWeekendStatus = async () => {
    try {
      setIsLoading(true)
      
      // Check if current weekend is long (India)
      const longWeekendResult = await apiManager.isLongWeekend('IN')
      setIsLongWeekend(longWeekendResult)
      
      // Get upcoming holidays for India
      const holidaysResult = await apiManager.getUpcomingHolidays('IN', 5)
      
      // Transform to correct format
      const transformedHolidays: Holiday[] = holidaysResult.map(h => ({
        date: h.date,
        localName: h.name || 'Holiday',
        name: h.name || 'Holiday',
        countryCode: h.country || 'IN'
      }))
      
      setUpcomingHolidays(transformedHolidays)
      
      // Update the main store with holiday data for calendar indicators
      updateStoreHolidays(transformedHolidays)
      
      // Find next long weekend opportunity
      if (transformedHolidays.length > 0) {
        // Logic to find which holiday creates a long weekend
        const nextHoliday = transformedHolidays.find(holiday => {
          const date = new Date(holiday.date)
          const dayOfWeek = date.getDay()
          // If holiday is Friday or Monday, it creates a long weekend
          return dayOfWeek === 1 || dayOfWeek === 5
        })
        setNextLongWeekend(nextHoliday || transformedHolidays[0])
      }
      
    } catch (error) {
      console.error('Holiday check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const getDaysUntilHoliday = (dateString: string) => {
    const today = new Date()
    const holiday = new Date(dateString)
    const diffTime = holiday.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleClick = () => {
    if (nextLongWeekend) {
      onLongWeekendClick?.(upcomingHolidays)
    }
  }

  if (isLoading) {
    return (
      <div 
        className="flex items-center gap-2 px-3 py-2 rounded-lg border animate-pulse"
        style={{
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        }}
      >
        <Calendar className="w-4 h-4 opacity-50" />
        <span className="text-sm text-opacity-50">Checking holidays...</span>
      </div>
    )
  }

  // Don't show if no upcoming holidays or long weekends
  if (!nextLongWeekend && !isLongWeekend) {
    return null
  }

  return (
    <motion.button
      onClick={handleClick}
      className="group relative overflow-hidden rounded-lg border transition-all duration-300 hover:scale-105 hover:shadow-lg"
      style={{
        backgroundColor: isLongWeekend 
          ? `${theme.colors.primary}15` 
          : theme.colors.surface,
        borderColor: isLongWeekend 
          ? theme.colors.primary 
          : theme.colors.border,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Background gradient for active long weekend */}
      {isLongWeekend && (
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.primary}, transparent)`
          }}
        />
      )}

      <div className="relative px-3 py-2 flex items-center gap-2">
        {/* Icon */}
        <div 
          className="p-1.5 rounded-md"
          style={{
            backgroundColor: isLongWeekend 
              ? `${theme.colors.primary}25` 
              : `${theme.colors.primary}10`,
          }}
        >
          {isLongWeekend ? (
            <Star className="w-4 h-4" style={{ color: theme.colors.primary }} />
          ) : (
            <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          {isLongWeekend ? (
            <>
              <div className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                🎉 Long Weekend!
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                Plan something special
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold" style={{ color: theme.colors.text }}>
                Next: {nextLongWeekend?.localName}
              </div>
              <div className="text-xs" style={{ color: theme.colors.textSecondary }}>
                {formatDate(nextLongWeekend!.date)} • {getDaysUntilHoliday(nextLongWeekend!.date)} days
              </div>
            </>
          )}
        </div>

        {/* Arrow indicator */}
        <ChevronRight 
          className="w-4 h-4 transition-transform group-hover:translate-x-0.5" 
          style={{ color: theme.colors.textSecondary }}
        />
      </div>

      {/* Hover tooltip */}
      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black text-white text-xs rounded pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        Click to plan long weekend
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
      </motion.div>
    </motion.button>
  )
}

export default LongWeekendWidget