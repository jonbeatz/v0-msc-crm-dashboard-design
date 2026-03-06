'use client'

import { useState } from 'react'
import { CheckCircle2, Circle, AlertTriangle, Plus, Clock, User, X, Calendar, Tag, ExternalLink } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const formatTimeRemaining = (dueAt: Date) => {
    const now = new Date()
    const diff = dueAt.getTime() - now.getTime()
    const isOverdue = diff < 0
    const absDiff = Math.abs(diff)

    const minutes = Math.floor(absDiff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return { text: `${days}d ${isOverdue ? 'overdue' : 'left'}`, isOverdue }
    } else if (hours > 0) {
      return { text: `${hours}h ${isOverdue ? 'overdue' : 'left'}`, isOverdue }
    } else if (minutes > 0) {
      return { text: `${minutes}m ${isOverdue ? 'overdue' : 'left'}`, isOverdue }
    } else {
      return { text: 'Due now', isOverdue: true }
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
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

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const handleCloseModal = () => {
    setSelectedTask(null)
  }

  return (
    <>
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

        {/* Task List */}
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
                    onClick={() => handleTaskClick(task)}
                    className={cn(
                      'task-strip p-4 flex items-center gap-4 cursor-pointer',
                      task.completed && 'opacity-50'
                    )}
                  >
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleTask(task.id)
                      }}
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

        {/* Quick Add Task */}
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

      {/* Task Detail Modal with Dimmed Lightbox */}
      {selectedTask && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
            onClick={handleCloseModal}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="glass-card w-full max-w-md rounded-2xl shadow-2xl shadow-black/50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl',
                    selectedTask.completed ? 'bg-primary/20' : 'bg-muted/30'
                  )}>
                    {selectedTask.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedTask.name}</h3>
                    <p className="text-xs text-muted-foreground">Task Details</p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5">
                {/* Client Info */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl avatar-initials">
                    <span className="text-sm font-semibold text-primary">
                      {selectedTask.clientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedTask.clientName}</p>
                    <p className="text-xs text-muted-foreground">Client</p>
                  </div>
                </div>

                {/* Task Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Step */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Step</span>
                    </div>
                    <p className="text-sm font-medium text-foreground">{TASK_STEPS[selectedTask.stepIndex]}</p>
                  </div>

                  {/* Due Date */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Due</span>
                    </div>
                    <p className={cn(
                      'text-sm font-medium',
                      formatTimeRemaining(selectedTask.dueAt).isOverdue && !selectedTask.completed 
                        ? 'text-destructive' 
                        : 'text-foreground'
                    )}>
                      {formatDate(selectedTask.dueAt)}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Status</span>
                    </div>
                    <p className={cn(
                      'text-sm font-medium',
                      selectedTask.completed ? 'text-primary' : 'text-foreground'
                    )}>
                      {selectedTask.completed ? 'Completed' : formatTimeRemaining(selectedTask.dueAt).text}
                    </p>
                  </div>

                  {/* Assigned */}
                  <div className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-xs text-muted-foreground">Assigned</span>
                    </div>
                    <p className={cn(
                      'text-sm font-medium',
                      selectedTask.assignedToMe ? 'text-primary' : 'text-foreground'
                    )}>
                      {selectedTask.assignedToMe ? 'You' : 'Team'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.06]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCloseModal}
                  className="rounded-xl border-white/[0.08] hover:bg-white/[0.04]"
                >
                  Close
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-white/[0.08] hover:bg-white/[0.04]"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Client
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      onToggleTask(selectedTask.id)
                      handleCloseModal()
                    }}
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/80"
                  >
                    {selectedTask.completed ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
