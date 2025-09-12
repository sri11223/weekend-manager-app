import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import groqAIService from '../services/groqAIService'
import { useTheme } from '../hooks/useTheme'
import { weatherService } from '../services/weatherService'
import { Activity } from '../types/index'

interface AIContextType {
  // Context data
  location: string
  setLocation: (location: string) => void
  
  // AI-generated activities by category
  allActivities: Record<string, Activity[]>
  isGenerating: boolean
  
  // Category counts for navigation
  categoryCounts: Record<string, number>
  
  // Methods
  regenerateAllActivities: () => Promise<void>
  generateCategoryActivities: (category: string) => Promise<Activity[]>
  refreshActivities: () => Promise<void>
  
  // Status
  lastGenerated: Date | null
  error: string | null
}

const AIContext = createContext<AIContextType | undefined>(undefined)

interface AIProviderProps {
  children: ReactNode
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const { currentTheme, themeId } = useTheme()
  
  // State
  const [location, setLocation] = useState('New York City')
  const [allActivities, setAllActivities] = useState<Record<string, Activity[]>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({})
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  // ✅ DETAILED ACTIVITY LOGGER
  const logActivitiesDetailed = (activities: Record<string, Activity[]>, theme: string, location: string) => {
    console.log('🎭 ===== DETAILED ACTIVITY BREAKDOWN =====');
    console.log(`📍 Location: ${location}`);
    console.log(`🎨 Theme: ${theme}`);
    console.log(`⏰ Generated at: ${new Date().toLocaleString()}`);
    console.log('=======================================\n');

    // Total count
    const totalActivities = Object.values(activities).reduce((sum, acts) => sum + acts.length, 0);
    console.log(`📊 TOTAL ACTIVITIES GENERATED: ${totalActivities}\n`);

    // Category breakdown
    Object.entries(activities).forEach(([category, categoryActivities]) => {
      if (categoryActivities.length === 0) return;

      console.log(`\n📂 ${category.toUpperCase()} CATEGORY (${categoryActivities.length} activities)`);
      console.log('='.repeat(50));
      
      categoryActivities.forEach((activity, index) => {
        console.log(`\n🎯 Activity ${index + 1}:`);
        console.log(`   Name: ${activity.name}`);
        console.log(`   Description: ${activity.description}`);
        console.log(`   Duration: ${activity.duration} minutes`);
        console.log(`   Cost: ${activity.cost}`);
        console.log(`   Mood: ${activity.mood}`);
        console.log(`   Location: ${activity.location}`);
        console.log(`   Tags: ${activity.tags.join(', ')}`);
        console.log(`   Difficulty: ${activity.difficulty}`);
        console.log(`   Indoor: ${activity.indoor ? 'Yes' : 'No'}`);
        console.log(`   Weather Dependent: ${activity.weatherDependent ? 'Yes' : 'No'}`);
        console.log(`   Category: ${activity.category}`);
        console.log(`   Icon: ${activity.icon}`);
        console.log(`   Color: ${activity.color}`);
        console.log('   ' + '-'.repeat(40));
      });
    });

    // Summary table
    console.log('\n📊 CATEGORY SUMMARY TABLE:');
    const summaryTable = Object.entries(activities).map(([category, acts]) => ({
      Category: category.toUpperCase(),
      Count: acts.length,
      'Avg Duration': acts.length > 0 ? Math.round(acts.reduce((sum, a) => sum + a.duration, 0) / acts.length) + ' min' : '0 min',
      'Cost Range': acts.length > 0 ? `${Math.min(...acts.map(a => typeof a.cost === 'string' ? 0 : a.cost))} - ${Math.max(...acts.map(a => typeof a.cost === 'string' ? 100 : a.cost))}` : 'N/A',
      'Main Moods': acts.length > 0 ? [...new Set(acts.map(a => a.mood))].slice(0, 3).join(', ') : 'N/A'
    }));
    console.table(summaryTable);

    // Raw data for debugging
    console.log('\n🔍 RAW ACTIVITY DATA (for debugging):');
    console.log(activities);
  };

