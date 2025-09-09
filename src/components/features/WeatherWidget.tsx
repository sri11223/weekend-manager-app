import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, RefreshCw } from 'lucide-react';
import { weatherService } from '../../services/weatherService';
import { useWeekendStore } from '../../store/useWeekendStore';
import { cn } from '../../utils/cn';

export const WeatherWidget: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { weather, setWeather } = useWeekendStore();

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const weatherData = await weatherService.getCurrentWeather();
      setWeather(weatherData);
    } catch (error) {
      console.error('Failed to fetch weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!weather) {
      fetchWeather();
    }
  }, [weather]);

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('sunny') || condition.includes('clear')) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    } else if (condition.includes('rain') || condition.includes('storm')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else {
      return <Cloud className="w-8 h-8 text-gray-500" />;
    }
  };

  const getWeatherGradient = (condition: string) => {
    if (condition.includes('sunny')) {
      return 'from-yellow-400 to-orange-500';
    } else if (condition.includes('rain')) {
      return 'from-blue-400 to-blue-600';
    } else if (condition.includes('cloud')) {
      return 'from-gray-400 to-gray-600';
    } else {
      return 'from-blue-400 to-purple-500';
    }
  };

  if (!weather) {
    return (
      <Card className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded"></div>
      </Card>
    );
  }

  const recommendation = weatherService.getWeatherRecommendation(weather);
  const isGoodWeather = weatherService.isGoodWeatherForOutdoor(weather);

  return (
    <Card className="overflow-hidden">
      <div className={cn(
        'bg-gradient-to-r p-4 text-white relative',
        getWeatherGradient(weather.condition)
      )}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {getWeatherIcon(weather.condition)}
            <div>
              <div className="text-2xl font-bold">{weather.temperature}°C</div>
              <div className="text-sm opacity-90 capitalize">{weather.condition}</div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchWeather}
            disabled={loading}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-1">
            <Droplets className="w-4 h-4" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wind className="w-4 h-4" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <div className="flex items-center space-x-1">
            <Thermometer className="w-4 h-4" />
            <span>Feels like {weather.temperature + Math.round(Math.random() * 4 - 2)}°C</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className={cn(
          'p-3 rounded-lg mb-4',
          isGoodWeather ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
        )}>
          <div className="flex items-center space-x-2 mb-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              isGoodWeather ? 'bg-green-500' : 'bg-blue-500'
            )}></div>
            <span className="text-sm font-medium">
              {isGoodWeather ? 'Great for outdoor activities!' : 'Consider indoor activities'}
            </span>
          </div>
          <p className="text-sm text-gray-600">{recommendation}</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">5-Day Forecast</h4>
          <div className="space-y-2">
            {weather.forecast.slice(0, 3).map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="font-medium w-20">{day.day}</span>
                <div className="flex items-center space-x-2 flex-1">
                  <div className="w-4 h-4">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <span className="text-gray-600 capitalize text-xs flex-1">{day.condition}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{day.high}°</span>
                  <span className="text-gray-500">{day.low}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
