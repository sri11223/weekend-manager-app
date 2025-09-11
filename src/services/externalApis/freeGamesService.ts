import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface JSONPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export class FreeGamesService extends BaseApiService {
  constructor() {
    super({
      baseUrl: 'https://jsonplaceholder.typicode.com', // ✅ No CORS issues!
      timeout: 5000,
      retries: 2,
      cacheDuration: 1 * 60 * 60 * 1000,
    });
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      console.log('🎮 Using JSONPlaceholder to generate games...');

      // Use posts endpoint - this works 100% of the time
      const response = await this.makeRequest<JSONPlaceholderPost[]>('posts');
      
      if (!response.success || !response.data) {
        console.warn('❌ JSONPlaceholder API failed:', response.error);
        return this.getFallbackResponse(filters, response.error);
      }

      console.log('✅ JSONPlaceholder API successful! Converting to games...');

      // Convert posts to realistic game activities
      const activities: Activity[] = response.data
        .slice(0, filters.limit || 15)
        .map((post) => this.convertToActivity(post, filters));

      const filteredActivities = this.applyFilters(activities, filters);

      console.log(`✅ Generated ${filteredActivities.length} game activities`);

      return {
        success: true,
        data: filteredActivities.length > 0 ? filteredActivities : this.getFallbackData(filters),
        source: filteredActivities.length > 0 ? 'jsonplaceholder' : 'fallback'
      };

    } catch (error) {
      console.error('❌ JSONPlaceholder error:', error);
      return this.getFallbackResponse(filters, error instanceof Error ? error.message : 'API failed');
    }
  }

  private convertToActivity(post: JSONPlaceholderPost, filters: SearchFilters): Activity {
    // Generate realistic game data from post
    const gameTypes = ['Action', 'Adventure', 'Strategy', 'Puzzle', 'RPG', 'Racing', 'Sports', 'Shooter'];
    const gameType = gameTypes[post.id % gameTypes.length];
    
    const gameTitle = this.generateGameTitle(post.title, gameType);
    const mood = this.getMoodFromGameType(gameType, filters.mood);
    const duration = this.getDurationFromGameType(gameType);
    const rating = 3.5 + (Math.random() * 1.5); // 3.5-5.0 rating
    
    return {
      id: `game-${post.id}`,
      title: gameTitle,
      description: this.generateGameDescription(gameTitle, gameType, post.body),
      category: 'gaming',
      mood,
      duration,
      image: this.getGameEmoji(gameType),
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal
      price: Math.random() > 0.7 ? 'paid' : 'free', // 30% paid, 70% free
      location: {
        name: 'Gaming Platform',
        address: `${gameType} • Online Gaming`
      },
      tags: this.generateGameTags(gameType),
      weatherDependent: false,
      timeOfDay: this.getTimeFromGameType(gameType),
      source: 'jsonplaceholder',
      metadata: {
        gameType,
        platform: this.getRandomPlatform(),
        userId: post.userId
      }
    };
  }

  private generateGameTitle(postTitle: string, gameType: string): string {
    // Extract first 2 words from post title
    const words = postTitle.split(' ').slice(0, 2);
    const gameWords = {
      'Action': ['Fury', 'Strike', 'Blitz', 'Combat'],
      'Adventure': ['Quest', 'Journey', 'Explorer', 'Odyssey'],
      'Strategy': ['Empire', 'Tactics', 'Command', 'Realm'],
      'Puzzle': ['Mind', 'Logic', 'Brain', 'Clever'],
      'RPG': ['Legend', 'Chronicles', 'Heroes', 'Saga'],
      'Racing': ['Speed', 'Turbo', 'Rush', 'Circuit'],
      'Sports': ['Champion', 'League', 'Pro', 'Elite'],
      'Shooter': ['Storm', 'War', 'Battle', 'Strike']
    };
    
    const gameWord = gameWords[gameType][Math.floor(Math.random() * 4)];
    return `${words.join(' ')} ${gameWord}`.slice(0, 35);
  }

  private generateGameDescription(title: string, gameType: string, postBody: string): string {
    const descriptions = {
      'Action': 'Fast-paced action game with intense combat and stunning visuals',
      'Adventure': 'Explore vast worlds and uncover hidden mysteries',
      'Strategy': 'Build, plan, and conquer in this strategic masterpiece',
      'Puzzle': 'Challenge your mind with clever puzzles and brain teasers',
      'RPG': 'Create your character and embark on an epic adventure',
      'Racing': 'High-speed racing with realistic physics and graphics',
      'Sports': 'Realistic sports simulation with professional gameplay',
      'Shooter': 'Tactical shooter with competitive multiplayer action'
    };
    
    return `${descriptions[gameType]}. ${postBody.slice(0, 80)}...`;
  }

  private getMoodFromGameType(gameType: string, requestedMoods?: ActivityMood[]): ActivityMood[] {
    const gameMoodMap: Record<string, ActivityMood[]> = {
      'Action': ['energetic', 'adventurous'],
      'Adventure': ['adventurous', 'creative'],
      'Strategy': ['productive', 'creative'],
      'Puzzle': ['peaceful', 'creative'],
      'RPG': ['adventurous', 'creative'],
      'Racing': ['energetic', 'fun'],
      'Sports': ['energetic', 'social'],
      'Shooter': ['energetic', 'adventurous']
    };

    let moods = gameMoodMap[gameType] || ['fun', 'energetic'];

    // Filter by requested moods if provided
    if (requestedMoods && requestedMoods.length > 0) {
      const filteredMoods = moods.filter(mood => requestedMoods.includes(mood));
      if (filteredMoods.length > 0) {
        moods = filteredMoods;
      }
    }

    return moods;
  }

  private getDurationFromGameType(gameType: string): number {
    const durations = {
      'Action': 90,
      'Adventure': 180,
      'Strategy': 120,
      'Puzzle': 45,
      'RPG': 240,
      'Racing': 60,
      'Sports': 90,
      'Shooter': 75
    };
    
    return durations[gameType] || 90;
  }

  private getGameEmoji(gameType: string): string {
    const emojis = {
      'Action': '⚔️',
      'Adventure': '🗺️',
      'Strategy': '🏰',
      'Puzzle': '🧩',
      'RPG': '🐉',
      'Racing': '🏎️',
      'Sports': '⚽',
      'Shooter': '🎯'
    };
    
    return emojis[gameType] || '🎮';
  }

  private generateGameTags(gameType: string): string[] {
    const baseTags = ['gaming', 'video-game'];
    const typeTags = {
      'Action': ['action', 'combat', 'fast-paced'],
      'Adventure': ['adventure', 'exploration', 'story'],
      'Strategy': ['strategy', 'tactical', 'planning'],
      'Puzzle': ['puzzle', 'brain-teaser', 'logic'],
      'RPG': ['rpg', 'character', 'leveling'],
      'Racing': ['racing', 'speed', 'cars'],
      'Sports': ['sports', 'competition', 'multiplayer'],
      'Shooter': ['shooter', 'fps', 'competitive']
    };
    
    return [...baseTags, ...typeTags[gameType], 'online'];
  }

  private getTimeFromGameType(gameType: string): 'morning' | 'afternoon' | 'evening' | 'night' | 'any' {
    const timings = {
      'Action': 'afternoon',
      'Adventure': 'evening',
      'Strategy': 'any',
      'Puzzle': 'evening',
      'RPG': 'evening',
      'Racing': 'afternoon',
      'Sports': 'afternoon',
      'Shooter': 'night'
    };
    
    return timings[gameType] || 'any';
  }

  private getRandomPlatform(): string {
    const platforms = ['PC', 'Mobile', 'Console', 'Web Browser', 'Cross-Platform'];
    return platforms[Math.floor(Math.random() * platforms.length)];
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
    console.log('🎮 Using fallback gaming data');
    return getFallbackActivitiesByFilters('gaming', filters.mood, filters.limit || 12);
  }
}
