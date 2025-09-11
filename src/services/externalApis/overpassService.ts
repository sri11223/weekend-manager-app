import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  tags?: {
    name?: string;
    amenity?: string;
    cuisine?: string;
    leisure?: string;
    tourism?: string;
    shop?: string;
    'addr:street'?: string;
    'addr:housenumber'?: string;
    phone?: string;
    website?: string;
    opening_hours?: string;
  };
}

interface OverpassResponse {
  elements: OverpassElement[];
}

export class OverpassService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://overpass-api.de/api/interpreter',
      timeout: 10000,
      retries: 2,
      cacheDuration: 30 * 60 * 1000, // 30 minutes
    });
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    if (!filters.location) {
      return {
        success: false,
        data: null,
        error: 'Location required for Overpass API',
        source: 'api'
      };
    }

    const { lat, lon } = filters.location;
    const radius = filters.radius || 5000; // 5km default
    
    let overpassQuery = '';
    
    if (filters.category === 'food') {
      overpassQuery = this.buildFoodQuery(lat, lon, radius);
    } else if (filters.category === 'outdoor') {
      overpassQuery = this.buildOutdoorQuery(lat, lon, radius);
    } else {
      // General query for mixed results
      overpassQuery = this.buildGeneralQuery(lat, lon, radius);
    }

    try {
      const response = await fetch(this.config.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: overpassQuery,
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.status}`);
      }

      const data: OverpassResponse = await response.json();
      const activities = this.transformOverpassData(data.elements, filters);
      
      return {
        success: true,
        data: this.applyFilters(activities, filters),
        source: 'api'
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

  private buildFoodQuery(lat: number, lon: number, radius: number): string {
    return `
      [out:json][timeout:25];
      (
        node["amenity"~"^(restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|bakery)$"](around:${radius},${lat},${lon});
        way["amenity"~"^(restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|bakery)$"](around:${radius},${lat},${lon});
        relation["amenity"~"^(restaurant|cafe|bar|pub|fast_food|food_court|ice_cream|bakery)$"](around:${radius},${lat},${lon});
      );
      out center meta;
    `;
  }

  private buildOutdoorQuery(lat: number, lon: number, radius: number): string {
    return `
      [out:json][timeout:25];
      (
        node["leisure"~"^(park|garden|nature_reserve|playground|sports_centre|swimming_pool|beach_resort)$"](around:${radius},${lat},${lon});
        node["tourism"~"^(viewpoint|attraction|picnic_site)$"](around:${radius},${lat},${lon});
        node["natural"~"^(beach|peak|waterfall|hot_spring)$"](around:${radius},${lat},${lon});
        way["leisure"~"^(park|garden|nature_reserve|playground|sports_centre|swimming_pool|beach_resort)$"](around:${radius},${lat},${lon});
        way["tourism"~"^(viewpoint|attraction|picnic_site)$"](around:${radius},${lat},${lon});
        way["natural"~"^(beach|peak|waterfall|hot_spring)$"](around:${radius},${lat},${lon});
      );
      out center meta;
    `;
  }

  private buildGeneralQuery(lat: number, lon: number, radius: number): string {
    return `
      [out:json][timeout:25];
      (
        node["amenity"~"^(restaurant|cafe|bar|pub|cinema|theatre|library|museum)$"](around:${radius},${lat},${lon});
        node["leisure"~"^(park|garden|sports_centre|swimming_pool)$"](around:${radius},${lat},${lon});
        node["tourism"~"^(attraction|museum|gallery|viewpoint)$"](around:${radius},${lat},${lon});
        node["shop"~"^(mall|department_store|books|art|music)$"](around:${radius},${lat},${lon});
      );
      out center meta;
    `;
  }

  private transformOverpassData(elements: OverpassElement[], filters: SearchFilters): Activity[] {
    return elements
      .filter(element => element.tags?.name)
      .map(element => this.elementToActivity(element, filters))
      .filter((activity): activity is Activity => activity !== null);
  }

  private elementToActivity(element: OverpassElement, filters: SearchFilters): Activity | null {
    const tags = element.tags!;
    const name = tags.name!;
    
    // Determine category and mood based on amenity/leisure type
    const { category, mood, description, duration, image, weatherDependent } = 
      this.categorizeElement(tags, filters);

    if (!category) return null;

    const location = element.lat && element.lon ? {
      lat: element.lat,
      lon: element.lon
    } : undefined;

    const address = this.buildAddress(tags);

    return {
      id: `overpass-${element.id}`,
      title: name,
      description,
      category,
      mood,
      duration,
      image,
      rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
      price: this.estimatePrice(tags),
      location: {
        name,
        address,
        coordinates: location
      },
      tags: this.extractTags(tags),
      weatherDependent,
      timeOfDay: this.getTimeOfDay(tags)
    };
  }

  private categorizeElement(tags: any, _filters: SearchFilters) {
    const amenity = tags.amenity;
    const leisure = tags.leisure;
    const tourism = tags.tourism;
    const shop = tags.shop;

    // Food category
    if (['restaurant', 'cafe', 'bar', 'pub', 'fast_food', 'food_court', 'ice_cream', 'bakery'].includes(amenity)) {
      return {
        category: 'food' as const,
        mood: this.getFoodMood(amenity, tags.cuisine),
        description: this.getFoodDescription(amenity, tags.cuisine),
        duration: this.getFoodDuration(amenity),
        image: this.getFoodEmoji(amenity),
        weatherDependent: amenity === 'ice_cream'
      };
    }

    // Outdoor category
    if (['park', 'garden', 'nature_reserve', 'playground', 'sports_centre', 'swimming_pool', 'beach_resort'].includes(leisure) ||
        ['viewpoint', 'picnic_site'].includes(tourism) ||
        ['beach', 'peak', 'waterfall', 'hot_spring'].includes(tags.natural)) {
      return {
        category: 'outdoor' as const,
        mood: this.getOutdoorMood(leisure || tourism || tags.natural),
        description: this.getOutdoorDescription(leisure || tourism || tags.natural),
        duration: this.getOutdoorDuration(leisure || tourism || tags.natural),
        image: this.getOutdoorEmoji(leisure || tourism || tags.natural),
        weatherDependent: true
      };
    }

    // Cultural category
    if (['cinema', 'theatre', 'library', 'museum'].includes(amenity) ||
        ['museum', 'gallery', 'attraction'].includes(tourism)) {
      return {
        category: 'cultural' as const,
        mood: ['creative', 'peaceful', 'productive'],
        description: this.getCulturalDescription(amenity || tourism),
        duration: 120,
        image: this.getCulturalEmoji(amenity || tourism),
        weatherDependent: false
      };
    }

    // Shopping category
    if (['mall', 'department_store', 'books', 'art', 'music'].includes(shop)) {
      return {
        category: 'shopping' as const,
        mood: ['creative', 'social', 'productive'],
        description: this.getShoppingDescription(shop),
        duration: 90,
        image: '🛍️',
        weatherDependent: false
      };
    }

    return {
      category: null,
      mood: [] as ActivityMood[],
      description: '',
      duration: 60,
      image: '📍',
      weatherDependent: false
    };
  }

  private getFoodMood(amenity: string, _cuisine?: string): ActivityMood[] {
    const moodMap: Record<string, ActivityMood[]> = {
      'restaurant': ['social', 'romantic'],
      'cafe': ['relaxed', 'cozy', 'peaceful'],
      'bar': ['social', 'fun', 'energetic'],
      'pub': ['social', 'fun', 'cozy'],
      'fast_food': ['energetic', 'fun'],
      'bakery': ['cozy', 'peaceful'],
      'ice_cream': ['fun', 'cozy']
    };
    return moodMap[amenity] || ['social'];
  }

  private getFoodDescription(amenity: string, _cuisine?: string): string {
    const base = `Enjoy ${_cuisine ? `delicious ${_cuisine}` : 'great food'} at this local ${amenity}`;
    return `${base}. Perfect for a relaxing meal with friends or family.`;
  }

  private getFoodDuration(amenity: string): number {
    const durationMap: Record<string, number> = {
      'restaurant': 120,
      'cafe': 60,
      'bar': 150,
      'pub': 180,
      'fast_food': 30,
      'bakery': 20,
      'ice_cream': 15
    };
    return durationMap[amenity] || 90;
  }

  private getFoodEmoji(amenity: string): string {
    const emojiMap: Record<string, string> = {
      'restaurant': '🍽️',
      'cafe': '☕',
      'bar': '🍸',
      'pub': '🍺',
      'fast_food': '🍔',
      'bakery': '🥐',
      'ice_cream': '🍦'
    };
    return emojiMap[amenity] || '🍽️';
  }

  private getOutdoorMood(type: string): ActivityMood[] {
    const moodMap: Record<string, ActivityMood[]> = {
      'park': ['peaceful', 'relaxed'],
      'garden': ['peaceful', 'romantic'],
      'nature_reserve': ['peaceful', 'adventurous'],
      'sports_centre': ['energetic', 'productive'],
      'swimming_pool': ['energetic', 'fun'],
      'beach': ['relaxed', 'fun'],
      'viewpoint': ['peaceful', 'romantic'],
      'waterfall': ['adventurous', 'peaceful']
    };
    return moodMap[type] || ['peaceful'];
  }

  private getOutdoorDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'park': 'Relax and enjoy nature in this beautiful park setting',
      'garden': 'Stroll through carefully maintained gardens and landscapes',
      'nature_reserve': 'Explore pristine natural environments and wildlife',
      'sports_centre': 'Stay active with various sports and fitness activities',
      'swimming_pool': 'Cool off and exercise in refreshing waters',
      'beach': 'Enjoy sun, sand, and water activities',
      'viewpoint': 'Take in breathtaking panoramic views',
      'waterfall': 'Experience the power and beauty of cascading water'
    };
    return descriptions[type] || 'Enjoy outdoor activities in a natural setting';
  }

  private getOutdoorDuration(type: string): number {
    const durationMap: Record<string, number> = {
      'park': 90,
      'garden': 60,
      'nature_reserve': 180,
      'sports_centre': 120,
      'swimming_pool': 90,
      'beach': 240,
      'viewpoint': 45,
      'waterfall': 60
    };
    return durationMap[type] || 120;
  }

  private getOutdoorEmoji(type: string): string {
    const emojiMap: Record<string, string> = {
      'park': '🌳',
      'garden': '🌺',
      'nature_reserve': '🦋',
      'sports_centre': '🏃‍♂️',
      'swimming_pool': '🏊‍♀️',
      'beach': '🏖️',
      'viewpoint': '🏔️',
      'waterfall': '💧'
    };
    return emojiMap[type] || '🌿';
  }

  private getCulturalDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'cinema': 'Watch the latest movies in a comfortable theater setting',
      'theatre': 'Experience live performances and dramatic arts',
      'library': 'Discover books, knowledge, and quiet study spaces',
      'museum': 'Explore fascinating exhibits and cultural artifacts',
      'gallery': 'Appreciate art and creative expressions',
      'attraction': 'Visit notable landmarks and points of interest'
    };
    return descriptions[type] || 'Engage with culture and arts';
  }

  private getCulturalEmoji(type: string): string {
    const emojiMap: Record<string, string> = {
      'cinema': '🎬',
      'theatre': '🎭',
      'library': '📚',
      'museum': '🏛️',
      'gallery': '🎨',
      'attraction': '🏰'
    };
    return emojiMap[type] || '🎨';
  }

  private getShoppingDescription(shop: string): string {
    const descriptions: Record<string, string> = {
      'mall': 'Browse multiple stores and enjoy shopping variety',
      'department_store': 'Find everything you need in one convenient location',
      'books': 'Discover new reads and literary treasures',
      'art': 'Explore unique artworks and creative supplies',
      'music': 'Find your favorite tunes and musical instruments'
    };
    return descriptions[shop] || 'Enjoy a shopping experience';
  }

  private estimatePrice(tags: any): 'free' | 'low' | 'medium' | 'high' {
    const amenity = tags.amenity;
    const leisure = tags.leisure;
    
    if (['park', 'garden', 'library', 'viewpoint'].includes(amenity || leisure)) {
      return 'free';
    }
    if (['fast_food', 'cafe', 'bakery', 'ice_cream'].includes(amenity)) {
      return 'low';
    }
    if (['restaurant', 'pub', 'cinema', 'museum'].includes(amenity)) {
      return 'medium';
    }
    return 'medium';
  }

  private buildAddress(tags: any): string | undefined {
    const street = tags['addr:street'];
    const number = tags['addr:housenumber'];
    
    if (street && number) {
      return `${number} ${street}`;
    }
    return street || undefined;
  }

  private extractTags(tags: any): string[] {
    const extractedTags: string[] = [];
    
    if (tags.amenity) extractedTags.push(tags.amenity);
    if (tags.leisure) extractedTags.push(tags.leisure);
    if (tags.cuisine) extractedTags.push(tags.cuisine);
    if (tags.tourism) extractedTags.push(tags.tourism);
    
    return extractedTags;
  }

  private getTimeOfDay(tags: any): 'morning' | 'afternoon' | 'evening' | 'night' | 'any' {
    const amenity = tags.amenity;
    
    if (['cafe', 'bakery'].includes(amenity)) return 'morning';
    if (['bar', 'pub', 'cinema', 'theatre'].includes(amenity)) return 'evening';
    
    return 'any';
  }

  getFallbackData(filters: SearchFilters): Activity[] {
    return getFallbackActivitiesByFilters(
      filters.category,
      filters.mood,
      filters.limit || 10
    );
  }
}
