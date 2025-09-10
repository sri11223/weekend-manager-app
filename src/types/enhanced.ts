export interface EnhancedActivity {
  id: string
  title: string
  name: string
  description: string
  category: string
  duration: number
  mood: string
  icon: string
  color: string
  indoor: boolean
  cost: string | number
  difficulty?: string
  tags: string[]
  location?: string
  weatherDependent?: boolean
  image?: string
  rating?: number
  moodTags?: string[]
  source?: 'api' | 'mock'
  apiId?: string
}

export interface TimeSlotActivity extends EnhancedActivity {
  timeSlot: string
  day: 'saturday' | 'sunday' | 'friday' | 'monday'
  scheduledId: string
}

export interface ActivityFilter {
  type: 'all' | 'trending' | 'nearby' | 'quick'
  mood?: string
  category?: string
  duration?: number
}
