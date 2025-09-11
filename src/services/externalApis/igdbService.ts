import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  storyline?: string;
  rating?: number;
  rating_count?: number;
  first_release_date?: number;
  genres?: { id: number; name: string }[];
  platforms?: { id: number; name: string }[];
  cover?: {
    id: number;
    url: string;
    image_id: string;
  };
  screenshots?: {
    id: number;
    url: string;
    image_id: string;
  }[];
  game_modes?: { id: number; name: string }[];
  player_perspectives?: { id: number; name: string }[];
  themes?: { id: number; name: string }[];
}

interface IGDBAuthResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export class IGDBService extends BaseApiService {
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;
  private readonly clientId = 'your_twitch_client_id'; // Would need to be configured
  private readonly clientSecret = 'your_twitch_client_secret'; // Would need to be configured

  constructor() {
    super({
      baseUrl: 'https://api.igdb.com/v4',
      timeout: 10000,
      retries: 2,
      cacheDuration: 4 * 60 * 60 * 1000, // 4 hours
    });
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      // IGDB requires OAuth token - for now, return fallback data
      // In production, you would implement proper OAuth flow
      console.warn('IGDB service requires OAuth token - using fallback data');
      
      return {
        success: true,
        data: this.getFallbackData(filters),
        source: 'fallback',
        error: 'IGDB API requires OAuth authentication'
      };

      // Commented out actual API implementation for reference:
      /*
      const token = await this.getAccessToken();
      if (!token) {
        return {
          success: false,
          data: null,
          error: 'Failed to authenticate with IGDB API',
          source: 'api'
        };
      }

      const query = this.buildIGDBQuery(filters);
      
      const response = await fetch(`${this.config.baseUrl}/games`, {
        method: 'POST',
        headers: {
          'Client-ID': this.clientId,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'text/plain',
        },
        body: query,
      });

      if (!response.ok) {
        throw new Error(`IGDB API error: ${response.status}`);
      }

      const games: IGDBGame[] = await response.json();
      const activities = games.map(game => this.convertToActivity(game, filters));

      return {
        success: true,
        data: this.applyFilters(activities, filters),
        source: 'api'
      };
      */
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'api'
      };
    }
  }

  private async getAccessToken(): Promise<string | null> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      });

      if (!response.ok) {
        throw new Error(`OAuth error: ${response.status}`);
      }

      const data: IGDBAuthResponse = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get IGDB access token:', error);
      return null;
    }
  }

  private buildIGDBQuery(filters: SearchFilters): string {
    const limit = filters.limit || 10;
    let query = `fields name,summary,rating,rating_count,first_release_date,genres.name,platforms.name,cover.url,game_modes.name,themes.name; limit ${limit};`;

    // Filter by mood-based genres
    if (filters.mood && filters.mood.length > 0) {
      const genreFilters = this.getGenreFiltersFromMood(filters.mood);
      if (genreFilters.length > 0) {
        query += ` where genres = (${genreFilters.join(',')});`;
      }
    }

    // Sort by rating
    query += ' sort rating desc;';

    return query;
  }

  private getGenreFiltersFromMood(moods: ActivityMood[]): number[] {
    const moodGenreMap: Record<ActivityMood, number[]> = {
      'adventurous': [31, 32, 33], // Adventure, Indie, Arcade
      'energetic': [4, 5, 10], // Fighting, Shooter, Racing
      'fun': [33, 34, 9], // Arcade, Visual Novel, Puzzle
      'social': [36, 11, 8], // MOBA, Real Time Strategy, Platform
      'creative': [16, 26, 9], // Turn-based strategy, Quiz/Trivia, Puzzle
      'relaxed': [13, 15, 2], // Simulator, Strategy, Point-and-click
      'peaceful': [13, 15, 34], // Simulator, Strategy, Visual Novel
      'romantic': [34, 25], // Visual Novel, Hack and slash/Beat 'em up
      'cozy': [13, 34, 9], // Simulator, Visual Novel, Puzzle
      'productive': [15, 16, 26] // Strategy, Turn-based strategy, Quiz/Trivia
    };

    let genreIds: number[] = [];
    for (const mood of moods) {
      if (moodGenreMap[mood]) {
        genreIds.push(...moodGenreMap[mood]);
      }
    }

    return [...new Set(genreIds)]; // Remove duplicates
  }

  private convertToActivity(game: IGDBGame, filters: SearchFilters): Activity {
    const mood = this.getMoodFromGenres(game.genres, filters.mood);
    const duration = this.getDurationFromGameModes(game.game_modes);
    const image = this.getImageFromGame(game);
    const price = this.getPriceFromPlatforms(game.platforms);

    return {
      id: `igdb-${game.id}`,
      title: game.name,
      description: game.summary || game.storyline || 'Enjoy this popular video game',
      category: 'gaming',
      mood,
      duration,
      image,
      rating: game.rating ? game.rating / 20 : 4.0, // Convert 100-point to 5-point scale
      price,
      location: {
        name: 'Gaming Setup',
        address: 'At home or gaming center'
      },
      tags: this.getTagsFromGame(game),
      weatherDependent: false,
      timeOfDay: this.getTimeOfDayFromMood(mood)
    };
  }

  private getMoodFromGenres(genres?: { id: number; name: string }[], requestedMoods?: ActivityMood[]): ActivityMood[] {
    if (!genres || genres.length === 0) {
      return ['fun', 'energetic'];
    }

    const genreMoodMap: Record<string, ActivityMood[]> = {
      'Adventure': ['adventurous', 'energetic'],
      'Fighting': ['energetic', 'fun'],
      'Shooter': ['energetic', 'adventurous'],
      'Racing': ['energetic', 'fun'],
      'Puzzle': ['creative', 'peaceful'],
      'Strategy': ['productive', 'creative'],
      'Simulator': ['relaxed', 'peaceful'],
      'Visual Novel': ['romantic', 'cozy'],
      'Arcade': ['fun', 'energetic'],
      'Indie': ['creative', 'cozy'],
      'MOBA': ['social', 'energetic'],
      'Platform': ['fun', 'energetic'],
      'Point-and-click': ['peaceful', 'creative'],
      'Turn-based strategy': ['productive', 'creative'],
      'Quiz/Trivia': ['productive', 'social']
    };

    let moods: ActivityMood[] = [];
    
    for (const genre of genres) {
      if (genreMoodMap[genre.name]) {
        moods.push(...genreMoodMap[genre.name]);
      }
    }

    // Remove duplicates
    moods = [...new Set(moods)];

    // Default moods if none found
    if (moods.length === 0) {
      moods = ['fun', 'energetic'];
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

  private getDurationFromGameModes(gameModes?: { id: number; name: string }[]): number {
    if (!gameModes || gameModes.length === 0) {
      return 120; // Default 2 hours
    }

    // Different game modes have different typical session lengths
    const modeDurations: Record<string, number> = {
      'Single player': 180, // 3 hours
      'Multiplayer': 90, // 1.5 hours
      'Co-operative': 120, // 2 hours
      'Split screen': 90, // 1.5 hours
      'Massively Multiplayer Online (MMO)': 240, // 4 hours
      'Battle Royale': 60 // 1 hour
    };

    for (const mode of gameModes) {
      if (modeDurations[mode.name]) {
        return modeDurations[mode.name];
      }
    }

    return 120; // Default
  }

  private getImageFromGame(game: IGDBGame): string {
    if (game.cover?.url) {
      // IGDB image URLs need to be formatted properly
      return `https:${game.cover.url.replace('t_thumb', 't_cover_big')}`;
    }

    if (game.screenshots && game.screenshots.length > 0) {
      return `https:${game.screenshots[0].url.replace('t_thumb', 't_screenshot_med')}`;
    }

    return '🎮'; // Fallback emoji
  }

  private getPriceFromPlatforms(platforms?: { id: number; name: string }[]): 'free' | 'low' | 'medium' | 'high' {
    if (!platforms || platforms.length === 0) {
      return 'medium';
    }

    // Check for free platforms
    const freePlatforms = ['Web browser', 'Android', 'iOS'];
    if (platforms.some(p => freePlatforms.includes(p.name))) {
      return 'free';
    }

    // Check for budget platforms
    const budgetPlatforms = ['PC (Microsoft Windows)', 'Mac', 'Linux'];
    if (platforms.some(p => budgetPlatforms.includes(p.name))) {
      return 'low';
    }

    // Console games are typically medium to high price
    return 'medium';
  }

  private getTagsFromGame(game: IGDBGame): string[] {
    const tags = ['gaming', 'video game'];

    if (game.genres) {
      tags.push(...game.genres.map(g => g.name.toLowerCase()));
    }

    if (game.platforms) {
      tags.push(...game.platforms.map(p => p.name.toLowerCase()));
    }

    if (game.game_modes) {
      tags.push(...game.game_modes.map(m => m.name.toLowerCase()));
    }

    return tags;
  }

  private getTimeOfDayFromMood(moods: ActivityMood[]): 'morning' | 'afternoon' | 'evening' | 'night' | 'any' {
    if (moods.includes('energetic') || moods.includes('social')) return 'afternoon';
    if (moods.includes('peaceful') || moods.includes('cozy')) return 'evening';
    if (moods.includes('adventurous')) return 'afternoon';
    return 'any';
  }

  getFallbackData(filters: SearchFilters): Activity[] {
    return getFallbackActivitiesByFilters(
      'gaming',
      filters.mood,
      filters.limit || 10
    );
  }
}
