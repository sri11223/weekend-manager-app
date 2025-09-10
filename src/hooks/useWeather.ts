import { useState, useEffect, useCallback } from 'react'
import { weatherService, WeatherData, Location } from '../services/weatherApi'

interface UseWeatherOptions {
  daysBack?: number
  daysForward?: number
  autoRefresh?: boolean
  refreshInterval?: number
}

interface UseWeatherReturn {
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

export const useWeather = (options: UseWeatherOptions = {}): UseWeatherReturn => {
  const {
    daysBack = 2,
    daysForward = 7,
    autoRefresh = true,
    refreshInterval = 30 * 60 * 1000 // 30 minutes
  } = options

  const [current, setCurrent] = useState<WeatherData | null>(null)
  const [historical, setHistorical] = useState<WeatherData[]>([])
  const [forecast, setForecast] = useState<WeatherData[]>([])
  const [all, setAll] = useState<WeatherData[]>([])
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeatherData = useCallback(async (targetLocation?: Location) => {
    try {
      setLoading(true)
      setError(null)

      const weatherLocation = targetLocation || location || await weatherService.getCurrentLocation()
      
      if (!location && weatherLocation) {
        setLocation(weatherLocation)
      }

      const weatherData = await weatherService.getComprehensiveWeather(
        weatherLocation,
        daysBack,
        daysForward
      )

      setCurrent(weatherData.current)
      setHistorical(weatherData.historical)
      setForecast(weatherData.forecast)
      setAll(weatherData.all)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [location, daysBack, daysForward])

  useEffect(() => {
    fetchWeatherData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchWeatherData()
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchWeatherData])

  const refetch = useCallback(() => {
    return fetchWeatherData()
  }, [fetchWeatherData])

  const updateLocation = useCallback((newLocation: Location) => {
    setLocation(newLocation)
    fetchWeatherData(newLocation)
  }, [fetchWeatherData])

  return {
    current,
    historical,
    forecast,
    all,
    location,
    loading,
    error,
    refetch,
    setLocation: updateLocation
  }
}
