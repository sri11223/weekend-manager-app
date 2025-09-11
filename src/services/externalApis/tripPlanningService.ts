import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface JSONPlaceholderAlbum {
  userId: number;
  id: number;
  title: string;
}

export class TripPlanningService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://jsonplaceholder.typicode.com',
      timeout: 5000,
      retries: 2,
      cacheDuration: 2 * 60 * 60 * 1000, // 2 hours
    });
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      console.log('🗺️ Generating trip ideas...');

      const response = await this.makeRequest<JSONPlaceholderAlbum[]>('albums');
      
      if (!response.success || !response.data) {
        return this.getFallbackResponse(filters, response.error);
      }

      const activities: Activity[] = response.data
        .slice(0, filters.limit || 12)
        .map((album) => this.convertToTripActivity(album, filters));

      const filteredActivities = this.applyFilters(activities, filters);

      console.log(`✅ Generated ${filteredActivities.length} trip ideas`);

      return {
        success: true,
        data: filteredActivities.length > 0 ? filteredActivities : this.getFallbackData(filters),
        source: filteredActivities.length > 0 ? 'jsonplaceholder' : 'fallback'
      };

    } catch (error) {
      return this.getFallbackResponse(filters, error instanceof Error ? error.message : 'API failed');
    }
  }

  private convertToTripActivity(album: JSONPlaceholderAlbum, filters: SearchFilters): Activity {
    const tripTypes = ['City Break', 'Nature Escape', 'Adventure Tour', 'Cultural Journey', 'Beach Getaway', 'Mountain Retreat'];
    const tripType = tripTypes[album.id % tripTypes.length];
    
    const destinations = ['Paris', 'Tokyo', 'New York', 'Bali', 'Iceland', 'Thailand', 'Italy', 'Greece'];
    const destination = destinations[album.userId % destinations.length];
    
    const tripTitle = this.generateTripTitle(album.title, tripType, destination);
    
    return {
      id: `trip-${album.id}`,
      title: tripTitle,
      description: this.generateTripDescription(tripType, destination),
      category: 'trip-planning',
      mood: this.getMoodFromTripType(tripType, filters.mood),
      duration: this.getDurationFromTripType(tripType),
      image: this.getTripEmoji(tripType),
      rating: 4.2 + Math.random() * 0.8,
      price: this.getPriceFromTripType(tripType),
      location: {
        name: destination,
        address: `${destination} • Weekend Trip`
      },
      tags: this.generateTripTags(tripType, destination),
      weatherDependent: true,
      timeOfDay: 'any'
    };
  }

  private generateTripTitle(albumTitle: string, tripType: string, destination: string): string {
    const words = albumTitle.split(' ').slice(0, 2).join(' ');
    return `${destination} ${tripType}: ${words}`.slice(0, 40);
  }

  private generateTripDescription(tripType: string, destination: string): string {
    const descriptions: Record<string, string> = {
      'City Break': `Explore the vibrant city life of ${destination} with amazing urban experiences`,
      'Nature Escape': `Disconnect and recharge in the beautiful natural landscapes of ${destination}`,
      'Adventure Tour': `Thrilling adventures and exciting activities await in ${destination}`,
      'Cultural Journey': `Immerse yourself in the rich culture and history of ${destination}`,
      'Beach Getaway': `Relax on pristine beaches and enjoy the coastal beauty of ${destination}`,
      'Mountain Retreat': `Experience breathtaking mountain views and fresh air in ${destination}`
    };
    
    return descriptions[tripType] || `Amazing weekend getaway to ${destination}`;
  }

  private getMoodFromTripType(tripType: string, requestedMoods?: ActivityMood[]): ActivityMood[] {
    const tripMoodMap: Record<string, ActivityMood[]> = {
      'City Break': ['adventurous', 'energetic'],
      'Nature Escape': ['peaceful', 'relaxed'],
      'Adventure Tour': ['adventurous', 'energetic'],
      'Cultural Journey': ['creative', 'adventurous'],
      'Beach Getaway': ['relaxed', 'romantic'],
      'Mountain Retreat': ['peaceful', 'adventurous']
    };

    let moods = tripMoodMap[tripType] || ['adventurous', 'fun'];

    if (requestedMoods && requestedMoods.length > 0) {
      const filteredMoods = moods.filter(mood => requestedMoods.includes(mood));
      if (filteredMoods.length > 0) {
        moods = filteredMoods;
      }
    }

    return moods;
  }

  private getDurationFromTripType(_tripType: string): number {
    return 2880; // 48 hours (2 days) for weekend trips
  }

  private getTripEmoji(tripType: string): string {
    const emojis: Record<string, string> = {
      'City Break': '🏙️',
      'Nature Escape': '🌲',
      'Adventure Tour': '🏔️',
      'Cultural Journey': '🏛️',
      'Beach Getaway': '🏖️',
      'Mountain Retreat': '⛰️'
    };
    
    return emojis[tripType] || '✈️';
  }

  private getPriceFromTripType(tripType: string): 'low' | 'medium' | 'high' {
    const prices: Record<string, 'low' | 'medium' | 'high'> = {
      'City Break': 'medium',
      'Nature Escape': 'low',
      'Adventure Tour': 'high',
      'Cultural Journey': 'medium',
      'Beach Getaway': 'high',
      'Mountain Retreat': 'medium'
    };
    
    return prices[tripType] || 'medium';
  }

  private generateTripTags(tripType: string, destination: string): string[] {
    return [
      'trip-planning',
      'weekend-trip',
      'travel',
      tripType.toLowerCase().replace(' ', '-'),
      destination.toLowerCase(),
      'getaway'
    ];
  }

  private getFallbackResponse(filters: SearchFilters, error?: string): ApiResponse<Activity[]> {
    return {
      success: true,
      data: this.getFallbackData(filters),
      source: 'fallback',
      error
    };
  }

  getFallbackData(filters: SearchFilters): Activity[] {
    return getFallbackActivitiesByFilters('trip-planning', filters.mood, filters.limit || 12);
  }
}
