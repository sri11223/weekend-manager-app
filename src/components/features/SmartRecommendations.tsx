import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ActivityCard } from './ActivityCard';
import { Sparkles, Brain, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useWeekendStore } from '../../store/useWeekendStore';
import type { Activity } from '../../types';

interface SmartRecommendationsProps {
  onAddToSchedule: (activity: Activity) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  onAddToSchedule
}) => {
  const [activeRecommendationType, setActiveRecommendationType] = useState<'weather' | 'mood' | 'trending' | 'nearby'>('weather');
  const { activities, weather } = useWeekendStore();

  const getWeatherBasedRecommendations = (): Activity[] => {
    if (!weather) return [];
    
    const isGoodWeather = weather.temperature > 15 && !weather.condition.includes('rain');
    
    return activities
      .filter(activity => {
        if (!isGoodWeather && activity.weatherDependent) return false;
        if (weather.temperature > 25 && activity.category === 'outdoor') return true;
        if (!isGoodWeather && activity.indoor) return true;
        return !activity.weatherDependent;
      })
      .slice(0, 6);
  };

  const getMoodBasedRecommendations = (): Activity[] => {
    // Simulate mood detection based on time of day and current plan
    const hour = new Date().getHours();
    let preferredMoods: string[] = [];
    
    if (hour < 10) {
      preferredMoods = ['peaceful', 'energetic'];
    } else if (hour < 14) {
      preferredMoods = ['social', 'adventurous'];
    } else if (hour < 18) {
      preferredMoods = ['creative', 'energetic'];
    } else {
      preferredMoods = ['relaxed', 'romantic', 'social'];
    }

    return activities
      .filter(activity => preferredMoods.includes(activity.mood))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 6);
  };

  const getTrendingRecommendations = (): Activity[] => {
    // Simulate trending activities based on category popularity
    const trendingCategories = ['food', 'entertainment', 'wellness', 'creative'];
    
    return activities
      .filter(activity => trendingCategories.includes(activity.category))
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  };

  const getNearbyRecommendations = (): Activity[] => {
    // Simulate location-based recommendations
    return activities
      .filter(activity => activity.cost !== 'high' && !activity.weatherDependent)
      .slice(0, 6);
  };

  const getRecommendations = () => {
    switch (activeRecommendationType) {
      case 'weather':
        return getWeatherBasedRecommendations();
      case 'mood':
        return getMoodBasedRecommendations();
      case 'trending':
        return getTrendingRecommendations();
      case 'nearby':
        return getNearbyRecommendations();
      default:
        return [];
    }
  };

  const recommendations = getRecommendations();

  const getRecommendationTitle = () => {
    switch (activeRecommendationType) {
      case 'weather':
        return `Perfect for ${weather?.condition || 'current'} weather`;
      case 'mood':
        return 'Based on your current mood';
      case 'trending':
        return 'Trending this weekend';
      case 'nearby':
        return 'Popular nearby activities';
      default:
        return 'Recommended for you';
    }
  };

  const getRecommendationIcon = () => {
    switch (activeRecommendationType) {
      case 'weather':
        return <Sparkles className="w-5 h-5" />;
      case 'mood':
        return <Brain className="w-5 h-5" />;
      case 'trending':
        return <TrendingUp className="w-5 h-5" />;
      case 'nearby':
        return <MapPin className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <Card>
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          {getRecommendationIcon()}
          <h3 className="text-lg font-semibold gradient-text">
            Smart Recommendations
          </h3>
        </div>

        {/* Recommendation Type Selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={activeRecommendationType === 'weather' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveRecommendationType('weather')}
            className="flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4" />
            <span>Weather</span>
          </Button>
          <Button
            variant={activeRecommendationType === 'mood' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveRecommendationType('mood')}
            className="flex items-center space-x-1"
          >
            <Brain className="w-4 h-4" />
            <span>Mood</span>
          </Button>
          <Button
            variant={activeRecommendationType === 'trending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveRecommendationType('trending')}
            className="flex items-center space-x-1"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </Button>
          <Button
            variant={activeRecommendationType === 'nearby' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveRecommendationType('nearby')}
            className="flex items-center space-x-1"
          >
            <MapPin className="w-4 h-4" />
            <span>Nearby</span>
          </Button>
        </div>

        <h4 className="text-sm font-medium text-gray-700 mb-3">
          {getRecommendationTitle()}
        </h4>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No recommendations available at the moment</p>
          <p className="text-sm">Try a different recommendation type</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              onAddToSchedule={onAddToSchedule}
              showAddButton={true}
            />
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-800">AI Insight</span>
        </div>
        <p className="text-sm text-purple-700">
          {activeRecommendationType === 'weather' && weather && (
            `Based on ${weather.condition} weather at ${weather.temperature}°C, these activities are perfectly suited for your weekend.`
          )}
          {activeRecommendationType === 'mood' && (
            `These activities match your current energy level and time preferences for optimal enjoyment.`
          )}
          {activeRecommendationType === 'trending' && (
            `These are the most popular activities among weekend planners this week.`
          )}
          {activeRecommendationType === 'nearby' && (
            `These activities are easily accessible and don't require extensive travel planning.`
          )}
        </p>
      </div>
    </Card>
  );
};
