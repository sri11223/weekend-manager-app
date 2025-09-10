// Free Games API - No API key needed!
class GamesService {
    async getFreeGames() {
      const response = await fetch('https://www.freetogame.com/api/games')
      return response.json()
    }
    
    async getGamesByGenre(genre: string) {
      const response = await fetch(
        `https://www.freetogame.com/api/games?category=${genre}`
      )
      return response.json()
    }
    
    // Convert to our activity format
    formatGameAsActivity(game: any) {
      return {
        id: `game-${game.id}`,
        title: game.title,
        category: 'Gaming',
        duration: 180, // 3 hours gaming session
        cost: 0, // Free games!
        weatherPreference: 'indoor',
        description: game.short_description,
        image: game.thumbnail,
        genre: game.genre,
        platform: game.platform
      }
    }
  }
  