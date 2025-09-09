import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '../ui/Card';
import { Clock, MapPin, Trash2, Edit3, CheckCircle, GripVertical, Calendar, Sun, Moon } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { ScheduledActivity } from '../../types';

interface SortableActivityItemProps {
  activity: ScheduledActivity;
  onRemove: (scheduledId: string) => void;
  onEdit: (activity: ScheduledActivity) => void;
  onToggleComplete: (scheduledId: string) => void;
}

const SortableActivityItem: React.FC<SortableActivityItemProps> = ({
  activity,
  onRemove,
  onEdit,
  onToggleComplete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: activity.scheduledId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMoodGradient = (mood: string) => {
    const gradients = {
      energetic: 'from-red-400 to-orange-400',
      relaxed: 'from-blue-400 to-cyan-400',
      peaceful: 'from-green-400 to-emerald-400',
      social: 'from-purple-400 to-pink-400',
      creative: 'from-pink-400 to-rose-400',
      adventurous: 'from-orange-400 to-yellow-400',
      romantic: 'from-rose-400 to-pink-400',
      family: 'from-indigo-400 to-purple-400'
    };
    return gradients[mood as keyof typeof gradients] || 'from-gray-400 to-gray-500';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'activity-card relative overflow-hidden group cursor-pointer transition-all duration-300',
        activity.completed && 'opacity-75',
        isDragging && 'opacity-50 shadow-glow-primary scale-105 rotate-2'
      )}
    >
      {/* Activity completion overlay */}
      {activity.completed && (
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm" />
      )}
      
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-grab active:cursor-grabbing p-2 rounded-xl hover:bg-white/20"
      >
        <GripVertical className="w-4 h-4 text-white/70" />
      </div>

      {/* Time indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r opacity-80" 
           style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}
           className={`bg-gradient-to-r ${getMoodGradient(activity.mood)}`} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-2xl filter drop-shadow-sm">{activity.icon}</div>
            <div className="flex-1">
              <h4 className={cn(
                'font-semibold text-white mb-1',
                activity.completed && 'line-through opacity-75'
              )}>
                {activity.name}
              </h4>
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <Clock className="w-4 h-4" />
                <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(activity.scheduledId);
            }}
            className={cn(
              'p-2 rounded-full transition-all duration-200 hover:scale-110',
              activity.completed 
                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            )}
          >
            <CheckCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Location */}
        {activity.location && (
          <div className="flex items-center space-x-2 text-white/70 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{activity.location}</span>
          </div>
        )}

        {/* Notes */}
        {activity.notes && (
          <p className="text-white/80 text-sm mb-3 italic bg-white/10 rounded-lg p-2">
            "{activity.notes}"
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r text-white shadow-sm',
              getMoodGradient(activity.mood)
            )}>
              {activity.mood}
            </span>
            <span className="text-white/60 text-xs font-medium">
              {activity.duration}min
            </span>
          </div>

          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(activity);
              }}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(activity.scheduledId);
              }}
              className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DraggableScheduleProps {
  activities: ScheduledActivity[];
  onRemoveActivity: (scheduledId: string) => void;
  onEditActivity: (activity: ScheduledActivity) => void;
  onToggleComplete: (scheduledId: string) => void;
  onReorderActivities: (day: string, fromIndex: number, toIndex: number) => void;
}

export const DraggableSchedule: React.FC<DraggableScheduleProps> = ({
  activities,
  onRemoveActivity,
  onEditActivity,
  onToggleComplete,
  onReorderActivities,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const days = ['friday', 'saturday', 'sunday', 'monday'];
  const dayLabels = {
    friday: 'Friday',
    saturday: 'Saturday', 
    sunday: 'Sunday',
    monday: 'Monday'
  };

  const dayIcons = {
    friday: Calendar,
    saturday: Sun,
    sunday: Sun,
    monday: Moon
  };

  const dayGradients = {
    friday: 'from-indigo-500 to-purple-600',
    saturday: 'from-orange-500 to-red-500',
    sunday: 'from-blue-500 to-cyan-500',
    monday: 'from-gray-600 to-gray-800'
  };

  const getActivitiesForDay = (day: string) => {
    return activities
      .filter(activity => activity.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTotalDuration = (dayActivities: ScheduledActivity[]) => {
    return dayActivities.reduce((total, activity) => total + activity.duration, 0);
  };

  const getDayProgress = (dayActivities: ScheduledActivity[]) => {
    const completed = dayActivities.filter(a => a.completed).length;
    return dayActivities.length > 0 ? (completed / dayActivities.length) * 100 : 0;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    // Find which day this activity belongs to
    const activeActivity = activities.find(a => a.scheduledId === active.id);
    if (!activeActivity) return;

    const day = activeActivity.day;
    const dayActivities = getActivitiesForDay(day);
    
    const oldIndex = dayActivities.findIndex(a => a.scheduledId === active.id);
    const newIndex = dayActivities.findIndex(a => a.scheduledId === over.id);

    if (oldIndex !== newIndex) {
      onReorderActivities(day, oldIndex, newIndex);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Calendar className="w-8 h-8 text-primary-500" />
          <h2 className="text-3xl font-bold gradient-text">Weekend Timeline</h2>
        </div>
        <div className="flex items-center justify-center space-x-6 text-sm text-white/70">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
            <span>Total Activities: {activities.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <GripVertical className="w-4 h-4" />
            <span>Drag to reorder</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        {days.map(day => {
          const dayActivities = getActivitiesForDay(day);
          const progress = getDayProgress(dayActivities);
          const totalDuration = getTotalDuration(dayActivities);
          const DayIcon = dayIcons[day as keyof typeof dayIcons];
          
          return (
            <div key={day} className="space-y-4">
              {/* Day Header */}
              <div className={cn(
                'glass rounded-2xl p-6 text-center bg-gradient-to-br',
                dayGradients[day as keyof typeof dayGradients]
              )}>
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <DayIcon className="w-6 h-6 text-white" />
                  <h3 className="text-xl font-bold text-white">
                    {dayLabels[day as keyof typeof dayLabels]}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-white/90 text-sm">
                    <span>{dayActivities.length} activities</span>
                    <span>{formatDuration(totalDuration)}</span>
                  </div>
                  
                  {dayActivities.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-white/80 text-xs">
                        <span>{Math.round(progress)}% complete</span>
                        <span>{dayActivities.filter(a => a.completed).length}/{dayActivities.length}</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-white/60 to-white/80 h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-3 min-h-[400px]">
                {dayActivities.length === 0 ? (
                  <div className="glass rounded-2xl p-8 text-center text-white/60">
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-medium mb-2">No activities planned</p>
                    <p className="text-sm opacity-75">Add activities to get started</p>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={dayActivities.map(a => a.scheduledId)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {dayActivities.map((activity, index) => (
                          <div key={activity.scheduledId} className="relative">
                            {/* Timeline connector */}
                            {index < dayActivities.length - 1 && (
                              <div className="absolute left-6 top-full w-0.5 h-3 bg-gradient-to-b from-white/30 to-transparent z-0" />
                            )}
                            
                            {/* Activity card */}
                            <div className="relative z-10">
                              <SortableActivityItem
                                activity={activity}
                                onRemove={onRemoveActivity}
                                onEdit={onEditActivity}
                                onToggleComplete={onToggleComplete}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
