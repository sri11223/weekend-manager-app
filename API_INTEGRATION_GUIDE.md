# 🚀 API Integration Guide - Complete Structure & Requirements

## 🎬 1. TMDb (Movies) - DETAILED SETUP

### Authentication
```javascript
// Required: API Key (Free)
const API_KEY = 'your_api_key_here'
const BASE_URL = 'https://api.themoviedb.org/3'

// Headers Required
headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Key Endpoints & Parameters
```javascript
// 1. Now Playing Movies
GET /movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=US

// 2. Popular Movies  
GET /movie/popular?api_key=${API_KEY}&language=en-US&page=1

// 3. Search Movies
GET /search/movie?api_key=${API_KEY}&query=${searchTerm}&page=1

// 4. Movie Details
GET /movie/${movie_id}?api_key=${API_KEY}&language=en-US

// 5. Movie Showtimes (External API needed)
// TMDb doesn't provide showtimes - use Fandango or local theater APIs
```

### Response Structure
```javascript
{
  "results": [
    {
      "id": 123456,
      "title": "Movie Title",
      "overview": "Movie description...",
      "poster_path": "/path/to/poster.jpg",
      "backdrop_path": "/path/to/backdrop.jpg", 
      "release_date": "2024-01-15",
      "vote_average": 7.8,
      "genre_ids": [28, 12, 878],
      "runtime": 142
    }
  ]
}
```

## 🍽️ 2. OpenStreetMap Overpass (Food & Outdoor) - NO API KEY

### Query Structure
```javascript
// Base URL
const OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

// Query Format (Overpass QL)
const foodQuery = `
[out:json][timeout:25];
(
  node["amenity"~"restaurant|cafe|bar|fast_food"](around:5000,${lat},${lon});
  way["amenity"~"restaurant|cafe|bar|fast_food"](around:5000,${lat},${lon});
  relation["amenity"~"restaurant|cafe|bar|fast_food"](around:5000,${lat},${lon});
);
out geom;
`

// Outdoor Query
const outdoorQuery = `
[out:json][timeout:25];
(
  node["leisure"~"park|nature_reserve|playground"](around:10000,${lat},${lon});
  way["leisure"~"park|nature_reserve|playground"](around:10000,${lat},${lon});
  node["tourism"~"attraction|viewpoint"](around:10000,${lat},${lon});
);
out geom;
`
```

### Request Method
```javascript
// POST request with query in body
fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: query
})
```

### Response Structure
```javascript
{
  "elements": [
    {
      "type": "node",
      "id": 123456789,
      "lat": 40.7128,
      "lon": -74.0060,
      "tags": {
        "amenity": "restaurant",
        "name": "Restaurant Name",
        "cuisine": "italian",
        "phone": "+1234567890",
        "website": "https://example.com",
        "opening_hours": "Mo-Su 11:00-22:00"
      }
    }
  ]
}
```

## 🎮 3. IGDB (Games) - Twitch Authentication Required

### Authentication Setup
```javascript
// Step 1: Get Twitch Client Credentials
const CLIENT_ID = 'your_twitch_client_id'
const CLIENT_SECRET = 'your_twitch_client_secret'

// Step 2: Get Access Token
const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`
})

// Step 3: Use Token for IGDB
const headers = {
  'Client-ID': CLIENT_ID,
  'Authorization': `Bearer ${access_token}`,
  'Content-Type': 'text/plain'
}
```

### IGDB Query Structure
```javascript
// Base URL
const IGDB_URL = 'https://api.igdb.com/v4'

// Query Examples
const gamesQuery = `
fields name,summary,cover.url,rating,platforms.name,release_dates.date;
where rating > 75 & platforms = (6,48,49);
sort rating desc;
limit 20;
`

// Search Query
const searchQuery = `
search "${searchTerm}";
fields name,summary,cover.url,rating,platforms.name;
limit 10;
`
```

### Request Method
```javascript
fetch('https://api.igdb.com/v4/games', {
  method: 'POST',
  headers: headers,
  body: query
})
```

## 👥 4. Eventbrite API - API Key Required

### Authentication
```javascript
const API_KEY = 'your_eventbrite_api_key'
const BASE_URL = 'https://www.eventbriteapi.com/v3'

headers: {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
}
```

### Key Endpoints
```javascript
// 1. Search Events
GET /events/search/?location.address=${city}&location.within=25mi&start_date.range_start=${date}

// 2. Event Categories
GET /categories/

// 3. Event Details
GET /events/${event_id}/

// Parameters
{
  'location.address': 'New York, NY',
  'location.within': '25mi',
  'start_date.range_start': '2024-01-15T00:00:00Z',
  'categories': '103', // Music category
  'sort_by': 'date'
}
```

## 🗺️ 5. OpenTripMap - NO API KEY (Basic) / API KEY (Advanced)

### Basic Usage (No Key)
```javascript
const BASE_URL = 'https://api.opentripmap.com/0.1/en/places'

// Get places by coordinates
GET /radius?radius=5000&lon=${lon}&lat=${lat}&kinds=museums,monuments&format=json

// Get place details
GET /xid/${xid}?format=json
```

### With API Key (More requests)
```javascript
headers: {
  'apikey': 'your_opentripmap_key'
}
```

## 🔧 IMPLEMENTATION STRUCTURE

### 1. Environment Variables (.env)
```bash
REACT_APP_TMDB_API_KEY=your_tmdb_key
REACT_APP_TWITCH_CLIENT_ID=your_twitch_client_id  
REACT_APP_TWITCH_CLIENT_SECRET=your_twitch_secret
REACT_APP_EVENTBRITE_API_KEY=your_eventbrite_key
REACT_APP_OPENTRIPMAP_API_KEY=your_opentripmap_key
```

### 2. Error Handling Pattern
```javascript
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    return { success: true, data }
    
  } catch (error) {
    console.error('API Error:', error)
    return { success: false, error: error.message }
  }
}
```

### 3. Rate Limiting & Caching
```javascript
class APICache {
  private cache = new Map()
  private readonly TTL = 15 * 60 * 1000 // 15 minutes
  
  get(key: string) {
    const item = this.cache.get(key)
    if (item && Date.now() - item.timestamp < this.TTL) {
      return item.data
    }
    return null
  }
  
  set(key: string, data: any) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }
}
```

## 🚨 COMMON PITFALLS TO AVOID

1. **CORS Issues**: Use proxy or backend for some APIs
2. **Rate Limits**: Implement caching and request throttling  
3. **API Keys in Frontend**: Use environment variables properly
4. **Error States**: Always handle network failures gracefully
5. **Data Transformation**: Each API returns different formats
6. **Geolocation**: Get user permission for location-based queries

## 📋 TESTING CHECKLIST

- [ ] API keys work and are properly configured
- [ ] All endpoints return expected data structure
- [ ] Error handling works for network failures
- [ ] Rate limiting doesn't break the app
- [ ] Caching reduces redundant API calls
- [ ] Fallback to mock data works
- [ ] Location-based queries work properly
- [ ] Search functionality works across all APIs
