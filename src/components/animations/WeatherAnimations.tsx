import React from 'react'
import { motion } from 'framer-motion'

interface WeatherAnimationProps {
  weather: 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'clear-night' | 'partly-cloudy-night'
  timeSlot: string
  className?: string
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ 
  weather, 
  timeSlot,
  className = '' 
}) => {
  const renderAnimation = () => {
    switch (weather) {
      case 'sunny':
        return <SunnyAnimation />
      case 'rainy':
        return <RainyAnimation />
      case 'snowy':
        return <SnowyAnimation />
      case 'cloudy':
        return <CloudyAnimation />
      case 'clear-night':
        return <ClearNightAnimation />
      case 'partly-cloudy-night':
        return <PartlyCloudyNightAnimation />
      default:
        return null
    }
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {renderAnimation()}
    </div>
  )
}

const SunnyAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Sun rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-4 bg-yellow-400 opacity-60"
          style={{
            top: '20%',
            right: '20%',
            transformOrigin: 'bottom center',
            transform: `rotate(${i * 45}deg)`
          }}
          animate={{
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1
          }}
        />
      ))}
      
      {/* Sun */}
      <motion.div
        className="absolute w-6 h-6 bg-yellow-400 rounded-full top-4 right-4 shadow-lg"
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: [
            '0 0 10px rgba(251, 191, 36, 0.5)',
            '0 0 20px rgba(251, 191, 36, 0.8)',
            '0 0 10px rgba(251, 191, 36, 0.5)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      />
    </div>
  )
}

const RainyAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Rain drops */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-4 bg-blue-400 opacity-70 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          animate={{
            y: [0, 120],
            opacity: [0, 0.7, 0]
          }}
          transition={{
            duration: 1 + Math.random() * 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Cloud */}
      <motion.div
        className="absolute top-2 right-4 w-8 h-4 bg-gray-400 rounded-full opacity-80"
        animate={{
          x: [0, 5, 0],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      >
        <div className="absolute -left-2 top-1 w-4 h-3 bg-gray-400 rounded-full" />
        <div className="absolute -right-1 top-0.5 w-3 h-3 bg-gray-400 rounded-full" />
      </motion.div>
    </div>
  )
}

const SnowyAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Snowflakes */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-80"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10px'
          }}
          animate={{
            y: [0, 120],
            x: [0, Math.random() * 20 - 10],
            rotate: [0, 360],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: 'easeInOut'
          }}
        />
      ))}
      
      {/* Snow cloud */}
      <motion.div
        className="absolute top-2 right-4 w-8 h-4 bg-gray-300 rounded-full opacity-70"
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity
        }}
      >
        <div className="absolute -left-2 top-1 w-4 h-3 bg-gray-300 rounded-full" />
        <div className="absolute -right-1 top-0.5 w-3 h-3 bg-gray-300 rounded-full" />
      </motion.div>
    </div>
  )
}

const CloudyAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Multiple clouds */}
      <motion.div
        className="absolute top-2 right-6 w-6 h-3 bg-gray-300 rounded-full opacity-60"
        animate={{
          x: [0, 10, 0],
          opacity: [0.4, 0.7, 0.4]
        }}
        transition={{
          duration: 5,
          repeat: Infinity
        }}
      >
        <div className="absolute -left-1 top-0.5 w-3 h-2 bg-gray-300 rounded-full" />
        <div className="absolute -right-0.5 top-0 w-2 h-2 bg-gray-300 rounded-full" />
      </motion.div>
      
      <motion.div
        className="absolute top-4 right-2 w-4 h-2 bg-gray-400 rounded-full opacity-50"
        animate={{
          x: [0, -8, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          delay: 1
        }}
      >
        <div className="absolute -left-1 top-0 w-2 h-1.5 bg-gray-400 rounded-full" />
      </motion.div>
    </div>
  )
}

const ClearNightAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Moon */}
      <motion.div
        className="absolute w-5 h-5 bg-gray-100 rounded-full top-4 right-4 shadow-lg"
        style={{
          boxShadow: '0 0 15px rgba(229, 231, 235, 0.6), inset -2px -2px 0 rgba(156, 163, 175, 0.3)'
        }}
        animate={{
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 15px rgba(229, 231, 235, 0.6), inset -2px -2px 0 rgba(156, 163, 175, 0.3)',
            '0 0 20px rgba(229, 231, 235, 0.8), inset -2px -2px 0 rgba(156, 163, 175, 0.4)',
            '0 0 15px rgba(229, 231, 235, 0.6), inset -2px -2px 0 rgba(156, 163, 175, 0.3)'
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity
        }}
      />
      
      {/* Stars */}
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-gray-200 rounded-full"
          style={{
            top: `${15 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 70}%`,
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5
          }}
        />
      ))}
    </div>
  )
}

