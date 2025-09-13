// Script to populate all images for activities
const fs = require('fs');
const path = require('path');

const imageMapping = {
  // Nature/Outdoor activities
  'hiking': 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
  'mountain': 'https://images.unsplash.com/photo-1464822759844-d150baec3374?w=400',
  'beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
  'garden': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
  'forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
  'lake': 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=400',
  'sunset': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'bird': 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400',
  'butterfly': 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400',
  
  // Wellness/Meditation
  'meditation': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  'yoga': 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?w=400',
  'spa': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400',
  'massage': 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
  'aromatherapy': 'https://images.unsplash.com/photo-1596178060810-0dd5fb4b0d3d?w=400',
  'sound bath': 'https://images.unsplash.com/photo-1588164113534-c8ddf93d0ff4?w=400',
  
  // Sports/Adventure
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
  'tennis': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400',
  'swimming': 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400',
  'running': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  'cycling': 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400',
  'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400',
  'rock climbing': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400',
  'skateboard': 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400',
  
  // Creative/Arts
  'painting': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
  'pottery': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  'photography': 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
  'music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
  'writing': 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400',
  'crafts': 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
  
  // Food
  'cooking': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
  'restaurant': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  'food truck': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
  'coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
  'wine': 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400',
  'bbq': 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400',
  
  // Culture/Social
  'museum': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400',
  'theater': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
  'library': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
  'market': 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
  'gaming': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
  'social': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400',
  
  // Romance
  'candle': 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
  'flowers': 'https://images.unsplash.com/photo-1487530216243-5d3de9c58c8c?w=400',
  'couples': 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
  'sunset dinner': 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400'
};

function findBestImage(activity) {
  const name = activity.name.toLowerCase();
  const description = activity.description.toLowerCase();
  const tags = activity.tags.join(' ').toLowerCase();
  const searchText = `${name} ${description} ${tags}`;
  
  // Find best matching image
  for (const [keyword, imageUrl] of Object.entries(imageMapping)) {
    if (searchText.includes(keyword)) {
      return imageUrl;
    }
  }
  
  // Default fallback based on category
  const categoryDefaults = {
    'outdoor': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400',
    'wellness': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    'sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    'creative': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400',
    'food': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    'culture': 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=400',
    'social': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400'
  };
  
  return categoryDefaults[activity.category] || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400';
}

console.log('Created image mapping utility - run with Node.js to process activities');