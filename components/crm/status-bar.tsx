'use client'

import { Circle, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'

interface StatusBarProps {
  totalProjects: number
  activeProjects: number
  completedToday: number
  overdueCount: number
}

export function StatusBar({ 
  totalProjects, 
  activeProjects, 
  completedToday,
  overdueCount 
}: StatusBarProps) {
  const now = new Date()
  const timeString = now.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })
  const dateString = now.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric' 
  })

  return (
    <div className="w-full glass-card border-b border-white/[0.04]">
      <div className="flex items-center justify-between h-10 px-6">
        {/* Left: Date & Time */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Circle className="h-2 w-2 fill-primary text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
          <div className="h-4 w-px bg-white/[0.08]" />
          <span className="text-xs text-foreground/80">{dateString}</span>
          <span className="text-xs font-medium text-foreground">{timeString}</span>
        </div>

        {/* Right: Quick Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
              <Circle className="h-2.5 w-2.5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Active</span>
            <span className="text-xs font-semibold text-foreground">{activeProjects}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
              <CheckCircle2 className="h-2.5 w-2.5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Done Today</span>
            <span className="text-xs font-semibold text-foreground">{completedToday}</span>
          </div>

          {overdueCount > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-destructive/10">
                <AlertTriangle className="h-2.5 w-2.5 text-destructive" />
              </div>
              <span className="text-xs text-muted-foreground">Overdue</span>
              <span className="text-xs font-semibold text-destructive">{overdueCount}</span>
            </div>
          )}

          <div className="h-4 w-px bg-white/[0.08]" />
          
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Projects</span>
            <span className="text-xs font-semibold text-foreground">{totalProjects}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
