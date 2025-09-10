import React from 'react'
import { motion } from 'framer-motion'

interface WeatherAnimationProps {
  weather: 'sunny' | 'rainy' | 'snowy' | 'cloudy'
  className?: string
}

export const WeatherAnimation: React.FC<WeatherAnimationProps> = ({ weather, className = '' }) => {
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

// Weather condition detector based on time and mock weather data
export const getWeatherForTimeSlot = (timeSlot: string, day: string): 'sunny' | 'rainy' | 'snowy' | 'cloudy' => {
  // Mock weather data - in real app, this would come from weather API
  const mockWeatherData: Record<string, Record<string, string>> = {
    saturday: {
      '6:00 AM': 'sunny',
      '7:00 AM': 'sunny',
      '8:00 AM': 'sunny',
      '9:00 AM': 'cloudy',
      '10:00 AM': 'cloudy',
      '11:00 AM': 'rainy',
      '12:00 PM': 'rainy',
      '1:00 PM': 'rainy',
      '2:00 PM': 'cloudy',
      '3:00 PM': 'sunny',
      '4:00 PM': 'sunny',
      '5:00 PM': 'sunny'
    },
    sunday: {
      '6:00 AM': 'cloudy',
      '7:00 AM': 'cloudy',
      '8:00 AM': 'sunny',
      '9:00 AM': 'sunny',
      '10:00 AM': 'sunny',
      '11:00 AM': 'sunny',
      '12:00 PM': 'sunny',
      '1:00 PM': 'cloudy',
      '2:00 PM': 'snowy',
      '3:00 PM': 'snowy',
      '4:00 PM': 'cloudy',
      '5:00 PM': 'cloudy'
    }
  }

  return (mockWeatherData[day]?.[timeSlot] as any) || 'sunny'
}

// Get dominant weather for entire day
export const getDayWeather = (day: string): 'sunny' | 'rainy' | 'snowy' | 'cloudy' => {
  const mockWeatherData: Record<string, Record<string, string>> = {
    saturday: {
      '6:00 AM': 'sunny',
      '7:00 AM': 'sunny',
      '8:00 AM': 'sunny',
      '9:00 AM': 'cloudy',
      '10:00 AM': 'cloudy',
      '11:00 AM': 'rainy',
      '12:00 PM': 'rainy',
      '1:00 PM': 'rainy',
      '2:00 PM': 'cloudy',
      '3:00 PM': 'sunny',
      '4:00 PM': 'sunny',
      '5:00 PM': 'sunny'
    },
    sunday: {
      '6:00 AM': 'cloudy',
      '7:00 AM': 'cloudy',
      '8:00 AM': 'sunny',
      '9:00 AM': 'sunny',
      '10:00 AM': 'sunny',
      '11:00 AM': 'sunny',
      '12:00 PM': 'sunny',
      '1:00 PM': 'cloudy',
      '2:00 PM': 'snowy',
      '3:00 PM': 'snowy',
      '4:00 PM': 'cloudy',
      '5:00 PM': 'cloudy'
    }
  }

  const dayData = mockWeatherData[day]
  if (!dayData) return 'sunny'

  // Count occurrences of each weather type
  const weatherCounts: Record<string, number> = {}
  Object.values(dayData).forEach(weather => {
    weatherCounts[weather] = (weatherCounts[weather] || 0) + 1
  })

  // Return the most frequent weather type
  const dominantWeather = Object.entries(weatherCounts)
    .sort(([,a], [,b]) => b - a)[0][0]

  return dominantWeather as 'sunny' | 'rainy' | 'snowy' | 'cloudy'
}
