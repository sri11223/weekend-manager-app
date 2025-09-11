import { ApiResponse, ApiServiceConfig, Activity, SearchFilters, ActivityMood } from './types';

export abstract class BaseApiService {
  protected config: ApiServiceConfig;
  private cache = new Map<string, { data: any; timestamp: number }>();

  constructor(config: ApiServiceConfig) {
    this.config = config;
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.config.cacheDuration) {
      return {
        success: true,
        data: cached.data,
        source: 'api'
      };
    }

    let retries = this.config.retries;
    let abortController = new AbortController();
    
    while (retries >= 0) {
      try {
        const timeoutId = setTimeout(() => abortController.abort(), this.config.timeout);

        // ✅ FIXED: Proper URL construction with slash handling
        const baseUrl = this.config.baseUrl.endsWith('/') 
          ? this.config.baseUrl.slice(0, -1) 
          : this.config.baseUrl;
        const cleanEndpoint = endpoint.startsWith('/') 
          ? endpoint.slice(1) 
          : endpoint;
        const fullUrl = `${baseUrl}/${cleanEndpoint}`;
        
        console.log('Making API request to:', fullUrl);
        
        const response = await fetch(fullUrl, {
          method: options.method || 'GET',
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
            ...(this.config.apiKey && { 'X-Api-Key': this.config.apiKey }),
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        // Check if response has content before parsing JSON
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          if (text.trim()) {
            try {
              data = JSON.parse(text);
            } catch (parseError) {
              console.warn('Failed to parse JSON response:', text);
              throw new Error('Invalid JSON response from API');
            }
          } else {
            // Empty response - treat as null
            data = null;
          }
        } else {
          // Non-JSON response
          data = await response.text();
        }
        
        // Cache successful response
        this.cache.set(cacheKey, { data, timestamp: Date.now() });
        
        return {
          success: true,
          data,
          source: 'api'
        };
      } catch (error) {
        retries--;
        if (retries < 0) {
          console.warn(`API request failed after retries: ${error}`);
          return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
            source: 'api'
          };
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        abortController = new AbortController(); // ✅ Reset controller for retry
      }
    }

    return {
      success: false,
      data: null,
      error: 'Max retries exceeded',
      source: 'api'
    };
  }

  protected filterByMood(activities: Activity[], moods?: ActivityMood[]): Activity[] {
    if (!moods || moods.length === 0) return activities;
    
    return activities.filter(activity => 
      activity.mood.some(mood => moods.includes(mood))
    );
  }

  protected applyFilters(activities: Activity[], filters: SearchFilters): Activity[] {
    let filtered = [...activities];

    if (filters.category) {
      filtered = filtered.filter(activity => activity.category === filters.category);
    }

    if (filters.mood && filters.mood.length > 0) {
      filtered = this.filterByMood(filtered, filters.mood);
    }

    if (filters.priceRange && filters.priceRange.length > 0) {
      filtered = filtered.filter(activity => 
        activity.price && filters.priceRange!.includes(activity.price)
      );
    }

    if (filters.timeOfDay && filters.timeOfDay.length > 0) {
      filtered = filtered.filter(activity => 
        !activity.timeOfDay || 
        activity.timeOfDay === 'any' || 
        filters.timeOfDay!.includes(activity.timeOfDay)
      );
    }

    if (filters.weatherDependent !== undefined) {
      filtered = filtered.filter(activity => 
        activity.weatherDependent === filters.weatherDependent
      );
    }

    if (filters.limit) {
      filtered = filtered.slice(0, filters.limit);
    }

    return filtered;
  }

  // Abstract methods to be implemented by each service
  abstract searchActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>>;
  abstract getFallbackData(filters: SearchFilters): Activity[];
  
  // Main method that handles API calls with fallback
  async getActivities(filters: SearchFilters): Promise<ApiResponse<Activity[]>> {
    try {
      const apiResult = await this.searchActivities(filters);
      
      if (apiResult.success && apiResult.data && apiResult.data.length > 0) {
        return apiResult;
      }
      
      // Fallback to static data
      const fallbackData = this.getFallbackData(filters);
      return {
        success: true,
        data: fallbackData,
        source: 'fallback'
      };
    } catch (error) {
      // Fallback to static data on any error
      const fallbackData = this.getFallbackData(filters);
      return {
        success: true,
        data: fallbackData,
        source: 'fallback',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}