const PartlyCloudyNightAnimation: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Moon behind clouds */}
      <motion.div
        className="absolute w-5 h-5 bg-gray-100 rounded-full top-3 right-6 opacity-60"
        style={{
          boxShadow: '0 0 10px rgba(229, 231, 235, 0.4)'
        }}
        animate={{
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity
        }}
      />
      
      {/* Night clouds */}
      <motion.div
        className="absolute w-8 h-3 bg-gray-400 rounded-full top-4 right-4 opacity-40"
        animate={{
          x: [-2, 2, -2],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity
        }}
      />
      
      {/* Few visible stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-gray-300 rounded-full"
          style={{
            top: `${20 + i * 20}%`,
            left: `${15 + i * 25}%`,
          }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1
          }}
        />
      ))}
    </div>
  )
}

// Enhanced weather system with date-based realistic patterns
export const getWeatherForTimeSlot = (timeSlot: string, day: string, selectedDate?: Date): 'sunny' | 'rainy' | 'snowy' | 'cloudy' | 'clear-night' | 'partly-cloudy-night' => {
  const hour = parseInt(timeSlot.split(':')[0])
  const isPM = timeSlot.includes('PM')
  const hour24 = isPM && hour !== 12 ? hour + 12 : (!isPM && hour === 12 ? 0 : hour)
  
  // Determine if it's night time (6 PM - 6 AM)
  const isNightTime = hour24 >= 18 || hour24 < 6
  
  // Get date-based weather pattern (more realistic than random)
  const currentDate = selectedDate || new Date()
  const dateStr = currentDate.toISOString().split('T')[0] // YYYY-MM-DD
  const dateHash = hashString(dateStr + day + timeSlot) // Create consistent hash for this date/time
  
  // Get base weather pattern for this date
  const baseWeather = getDateBasedWeather(currentDate, dateHash)
  
  // If night time, convert to night variants
  if (isNightTime) {
    return convertToNightWeather(baseWeather, dateHash)
  }
  
  return baseWeather
}

// Create consistent hash from string for deterministic weather
const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// Get realistic weather based on date and season
const getDateBasedWeather = (date: Date, hash: number): 'sunny' | 'rainy' | 'snowy' | 'cloudy' => {
  const month = date.getMonth() + 1 // 1-12
  const day = date.getDate()
  
  // Seasonal weather patterns
  let weatherProbabilities = { sunny: 40, cloudy: 30, rainy: 25, snowy: 5 }
  
  // Winter (Dec, Jan, Feb) - more snow and clouds
  if (month === 12 || month <= 2) {
    weatherProbabilities = { sunny: 20, cloudy: 35, rainy: 20, snowy: 25 }
  }
  // Spring (Mar, Apr, May) - more rainy days
  else if (month >= 3 && month <= 5) {
    weatherProbabilities = { sunny: 35, cloudy: 25, rainy: 35, snowy: 5 }
  }
  // Summer (Jun, Jul, Aug) - mostly sunny
  else if (month >= 6 && month <= 8) {
    weatherProbabilities = { sunny: 60, cloudy: 20, rainy: 15, snowy: 5 }
  }
  // Fall (Sep, Oct, Nov) - mixed with more clouds
  else if (month >= 9 && month <= 11) {
    weatherProbabilities = { sunny: 30, cloudy: 40, rainy: 25, snowy: 5 }
  }
  
  // Create day-specific consistency (same weather pattern for the day)
  const dayHash = hash % 100
  
  if (dayHash < weatherProbabilities.sunny) return 'sunny'
  if (dayHash < weatherProbabilities.sunny + weatherProbabilities.cloudy) return 'cloudy'  
  if (dayHash < weatherProbabilities.sunny + weatherProbabilities.cloudy + weatherProbabilities.rainy) return 'rainy'
  return 'snowy'
}

// Convert day weather to night weather
const convertToNightWeather = (dayWeather: string, hash: number): 'clear-night' | 'partly-cloudy-night' => {
  const nightHash = hash % 100
  
  switch (dayWeather) {
    case 'sunny':
      return 'clear-night'
    case 'cloudy':
      return 'partly-cloudy-night'
    case 'rainy':
      // Night rain becomes partly cloudy night (rain stops at night often)
      return nightHash > 60 ? 'clear-night' : 'partly-cloudy-night'
    case 'snowy':
      return 'partly-cloudy-night'
    default:
      return 'clear-night'
  }
}

// Get dominant weather for entire day (updated for new system)
export const getDayWeather = (day: string, selectedDate?: Date): 'sunny' | 'rainy' | 'snowy' | 'cloudy' => {
  const currentDate = selectedDate || new Date()
  const dateStr = currentDate.toISOString().split('T')[0]
  const dateHash = hashString(dateStr + day)
  
  return getDateBasedWeather(currentDate, dateHash)
}
