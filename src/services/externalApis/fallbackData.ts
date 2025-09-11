import { Activity, ActivityCategory, ActivityMood } from './types';

// Comprehensive fallback data organized by mood and category
export const fallbackActivities: Activity[] = [
  // FOOD - Relaxed Mood
  {
    id: 'food-1',
    title: 'Cozy Café Brunch',
    description: 'Enjoy a peaceful brunch at a local café with artisanal coffee and pastries',
    category: 'food',
    mood: ['relaxed', 'cozy', 'peaceful'],
    duration: 90,
    image: '☕',
    rating: 4.5,
    price: 'medium',
    location: { name: 'Local Café District' },
    tags: ['brunch', 'coffee', 'pastries', 'quiet'],
    timeOfDay: 'morning',
    weatherDependent: false
  },
  {
    id: 'food-2',
    title: 'Wine & Cheese Tasting',
    description: 'Intimate wine and cheese pairing experience at a boutique winery',
    category: 'food',
    mood: ['romantic', 'relaxed', 'social'],
    duration: 120,
    image: '🍷',
    rating: 4.7,
    price: 'high',
    location: { name: 'Downtown Wine Bar' },
    tags: ['wine', 'cheese', 'tasting', 'romantic'],
    timeOfDay: 'evening',
    weatherDependent: false
  },

  // FOOD - Adventurous Mood
  {
    id: 'food-3',
    title: 'Street Food Tour',
    description: 'Explore diverse street food vendors and try exotic cuisines',
    category: 'food',
    mood: ['adventurous', 'social', 'energetic'],
    duration: 180,
    image: '🌮',
    rating: 4.3,
    price: 'low',
    location: { name: 'Food Truck District' },
    tags: ['street food', 'diverse', 'walking', 'cultural'],
    timeOfDay: 'afternoon',
    weatherDependent: true
  },
  {
    id: 'food-4',
    title: 'Cooking Class Experience',
    description: 'Learn to cook authentic cuisine from expert chefs',
    category: 'food',
    mood: ['creative', 'social', 'productive'],
    duration: 150,
    image: '👨‍🍳',
    rating: 4.6,
    price: 'medium',
    location: { name: 'Culinary Institute' },
    tags: ['cooking', 'learning', 'hands-on', 'skills'],
    timeOfDay: 'afternoon',
    weatherDependent: false
  },

  // OUTDOOR - Energetic Mood
  {
    id: 'outdoor-1',
    title: 'Mountain Hiking Trail',
    description: 'Challenging hike with breathtaking views and fresh air',
    category: 'outdoor',
    mood: ['energetic', 'adventurous', 'peaceful'],
    duration: 240,
    image: '🥾',
    rating: 4.8,
    price: 'free',
    location: { name: 'Mountain Trail Park' },
    tags: ['hiking', 'nature', 'exercise', 'views'],
    timeOfDay: 'morning',
    weatherDependent: true
  },
  {
    id: 'outdoor-2',
    title: 'Kayaking Adventure',
    description: 'Paddle through scenic waterways and explore hidden coves',
    category: 'outdoor',
    mood: ['adventurous', 'energetic', 'peaceful'],
    duration: 180,
    image: '🛶',
    rating: 4.5,
    price: 'medium',
    location: { name: 'Riverside Marina' },
    tags: ['kayaking', 'water', 'adventure', 'nature'],
    timeOfDay: 'afternoon',
    weatherDependent: true
  },

  // OUTDOOR - Relaxed Mood
  {
    id: 'outdoor-3',
    title: 'Botanical Garden Stroll',
    description: 'Peaceful walk through beautiful gardens and exotic plants',
    category: 'outdoor',
    mood: ['relaxed', 'peaceful', 'romantic'],
    duration: 120,
    image: '🌺',
    rating: 4.4,
    price: 'low',
    location: { name: 'City Botanical Gardens' },
    tags: ['gardens', 'flowers', 'walking', 'photography'],
    timeOfDay: 'any',
    weatherDependent: true
  },
  {
    id: 'outdoor-4',
    title: 'Sunset Picnic',
    description: 'Romantic picnic with homemade treats watching the sunset',
    category: 'outdoor',
    mood: ['romantic', 'relaxed', 'cozy'],
    duration: 150,
    image: '🧺',
    rating: 4.6,
    price: 'low',
    location: { name: 'Hilltop Park' },
    tags: ['picnic', 'sunset', 'romantic', 'food'],
    timeOfDay: 'evening',
    weatherDependent: true
  },

  // ENTERTAINMENT - Fun Mood
  {
    id: 'entertainment-1',
    title: 'Comedy Show Night',
    description: 'Laugh out loud at a local comedy club with talented comedians',
    category: 'entertainment',
    mood: ['fun', 'social', 'energetic'],
    duration: 120,
    image: '🎭',
    rating: 4.3,
    price: 'medium',
    location: { name: 'Downtown Comedy Club' },
    tags: ['comedy', 'live show', 'laughter', 'nightlife'],
    timeOfDay: 'evening',
    weatherDependent: false
  },
  {
    id: 'entertainment-2',
    title: 'Indie Movie Marathon',
    description: 'Discover unique independent films at an art house cinema',
    category: 'entertainment',
    mood: ['creative', 'relaxed', 'cozy'],
    duration: 180,
    image: '🎬',
    rating: 4.2,
    price: 'medium',
    location: { name: 'Art House Cinema' },
    tags: ['movies', 'indie', 'art', 'cinema'],
    timeOfDay: 'evening',
    weatherDependent: false
  },

  // CULTURAL - Creative Mood
  {
    id: 'cultural-1',
    title: 'Art Museum Exhibition',
    description: 'Explore contemporary art and classic masterpieces',
    category: 'cultural',
    mood: ['creative', 'peaceful', 'productive'],
    duration: 150,
    image: '🎨',
    rating: 4.5,
    price: 'medium',
    location: { name: 'Metropolitan Art Museum' },
    tags: ['art', 'museum', 'culture', 'education'],
    timeOfDay: 'afternoon',
    weatherDependent: false
  },
  {
    id: 'cultural-2',
    title: 'Live Jazz Performance',
    description: 'Intimate jazz session with world-class musicians',
    category: 'cultural',
    mood: ['romantic', 'relaxed', 'social'],
    duration: 120,
    image: '🎷',
    rating: 4.7,
    price: 'medium',
    location: { name: 'Jazz Lounge' },
    tags: ['jazz', 'music', 'live', 'atmosphere'],
    timeOfDay: 'evening',
    weatherDependent: false
  },

  // SOCIAL - Social Mood
  {
    id: 'social-1',
    title: 'Board Game Café',
    description: 'Play strategy games with friends over coffee and snacks',
    category: 'social',
    mood: ['social', 'fun', 'cozy'],
    duration: 180,
    image: '🎲',
    rating: 4.4,
    price: 'low',
    location: { name: 'Game Café Downtown' },
    tags: ['games', 'friends', 'strategy', 'casual'],
    timeOfDay: 'afternoon',
    weatherDependent: false
  },
  {
    id: 'social-2',
    title: 'Karaoke Night',
    description: 'Sing your heart out with friends at a lively karaoke bar',
    category: 'social',
    mood: ['fun', 'energetic', 'social'],
    duration: 150,
    image: '🎤',
    rating: 4.2,
    price: 'medium',
    location: { name: 'Karaoke Palace' },
    tags: ['karaoke', 'singing', 'friends', 'nightlife'],
    timeOfDay: 'evening',
    weatherDependent: false
  },

  // WELLNESS - Peaceful Mood
  {
    id: 'wellness-1',
    title: 'Spa Day Retreat',
    description: 'Rejuvenating spa treatments for ultimate relaxation',
    category: 'wellness',
    mood: ['relaxed', 'peaceful', 'cozy'],
    duration: 240,
    image: '🧘‍♀️',
    rating: 4.8,
    price: 'high',
    location: { name: 'Serenity Spa Resort' },
    tags: ['spa', 'massage', 'relaxation', 'wellness'],
    timeOfDay: 'afternoon',
    weatherDependent: false
  },
  {
    id: 'wellness-2',
    title: 'Yoga in the Park',
    description: 'Morning yoga session surrounded by nature',
    category: 'wellness',
    mood: ['peaceful', 'energetic', 'productive'],
    duration: 90,
    image: '🧘',
    rating: 4.6,
    price: 'free',
    location: { name: 'Central Park Pavilion' },
    tags: ['yoga', 'meditation', 'nature', 'morning'],
    timeOfDay: 'morning',
    weatherDependent: true
  },

  // GAMING - Fun Mood
  {
    id: 'gaming-1',
    title: 'VR Gaming Experience',
    description: 'Immersive virtual reality games and adventures',
    category: 'gaming',
    mood: ['fun', 'adventurous', 'energetic'],
    duration: 120,
    image: '🥽',
    rating: 4.5,
    price: 'medium',
    location: { name: 'VR Gaming Center' },
    tags: ['VR', 'technology', 'immersive', 'adventure'],
    timeOfDay: 'afternoon',
    weatherDependent: false
  },
  {
    id: 'gaming-2',
    title: 'Retro Arcade Night',
    description: 'Classic arcade games and pinball machines',
    category: 'gaming',
    mood: ['fun', 'social', 'cozy'],
    duration: 150,
    image: '🕹️',
    rating: 4.3,
    price: 'low',
    location: { name: 'Retro Arcade Bar' },
    tags: ['arcade', 'retro', 'nostalgia', 'games'],
    timeOfDay: 'evening',
    weatherDependent: false
  },

  // SHOPPING - Creative Mood
  {
    id: 'shopping-1',
    title: 'Artisan Market Browse',
    description: 'Discover unique handmade crafts and local artisan goods',
    category: 'shopping',
    mood: ['creative', 'social', 'productive'],
    duration: 120,
    image: '🛍️',
    rating: 4.4,
    price: 'medium',
    location: { name: 'Weekend Artisan Market' },
    tags: ['artisan', 'handmade', 'local', 'unique'],
    timeOfDay: 'afternoon',
    weatherDependent: true
  },
  {
    id: 'shopping-2',
    title: 'Vintage Thrift Hunt',
    description: 'Hunt for unique vintage treasures and retro finds',
    category: 'shopping',
    mood: ['adventurous', 'creative', 'fun'],
    duration: 180,
    image: '👗',
    rating: 4.2,
    price: 'low',
    location: { name: 'Vintage District' },
    tags: ['vintage', 'thrift', 'unique', 'treasure hunt'],
    timeOfDay: 'afternoon',
    weatherDependent: false
  },

  // TRIP-PLANNING - Adventurous Mood
  {
    id: 'trip-1',
    title: 'Paris City Break',
    description: 'Explore the romantic streets of Paris with iconic landmarks and cuisine',
    category: 'trip-planning',
    mood: ['adventurous', 'romantic', 'creative'],
    duration: 2880, // 48 hours
    image: '🗼',
    rating: 4.8,
    price: 'high',
    location: { name: 'Paris, France' },
    tags: ['trip-planning', 'weekend-trip', 'europe', 'culture', 'romance'],
    timeOfDay: 'any',
    weatherDependent: true
  },
  {
    id: 'trip-2',
    title: 'Mountain Retreat Weekend',
    description: 'Escape to peaceful mountain cabins with hiking and fresh air',
    category: 'trip-planning',
    mood: ['peaceful', 'adventurous', 'relaxed'],
    duration: 2880,
    image: '⛰️',
    rating: 4.6,
    price: 'medium',
    location: { name: 'Mountain Resort' },
    tags: ['trip-planning', 'mountains', 'nature', 'hiking', 'retreat'],
    timeOfDay: 'any',
    weatherDependent: true
  },
  {
    id: 'trip-3',
    title: 'Beach Getaway',
    description: 'Relax on pristine beaches with crystal clear waters and sunset views',
    category: 'trip-planning',
    mood: ['relaxed', 'romantic', 'peaceful'],
    duration: 2880,
    image: '🏖️',
    rating: 4.7,
    price: 'high',
    location: { name: 'Coastal Resort' },
    tags: ['trip-planning', 'beach', 'ocean', 'relaxation', 'sunset'],
    timeOfDay: 'any',
    weatherDependent: true
  },
  {
    id: 'trip-4',
    title: 'Cultural City Tour',
    description: 'Immerse yourself in rich history, museums, and local traditions',
    category: 'trip-planning',
    mood: ['creative', 'adventurous', 'productive'],
    duration: 2880,
    image: '🏛️',
    rating: 4.5,
    price: 'medium',
    location: { name: 'Historic City Center' },
    tags: ['trip-planning', 'culture', 'museums', 'history', 'education'],
    timeOfDay: 'any',
    weatherDependent: false
  },
  {
    id: 'trip-5',
    title: 'Adventure Tour Package',
    description: 'Thrilling outdoor activities including zip-lining and rock climbing',
    category: 'trip-planning',
    mood: ['adventurous', 'energetic', 'fun'],
    duration: 2880,
    image: '🏔️',
    rating: 4.9,
    price: 'high',
    location: { name: 'Adventure Park Resort' },
    tags: ['trip-planning', 'adventure', 'extreme-sports', 'adrenaline', 'outdoor'],
    timeOfDay: 'any',
    weatherDependent: true
  },
  {
    id: 'trip-6',
    title: 'Wine Country Escape',
    description: 'Tour vineyards, taste premium wines, and enjoy gourmet dining',
    category: 'trip-planning',
    mood: ['romantic', 'relaxed', 'social'],
    duration: 2880,
    image: '🍷',
    rating: 4.6,
    price: 'high',
    location: { name: 'Wine Valley' },
    tags: ['trip-planning', 'wine', 'vineyard', 'gourmet', 'tasting'],
    timeOfDay: 'any',
    weatherDependent: false
  }
];

// Helper function to get fallback data by filters
export function getFallbackActivitiesByFilters(
  category?: ActivityCategory | 'trip-planning',
  mood?: ActivityMood[],
  limit: number = 10
): Activity[] {
  let filtered = [...fallbackActivities];

  if (category) {
    filtered = filtered.filter(activity => activity.category === category);
  }

  if (mood && mood.length > 0) {
    filtered = filtered.filter(activity => 
      activity.mood.some(activityMood => mood.includes(activityMood))
    );
  }

  // Shuffle for variety
  filtered = filtered.sort(() => Math.random() - 0.5);

  return filtered.slice(0, limit);
}
