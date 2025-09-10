export interface MoodTheme {
  id: string
  name: string
  mood: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    gradient: string
  }
  description: string
}

export const MOOD_THEMES: MoodTheme[] = [
  {
    id: 'energetic',
    name: 'Energetic Vibes',
    mood: 'energetic',
    colors: {
      primary: '#FF6B35',
      secondary: '#FF8E53',
      accent: '#FFB627',
      background: '#FFF8F0',
      surface: '#FFFFFF',
      text: '#2D1B69',
      textSecondary: '#6B7280',
      border: '#FFE4D6',
      gradient: 'linear-gradient(135deg, #FF6B35 0%, #FFB627 100%)'
    },
    description: 'Bright and vibrant for active weekends'
  },
  {
    id: 'relaxed',
    name: 'Calm & Peaceful',
    mood: 'relaxed',
    colors: {
      primary: '#4F46E5',
      secondary: '#7C3AED',
      accent: '#06B6D4',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#1E293B',
      textSecondary: '#64748B',
      border: '#E2E8F0',
      gradient: 'linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%)'
    },
    description: 'Soothing colors for peaceful relaxation'
  },
  {
    id: 'adventurous',
    name: 'Adventure Ready',
    mood: 'adventurous',
    colors: {
      primary: '#059669',
      secondary: '#10B981',
      accent: '#F59E0B',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      text: '#064E3B',
      textSecondary: '#6B7280',
      border: '#BBF7D0',
      gradient: 'linear-gradient(135deg, #059669 0%, #F59E0B 100%)'
    },
    description: 'Nature-inspired for outdoor adventures'
  },
  {
    id: 'romantic',
    name: 'Romantic Mood',
    mood: 'romantic',
    colors: {
      primary: '#EC4899',
      secondary: '#F472B6',
      accent: '#A855F7',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      text: '#831843',
      textSecondary: '#6B7280',
      border: '#FBCFE8',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)'
    },
    description: 'Warm and intimate for special moments'
  },
  {
    id: 'productive',
    name: 'Focus Mode',
    mood: 'productive',
    colors: {
      primary: '#1F2937',
      secondary: '#374151',
      accent: '#3B82F6',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      gradient: 'linear-gradient(135deg, #1F2937 0%, #3B82F6 100%)'
    },
    description: 'Clean and minimal for getting things done'
  },
  {
    id: 'creative',
    name: 'Creative Flow',
    mood: 'creative',
    colors: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      accent: '#F59E0B',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      text: '#581C87',
      textSecondary: '#6B7280',
      border: '#E9D5FF',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)'
    },
    description: 'Inspiring colors for artistic pursuits'
  }
]

export interface TimeSlot {
  id: string
  hour: number
  label: string
  period: 'morning' | 'afternoon' | 'evening' | 'night'
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: '6am', hour: 6, label: '6:00 AM', period: 'morning' },
  { id: '7am', hour: 7, label: '7:00 AM', period: 'morning' },
  { id: '8am', hour: 8, label: '8:00 AM', period: 'morning' },
  { id: '9am', hour: 9, label: '9:00 AM', period: 'morning' },
  { id: '10am', hour: 10, label: '10:00 AM', period: 'morning' },
  { id: '11am', hour: 11, label: '11:00 AM', period: 'morning' },
  { id: '12pm', hour: 12, label: '12:00 PM', period: 'afternoon' },
  { id: '1pm', hour: 13, label: '1:00 PM', period: 'afternoon' },
  { id: '2pm', hour: 14, label: '2:00 PM', period: 'afternoon' },
  { id: '3pm', hour: 15, label: '3:00 PM', period: 'afternoon' },
  { id: '4pm', hour: 16, label: '4:00 PM', period: 'afternoon' },
  { id: '5pm', hour: 17, label: '5:00 PM', period: 'afternoon' },
  { id: '6pm', hour: 18, label: '6:00 PM', period: 'evening' },
  { id: '7pm', hour: 19, label: '7:00 PM', period: 'evening' },
  { id: '8pm', hour: 20, label: '8:00 PM', period: 'evening' },
  { id: '9pm', hour: 21, label: '9:00 PM', period: 'evening' },
  { id: '10pm', hour: 22, label: '10:00 PM', period: 'night' },
  { id: '11pm', hour: 23, label: '11:00 PM', period: 'night' }
]
