import { Activity, ApiResponse, SearchFilters, ActivityCategory, ActivityMood } from './types';
import { OverpassService } from './overpassService';
import { TMDbService } from './tmdbService';
import { OpenTripMapService } from './openTripMapService';
import { FreeGamesService } from './freeGamesService';
import { EventbriteService } from './eventbriteService';
import { TripPlanningService } from './tripPlanningService';
import { HolidayService } from './holidayService';

export class ApiManager {
  private overpassService: OverpassService;
  private tmdbService: TMDbService;
  private openTripMapService: OpenTripMapService;
  private freeGamesService: FreeGamesService;
  private eventbriteService: EventbriteService;
  private tripPlanningService: TripPlanningService;
  private holidayService: HolidayService;

  constructor() {
    this.overpassService = new OverpassService();
    this.tmdbService = new TMDbService();
    this.openTripMapService = new OpenTripMapService();
    this.freeGamesService = new FreeGamesService();
    this.eventbriteService = new EventbriteService();
    this.tripPlanningService = new TripPlanningService();
    this.holidayService = new HolidayService();
  }

  async getActivitiesByCategory(
    category: ActivityCategory,
    filters: Omit<SearchFilters, 'category'>
  ): Promise<ApiResponse<Activity[]>> {
    const searchFilters: SearchFilters = { ...filters, category };

    switch (category) {
      case 'food':
      case 'outdoor':
        return this.overpassService.getActivities(searchFilters);
      
      case 'entertainment':
        return this.tmdbService.getActivities(searchFilters);
      
      case 'cultural':
        return this.openTripMapService.getActivities(searchFilters);
      
      case 'gaming':
        return this.freeGamesService.getActivities(searchFilters);
      
      case 'social':
        return this.eventbriteService.getActivities(searchFilters);
      
      case 'wellness':
        // Use OpenTripMap for wellness locations (spas, parks, etc.)
        return this.openTripMapService.getActivities(searchFilters);
      
      case 'shopping':
        // Use Overpass for shopping locations
        return this.overpassService.getActivities(searchFilters);
      
      case 'trip-planning':
        return this.tripPlanningService.searchActivities(searchFilters);
      
      default:
        return {
          success: false,
          data: null,
          error: `Unsupported category: ${category}`,
          source: 'api'
        };
    }
  }

  async getActivitiesByMood(
    mood: ActivityMood[],
    filters: Omit<SearchFilters, 'mood'>
  ): Promise<ApiResponse<Activity[]>> {
    const searchFilters: SearchFilters = { ...filters, mood };

    // Determine best service based on mood
    const moodServiceMap: Record<ActivityMood, () => Promise<ApiResponse<Activity[]>>> = {
      'adventurous': () => this.openTripMapService.getActivities(searchFilters),
      'energetic': () => this.freeGamesService.getActivities(searchFilters),
      'social': () => this.eventbriteService.getActivities(searchFilters),
      'romantic': () => this.overpassService.getActivities({ ...searchFilters, category: 'food' }),
      'peaceful': () => this.openTripMapService.getActivities({ ...searchFilters, category: 'cultural' }),
      'creative': () => this.openTripMapService.getActivities({ ...searchFilters, category: 'cultural' }),
      'fun': () => this.tmdbService.getActivities({ ...searchFilters, category: 'entertainment' }),
      'relaxed': () => this.overpassService.getActivities({ ...searchFilters, category: 'food' }),
      'cozy': () => this.overpassService.getActivities({ ...searchFilters, category: 'food' }),
      'productive': () => this.openTripMapService.getActivities({ ...searchFilters, category: 'cultural' })
    };

    // Use the first mood to determine the primary service
    const primaryMood = mood[0];
    if (moodServiceMap[primaryMood]) {
      return moodServiceMap[primaryMood]();
    }

    // Fallback to mixed results
    return this.getMixedActivities(searchFilters);
  }

  async getMixedActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    const limit = filters.limit || 10;
    const perService = Math.ceil(limit / 6); // Distribute across 6 services

