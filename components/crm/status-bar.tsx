'use client'

import { useState, useEffect } from 'react'
import { Circle, CheckCircle2, AlertTriangle, Folder } from 'lucide-react'

interface StatusBarProps {
  totalProjects: number
  activeProjects: number
  completedToday: number
  overdueCount: number
  onFilterActive?: () => void
  onFilterCompleted?: () => void
  onFilterOverdue?: () => void
  onOpenProjects?: () => void
}

export function StatusBar({ 
  totalProjects, 
  activeProjects, 
  completedToday,
  overdueCount,
  onFilterActive,
  onFilterCompleted,
  onFilterOverdue,
  onOpenProjects,
}: StatusBarProps) {
  const [timeString, setTimeString] = useState<string>('')
  const [dateString, setDateString] = useState<string>('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTimeString(now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }))
      setDateString(now.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric' 
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onFilterActive}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <Circle className="h-2 w-2 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground hidden sm:inline">Active</span>
            <span className="text-xs font-semibold text-foreground">{activeProjects}</span>
          </button>

          <button
            type="button"
            onClick={onFilterCompleted}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <CheckCircle2 className="h-3 w-3 text-primary" />
            <span className="text-xs text-muted-foreground hidden sm:inline">Done Today</span>
            <span className="text-xs font-semibold text-foreground">{completedToday}</span>
          </button>

          {overdueCount > 0 && (
            <button
              type="button"
              onClick={onFilterOverdue}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              <AlertTriangle className="h-3 w-3 text-destructive" />
              <span className="text-xs text-muted-foreground hidden sm:inline">Overdue</span>
              <span className="text-xs font-semibold text-destructive">{overdueCount}</span>
            </button>
          )}

          <div className="h-4 w-px bg-white/[0.08] mx-1" />
          
          <button
            type="button"
            onClick={onOpenProjects}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/[0.04] transition-colors"
          >
            <Folder className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground hidden sm:inline">Projects</span>
            <span className="text-xs font-semibold text-foreground">{totalProjects}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
