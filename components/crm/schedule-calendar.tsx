'use client'

import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, User, AlertTriangle, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TASK_STEPS, type Task, type Client } from '@/lib/crm-data'

interface ScheduleCalendarProps {
  tasks: Task[]
  clients: Client[]
  onTaskClick?: (task: Task) => void
}

// Types for calendar events
interface CalendarEvent {
  id: string
  title: string
  type: 'task' | 'deadline' | 'meeting'
  date: Date
  clientName: string
  status: 'upcoming' | 'overdue' | 'completed'
  priority?: 'normal' | 'high'
  task?: Task
}

export function ScheduleCalendar({ tasks, clients, onTaskClick }: ScheduleCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())

  // Generate calendar events from tasks
  const calendarEvents = useMemo(() => {
    const events: CalendarEvent[] = tasks.map((task) => {
      const now = new Date()
      const isOverdue = task.dueAt < now && !task.completed
      
      return {
        id: task.id,
        title: task.name,
        type: 'task' as const,
        date: task.dueAt,
        clientName: task.clientName,
        status: task.completed ? 'completed' : isOverdue ? 'overdue' : 'upcoming',
        task,
      }
    })

    // Add some mock deadlines for clients
    clients.forEach((client) => {
      if (client.currentStep < 5 && client.currentStep > 0) {
        const deadlineDate = new Date()
        deadlineDate.setDate(deadlineDate.getDate() + client.currentStep * 2)
        events.push({
          id: `deadline-${client.id}`,
          title: `${TASK_STEPS[client.currentStep]} Deadline`,
          type: 'deadline',
          date: deadlineDate,
          clientName: client.name,
          status: 'upcoming',
          priority: client.priority,
        })
      }
    })

    return events.sort((a, b) => a.date.getTime() - b.date.getTime())
  }, [tasks, clients])

  // Get events for selected date
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return []
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [calendarEvents, selectedDate])

  // Get dates that have events (for highlighting)
  const eventDates = useMemo(() => {
    const dates: { [key: string]: { count: number; hasOverdue: boolean } } = {}
    calendarEvents.forEach((event) => {
      const dateKey = event.date.toDateString()
      if (!dates[dateKey]) {
        dates[dateKey] = { count: 0, hasOverdue: false }
      }
      dates[dateKey].count++
      if (event.status === 'overdue') {
        dates[dateKey].hasOverdue = true
      }
    })
    return dates
  }, [calendarEvents])

  // Upcoming events (next 7 days)
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    return calendarEvents
      .filter((event) => event.date >= now && event.date <= nextWeek && event.status !== 'completed')
      .slice(0, 5)
  }, [calendarEvents])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDateHeader = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue':
        return 'text-destructive'
      case 'completed':
        return 'text-primary/50'
      default:
        return 'text-foreground'
    }
  }

  const handlePrevMonth = () => {
    const prev = new Date(currentMonth)
    prev.setMonth(prev.getMonth() - 1)
    setCurrentMonth(prev)
  }

  const handleNextMonth = () => {
    const next = new Date(currentMonth)
    next.setMonth(next.getMonth() + 1)
    setCurrentMonth(next)
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <CalendarDays className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Schedule</h2>
            <span className="text-xs text-muted-foreground">
              {upcomingEvents.length} upcoming this week
            </span>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
        {/* Calendar Section */}
        <div className="p-4">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4 px-2">
            <button
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="text-sm font-medium text-foreground">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Calendar Grid */}
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            className="w-full"
            classNames={{
              months: "w-full",
              month: "w-full",
              table: "w-full",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: cn(
                "relative flex-1 p-0 text-center focus-within:relative focus-within:z-20",
                "[&:has([aria-selected])]:bg-primary/10 [&:has([aria-selected])]:rounded-lg"
              ),
              day: cn(
                "h-9 w-full p-0 font-normal",
                "hover:bg-white/[0.06] rounded-lg transition-colors",
                "aria-selected:bg-primary aria-selected:text-primary-foreground"
              ),
              day_today: "bg-accent/20 text-accent",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_hidden: "invisible",
              nav: "hidden",
              caption: "hidden",
            }}
            components={{
              DayButton: ({ day, modifiers, ...props }) => {
                const dateKey = day.date.toDateString()
                const eventInfo = eventDates[dateKey]
                
                return (
                  <button
                    {...props}
                    className={cn(
                      "relative h-9 w-full p-0 font-normal rounded-lg transition-all",
                      "hover:bg-white/[0.06]",
                      modifiers.selected && "bg-primary text-primary-foreground hover:bg-primary/80",
                      modifiers.today && !modifiers.selected && "bg-accent/20 text-accent",
                      modifiers.outside && "text-muted-foreground opacity-50"
                    )}
                  >
                    {day.date.getDate()}
                    {eventInfo && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                        {Array.from({ length: Math.min(eventInfo.count, 3) }).map((_, i) => (
                          <span
                            key={i}
                            className={cn(
                              "h-1 w-1 rounded-full",
                              eventInfo.hasOverdue ? "bg-destructive" : "bg-primary"
                            )}
                            style={{
                              boxShadow: eventInfo.hasOverdue 
                                ? '0 0 4px rgba(255, 85, 85, 0.6)' 
                                : '0 0 4px rgba(0, 255, 136, 0.6)'
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </button>
                )
              }
            }}
          />
        </div>

        {/* Events List Section */}
        <div className="p-4">
          {/* Selected Date Header */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-foreground">
              {selectedDate ? formatDateHeader(selectedDate) : 'Select a date'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {selectedDateEvents.length} event{selectedDateEvents.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Events for Selected Date */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedDateEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted/30 mb-3">
                  <CalendarDays className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No events scheduled</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Select a different date or add an event
                </p>
              </div>
            ) : (
              selectedDateEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => event.task && onTaskClick?.(event.task)}
                  className={cn(
                    "p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-all",
                    event.task && "cursor-pointer hover:bg-white/[0.04] hover:border-white/[0.08]"
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Status Indicator */}
                    <div className="mt-0.5">
                      {event.status === 'overdue' ? (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      ) : event.status === 'completed' ? (
                        <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <div 
                          className="h-4 w-4 rounded-full border-2"
                          style={{ 
                            borderColor: event.type === 'deadline' ? '#ff8888' : '#00ff88',
                            boxShadow: event.type === 'deadline' 
                              ? '0 0 8px rgba(255, 136, 136, 0.3)' 
                              : '0 0 8px rgba(0, 255, 136, 0.3)'
                          }}
                        />
                      )}
                    </div>

                    {/* Event Content */}
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "text-sm font-medium",
                        getStatusColor(event.status),
                        event.status === 'completed' && 'line-through'
                      )}>
                        {event.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground truncate">
                          {event.clientName}
                        </span>
                      </div>
                    </div>

                    {/* Time */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(event.date)}</span>
                    </div>
                  </div>

                  {/* Event Type Badge */}
                  <div className="flex items-center gap-2 mt-2 ml-7">
                    <span className={cn(
                      "text-[10px] font-medium px-2 py-0.5 rounded-full",
                      event.type === 'task' && "bg-primary/15 text-primary",
                      event.type === 'deadline' && "bg-chart-5/15 text-chart-5",
                      event.type === 'meeting' && "bg-accent/15 text-accent"
                    )}>
                      {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                    </span>
                    {event.priority === 'high' && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-destructive/15 text-destructive">
                        High Priority
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Upcoming Section */}
          {selectedDateEvents.length === 0 && upcomingEvents.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <h4 className="text-xs font-medium text-muted-foreground mb-3">
                Coming Up
              </h4>
              <div className="space-y-2">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => {
                      setSelectedDate(new Date(event.date))
                      if (event.task) onTaskClick?.(event.task)
                    }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-colors"
                  >
                    <div 
                      className="h-2 w-2 rounded-full"
                      style={{ 
                        backgroundColor: event.status === 'overdue' ? '#ff5555' : '#00ff88',
                        boxShadow: event.status === 'overdue' 
                          ? '0 0 6px rgba(255, 85, 85, 0.5)' 
                          : '0 0 6px rgba(0, 255, 136, 0.5)'
                      }}
                    />
                    <span className="text-sm text-foreground truncate flex-1">
                      {event.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
