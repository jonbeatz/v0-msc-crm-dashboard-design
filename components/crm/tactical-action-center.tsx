'use client'

import { useState } from 'react'
import { CheckSquare, AlertTriangle, ChevronRight, Clock, User } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
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
      return { text: `${days}d remaining`, isOverdue }
    } else if (hours > 0) {
      return { text: `${hours}h remaining`, isOverdue }
    } else if (minutes > 0) {
      return { text: isOverdue ? `${minutes}m overdue` : `${minutes}m remaining`, isOverdue }
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
    // Completed tasks go to bottom
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    // Overdue tasks first
    const aOverdue = a.dueAt.getTime() < Date.now()
    const bOverdue = b.dueAt.getTime() < Date.now()
    if (aOverdue !== bOverdue) return aOverdue ? -1 : 1
    // Then by due date
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
    <section className="bg-[#121212] border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#1c1c1c]">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-primary" />
          <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
            Tactical Action Center
          </h2>
          {selectedStepFilter && (
            <span className="ml-2 px-2 py-0.5 rounded-sm bg-primary/20 border border-primary/30 font-mono text-[10px] text-primary">
              Filtering: {TASK_STEPS[selectedStepFilter.stepIndex]}
            </span>
          )}
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {sortedTasks.filter((t) => !t.completed).length} active
        </span>
      </div>

      {/* Task List */}
      <div className="max-h-48 overflow-y-auto">
        {sortedTasks.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground font-mono text-xs">
            No tasks {selectedStepFilter ? 'for this step' : 'available'}
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky top-0 bg-[#1c1c1c] z-10">
              <tr className="border-b border-border">
                <th className="w-10 px-3 py-2 text-left"></th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Task
                </th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Client
                </th>
                <th className="px-3 py-2 text-left font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Step
                </th>
                <th className="px-3 py-2 text-right font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Due
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => {
                const timeInfo = formatTimeRemaining(task.dueAt)
                return (
                  <tr
                    key={task.id}
                    className={cn(
                      'border-b border-border/50 transition-colors',
                      task.completed && 'opacity-50',
                      !task.completed && task.assignedToMe && 'bg-primary/5',
                      timeInfo.isOverdue && !task.completed && 'bg-destructive/5'
                    )}
                  >
                    <td className="px-3 py-2">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggleTask(task.id)}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        {timeInfo.isOverdue && !task.completed && (
                          <AlertTriangle className="h-3 w-3 text-destructive vader-critical-pulse flex-shrink-0" />
                        )}
                        <span
                          className={cn(
                            'font-mono text-xs',
                            task.completed ? 'line-through text-muted-foreground' : 'text-foreground',
                            task.assignedToMe && !task.completed && 'text-primary'
                          )}
                        >
                          {task.name}
                        </span>
                        {task.assignedToMe && !task.completed && (
                          <User className="h-3 w-3 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {task.clientName}
                    </td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-muted font-mono text-[10px] text-muted-foreground border border-border">
                        {TASK_STEPS[task.stepIndex]}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Clock className={cn(
                          'h-3 w-3',
                          timeInfo.isOverdue && !task.completed ? 'text-destructive' : 'text-muted-foreground'
                        )} />
                        <span
                          className={cn(
                            'font-mono text-[11px]',
                            task.completed
                              ? 'text-muted-foreground'
                              : timeInfo.isOverdue
                              ? 'text-destructive font-semibold'
                              : 'text-muted-foreground'
                          )}
                        >
                          {task.completed ? 'Done' : timeInfo.text}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Add Task - Terminal Style */}
      <form onSubmit={handleSubmit} className="border-t border-border bg-[#0a0a0a]">
        <div className="flex items-center">
          <span className="pl-4 pr-2 font-mono text-sm text-primary">{'>'}</span>
          <Input
            type="text"
            placeholder="New Task..."
            value={newTaskInput}
            onChange={(e) => setNewTaskInput(e.target.value)}
            className="flex-1 h-10 bg-transparent border-0 rounded-none font-mono text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          <button
            type="submit"
            className="px-4 h-10 font-mono text-xs text-primary hover:bg-primary/10 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </form>
    </section>
  )
}
