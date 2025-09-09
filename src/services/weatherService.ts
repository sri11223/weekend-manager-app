import type { WeatherData, DayForecast } from '../types';

// Mock weather service - in a real app, you'd use OpenWeatherMap or similar API
export class WeatherService {
  private static instance: WeatherService;
  private cache: Map<string, { data: WeatherData; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(location: string = 'current'): Promise<WeatherData> {
    // Check cache first
    const cached = this.cache.get(location);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // In a real app, you'd make an API call here
      // For demo purposes, we'll simulate weather data
      const weatherData = this.generateMockWeather();
      
      // Cache the result
      this.cache.set(location, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      return this.getFallbackWeather();
    }
  }

  private generateMockWeather(): WeatherData {
    const conditions = ['sunny', 'partly cloudy', 'cloudy', 'rainy', 'stormy'];
    const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const baseTemp = 15 + Math.random() * 20; // 15-35°C

    const forecast: DayForecast[] = [];
    const days = ['Today', 'Tomorrow', 'Saturday', 'Sunday', 'Monday'];
    
    for (let i = 0; i < 5; i++) {
      forecast.push({
        day: days[i],
        high: Math.round(baseTemp + Math.random() * 10),
        low: Math.round(baseTemp - Math.random() * 5),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        precipitation: Math.random() * 100
      });
    }

    return {
      temperature: Math.round(baseTemp),
      condition: currentCondition,
      humidity: Math.round(40 + Math.random() * 40),
      windSpeed: Math.round(Math.random() * 20),
      forecast
    };
  }

  private getFallbackWeather(): WeatherData {
    return {
      temperature: 22,
      condition: 'partly cloudy',
      humidity: 65,
      windSpeed: 8,
      forecast: [
        { day: 'Today', high: 25, low: 18, condition: 'sunny', precipitation: 10 },
        { day: 'Tomorrow', high: 23, low: 16, condition: 'partly cloudy', precipitation: 20 },
        { day: 'Saturday', high: 26, low: 19, condition: 'sunny', precipitation: 5 },
        { day: 'Sunday', high: 24, low: 17, condition: 'cloudy', precipitation: 30 },
        { day: 'Monday', high: 22, low: 15, condition: 'rainy', precipitation: 80 }
      ]
    };
  }

  isGoodWeatherForOutdoor(weather: WeatherData): boolean {
    return weather.temperature > 15 && 
           !weather.condition.includes('rain') && 
           !weather.condition.includes('storm') &&
           weather.windSpeed < 25;
  }

  getWeatherRecommendation(weather: WeatherData): string {
    if (this.isGoodWeatherForOutdoor(weather)) {
      if (weather.temperature > 25) {
        return "Perfect weather for outdoor activities! Consider water sports or beach activities.";
      } else if (weather.temperature > 20) {
        return "Great weather for hiking, cycling, or outdoor dining.";
      } else {
        return "Good weather for light outdoor activities. Bring a light jacket.";
      }
    } else {
      if (weather.condition.includes('rain')) {
        return "Rainy weather - perfect for indoor activities like museums, cafes, or movie theaters.";
      } else if (weather.temperature < 10) {
        return "Cold weather - consider indoor activities or warm outdoor activities like hot springs.";
      } else {
        return "Weather might not be ideal for outdoor activities. Consider indoor alternatives.";
      }
    }
  }
}

export const weatherService = WeatherService.getInstance();
