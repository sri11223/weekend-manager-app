import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { ScheduledActivity } from '@/types'
import { Clock, X, GripVertical } from 'lucide-react'

interface ScheduledActivityCardProps {
  activity: ScheduledActivity
  onRemove: () => void
}

export const ScheduledActivityCard: React.FC<ScheduledActivityCardProps> = ({
  activity,
  onRemove
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: activity.scheduledId
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1000 : 'auto'
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card 
        variant="interactive"
        className={`border-l-4 ${isDragging ? 'shadow-xl scale-105' : ''}`}
        style={{ borderLeftColor: '#3b82f6' }}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Drag Handle */}
            <button
              className="p-1 hover:bg-gray-100 rounded cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="w-4 h-4 text-gray-400" />
            </button>
            
            {/* Activity Icon */}
            <div className="text-2xl">{activity.icon}</div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 text-sm truncate">
                {activity.name}
              </h4>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{activity.startTime} - {activity.endTime}</span>
                </div>
                <span>•</span>
                <span>{activity.duration}m</span>
                <span>•</span>
                <span className="capitalize">{activity.category}</span>
              </div>
              
              {activity.completed && (
                <div className="mt-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    ✓ Completed
                  </span>
                </div>
              )}
            </div>
            
            {/* Remove Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