    try {
      // Get activities from all services in parallel
      const [
        foodResults,
        entertainmentResults,
        culturalResults,
        gamingResults,
        socialResults,
        tripResults
      ] = await Promise.allSettled([
        this.overpassService.getActivities({ ...filters, category: 'food', limit: perService }),
        this.tmdbService.getActivities({ ...filters, category: 'entertainment', limit: perService }),
        this.openTripMapService.getActivities({ ...filters, category: 'cultural', limit: perService }),
        this.freeGamesService.getActivities({ ...filters, category: 'gaming', limit: perService }),
        this.eventbriteService.getActivities({ ...filters, category: 'social', limit: perService }),
        this.tripPlanningService.searchActivities({ ...filters, category: 'trip-planning', limit: perService })
      ]);

      // Collect all successful results
      const allActivities: Activity[] = [];
      let hasApiSuccess = false;

      [foodResults, entertainmentResults, culturalResults, gamingResults, socialResults, tripResults].forEach(result => {
        if (result.status === 'fulfilled' && result.value.success && result.value.data) {
          allActivities.push(...result.value.data);
          if (result.value.source === 'api') {
            hasApiSuccess = true;
          }
        }
      });

      // Shuffle and limit results
      const shuffled = allActivities.sort(() => Math.random() - 0.5);
      const limited = shuffled.slice(0, limit);

      return {
        success: true,
        data: limited,
        source: hasApiSuccess ? 'api' : 'fallback'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'api'
      };
    }
  }

  async getSmartRecommendations(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    const { mood, category, location } = filters;

    // Smart recommendation logic based on mood and context
    if (mood && mood.length > 0) {
      const primaryMood = mood[0];
      
      // Weather-aware recommendations
      if (location && filters.weatherDependent !== false) {
        // In a real implementation, you would check weather API here
        // For now, we'll assume good weather
        if (['adventurous', 'energetic'].includes(primaryMood)) {
          return this.getActivitiesByCategory('outdoor', filters);
        }
      }

      // Time-aware recommendations
      const hour = new Date().getHours();
      if (hour < 12 && ['peaceful', 'relaxed'].includes(primaryMood)) {
        return this.getActivitiesByCategory('food', { ...filters, timeOfDay: ['morning'] });
      }
      if (hour >= 18 && ['social', 'fun'].includes(primaryMood)) {
        return this.getActivitiesByCategory('social', { ...filters, timeOfDay: ['evening'] });
      }
    }

    // Category-specific recommendations
    if (category) {
      return this.getActivitiesByCategory(category, filters);
    }

    // Default to mixed recommendations
    return this.getMixedActivities(filters);
  }

  // Utility method to get trending activities (mock implementation)
  async getTrendingActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    // In a real implementation, this would track popular activities
    // For now, we'll return a mix with higher ratings
    const result = await this.getMixedActivities(filters);
    
    if (result.success && result.data) {
      // Sort by rating and return top activities
      const trending = result.data
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, filters.limit || 10);
      
      return {
        ...result,
        data: trending
      };
    }

    return result;
  }

  // Utility method to get nearby activities
  async getNearbyActivities(
    location: { lat: number; lon: number },
    filters: Omit<SearchFilters, 'location'>
  ): Promise<ApiResponse<Activity[]>> {
    return this.getMixedActivities({
      ...filters,
      location,
      radius: filters.radius || 5000 // 5km default
    });
  }

  // Health check for all services
  async healthCheck(): Promise<Record<string, boolean>> {
    const services = {
      overpass: this.overpassService,
      tmdb: this.tmdbService,
      openTripMap: this.openTripMapService,
      freeGames: this.freeGamesService,
      eventbrite: this.eventbriteService,
      tripPlanning: this.tripPlanningService,
      holiday: this.holidayService
    };

    const health: Record<string, boolean> = {};

    for (const [name, service] of Object.entries(services)) {
      try {
        const result = await service.getActivities({
          limit: 1,
          location: { lat: 40.7128, lon: -74.0060 } // NYC coordinates for test
        });
        health[name] = result.success;
      } catch (error) {
        health[name] = false;
      }
    }

    return health;
  }

  // Holiday awareness methods
  async isLongWeekend(countryCode: string = 'IN'): Promise<boolean> {
    try {
      const result = await this.holidayService.isLongWeekend(countryCode);
      return result.data || false;
    } catch (error) {
      console.warn('Long weekend check failed:', error);
      return false;
    }
  }

  async getUpcomingHolidays(countryCode: string = 'IN', limit: number = 3) {
    try {
      const result = await this.holidayService.getUpcomingHolidays(countryCode, limit);
      return result.data || [];
    } catch (error) {
      console.warn('Holiday fetch failed:', error);
      return [];
    }
  }

  // Smart weekend planning with holiday awareness
  async getSmartWeekendRecommendations(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      // Check if it's a long weekend
      const isLong = await this.isLongWeekend();
      
      if (isLong) {
        console.log('🏖️ Long weekend detected! Suggesting extended activities...');
        // Prioritize trip planning and longer activities for long weekends
        const tripResults = await this.tripPlanningService.searchActivities({
          ...filters,
          limit: Math.ceil((filters.limit || 10) * 0.6) // 60% trips
        });
        
        const otherResults = await this.getMixedActivities({
          ...filters,
          limit: Math.floor((filters.limit || 10) * 0.4) // 40% other activities
        });
        
        const combinedActivities = [
          ...(tripResults.data || []),
          ...(otherResults.data || [])
        ];
        
        return {
          success: true,
          data: combinedActivities.slice(0, filters.limit || 10),
          source: 'api'
        };
      } else {
        console.log('📅 Regular weekend - standard recommendations');
        return this.getSmartRecommendations(filters);
      }
    } catch (error) {
      console.warn('Smart weekend recommendations failed:', error);
      return this.getMixedActivities(filters);
    }
  }
}

// Export singleton instance
export const apiManager = new ApiManager();
