import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ScheduledActivityCard } from './ScheduledActivityCard'
import type { ScheduledActivity } from '@/types'
import { Calendar, Plus } from 'lucide-react'

interface DayColumnProps {
  day: 'saturday' | 'sunday'
  title: string
  activities: ScheduledActivity[]
  onRemoveActivity: (scheduledId: string) => void
}

export const DayColumn: React.FC<DayColumnProps> = ({
  day,
  title,
  activities,
  onRemoveActivity
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${day}`
  })

  const sortedActivities = activities.sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  )

  return (
    <Card variant="glass" className="h-full min-h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          {title}
          <span className="text-sm text-neutral-500 ml-auto">
            {activities.length} activities
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div
          ref={setNodeRef}
          className={`min-h-[400px] rounded-2xl border-2 border-dashed transition-all duration-300 p-4 ${
            isOver 
              ? 'border-blue-400 bg-blue-50/50' 
              : 'border-neutral-200 bg-neutral-50/30'
          }`}
        >
          {sortedActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-neutral-600 mb-2">
                No activities planned
              </h4>
              <p className="text-sm text-neutral-500 max-w-xs">
                Drag activities from below to add them to your {title.toLowerCase()}
              </p>
            </div>
          ) : (
            <SortableContext 
              items={sortedActivities.map(a => a.scheduledId)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {sortedActivities.map(activity => (
                  <ScheduledActivityCard
                    key={activity.scheduledId}
                    activity={activity}
                    onRemove={() => onRemoveActivity(activity.scheduledId)}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
