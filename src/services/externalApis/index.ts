// Export all API services and types
export * from './types';
export * from './baseService';
export * from './fallbackData';

// Individual services
export { OverpassService } from './overpassService';
export { TMDbService } from './tmdbService';
export { OpenTripMapService } from './openTripMapService';
export { IGDBService } from './igdbService';
export { EventbriteService } from './eventbriteService';

// Main API manager
export { ApiManager, apiManager } from './apiManager';

// Convenience exports
export type {
  Activity,
  ApiResponse,
  SearchFilters,
  ActivityCategory,
  ActivityMood,
  Location,
  ApiServiceConfig
} from './types';