  // ✅ ACTIVITY ANALYZER
  const analyzeActivities = (activities: Record<string, Activity[]>) => {
    console.log('\n🔬 ACTIVITY ANALYSIS:');
    
    const allActivities = Object.values(activities).flat();
    
    // Mood distribution
    const moodCounts = allActivities.reduce((acc, activity) => {
      acc[activity.mood] = (acc[activity.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Cost distribution
    const costCounts = allActivities.reduce((acc, activity) => {
      const cost = typeof activity.cost === 'string' ? activity.cost : 'unknown';
      acc[cost] = (acc[cost] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Duration stats
    const durations = allActivities.map(a => a.duration);
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    
    console.log('😊 Mood Distribution:', moodCounts);
    console.log('💰 Cost Distribution:', costCounts);
    console.log(`⏱️ Duration Stats: Min=${minDuration}min, Max=${maxDuration}min, Avg=${Math.round(avgDuration)}min`);
    console.log(`🏠 Indoor Activities: ${allActivities.filter(a => a.indoor).length}`);
    console.log(`🌤️ Weather Dependent: ${allActivities.filter(a => a.weatherDependent).length}`);
  };

  // Get current context for AI
  const getCurrentContext = async () => {
    const weather = await weatherService.getCurrentWeather(location)
    const currentHour = new Date().getHours()
    
    let timeOfDay: 'morning' | 'afternoon' | 'evening'
    if (currentHour < 12) timeOfDay = 'morning'
    else if (currentHour < 17) timeOfDay = 'afternoon'
    else timeOfDay = 'evening'

    return {
      location,
      theme: currentTheme.name.toLowerCase(),
      weather: {
        temperature: weather.temperature,
        condition: weather.condition,
        isGoodForOutdoor: weatherService.isGoodWeatherForOutdoor(weather)
      },
      timeOfDay,
      budget: 150, // Default budget
      userPreferences: []
    }
  }

  // Generate all activities for current theme
  const regenerateAllActivities = async () => {
    if (isGenerating) return

    setIsGenerating(true)
    setError(null)
    
    try {
      console.log(`🎨 Regenerating all activities for ${currentTheme.name} theme`)
      
      const context = await getCurrentContext()
      const newActivities = await groqAIService.generateAllCategories(context)
      
      setAllActivities(newActivities)
      setCategoryCounts(groqAIService.getCategoryCounts(newActivities))
      setLastGenerated(new Date())
      
      console.log(`✅ Successfully generated activities for all categories`)
      
      // ✅ DETAILED LOGGING OF ALL GENERATED ACTIVITIES
      logActivitiesDetailed(newActivities, currentTheme.name, location)
      
      // ✅ ACTIVITY ANALYSIS
      analyzeActivities(newActivities)
      
      // ✅ INDIVIDUAL CATEGORY LOGS
      Object.entries(newActivities).forEach(([category, activities]) => {
        console.group(`📂 ${category.toUpperCase()} ACTIVITIES`);
        activities.forEach((activity, index) => {
          console.log(`${index + 1}. ${activity.name}`, activity);
        });
        console.groupEnd();
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate activities'
      setError(errorMessage)
      console.error('❌ Failed to regenerate activities:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate activities for specific category
  const generateCategoryActivities = async (category: string): Promise<Activity[]> => {
    try {
      console.log(`🎯 Generating activities for category: ${category}`)
      
      const context = await getCurrentContext()
      const activities = await groqAIService.generateActivities({
        category,
        count: 15,
        context
      })
      
      // ✅ LOG SPECIFIC CATEGORY ACTIVITIES
      console.log(`\n📂 GENERATED ${category.toUpperCase()} ACTIVITIES:`);
      console.log(`📊 Count: ${activities.length}`);
      console.log(`🎨 Theme: ${context.theme}`);
      console.log(`📍 Location: ${context.location}`);
      
      activities.forEach((activity, index) => {
        console.log(`\n${index + 1}. ${activity.name}`);
        console.log(`   💡 ${activity.description}`);
        console.log(`   ⏱️ ${activity.duration}min | 💰 ${activity.cost} | 📍 ${activity.location}`);
        console.log(`   🎯 ${activity.mood} | 🏷️ ${activity.tags.join(', ')}`);
      });
      
      // Update the specific category in allActivities
      setAllActivities(prev => {
        const updated = {
          ...prev,
          [category]: activities
        };
        
        // Log updated state
        console.log(`✅ Updated ${category} in allActivities:`, updated);
        return updated;
      })
      
      // Update category counts
      setCategoryCounts(prev => ({
        ...prev,
        [category]: activities.length
      }))
      
      return activities
      
    } catch (err) {
      console.error(`❌ Failed to generate ${category} activities:`, err)
      return allActivities[category] || []
    }
  }

  // ✅ LOG STATE CHANGES
  useEffect(() => {
    if (Object.keys(allActivities).length > 0) {
      console.log('🔄 AllActivities state updated:', allActivities);
      console.log('📊 Category counts updated:', categoryCounts);
    }
  }, [allActivities, categoryCounts]);

  // Regenerate when theme changes
  useEffect(() => {
    if (themeId && currentTheme) {
      console.log(`🎭 Theme changed to ${currentTheme.name}, clearing cache and regenerating`)
      groqAIService.clearCache()
      regenerateAllActivities()
    }
  }, [themeId])

  // Initial generation when location changes
  useEffect(() => {
    if (location) {
      console.log(`📍 Location changed to ${location}, regenerating activities`)
      groqAIService.clearCache()
      regenerateAllActivities()
    }
  }, [location])

  // Auto-regenerate periodically (every 30 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastGenerated && Date.now() - lastGenerated.getTime() > 30 * 60 * 1000) {
        console.log('⏰ Auto-regenerating activities (30min interval)')
        regenerateAllActivities()
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(interval)
  }, [lastGenerated])

  const value: AIContextType = {
    location,
    setLocation,
    allActivities,
    isGenerating,
    categoryCounts,
    regenerateAllActivities,
    generateCategoryActivities,
    refreshActivities: regenerateAllActivities,
    lastGenerated,
    error
  }

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  )
}

export const useAI = (): AIContextType => {
  const context = useContext(AIContext)
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider')
  }
  return context
}

// ✅ ENHANCED HOOK WITH DETAILED LOGGING
export const useAIActivities = (category: string): {
  activities: Activity[]
  isLoading: boolean
  refresh: () => Promise<void>
} => {
  const { allActivities, isGenerating, generateCategoryActivities } = useAI()
  
  const activities = allActivities[category] || []
  
  // ✅ LOG WHEN ACTIVITIES ARE ACCESSED
  useEffect(() => {
    if (activities.length > 0) {
      console.log(`🎬 useAIActivities hook accessed for ${category}:`, {
        category,
        activityCount: activities.length,
        activities: activities.map(a => ({
          name: a.name,
          description: a.description.slice(0, 50) + '...',
          duration: a.duration,
          mood: a.mood,
          cost: a.cost
        }))
      });
    }
  }, [category, activities]);
  
  const refresh = async () => {
    console.log(`🔄 Refreshing ${category} activities...`);
    await generateCategoryActivities(category)
  }
  
  return {
    activities,
    isLoading: isGenerating,
    refresh
  }
}

// ✅ GLOBAL ACTIVITY LOGGER (call this from anywhere)
export const logAllActivities = (activities: Record<string, Activity[]>) => {
  console.log('\n🌟 COMPLETE ACTIVITY DUMP:');
  console.log('==========================');
  
  Object.entries(activities).forEach(([category, acts]) => {
    console.log(`\n📂 ${category.toUpperCase()}:`);
    acts.forEach((activity, i) => {
      console.log(`${i + 1}. ${activity.name} (${activity.duration}min, ${activity.cost}, ${activity.mood})`);
    });
  });
  
  // Raw data
  console.log('\n🔍 Raw data:', activities);
};
