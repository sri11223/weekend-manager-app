import React, { createContext, useContext } from 'react'
import { useWeather } from '../hooks/useWeather'
import { WeatherData, Location } from '../services/weatherApi'

interface WeatherContextType {
  current: WeatherData | null
  historical: WeatherData[]
  forecast: WeatherData[]
  all: WeatherData[]
  location: Location | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  setLocation: (location: Location) => void
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined)

export const useWeatherContext = () => {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeatherContext must be used within WeatherProvider')
  }
  return context
}

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const weatherData = useWeather({
    daysBack: 3,      // Get last 3 days
    daysForward: 7,   // Get next 7 days
    autoRefresh: true, // Auto-refresh every 30 minutes
    refreshInterval: 30 * 60 * 1000
  })

  return (
    <WeatherContext.Provider value={weatherData}>
      {children}
    </WeatherContext.Provider>
  )
}
