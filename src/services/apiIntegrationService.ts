import { Activity } from '../components/features/DraggableActivityCard'

// Games API Service
class GamesService {
  async getFreeGames(): Promise<any[]> {
    try {
      const response = await fetch('https://www.freetogame.com/api/games')
      if (!response.ok) throw new Error('Failed to fetch games')
      return await response.json()
    } catch (error) {
      console.error('Games API error:', error)
      return []
    }
  }
  
  async getGamesByGenre(genre: string): Promise<any[]> {
    try {
      const response = await fetch(`https://www.freetogame.com/api/games?category=${genre}`)
      if (!response.ok) throw new Error('Failed to fetch games by genre')
      return await response.json()
    } catch (error) {
      console.error('Games API error:', error)
      return []
    }
  }
  
  formatGameAsActivity(game: any): Activity {
    return {
      id: `game-${game.id}`,
      title: game.title,
      category: 'entertainment',
      duration: 180, // 3 hours gaming session
      cost: 0, // Free games!
      weatherPreference: 'indoor',
      description: game.short_description || 'Free-to-play game',
      image: game.thumbnail || '/api/placeholder/300/200',
      moodTags: ['fun', 'engaging', 'social'],
      popularity: Math.floor(Math.random() * 100) + 1,
      isApiGenerated: true,
      apiSource: 'freetogame'
    }
  }
}

// Entertainment API Service (TMDb)
class EntertainmentService {
  private tmdbApiKey = '151369cb9424205636edd98be743db99'
  
  async getPopularMovies(): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.tmdbApiKey}&language=en-US&page=1`
      )
      if (!response.ok) throw new Error('Failed to fetch popular movies')
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('TMDb API error:', error)
      return []
    }
  }
  
  async getNowPlayingMovies(): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.tmdbApiKey}&language=en-US&page=1`
      )
      if (!response.ok) throw new Error('Failed to fetch now playing movies')
      const data = await response.json()
      return data.results || []
    } catch (error) {
      console.error('TMDb API error:', error)
      return []
    }
  }
  
  formatMovieAsActivity(movie: any): Activity {
    return {
      id: `movie-${movie.id}`,
      title: movie.title,
      category: 'entertainment',
      duration: 120, // Default 2 hours
      cost: 15, // Average movie ticket
      weatherPreference: 'indoor',
      description: movie.overview || 'Popular movie',
      image: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : '/api/placeholder/300/400',
      moodTags: ['entertaining', 'relaxing', 'social'],
      popularity: Math.round(movie.vote_average * 10),
      isApiGenerated: true,
      apiSource: 'tmdb'
    }
  }
}

// Restaurant/Food API Service (using a free API)
class FoodService {
  async getRestaurantsByLocation(lat: number, lon: number): Promise<any[]> {
    try {
      // Fallback to mock restaurants due to CORS issues with Overpass API
      const mockRestaurants = [
        { id: 1, tags: { name: 'Italian Bistro', cuisine: 'Italian' } },
        { id: 2, tags: { name: 'Sushi Palace', cuisine: 'Japanese' } },
        { id: 3, tags: { name: 'BBQ House', cuisine: 'American' } },
        { id: 4, tags: { name: 'Thai Garden', cuisine: 'Thai' } },
        { id: 5, tags: { name: 'French Café', cuisine: 'French' } },
        { id: 6, tags: { name: 'Mexican Cantina', cuisine: 'Mexican' } },
        { id: 7, tags: { name: 'Indian Spice', cuisine: 'Indian' } },
        { id: 8, tags: { name: 'Greek Taverna', cuisine: 'Greek' } }
      ]
      return mockRestaurants
    } catch (error) {
      console.error('Food API error:', error)
      return []
    }
  }
  
  formatRestaurantAsActivity(restaurant: any): Activity {
    const name = restaurant.tags?.name || 'Local Restaurant'
    const cuisine = restaurant.tags?.cuisine || 'Various'
    
    return {
      id: `restaurant-${restaurant.id}`,
      title: name,
      category: 'food',
      duration: 90, // 1.5 hours dining
      cost: 25, // Average meal cost
      weatherPreference: 'any',
      description: `${cuisine} cuisine restaurant`,
      image: '/api/placeholder/300/200',
      moodTags: ['social', 'delicious', 'relaxing'],
      popularity: Math.floor(Math.random() * 100) + 1,
      isApiGenerated: true,
      apiSource: 'overpass'
    }
  }
}

// Main API Integration Service
export class ApiIntegrationService {
  private gamesService = new GamesService()
  private entertainmentService = new EntertainmentService()
  private foodService = new FoodService()
  
