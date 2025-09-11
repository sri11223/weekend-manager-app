import { BaseApiService } from './baseService';
import { Activity, ApiResponse, SearchFilters, ActivityMood } from './types';
import { getFallbackActivitiesByFilters } from './fallbackData';

interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  runtime?: number;
  genre_ids: number[];
  genres?: { id: number; name: string }[];
}

interface TMDbResponse {
  results: TMDbMovie[];
  total_results: number;
  total_pages: number;
}

export class TMDbService extends BaseApiService {
  private readonly imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  private readonly apiKey = '151369cb9424205636edd98be743db99'; // From memory

  constructor() {
    super({
      baseUrl: 'https://api.themoviedb.org/3',
      apiKey: '151369cb9424205636edd98be743db99',
      timeout: 8000,
      retries: 2,
      cacheDuration: 60 * 60 * 1000, // 1 hour
    });
  }

  async getActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      let endpoint = '/movie/popular';
      
      // Choose endpoint based on mood
      if (filters.mood?.includes('adventurous')) {
        endpoint = '/movie/top_rated';
      } else if (filters.mood?.includes('fun')) {
        endpoint = '/movie/now_playing';
      } else if (filters.mood?.includes('romantic')) {
        endpoint = '/discover/movie?with_genres=10749'; // Romance genre
      }

      const url = `${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${this.apiKey}&language=en-US&page=1`;
      console.log('TMDb API URL:', url);
      
      const response = await this.makeRequest<TMDbResponse>(url);

      if (!response.success || !response.data) {
        return {
          success: false,
          data: null,
          error: response.error,
          source: response.source
        };
      }

      const activities = response.data.results
        .slice(0, filters.limit || 10)
        .map(movie => this.convertToActivity(movie, filters));

      return {
        success: true,
        data: this.applyFilters(activities, filters),
        source: response.source
      };
    } catch (error) {
      console.warn('TMDb API failed, using fallback data:', error);
      const fallbackActivities = getFallbackActivitiesByFilters(filters.category);
      return {
        success: true,
        data: fallbackActivities,
        source: 'fallback'
      };
    }
  }

  async searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    return this.getActivities(filters);
  }

  private convertToActivity(movie: TMDbMovie, filters: SearchFilters): Activity {
    const mood = this.getMoodFromGenres(movie.genre_ids, filters.mood);
    const timeOfDay = this.getTimeOfDayFromMood(mood);
    
    return {
      id: `tmdb-${movie.id}`,
      title: movie.title,
      description: movie.overview || 'Enjoy this popular movie at your local theater',
      category: 'entertainment',
      mood,
      duration: movie.runtime || 120,
      image: movie.poster_path ? this.getImageUrl(movie.poster_path) : '🎬',
      rating: movie.vote_average / 2, // Convert 10-point to 5-point scale
      price: 'medium',
      location: {
        name: 'Local Cinema',
        address: 'Various locations'
      },
      tags: this.getTagsFromGenres(movie.genre_ids),
      weatherDependent: false,
      timeOfDay
    };
  }

  private getMoodFromGenres(genreIds: number[], requestedMoods?: ActivityMood[]): ActivityMood[] {
    const genreMoodMap: Record<number, ActivityMood[]> = {
      28: ['energetic', 'adventurous'], // Action
      12: ['adventurous', 'energetic'], // Adventure
      16: ['fun', 'cozy'], // Animation
      35: ['fun', 'social'], // Comedy
      80: ['energetic', 'adventurous'], // Crime
      99: ['productive', 'creative'], // Documentary
      18: ['creative', 'peaceful'], // Drama
      10751: ['cozy', 'social'], // Family
      14: ['adventurous', 'creative'], // Fantasy
      36: ['productive', 'creative'], // History
      27: ['energetic', 'adventurous'], // Horror
      10402: ['creative', 'romantic'], // Music
      9648: ['energetic', 'creative'], // Mystery
      10749: ['romantic', 'cozy'], // Romance
      878: ['adventurous', 'creative'], // Science Fiction
      10770: ['cozy', 'social'], // TV Movie
      53: ['energetic', 'adventurous'], // Thriller
      10752: ['energetic', 'adventurous'], // War
      37: ['adventurous', 'energetic'] // Western
    };

    let moods: ActivityMood[] = [];
    
    for (const genreId of genreIds) {
      if (genreMoodMap[genreId]) {
        moods.push(...genreMoodMap[genreId]);
      }
    }

    // Remove duplicates
    moods = [...new Set(moods)];

    // If no moods found or requested moods provided, use defaults
    if (moods.length === 0) {
      moods = ['fun', 'relaxed'];
    }

    // Filter by requested moods if provided
    if (requestedMoods && requestedMoods.length > 0) {
      const filteredMoods = moods.filter(mood => requestedMoods.includes(mood));
      if (filteredMoods.length > 0) {
        moods = filteredMoods;
      }
    }

    return moods.slice(0, 3); // Limit to 3 moods
  }

  private getTimeOfDayFromMood(moods: ActivityMood[]): 'morning' | 'afternoon' | 'evening' | 'night' | 'any' {
    if (moods.includes('romantic')) return 'evening';
    if (moods.includes('energetic') || moods.includes('adventurous')) return 'afternoon';
    if (moods.includes('cozy') || moods.includes('peaceful')) return 'evening';
    return 'evening'; // Movies are typically evening activities
  }

  private getTagsFromGenres(genreIds: number[]): string[] {
    const genreMap: Record<number, string> = {
      28: 'action',
      12: 'adventure',
      16: 'animation',
      35: 'comedy',
      80: 'crime',
      99: 'documentary',
      18: 'drama',
      10751: 'family',
      14: 'fantasy',
      36: 'history',
      27: 'horror',
      10402: 'music',
      9648: 'mystery',
      10749: 'romance',
      878: 'sci-fi',
      53: 'thriller',
      10752: 'war',
      37: 'western'
    };

    return genreIds
      .map(id => genreMap[id])
      .filter(Boolean)
      .concat(['movie', 'cinema', 'entertainment']);
  }

  private getImageUrl(path: string): string {
    return path ? `${this.imageBaseUrl}${path}` : '🎬';
  }

  getFallbackData(filters: SearchFilters): Activity[] {
    return getFallbackActivitiesByFilters(
      'entertainment',
      filters.mood,
      filters.limit || 10
    );
  }

  // Legacy methods for backward compatibility
  async getNowPlayingMovies(): Promise<TMDbMovie[]> {
    const response = await this.makeRequest<TMDbResponse>(
      `/movie/now_playing?api_key=${this.apiKey}&language=en-US&page=1`
    );
    return response.success ? response.data?.results || [] : [];
  }

  async getPopularMovies(): Promise<TMDbMovie[]> {
    const response = await this.makeRequest<TMDbResponse>(
      `/movie/popular?api_key=${this.apiKey}&language=en-US&page=1`
    );
    return response.success ? response.data?.results || [] : [];
  }

  async searchMovies(query: string): Promise<TMDbMovie[]> {
    const response = await this.makeRequest<TMDbResponse>(
      `/search/movie?api_key=${this.apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );
    return response.success ? response.data?.results || [] : [];
  }
}
