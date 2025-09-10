interface WeatherData {
    date: Date
    temperature: number
    feelsLike: number
    weather: string
    description: string
    icon: string
    humidity: number
    windSpeed: number
    precipitation: number
  }
  
  interface Location {
    lat: number
    lon: number
    city?: string
    country?: string
  }
  
  class FreeWeatherService {
    private baseUrl = 'https://api.open-meteo.com/v1'
    private cache: Map<string, { data: any; timestamp: number }> = new Map()
    private cacheDuration = 10 * 60 * 1000 // 10 minutes
  
    private getFromCache(key: string) {
      const cached = this.cache.get(key)
      if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
        return cached.data
      }
      return null
    }
  
    private saveToCache(key: string, data: any) {
      this.cache.set(key, { data, timestamp: Date.now() })
    }
  
    private getWeatherDescription(code: number): { weather: string; description: string; icon: string } {
      const weatherMap: { [key: number]: { weather: string; description: string; icon: string } } = {
        0: { weather: 'Clear', description: 'Clear sky', icon: '01d' },
        1: { weather: 'Clear', description: 'Mainly clear', icon: '01d' },
        2: { weather: 'Clouds', description: 'Partly cloudy', icon: '02d' },
        3: { weather: 'Clouds', description: 'Overcast', icon: '03d' },
        45: { weather: 'Mist', description: 'Fog', icon: '50d' },
        48: { weather: 'Mist', description: 'Depositing rime fog', icon: '50d' },
        51: { weather: 'Drizzle', description: 'Light drizzle', icon: '09d' },
        53: { weather: 'Drizzle', description: 'Moderate drizzle', icon: '09d' },
        55: { weather: 'Drizzle', description: 'Dense drizzle', icon: '09d' },
        61: { weather: 'Rain', description: 'Slight rain', icon: '10d' },
        63: { weather: 'Rain', description: 'Moderate rain', icon: '10d' },
        65: { weather: 'Rain', description: 'Heavy rain', icon: '10d' },
        80: { weather: 'Rain', description: 'Slight rain showers', icon: '09d' },
        81: { weather: 'Rain', description: 'Moderate rain showers', icon: '09d' },
        82: { weather: 'Rain', description: 'Violent rain showers', icon: '09d' },
        95: { weather: 'Thunderstorm', description: 'Thunderstorm', icon: '11d' },
      }
      
      return weatherMap[code] || { weather: 'Unknown', description: 'Unknown conditions', icon: '01d' }
    }
  
    private formatWeatherData(data: any, index: number = 0): WeatherData {
      const weatherInfo = this.getWeatherDescription(data.weather_code?.[index] || data.weather_code || 0)
      
      return {
        date: new Date(data.time?.[index] || data.time || Date.now()),
        temperature: Math.round(data.temperature_2m?.[index] || data.temperature_2m || 0),
        feelsLike: Math.round(data.apparent_temperature?.[index] || data.apparent_temperature || 0),
        weather: weatherInfo.weather,
        description: weatherInfo.description,
        icon: weatherInfo.icon,
        humidity: data.relative_humidity_2m?.[index] || data.relative_humidity_2m || 0,
        windSpeed: data.wind_speed_10m?.[index] || data.wind_speed_10m || 0,
        precipitation: data.precipitation?.[index] || data.precipitation || 0
      }
    }
  
    async getCurrentWeather(location: Location): Promise<WeatherData> {
      const cacheKey = `current-${location.lat}-${location.lon}`
      const cached = this.getFromCache(cacheKey)
      if (cached) return this.formatWeatherData(cached.current)
  
      try {
        const response = await fetch(
          `${this.baseUrl}/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,apparent_temperature,weather_code,relative_humidity_2m,wind_speed_10m,precipitation&timezone=auto`
        )
        
        if (!response.ok) throw new Error('Weather API request failed')
        
        const data = await response.json()
        this.saveToCache(cacheKey, data)
        
        return this.formatWeatherData(data.current)
      } catch (error) {
        console.error('Error fetching current weather:', error)
        throw new Error('Failed to fetch current weather')
      }
    }
  
    // SIMPLIFIED: Skip historical data to avoid 404 errors
    async getHistoricalWeather(location: Location, daysBack: number = 1): Promise<WeatherData[]> {
      console.log('Historical weather skipped to avoid API errors')
      return [] // Return empty array - no historical data for now
    }
  
    async getForecastWeather(location: Location, daysForward: number = 7): Promise<WeatherData[]> {
      const cacheKey = `forecast-${location.lat}-${location.lon}`
      let data = this.getFromCache(cacheKey)
      
      if (!data) {
        try {
          const response = await fetch(
            `${this.baseUrl}/forecast?latitude=${location.lat}&longitude=${location.lon}&daily=temperature_2m_max,apparent_temperature_max,weather_code,relative_humidity_2m_mean,wind_speed_10m_max,precipitation_sum&timezone=auto&forecast_days=${Math.min(daysForward, 16)}`
          )
          
          if (!response.ok) throw new Error('Forecast API request failed')
          
          const result = await response.json()
          data = result.daily
          this.saveToCache(cacheKey, data)
        } catch (error) {
          console.error('Error fetching forecast weather:', error)
          throw new Error('Failed to fetch weather forecast')
        }
      }
      
      const results: WeatherData[] = []
      const maxDays = Math.min(daysForward, data.time?.length || 0)
      
      for (let i = 0; i < maxDays; i++) {
        results.push(this.formatWeatherData({
          time: data.time[i],
          temperature_2m: data.temperature_2m_max[i],
          apparent_temperature: data.apparent_temperature_max[i],
          weather_code: data.weather_code[i],
          relative_humidity_2m: data.relative_humidity_2m_mean[i],
          wind_speed_10m: data.wind_speed_10m_max[i],
          precipitation: data.precipitation_sum[i]
        }))
      }
      
      return results
    }
  
    async getComprehensiveWeather(
      location: Location, 
      daysBack: number = 0, // Skip historical  
      daysForward: number = 7
    ) {
      try {
        const [current, forecast] = await Promise.all([
          this.getCurrentWeather(location),
          daysForward > 0 ? this.getForecastWeather(location, daysForward) : Promise.resolve([])
        ])
  
        return {
          current,
          historical: [], // No historical data
          forecast,
          all: [current, ...forecast] // Only current + forecast
        }
      } catch (error) {
        console.error('Error fetching comprehensive weather:', error)
        throw error
      }
    }
  
    async getCurrentLocation(): Promise<Location> {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported'))
          return
        }
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            })
          },
          (error) => {
            console.warn('Geolocation failed, using default location:', error)
            resolve({ lat: 40.7128, lon: -74.0060, city: 'New York', country: 'US' })
          },
          { timeout: 10000, enableHighAccuracy: false }
        )
      })
    }
  
    getThemeFromWeather(weather: string): string {
      const weatherLower = weather.toLowerCase()
      
      if (weatherLower.includes('rain') || weatherLower.includes('drizzle') || weatherLower.includes('thunderstorm')) {
        return 'rainy'
      } else if (weatherLower.includes('cloud') || weatherLower.includes('overcast') || weatherLower.includes('mist')) {
        return 'cloudy'
      } else if (weatherLower.includes('clear') || weatherLower.includes('sun')) {
        return 'sunny'
      } else {
        return 'cloudy'
      }
    }
  
    clearCache() {
      this.cache.clear()
    }
  }
  
  export const weatherService = new FreeWeatherService()
  export type { WeatherData, Location }
  