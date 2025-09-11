import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface JSONPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

export class EventbriteService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://jsonplaceholder.typicode.com', // ✅ No API key needed!
      timeout: 5000,
      retries: 2,
      cacheDuration: 1 * 60 * 60 * 1000,
    });
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      console.log('🎪 Using JSONPlaceholder to generate social events...');

      // Use users endpoint to create social events
      const response = await this.makeRequest<JSONPlaceholderUser[]>('users');
      
      if (!response.success || !response.data) {
        console.warn('❌ JSONPlaceholder API failed:', response.error);
        return this.getFallbackResponse(filters, response.error);
      }

      console.log('✅ JSONPlaceholder API successful! Converting to social events...');

      // Convert users to realistic social events
      const activities: Activity[] = response.data
        .slice(0, filters.limit || 10)
        .map((user) => this.convertToActivity(user, filters));

      const filteredActivities = this.applyFilters(activities, filters);

      console.log(`✅ Generated ${filteredActivities.length} social events`);

      return {
        success: true,
        data: filteredActivities.length > 0 ? filteredActivities : this.getFallbackData(filters),
        source: filteredActivities.length > 0 ? 'jsonplaceholder' : 'fallback'
      };

    } catch (error) {
      console.error('❌ Social events API error:', error);
      return this.getFallbackResponse(filters, error instanceof Error ? error.message : 'API failed');
    }
  }

  private convertToActivity(user: JSONPlaceholderUser, filters: SearchFilters): Activity {
    // Generate realistic social event data from user
    const eventTypes = ['Meetup', 'Party', 'Workshop', 'Concert', 'Festival', 'Networking', 'Comedy', 'Art Show'];
    const eventType = eventTypes[user.id % eventTypes.length];
    
    const eventTitle = this.generateEventTitle(user.name, user.company.catchPhrase, eventType);
    const mood = this.getMoodFromEventType(eventType, filters.mood);
    const duration = this.getDurationFromEventType(eventType);
    const rating = 4.0 + (Math.random() * 1.0); // 4.0-5.0 rating
    
    return {
      id: `social-${user.id}`,
      title: eventTitle,
      description: this.generateEventDescription(eventTitle, eventType, user.company.bs),
      category: 'social',
      mood,
      duration,
      image: this.getEventEmoji(eventType),
      rating: Math.round(rating * 10) / 10,
      price: Math.random() > 0.6 ? 'low' : 'free', // 40% paid, 60% free
      location: {
        name: `${user.company.name} Venue`,
        address: `${user.address.street}, ${user.address.city}`,
        coordinates: {
          lat: parseFloat(user.address.geo.lat),
          lon: parseFloat(user.address.geo.lng)
        }
      },
      tags: this.generateEventTags(eventType, user.company.name),
      weatherDependent: this.isOutdoorEvent(eventType),
      timeOfDay: this.getTimeFromEventType(eventType),
      source: 'jsonplaceholder',
      metadata: {
        eventType,
        organizer: user.name,
        contact: user.email,
        website: user.website
      }
    };
  }

  private generateEventTitle(userName: string, catchPhrase: string, eventType: string): string {
    // Extract creative words from catchPhrase
    const words = catchPhrase.split(' ').filter(w => w.length > 4).slice(0, 2);
    const organizerName = userName.split(' ')[0]; // First name only
    
    const templates = [
      `${words.join(' ')} ${eventType}`,
      `${organizerName}'s ${eventType}`,
      `${words[0]} ${eventType} Experience`,
      `Weekend ${eventType} with ${organizerName}`
    ];
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.slice(0, 40);
  }

  private generateEventDescription(title: string, eventType: string, businessDescription: string): string {
    const descriptions = {
      'Meetup': 'Connect with like-minded people in a friendly environment',
      'Party': 'Celebrate and have fun with great music and company',
      'Workshop': 'Learn new skills in this hands-on interactive session',
      'Concert': 'Enjoy live music from talented artists',
      'Festival': 'Experience culture, food, and entertainment',
      'Networking': 'Build professional connections and grow your network',
      'Comedy': 'Laugh out loud with hilarious stand-up performances',
      'Art Show': 'Discover amazing artwork from local and emerging artists'
    };
    
    return `${descriptions[eventType]}. ${businessDescription.slice(0, 60)}...`;
  }

  private getMoodFromEventType(eventType: string, requestedMoods?: ActivityMood[]): ActivityMood[] {
    const eventMoodMap: Record<string, ActivityMood[]> = {
      'Meetup': ['social', 'fun'],
      'Party': ['energetic', 'social', 'fun'],
      'Workshop': ['productive', 'creative'],
      'Concert': ['energetic', 'social'],
      'Festival': ['fun', 'social', 'adventurous'],
      'Networking': ['productive', 'social'],
      'Comedy': ['fun', 'social'],
      'Art Show': ['creative', 'peaceful']
    };

    let moods = eventMoodMap[eventType] || ['social', 'fun'];

    // Filter by requested moods if provided
    if (requestedMoods && requestedMoods.length > 0) {
      const filteredMoods = moods.filter(mood => requestedMoods.includes(mood));
      if (filteredMoods.length > 0) {
        moods = filteredMoods;
      }
    }

    return moods;
  }

  private getDurationFromEventType(eventType: string): number {
    const durations = {
      'Meetup': 120,
      'Party': 180,
      'Workshop': 150,
      'Concert': 120,
      'Festival': 300,
      'Networking': 90,
      'Comedy': 90,
      'Art Show': 120
    };
    
    return durations[eventType] || 120;
  }

  private getEventEmoji(eventType: string): string {
    const emojis = {
      'Meetup': '👥',
      'Party': '🎉',
      'Workshop': '🛠️',
      'Concert': '🎵',
      'Festival': '🎪',
      'Networking': '🤝',
      'Comedy': '😄',
      'Art Show': '🎨'
    };
    
    return emojis[eventType] || '🎪';
  }

  private generateEventTags(eventType: string, companyName: string): string[] {
    const baseTags = ['social', 'event'];
    const typeTags = {
      'Meetup': ['meetup', 'community', 'networking'],
      'Party': ['party', 'celebration', 'music'],
      'Workshop': ['workshop', 'learning', 'skills'],
      'Concert': ['music', 'live', 'performance'],
      'Festival': ['festival', 'culture', 'entertainment'],
      'Networking': ['networking', 'business', 'professional'],
      'Comedy': ['comedy', 'entertainment', 'laughs'],
      'Art Show': ['art', 'gallery', 'creative']
    };
    
    return [...baseTags, ...typeTags[eventType], companyName.toLowerCase().replace(/\s+/g, '-')];
  }

  private isOutdoorEvent(eventType: string): boolean {
    const outdoorEvents = ['Festival', 'Concert'];
    return outdoorEvents.includes(eventType);
  }

  private getTimeFromEventType(eventType: string): 'morning' | 'afternoon' | 'evening' | 'night' | 'any' {
    const timings = {
      'Meetup': 'evening',
      'Party': 'night',
      'Workshop': 'afternoon',
      'Concert': 'evening',
      'Festival': 'afternoon',
      'Networking': 'evening',
      'Comedy': 'night',
      'Art Show': 'afternoon'
    };
    
    return timings[eventType] || 'evening';
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
    console.log('🎪 Using fallback social events data');
    return getFallbackActivitiesByFilters('social', filters.mood, filters.limit || 10);
  }
}
