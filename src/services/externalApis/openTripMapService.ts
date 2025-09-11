import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface OpenTripMapPlace {
  xid: string;
  name: string;
  dist: number;
  rate: number;
  osm: string;
  wikidata: string;
  kinds: string;
  point: {
    lon: number;
    lat: number;
  };
}

interface OpenTripMapDetails {
  xid: string;
  name: string;
  address: {
    city?: string;
    road?: string;
    house_number?: string;
    country?: string;
  };
  rate: number;
  kinds: string;
  sources: {
    geometry: string;
    attributes: string[];
  };
  bbox: {
    lat_max: number;
    lat_min: number;
    lon_max: number;
    lon_min: number;
  };
  point: {
    lon: number;
    lat: number;
  };
  wikipedia_extracts?: {
    title: string;
    text: string;
    html: string;
  };
  image?: string;
  preview?: {
    source: string;
    height: number;
    width: number;
  };
  wikipedia?: string;
  url?: string;
}

interface OpenTripMapResponse {
  type: string;
  features: OpenTripMapPlace[];
}

export class OpenTripMapService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://api.opentripmap.com/0.1/en/places',
      timeout: 8000,
      retries: 2,
      cacheDuration: 2 * 60 * 60 * 1000, // 2 hours
    });
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    if (!filters.location) {
      return {
        success: false,
        data: null,
        error: 'Location required for OpenTripMap API',
        source: 'api'
      };
    }

    const { lat, lon } = filters.location;
    const radius = filters.radius || 5000; // 5km default
    const limit = filters.limit || 10;
    
    // Determine kinds based on category and mood
    const kinds = this.getKindsFromFilters(filters);
    
    try {
      const response = await this.makeRequest<OpenTripMapPlace[]>(
        `/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=${kinds}&format=json&limit=${limit}`
      );

      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          error: response.error,
          source: response.source
        };
      }

      // Get detailed information for each place
      const activities = await Promise.all(
        response.data
          .filter(place => place.name && place.rate > 1) // Filter out low-quality places
          .slice(0, limit)
          .map(place => this.convertToActivity(place, filters))
      );

      const validActivities = activities.filter((activity): activity is Activity => activity !== null);

      return {
        success: true,
        data: this.applyFilters(validActivities, filters),
        source: response.source
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

  private getKindsFromFilters(filters: SearchFilters): string {
    const categoryKinds: Record<string, string[]> = {
      'cultural': ['museums', 'monuments', 'theatres', 'galleries', 'historic', 'architecture'],
      'entertainment': ['amusements', 'theatres', 'cinemas', 'sport'],
      'outdoor': ['natural', 'beaches', 'gardens', 'sport'],
      'social': ['amusements', 'sport', 'theatres'],
      'wellness': ['natural', 'gardens', 'sport']
    };

    const moodKinds: Record<ActivityMood, string[]> = {
      'adventurous': ['natural', 'sport', 'amusements'],
      'peaceful': ['natural', 'gardens', 'monuments'],
      'creative': ['museums', 'galleries', 'architecture'],
      'romantic': ['gardens', 'monuments', 'architecture'],
      'energetic': ['sport', 'amusements'],
      'social': ['amusements', 'theatres', 'sport'],
      'fun': ['amusements', 'sport', 'theatres'],
      'relaxed': ['natural', 'gardens', 'museums'],
      'cozy': ['museums', 'galleries', 'cafes'],
      'productive': ['museums', 'galleries', 'historic']
    };

    let kinds: string[] = [];

    // Add kinds based on category
    if (filters.category && categoryKinds[filters.category]) {
      kinds.push(...categoryKinds[filters.category]);
    }

    // Add kinds based on mood
    if (filters.mood) {
      for (const mood of filters.mood) {
        if (moodKinds[mood]) {
          kinds.push(...moodKinds[mood]);
        }
      }
    }

    // Default kinds if none specified
    if (kinds.length === 0) {
      kinds = ['museums', 'monuments', 'natural', 'gardens', 'architecture'];
    }

    // Remove duplicates and join
    return [...new Set(kinds)].join(',');
  }

  private async convertToActivity(place: OpenTripMapPlace, filters: SearchFilters): Promise<Activity | null> {
    try {
      // Get detailed information
      const detailsResponse = await this.makeRequest<OpenTripMapDetails>(`/xid/${place.xid}?format=json`);
      const details = detailsResponse.success ? detailsResponse.data : null;

      const mood = this.getMoodFromKinds(place.kinds, filters.mood);
      const category = this.getCategoryFromKinds(place.kinds, filters.category);
      
      if (!category) return null;

      const description = this.getDescriptionFromKinds(place.kinds, details?.wikipedia_extracts?.text);
      const duration = this.getDurationFromKinds(place.kinds);
      const image = this.getImageFromDetails(details, place.kinds);
      const price = this.getPriceFromKinds(place.kinds);

      return {
        id: `otm-${place.xid}`,
        title: place.name,
        description,
        category,
        mood,
        duration,
        image,
        rating: Math.min(place.rate / 2, 5), // Convert to 5-point scale
        price,
        location: {
          name: place.name,
          address: this.buildAddress(details?.address),
          coordinates: {
            lat: place.point.lat,
            lon: place.point.lon
          }
        },
        tags: this.getTagsFromKinds(place.kinds),
        weatherDependent: this.isWeatherDependent(place.kinds),
        timeOfDay: this.getTimeOfDayFromKinds(place.kinds)
      };
    } catch (error) {
      console.warn(`Failed to convert place ${place.name}:`, error);
      return null;
    }
  }

  private getMoodFromKinds(kinds: string, requestedMoods?: ActivityMood[]): ActivityMood[] {
    const kindsMoodMap: Record<string, ActivityMood[]> = {
      'museums': ['creative', 'peaceful', 'productive'],
      'monuments': ['peaceful', 'romantic', 'creative'],
      'galleries': ['creative', 'peaceful'],
      'theatres': ['creative', 'social', 'fun'],
      'natural': ['peaceful', 'adventurous', 'relaxed'],
      'beaches': ['relaxed', 'fun', 'romantic'],
      'gardens': ['peaceful', 'romantic', 'relaxed'],
      'sport': ['energetic', 'adventurous', 'social'],
      'amusements': ['fun', 'energetic', 'social'],
      'architecture': ['creative', 'peaceful', 'romantic'],
      'historic': ['creative', 'peaceful', 'productive']
    };

    let moods: ActivityMood[] = [];
    const kindsArray = kinds.split(',');

    for (const kind of kindsArray) {
      if (kindsMoodMap[kind]) {
        moods.push(...kindsMoodMap[kind]);
      }
    }

    // Remove duplicates
    moods = [...new Set(moods)];

    // Default moods if none found
    if (moods.length === 0) {
      moods = ['creative', 'peaceful'];
    }

    // Filter by requested moods if provided
    if (requestedMoods && requestedMoods.length > 0) {
      const filteredMoods = moods.filter(mood => requestedMoods.includes(mood));
      if (filteredMoods.length > 0) {
        moods = filteredMoods;
      }
    }

    return moods.slice(0, 3);
  }

  private getCategoryFromKinds(kinds: string, requestedCategory?: string): 'cultural' | 'entertainment' | 'outdoor' | 'social' | 'wellness' | null {
    const kindsArray = kinds.split(',');

    if (requestedCategory) {
      const categoryMap: Record<string, string[]> = {
        'cultural': ['museums', 'monuments', 'galleries', 'theatres', 'historic', 'architecture'],
        'entertainment': ['amusements', 'theatres', 'cinemas', 'sport'],
        'outdoor': ['natural', 'beaches', 'gardens', 'sport'],
        'social': ['amusements', 'sport', 'theatres'],
        'wellness': ['natural', 'gardens', 'sport']
      };

      if (categoryMap[requestedCategory]?.some(kind => kindsArray.includes(kind))) {
        return requestedCategory as any;
      }
    }

    // Auto-detect category
    if (kindsArray.some(k => ['museums', 'monuments', 'galleries', 'historic', 'architecture'].includes(k))) {
      return 'cultural';
    }
    if (kindsArray.some(k => ['natural', 'beaches', 'gardens'].includes(k))) {
      return 'outdoor';
    }
    if (kindsArray.some(k => ['amusements', 'theatres', 'sport'].includes(k))) {
      return 'entertainment';
    }

    return 'cultural'; // Default
  }

  private getDescriptionFromKinds(kinds: string, wikipediaText?: string): string {
    if (wikipediaText && wikipediaText.length > 50) {
      return wikipediaText.substring(0, 200) + '...';
    }

    const kindsArray = kinds.split(',');
    const descriptions: Record<string, string> = {
      'museums': 'Explore fascinating exhibits and cultural artifacts',
      'monuments': 'Visit historic landmarks and architectural marvels',
      'galleries': 'Discover beautiful artworks and creative expressions',
      'theatres': 'Experience live performances and entertainment',
      'natural': 'Enjoy the beauty of nature and outdoor scenery',
      'beaches': 'Relax by the water and enjoy beach activities',
      'gardens': 'Stroll through beautiful landscaped gardens',
      'sport': 'Engage in sports and physical activities',
      'amusements': 'Have fun with entertainment and recreational activities',
      'architecture': 'Admire stunning architectural designs and structures',
      'historic': 'Learn about history and cultural heritage'
    };

    for (const kind of kindsArray) {
      if (descriptions[kind]) {
        return descriptions[kind];
      }
    }

    return 'Discover interesting places and attractions in your area';
  }

  private getDurationFromKinds(kinds: string): number {
    const kindsArray = kinds.split(',');
    
    if (kindsArray.includes('museums') || kindsArray.includes('galleries')) return 120;
    if (kindsArray.includes('monuments') || kindsArray.includes('architecture')) return 60;
    if (kindsArray.includes('natural') || kindsArray.includes('gardens')) return 90;
    if (kindsArray.includes('sport') || kindsArray.includes('amusements')) return 150;
    if (kindsArray.includes('theatres')) return 180;
    
    return 90; // Default
  }

  private getImageFromDetails(details: OpenTripMapDetails | null, kinds: string): string {
    if (details?.preview?.source) {
      return details.preview.source;
    }

    // Fallback emojis based on kinds
    const kindsArray = kinds.split(',');
    const emojiMap: Record<string, string> = {
      'museums': '🏛️',
      'monuments': '🗿',
      'galleries': '🎨',
      'theatres': '🎭',
      'natural': '🌿',
      'beaches': '🏖️',
      'gardens': '🌺',
      'sport': '⚽',
      'amusements': '🎢',
      'architecture': '🏰',
      'historic': '📜'
    };

    for (const kind of kindsArray) {
      if (emojiMap[kind]) {
        return emojiMap[kind];
      }
    }

    return '📍';
  }

  private getPriceFromKinds(kinds: string): 'free' | 'low' | 'medium' | 'high' {
    const kindsArray = kinds.split(',');
    
    if (kindsArray.some(k => ['natural', 'gardens', 'monuments'].includes(k))) return 'free';
    if (kindsArray.some(k => ['museums', 'galleries'].includes(k))) return 'low';
    if (kindsArray.some(k => ['theatres', 'amusements'].includes(k))) return 'medium';
    if (kindsArray.some(k => ['sport'].includes(k))) return 'medium';
    
    return 'low';
  }

  private buildAddress(address?: OpenTripMapDetails['address']): string | undefined {
    if (!address) return undefined;
    
    const parts = [];
    if (address.house_number) parts.push(address.house_number);
    if (address.road) parts.push(address.road);
    if (address.city) parts.push(address.city);
    
    return parts.length > 0 ? parts.join(' ') : undefined;
  }

  private getTagsFromKinds(kinds: string): string[] {
    const kindsArray = kinds.split(',');
    return [...kindsArray, 'attraction', 'sightseeing'];
  }

  private isWeatherDependent(kinds: string): boolean {
    const kindsArray = kinds.split(',');
    return kindsArray.some(k => ['natural', 'beaches', 'gardens', 'sport'].includes(k));
  }

  private getTimeOfDayFromKinds(kinds: string): 'morning' | 'afternoon' | 'evening' | 'night' | 'any' {
    const kindsArray = kinds.split(',');
    
    if (kindsArray.includes('theatres')) return 'evening';
    if (kindsArray.includes('amusements')) return 'afternoon';
    if (kindsArray.includes('natural') || kindsArray.includes('gardens')) return 'morning';
    
    return 'any';
  }

  getFallbackData(filters: SearchFilters): Activity[] {
    return getFallbackActivitiesByFilters(
      filters.category || 'cultural',
      filters.mood,
      filters.limit || 10
    );
  }
}
