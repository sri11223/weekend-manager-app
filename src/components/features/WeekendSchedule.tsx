import React from 'react'
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useWeekendStore } from '@/store/useWeekendStore'
import { DayColumn } from './DayColumn'
import { DraggableActivityCard } from './DraggableActivityCard'
import type { Activity } from '@/types'

interface WeekendScheduleProps {
  availableActivities: Activity[]
}

export const WeekendSchedule: React.FC<WeekendScheduleProps> = ({
  availableActivities
}) => {
  const { 
    currentPlan,
    addActivityToPlan,
    removeActivityFromPlan,
    reorderActivities,
    getActivitiesByDay
  } = useWeekendStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Handle dropping from available activities to schedule
    if (overId.startsWith('day-')) {
      const day = overId.replace('day-', '') as 'saturday' | 'sunday'
      const activity = availableActivities.find(a => a.id === activeId)
      
      if (activity && !currentPlan?.activities.find(a => a.id === activeId)) {
        // Add to schedule with default time
        addActivityToPlan(activity, day, '09:00')
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Handle reordering within the same day
    if (overId.startsWith('scheduled-')) {
      const activeActivity = currentPlan?.activities.find(a => a.scheduledId === activeId)
      const overActivity = currentPlan?.activities.find(a => a.scheduledId === overId)
      
      if (activeActivity && overActivity && activeActivity.day === overActivity.day) {
        const dayActivities = getActivitiesByDay(activeActivity.day)
        const oldIndex = dayActivities.findIndex(a => a.scheduledId === activeId)
        const newIndex = dayActivities.findIndex(a => a.scheduledId === overId)
        
        if (oldIndex !== newIndex) {
          reorderActivities(activeActivity.day, oldIndex, newIndex)
        }
      }
    }
  }

  if (!currentPlan) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-neutral-600">Create a plan to start scheduling activities</p>
      </div>
    )
  }

  const saturdayActivities = getActivitiesByDay('saturday')
  const sundayActivities = getActivitiesByDay('sunday')

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Saturday Column */}
        <DayColumn
          day="saturday"
          title="Saturday"
          activities={saturdayActivities}
          onRemoveActivity={removeActivityFromPlan}
        />
        
        {/* Sunday Column */}
        <DayColumn
          day="sunday"
          title="Sunday"
          activities={sundayActivities}
          onRemoveActivity={removeActivityFromPlan}
        />
      </div>
      
      {/* Available Activities Panel */}
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-6 text-neutral-800">
          Available Activities
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {availableActivities.map(activity => (
            <DraggableActivityCard 
              key={activity.id}
              activity={activity}
              isScheduled={currentPlan.activities.some(a => a.id === activity.id)}
            />
          ))}
        </div>
      </div>
    </DndContext>
  )
}
