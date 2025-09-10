import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Eye, Droplets } from 'lucide-react'
import { useWeather } from '../../hooks/useWeather'
import { WeatherData } from '../../services/weatherApi'

const WeatherIcon: React.FC<{ weather: string; size?: number }> = ({ weather, size = 24 }) => {
  const iconProps = { size, className: 'text-current' }
  
  switch (weather.toLowerCase()) {
    case 'clear':
      return <Sun {...iconProps} />
    case 'clouds':
      return <Cloud {...iconProps} />
    case 'rain':
    case 'drizzle':
      return <CloudRain {...iconProps} />
    case 'snow':
      return <CloudSnow {...iconProps} />
    default:
      return <Cloud {...iconProps} />
  }
}

export const WeatherCard: React.FC<{ weather: WeatherData; showDetails?: boolean }> = ({ 
  weather, 
  showDetails = false 
}) => {
  return (
    <motion.div
      className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30"
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <WeatherIcon weather={weather.weather} size={32} />
          <div>
            <div className="text-2xl font-bold">{weather.temperature}°C</div>
            <div className="text-sm text-gray-600 capitalize">{weather.description}</div>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {weather.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
      </div>
      
      {showDetails && (
        <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <Droplets size={14} />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind size={14} />
            <span>{Math.round(weather.windSpeed)} m/s</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{weather.precipitation}mm</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export const WeatherTimeline: React.FC = () => {
  const { all, loading, error } = useWeather()

  if (loading) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="grid grid-cols-7 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-800">
        <p>Weather data unavailable: {error}</p>
      </div>
    )
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30">
      <h3 className="text-lg font-bold mb-4">Weather Timeline</h3>
      <div className="grid grid-cols-1 sm:grid-cols-7 gap-4">
        {all.map((weather, index) => (
          <WeatherCard key={index} weather={weather} />
        ))}
      </div>
    </div>
  )
}

export const CurrentWeather: React.FC = () => {
  const { current, loading, location } = useWeather()

  if (loading || !current) {
    return (
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 animate-pulse">
        <div className="h-20 bg-gray-300 rounded"></div>
      </div>
    )
  }

  return (
    <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
      <div className="flex items-center gap-3">
        <WeatherIcon weather={current.weather} size={48} />
        <div>
          <div className="text-3xl font-bold">{current.temperature}°C</div>
          <div className="text-sm text-gray-600 capitalize">{current.description}</div>
          {location && (
            <div className="text-xs text-gray-500">
              {location.city || `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
