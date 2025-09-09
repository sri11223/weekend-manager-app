import React from 'react'
import { useDraggable } from '@dnd-kit/core'
import { ActivityCard } from './ActivityCard'
import type { Activity } from '@/types'

interface DraggableActivityCardProps {
  activity: Activity
  isScheduled: boolean
}

export const DraggableActivityCard: React.FC<DraggableActivityCardProps> = ({
  activity,
  isScheduled
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
  } = useDraggable({
    id: activity.id,
    disabled: isScheduled
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 1000 : 'auto'
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={isScheduled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}
    >
      <ActivityCard
        activity={activity}
        size="sm"
        isDragging={isDragging}
        isSelected={isScheduled}
      />
      
      {isScheduled && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Scheduled
        </div>
      )}
    </div>
  )
}
