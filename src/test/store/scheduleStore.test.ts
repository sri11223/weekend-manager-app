import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useScheduleStore } from '../../store/scheduleStore'
import { mockActivity } from '../utils/testUtils'

// Mock Zustand store for testing
const mockStore = useScheduleStore

describe('Schedule Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    mockStore.setState({
      scheduledActivities: [],
    })
    vi.clearAllMocks()
  })

  it('initializes with empty scheduled activities', () => {
    const state = mockStore.getState()
    expect(state.scheduledActivities).toEqual([])
  })

  it('adds activity to schedule successfully', () => {
    const { addActivity } = mockStore.getState()
    
    const result = addActivity(mockActivity, '10am', 'saturday')
    
    expect(result).toBe(true)
    
    const state = mockStore.getState()
    expect(state.scheduledActivities).toHaveLength(1)
    expect(state.scheduledActivities[0]).toMatchObject({
      title: mockActivity.title,
      description: mockActivity.description,
      duration: mockActivity.duration,
      category: mockActivity.category,
      timeSlot: '10am',
      day: 'saturday',
    })
  })

  it('prevents adding activity to occupied slot', () => {
    const { addActivity } = mockStore.getState()
    
    // Add first activity
    addActivity(mockActivity, '10am', 'saturday')
    
    // Try to add another activity to the same slot
    const result = addActivity({
      ...mockActivity,
      id: 'different-id',
      title: 'Different Activity'
    }, '10am', 'saturday')
    
    expect(result).toBe(false)
    
    const state = mockStore.getState()
    expect(state.scheduledActivities).toHaveLength(1)
  })


  it('removes activity from schedule', () => {
    const { addActivity, removeActivity } = mockStore.getState()
    
    // Add activity first
    addActivity(mockActivity, '10am', 'saturday')
    
    let state = mockStore.getState()
    const activityId = state.scheduledActivities[0].id
    
    // Remove activity
    removeActivity(activityId)
    
    state = mockStore.getState()
    expect(state.scheduledActivities).toHaveLength(0)
  })

  it('moves activity to new time slot', () => {
    const { addActivity, moveActivity } = mockStore.getState()
    
    // Add activity first
    addActivity(mockActivity, '10am', 'saturday')
    
    let state = mockStore.getState()
    const activityId = state.scheduledActivities[0].id
    
    // Move activity
    const result = moveActivity(activityId, '2pm', 'sunday')
    
    expect(result).toBe(true)
    
    state = mockStore.getState()
    const activities = state.scheduledActivities
    const movedActivity = activities.find(a => a.day === 'sunday')
    expect(movedActivity).toBeDefined()
    expect(movedActivity?.day).toBe('sunday')
  })

  it('checks if slot is occupied correctly', () => {
    const { addActivity, isSlotOccupied } = mockStore.getState()
    
    // Initially empty
    expect(isSlotOccupied('saturday', '10am')).toBe(false)
    
    // Add activity
    addActivity(mockActivity, '10am', 'saturday')
    
    // Now occupied
    expect(isSlotOccupied('saturday', '10am')).toBe(true)
    expect(isSlotOccupied('saturday', '11am')).toBe(false)
  })

  it('gets activities for specific day', () => {
    const { addActivity, getActivitiesForDay } = mockStore.getState()
    
    // Add activities for different days
    addActivity(mockActivity, '10am', 'saturday')
    addActivity({
      ...mockActivity,
      id: 'sunday-activity',
      title: 'Sunday Activity'
    }, '2pm', 'sunday')
    
    const saturdayActivities = getActivitiesForDay('saturday')
    const sundayActivities = getActivitiesForDay('sunday')
    
    expect(saturdayActivities).toHaveLength(1)
    expect(sundayActivities).toHaveLength(1)
    expect(saturdayActivities[0].day).toBe('saturday')
    expect(sundayActivities[0].day).toBe('sunday')
  })

  it('clears all scheduled activities', () => {
    // Add some activities first
    useScheduleStore.getState().addActivity(mockActivity, '10am', 'saturday')
    useScheduleStore.getState().addActivity(mockActivity, '2pm', 'sunday')
    
    expect(useScheduleStore.getState().scheduledActivities).toHaveLength(2)
    
    // Clear all
    useScheduleStore.getState().clearAllActivities()
    
    expect(useScheduleStore.getState().scheduledActivities).toHaveLength(0)
  })
})