  async getActivitiesByTheme(theme: string, limit: number = 10): Promise<Activity[]> {
    const activities: Activity[] = []
    
    try {
      switch (theme) {
        case 'lazy':
          // Get movies and games for lazy weekend
          const [movies, games] = await Promise.all([
            this.entertainmentService.getPopularMovies(),
            this.gamesService.getFreeGames()
          ])
          
          activities.push(
            ...movies.slice(0, 5).map(movie => this.entertainmentService.formatMovieAsActivity(movie)),
            ...games.slice(0, 5).map(game => this.gamesService.formatGameAsActivity(game))
          )
          break
          
        case 'adventurous':
          // For adventurous, we'll focus on games and some entertainment
          const adventureGames = await this.gamesService.getGamesByGenre('action')
          activities.push(
            ...adventureGames.slice(0, limit).map(game => this.gamesService.formatGameAsActivity(game))
          )
          break
          
        case 'romantic':
          // Get romantic movies and nice restaurants
          const romanticMovies = await this.entertainmentService.getPopularMovies()
          activities.push(
            ...romanticMovies.slice(0, limit).map(movie => ({
              ...this.entertainmentService.formatMovieAsActivity(movie),
              moodTags: ['romantic', 'intimate', 'cozy']
            }))
          )
          break
          
        case 'family':
          // Family-friendly content
          const familyMovies = await this.entertainmentService.getPopularMovies()
          const familyGames = await this.gamesService.getGamesByGenre('family')
          
          activities.push(
            ...familyMovies.slice(0, 5).map(movie => ({
              ...this.entertainmentService.formatMovieAsActivity(movie),
              moodTags: ['family', 'fun', 'wholesome']
            })),
            ...familyGames.slice(0, 5).map(game => this.gamesService.formatGameAsActivity(game))
          )
          break
          
        default:
          // Default mix of content
          const [defaultMovies, defaultGames] = await Promise.all([
            this.entertainmentService.getPopularMovies(),
            this.gamesService.getFreeGames()
          ])
          
          activities.push(
            ...defaultMovies.slice(0, 5).map(movie => this.entertainmentService.formatMovieAsActivity(movie)),
            ...defaultGames.slice(0, 5).map(game => this.gamesService.formatGameAsActivity(game))
          )
      }
    } catch (error) {
      console.error('Error fetching themed activities:', error)
    }
    
    return activities.slice(0, limit)
  }
  
  async getActivitiesByCategory(category: string, limit: number = 10): Promise<Activity[]> {
    const activities: Activity[] = []
    
    try {
      switch (category) {
        case 'entertainment':
          const [movies, games] = await Promise.all([
            this.entertainmentService.getPopularMovies(),
            this.gamesService.getFreeGames()
          ])
          
          activities.push(
            ...movies.slice(0, 5).map(movie => this.entertainmentService.formatMovieAsActivity(movie)),
            ...games.slice(0, 5).map(game => this.gamesService.formatGameAsActivity(game))
          )
          break
          
        case 'food':
          // For now, we'll create some sample food activities
          // In a real app, you'd use user's location
          const sampleRestaurants = [
            { id: 1, tags: { name: 'Italian Bistro', cuisine: 'Italian' } },
            { id: 2, tags: { name: 'Sushi Palace', cuisine: 'Japanese' } },
            { id: 3, tags: { name: 'BBQ House', cuisine: 'American' } },
            { id: 4, tags: { name: 'Thai Garden', cuisine: 'Thai' } },
            { id: 5, tags: { name: 'French Café', cuisine: 'French' } }
          ]
          
          activities.push(
            ...sampleRestaurants.map(restaurant => this.foodService.formatRestaurantAsActivity(restaurant))
          )
          break
          
        default:
          // Return mixed content for other categories
          const mixedMovies = await this.entertainmentService.getPopularMovies()
          activities.push(
            ...mixedMovies.slice(0, limit).map(movie => this.entertainmentService.formatMovieAsActivity(movie))
          )
      }
    } catch (error) {
      console.error('Error fetching activities by category:', error)
    }
    
    return activities.slice(0, limit)
  }
  
  async searchActivities(query: string, limit: number = 10): Promise<Activity[]> {
    const activities: Activity[] = []
    
    try {
      // Search movies
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${this.entertainmentService['tmdbApiKey']}&query=${encodeURIComponent(query)}`
      )
      
      if (movieResponse.ok) {
        const movieData = await movieResponse.json()
        activities.push(
          ...movieData.results.slice(0, 5).map((movie: any) => 
            this.entertainmentService.formatMovieAsActivity(movie)
          )
        )
      }
      
      // Search games (filter by title)
      const games = await this.gamesService.getFreeGames()
      const filteredGames = games.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase())
      )
      
      activities.push(
        ...filteredGames.slice(0, 5).map(game => this.gamesService.formatGameAsActivity(game))
      )
      
    } catch (error) {
      console.error('Error searching activities:', error)
    }
    
    return activities.slice(0, limit)
  }
}

export const apiIntegrationService = new ApiIntegrationService()
