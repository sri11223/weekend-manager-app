import { Activity, ActivityCategory, Mood, CostLevel, DifficultyLevel } from '../types/index'

// Generate large dataset of activities for performance testing
export const generateTestActivities = (count: number = 100): Activity[] => {
  const categories: ActivityCategory[] = ['outdoor', 'sports', 'food', 'social', 'wellness', 'culture', 'creative', 'entertainment', 'indoor', 'learning']
  const moods: Mood[] = ['energetic', 'relaxed', 'social', 'adventurous', 'peaceful', 'creative', 'romantic', 'family']
  const difficulties: DifficultyLevel[] = ['easy', 'moderate', 'challenging']
  const costs: CostLevel[] = ['free', 'low', 'medium', 'high']
  
  const activities: Activity[] = []
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const mood = moods[Math.floor(Math.random() * moods.length)]
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
    const cost = costs[Math.floor(Math.random() * costs.length)]
    const duration = Math.floor(Math.random() * 240) + 30 // 30-270 minutes
    
    const activity: Activity = {
      id: `test-activity-${i}`,
      name: `Test Activity ${i + 1}`,
      description: `This is a generated test activity for performance testing. Activity number ${i + 1} with various properties to simulate real data.`,
      category: category,
      duration,
      mood,
      icon: '🎯',
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`,
      indoor: Math.random() > 0.5,
      cost,
      difficulty,
      tags: [
        `tag-${Math.floor(Math.random() * 20)}`,
        `category-${category}`,
        `mood-${mood}`,
        duration > 120 ? 'long-duration' : 'short-duration'
      ],
      location: Math.random() > 0.7 ? `Location ${Math.floor(Math.random() * 50)}` : undefined,
      weatherDependent: Math.random() > 0.6
    }
    
    activities.push(activity)
  }
  
  return activities
}

// Create activities with different search scenarios
export const createPerformanceTestData = () => {
  const baseActivities = generateTestActivities(150)
  
  // Add some predictable activities for testing
  const testScenarios: Array<{name: string, category: ActivityCategory, mood: Mood, tags: string[]}> = [
    { name: 'Beach Volleyball Tournament', category: 'sports', mood: 'energetic', tags: ['beach', 'volleyball', 'tournament'] },
    { name: 'Meditation Session', category: 'wellness', mood: 'peaceful', tags: ['meditation', 'mindfulness'] },
    { name: 'Food Truck Festival', category: 'food', mood: 'social', tags: ['festival', 'food-truck', 'outdoor'] },
    { name: 'Rock Climbing Adventure', category: 'outdoor', mood: 'adventurous', tags: ['climbing', 'adventure', 'fitness'] },
    { name: 'Art Workshop', category: 'creative', mood: 'creative', tags: ['workshop', 'art', 'painting'] }
  ]
  
  testScenarios.forEach((scenario, index) => {
    baseActivities.push({
      id: `scenario-${index}`,
      name: scenario.name,
      description: `Performance test scenario activity: ${scenario.name}`,
      category: scenario.category,
      duration: Math.floor(Math.random() * 180) + 60,
      mood: scenario.mood,
      icon: '🎯',
      color: `hsl(${index * 72}, 70%, 50%)`,
      indoor: false,
      cost: 'low',
      difficulty: 'moderate',
      tags: scenario.tags,
      weatherDependent: true
    })
  })
  
  return baseActivities
}

// Performance testing utilities
export const measureSearchPerformance = (activities: Activity[], searchTerm: string) => {
  const startTime = performance.now()
  
  const results = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )
  
  const endTime = performance.now()
  const duration = endTime - startTime
  
  return {
    results,
    searchTime: duration,
    resultsCount: results.length,
    totalActivities: activities.length
  }
}

export const measureRenderPerformance = (componentName: string, renderFunction: () => void) => {
  const startTime = performance.now()
  renderFunction()
  const endTime = performance.now()
  
  console.log(`🚀 ${componentName} render time: ${(endTime - startTime).toFixed(2)}ms`)
  return endTime - startTime
}

console.log('📊 Performance test utilities loaded. Use generateTestActivities(100) to create test data.')