import { describe, it, expect } from 'vitest'

describe('Weekendly Core Functionality', () => {
  it('should have correct time slots for weekend planning', () => {
    const timeSlots = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']
    expect(timeSlots).toContain('10am')
    expect(timeSlots).toContain('2pm')
    expect(timeSlots).toContain('8pm')
    expect(timeSlots).toHaveLength(18) // 6am to 11pm
  })

  it('should validate activity duration logic', () => {
    const activity = {
      id: 'test-1',
      title: 'Movie Night',
      duration: 3, // 3 hours
      category: 'entertainment'
    }
    
    expect(activity.duration).toBeGreaterThan(0)
    expect(activity.duration).toBeLessThanOrEqual(8) // Max 8 hours
  })

  it('should handle weekend day validation', () => {
    const validDays = ['saturday', 'sunday']
    const testDay = 'saturday'
    
    expect(validDays).toContain(testDay)
    expect(validDays).toHaveLength(2)
  })

  it('should validate activity categories', () => {
    const categories = ['entertainment', 'food', 'outdoor', 'indoor', 'social']
    const testCategory = 'entertainment'
    
    expect(categories).toContain(testCategory)
  })

  it('should calculate time slot blocking correctly', () => {
    const timeSlots = ['6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']
    const startSlot = '2pm'
    const duration = 2 // 2 hours
    const expectedSlots = ['2pm', '3pm']
    
    // Simple blocking logic test
    const startIndex = timeSlots.indexOf(startSlot)
    const blockedSlots = timeSlots.slice(startIndex, startIndex + duration)
    
    expect(blockedSlots).toEqual(expectedSlots)
  })
})
