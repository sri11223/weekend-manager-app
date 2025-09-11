import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiManager } from '../../services/externalApis'

interface Holiday {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
}

interface LongWeekendBannerProps {
  onClose?: () => void;
}

const LongWeekendBanner: React.FC<LongWeekendBannerProps> = ({ onClose }) => {
  const [isLongWeekend, setIsLongWeekend] = useState(false)
  const [upcomingHolidays, setUpcomingHolidays] = useState<Holiday[]>([])
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

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
      const holidaysResult = await apiManager.getUpcomingHolidays('IN', 3)
      setUpcomingHolidays(holidaysResult)
      
      console.log('🏖️ Long weekend check:', longWeekendResult)
      console.log('📅 Upcoming holidays:', holidaysResult)
      
    } catch (error) {
      console.error('Holiday check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getNextHoliday = () => {
    if (upcomingHolidays.length === 0) return null
    return upcomingHolidays[0]
  }

  const nextHoliday = getNextHoliday()

  // Don't show if not visible or if no relevant info
  if (!isVisible || (!isLongWeekend && !nextHoliday)) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mb-6"
      >
        {/* Long Weekend Banner */}
        {isLongWeekend && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6 text-white shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12" />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">🏖️ Long Weekend Detected!</h3>
                  <p className="text-white/90 text-sm">Perfect time for extended adventures</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>Extended trip opportunities available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>3-4 day weekend plans recommended</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium">💡 Tip: Check out our Trip Planning section for weekend getaways!</p>
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Holiday Info */}
        {nextHoliday && !isLongWeekend && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 p-6 text-white shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full translate-x-14 -translate-y-14" />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">📅 Next Holiday: {nextHoliday.localName}</h3>
                  <p className="text-white/90 text-sm">{formatDate(nextHoliday.date)} • Start planning ahead!</p>
                </div>
              </div>

              {upcomingHolidays.length > 1 && (
                <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                  <p className="text-sm font-medium mb-2">🗓️ Coming up:</p>
                  <div className="space-y-1">
                    {upcomingHolidays.slice(1, 3).map((holiday, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{holiday.localName}</span>
                        <span className="text-white/80">{formatDate(holiday.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-400 to-gray-500 p-6 text-white shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Calendar className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold">🔍 Checking for long weekends...</h3>
                <p className="text-white/90 text-sm">Fetching holiday information</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default LongWeekendBanner
