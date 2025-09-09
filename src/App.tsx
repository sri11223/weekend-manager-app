import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'
import { Calendar, Sparkles, Clock, GripVertical, X, Plus } from 'lucide-react'
import { ActivityCard } from '@/components/features/ActivityCard'
import { ActivityBrowser } from '@/components/features/ActivityBrowser'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { SAMPLE_ACTIVITIES } from '@/constants'
import type { Activity, ScheduledActivity } from '@/types'
import { motion } from 'framer-motion'
import { useWeekendStore } from '@/store/useWeekendStore'
import { 
  DndContext, 
  DragEndEvent,
  DragOverEvent,  
  DragStartEvent,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable
} from '@dnd-kit/core'
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Draggable Activity Component
const DraggableActivityCard: React.FC<{ 
  activity: Activity; 
  isScheduled: boolean;
}> = ({ activity, isScheduled }) => {
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
      <div className="relative">
        <ActivityCard
          activity={activity}
          size="sm"
          isDragging={isDragging}
          isSelected={isScheduled}
        />
        
        {isScheduled && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            ✓ Added
          </div>
        )}
      </div>
    </div>
  )
}

// Scheduled Activity Card Component
const ScheduledActivityCard: React.FC<{
  activity: ScheduledActivity;
  onRemove: () => void;
}> = ({ activity, onRemove }) => {
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
        className={`border-l-4 ${isDragging ? 'shadow-xl scale-105 rotate-2' : ''}`}
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

// Day Column Component
const DayColumn: React.FC<{
  day: 'saturday' | 'sunday';
  title: string;
  activities: ScheduledActivity[];
  onRemoveActivity: (scheduledId: string) => void;
}> = ({ day, title, activities, onRemoveActivity }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${day}`
  })

  const sortedActivities = activities.sort((a, b) => 
    a.startTime.localeCompare(b.startTime)
  )

  return (
    <Card variant="glass" className="h-full min-h-[500px]">
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
          className={`min-h-[300px] rounded-2xl border-2 border-dashed transition-all duration-300 p-4 ${
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
                Drag activities here to add them to {title.toLowerCase()}
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

function App() {
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>([])
  
  // Zustand store
  const { 
    currentPlan,
    createNewPlan,
    addActivityToPlan,
    removeActivityFromPlan,
    reorderActivities,
    getActivitiesByDay,
    calculatePlanCost,
    getPlanDuration
  } = useWeekendStore()

  // Drag and drop sensors
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

  const handleSelectActivity = (activity: Activity) => {
    if (selectedActivities.find(a => a.id === activity.id)) {
      toast.error(`${activity.name} is already selected!`)
      return
    }
    
    setSelectedActivities(prev => [...prev, activity])
    toast.success(`Added ${activity.name} to your weekend!`)
  }

  const handleRemoveActivity = (activityId: string) => {
    setSelectedActivities(prev => prev.filter(a => a.id !== activityId))
    toast.success('Activity removed from weekend!')
  }

  const handleClearAll = () => {
    setSelectedActivities([])
    toast.success('All activities cleared!')
  }

  const handleCreatePlan = () => {
    if (!currentPlan) {
      createNewPlan('My Weekend Plan', 'custom')
      toast.success('Weekend plan created!')
    }
  }

  // Drag and drop handlers
  const handleDragStart = (event: DragStartEvent) => {
    console.log('Drag started:', event.active.id)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Handle dropping from available activities to schedule
    if (overId.startsWith('day-') && currentPlan) {
      const day = overId.replace('day-', '') as 'saturday' | 'sunday'
      const activity = SAMPLE_ACTIVITIES.find(a => a.id === activeId)
      
      if (activity && !currentPlan.activities.find(a => a.id === activeId)) {
        // Add to schedule with default time based on existing activities
        const dayActivities = getActivitiesByDay(day)
        const defaultTime = dayActivities.length === 0 ? '09:00' : 
                          dayActivities.length === 1 ? '12:00' : 
                          dayActivities.length === 2 ? '15:00' : '18:00'
        
        addActivityToPlan(activity, day, defaultTime)
        toast.success(`Added ${activity.name} to ${day}!`)
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || !currentPlan) return

    const activeId = active.id as string
    const overId = over.id as string

    // Handle reordering within the same day
    if (overId.startsWith('scheduled-')) {
      const activeActivity = currentPlan.activities.find(a => a.scheduledId === activeId)
      const overActivity = currentPlan.activities.find(a => a.scheduledId === overId)
      
      if (activeActivity && overActivity && activeActivity.day === overActivity.day) {
        const dayActivities = getActivitiesByDay(activeActivity.day)
        const oldIndex = dayActivities.findIndex(a => a.scheduledId === activeId)
        const newIndex = dayActivities.findIndex(a => a.scheduledId === overId)
        
        if (oldIndex !== newIndex) {
          reorderActivities(activeActivity.day, oldIndex, newIndex)
          toast.success('Activity reordered!')
        }
      }
    }
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
      <div className="min-h-screen relative overflow-hidden">
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: 'glass rounded-2xl border-0 shadow-strong',
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            }
          }}
        />
        
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-rose-50 animate-gradient"></div>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Header */}
        <header className="glass sticky top-0 z-50 border-b border-white/20">
          <div className="container-custom">
            <div className="flex items-center justify-between h-20">
              {/* Logo & Brand */}
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">Weekendly</h1>
                  <p className="text-sm text-neutral-600 font-medium">Plan your perfect weekend</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button variant="primary" onClick={handleCreatePlan}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {currentPlan ? 'Plan Created!' : 'Create Plan'}
                </Button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Title */}
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-bold gradient-text mb-6">
              Plan Your Perfect Weekend
            </h2>
            <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover amazing activities and create memorable weekend experiences with drag & drop scheduling
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <main className="container-custom pb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Activities Panel - NEW ACTIVITYBROWSER */}
            <motion.section
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <div className="glass rounded-3xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">Discover Activities</h3>
                    <p className="text-neutral-600">Search, filter, and plan your perfect weekend</p>
                  </div>
                </div>
                
                <ActivityBrowser
                  activities={SAMPLE_ACTIVITIES}
                  selectedActivities={selectedActivities}
                  scheduledActivityIds={currentPlan?.activities.map(a => a.id) || []}
                  onSelectActivity={handleSelectActivity}
                  onAddToSchedule={currentPlan ? (activity) => {
                    // Quick add to Saturday by default
                    const dayActivities = getActivitiesByDay('saturday')
                    const defaultTime = dayActivities.length === 0 ? '09:00' : 
                                      dayActivities.length === 1 ? '12:00' : 
                                      dayActivities.length === 2 ? '15:00' : '18:00'
                    addActivityToPlan(activity, 'saturday', defaultTime)
                    toast.success(`Added ${activity.name} to Saturday!`)
                  } : undefined}
                />
              </div>
            </motion.section>

            {/* Weekend Plan */}
            <motion.section
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <div className="glass rounded-3xl p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-neutral-900">Your Weekend Plan</h3>
                    <p className="text-neutral-600">
                      {selectedActivities.length} activities selected
                    </p>
                  </div>
                </div>
                
                {!currentPlan ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-16"
                  >
                    <div className="text-8xl mb-6">📅</div>
                    <h3 className="text-2xl font-bold text-neutral-800 mb-4">
                      Create Your Plan First
                    </h3>
                    <p className="text-lg text-neutral-500 max-w-md mx-auto mb-6">
                      Click "Create Plan" to start building your weekend schedule
                    </p>
                    <Button variant="primary" onClick={handleCreatePlan}>
                      Create Weekend Plan
                    </Button>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {/* Plan Stats */}
                    <div className="bg-white/40 rounded-2xl p-4">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-blue-600">{currentPlan.activities.length}</div>
                          <div className="text-xs text-neutral-600">Activities</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">${calculatePlanCost()}</div>
                          <div className="text-xs text-neutral-600">Est. Cost</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">{Math.round(getPlanDuration() / 60)}h</div>
                          <div className="text-xs text-neutral-600">Duration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          </div>

          {/* Weekend Schedule */}
          {currentPlan && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-16"
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold gradient-text mb-4">
                  Weekend Schedule
                </h2>
                <p className="text-xl text-neutral-600">
                  Drag activities between Saturday and Sunday to organize your weekend
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <DayColumn
                  day="saturday"
                  title="Saturday"
                  activities={saturdayActivities}
                  onRemoveActivity={removeActivityFromPlan}
                />
                
                <DayColumn
                  day="sunday"
                  title="Sunday"
                  activities={sundayActivities}
                  onRemoveActivity={removeActivityFromPlan}
                />
              </div>
            </motion.section>
          )}
        </main>
      </div>
    </DndContext>
  )
}

export default App
