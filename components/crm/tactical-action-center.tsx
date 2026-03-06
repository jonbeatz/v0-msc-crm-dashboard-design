'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, AlertTriangle, Plus, Clock, User } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TASK_STEPS, type Task } from '@/lib/crm-data'

interface TacticalActionCenterProps {
  tasks: Task[]
  selectedStepFilter: { clientId: string; stepIndex: number } | null
  onToggleTask: (taskId: string) => void
  onAddTask: (taskName: string) => void
}

export function TacticalActionCenter({
  tasks,
  selectedStepFilter,
  onToggleTask,
  onAddTask,
}: TacticalActionCenterProps) {
  const [newTaskInput, setNewTaskInput] = useState('')

  const formatTimeRemaining = (dueAt: Date) => {
    const now = new Date()
    const diff = dueAt.getTime() - now.getTime()
    const isOverdue = diff < 0
    const absDiff = Math.abs(diff)

    const minutes = Math.floor(absDiff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return { text: `${days}d left`, isOverdue }
    } else if (hours > 0) {
      return { text: `${hours}h left`, isOverdue }
    } else if (minutes > 0) {
      return { text: isOverdue ? `${minutes}m overdue` : `${minutes}m left`, isOverdue }
    } else {
      return { text: 'Due now', isOverdue: true }
    }
  }

  const filteredTasks = selectedStepFilter
    ? tasks.filter(
        (t) =>
          t.clientId === selectedStepFilter.clientId &&
          t.stepIndex === selectedStepFilter.stepIndex
      )
    : tasks

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    const aOverdue = a.dueAt.getTime() < Date.now()
    const bOverdue = b.dueAt.getTime() < Date.now()
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
    return a.dueAt.getTime() - b.dueAt.getTime()
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskInput.trim()) {
      onAddTask(newTaskInput.trim())
      setNewTaskInput('')
    }
  }

  return (
    <section className="glass-card border-t border-white/[0.06] mx-6 mb-6 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              My Tasks
            </h2>
            {selectedStepFilter && (
              <span className="text-xs text-primary">
                Filtering: {TASK_STEPS[selectedStepFilter.stepIndex]}
              </span>
            )}
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-muted/50 text-xs font-medium text-muted-foreground">
          {sortedTasks.filter((t) => !t.completed).length} active
        </span>
      </div>

      {/* Task List - Sticky Note Style */}
      <div className="max-h-56 overflow-y-auto p-4">
        {sortedTasks.length === 0 ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
            No tasks {selectedStepFilter ? 'for this step' : 'yet'}
          </div>
        ) : (
          <div className="space-y-2">
            {sortedTasks.map((task) => {
              const timeInfo = formatTimeRemaining(task.dueAt)
              return (
                <div
                  key={task.id}
                  className={cn(
                    'task-strip p-4 flex items-center gap-4',
                    task.completed && 'opacity-50'
                  )}
                >
                  {/* Checkbox - Custom Styled */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={cn(
                      'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg transition-all duration-200',
                      task.completed
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                    )}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      {timeInfo.isOverdue && !task.completed && (
                        <AlertTriangle className="h-3.5 w-3.5 text-destructive flex-shrink-0" />
                      )}
                      <span
                        className={cn(
                          'text-sm',
                          task.completed ? 'line-through text-muted-foreground' : 'text-foreground',
                          task.assignedToMe && !task.completed && 'text-primary font-medium'
                        )}
                      >
                        {task.name}
                      </span>
                      {task.assignedToMe && !task.completed && (
                        <User className="h-3 w-3 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {task.clientName}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-muted/40 text-[10px] text-muted-foreground">
                        {TASK_STEPS[task.stepIndex]}
                      </span>
                    </div>
                  </div>

                  {/* Due Time */}
                  <div className="flex items-center gap-2">
                    <Clock className={cn(
                      'h-3.5 w-3.5',
                      timeInfo.isOverdue && !task.completed ? 'text-destructive' : 'text-muted-foreground'
                    )} />
                    <span
                      className={cn(
                        'text-xs',
                        task.completed
                          ? 'text-muted-foreground'
                          : timeInfo.isOverdue
                          ? 'text-destructive font-medium'
                          : 'text-muted-foreground'
                      )}
                    >
                      {task.completed ? 'Done' : timeInfo.text}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Add Task - Soft Input */}
      <form onSubmit={handleSubmit} className="border-t border-white/[0.06] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-muted/30">
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            className="flex-1 h-10 bg-transparent border-0 rounded-xl text-sm placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/30"
          />
          <button
            type="submit"
            disabled={!newTaskInput.trim()}
            className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>
      </form>
    </section>
  )
}
