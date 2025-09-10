// TMDb API for movies
class EntertainmentService {
    private tmdbApiKey = '151369cb9424205636edd98be743db99'
    
    async getPopularMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${this.tmdbApiKey}`
      )
      return response.json()
    }
    
    async getNowPlayingMovies() {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${this.tmdbApiKey}`
      )
      return response.json()
    }
    
    // Convert to our activity format
    formatMovieAsActivity(movie: any) {
      return {
        id: `movie-${movie.id}`,
        title: movie.title,
        category: 'Movies & Shows',
        duration: 120, // Default 2 hours
        cost: 15, // Average movie ticket
        weatherPreference: 'indoor',
        description: movie.overview,
        image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        rating: movie.vote_average
      }
    }
  }
  