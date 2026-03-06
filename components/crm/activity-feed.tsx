'use client'

import { useState } from 'react'
import { Activity, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Activity as ActivityType } from '@/lib/crm-data'

interface ActivityFeedProps {
  activities: ActivityType[]
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Toggle Button - Always Visible on Right Edge */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-40 h-24 w-8 rounded-l-xl rounded-r-none",
          "glass-card border border-r-0 border-white/[0.06]",
          "hover:bg-white/[0.04] transition-all duration-300",
          isOpen && "right-[340px]"
        )}
      >
        <div className="flex flex-col items-center gap-2">
          {isOpen ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
          <Activity className="h-4 w-4 text-primary" />
        </div>
      </Button>

      {/* Slide-out Panel - Glass with darker background */}
      <aside
        className={cn(
          "fixed right-0 top-0 bottom-0 w-[340px] z-30",
          "glass-card border-l border-white/[0.08]",
          "transform transition-transform duration-300 ease-in-out",
          "flex flex-col shadow-2xl shadow-black/60",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-5 border-b border-white/[0.06]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">Team Activity</h2>
            <p className="text-xs text-muted-foreground">Recent updates</p>
          </div>
        </div>

        {/* Activity List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                'rounded-xl p-4 transition-all duration-200',
                'bg-white/[0.02] border border-white/[0.04]',
                index === 0 && 'border-primary/20 bg-primary/[0.03]'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-xs font-semibold',
                    activity.user === 'System'
                      ? 'bg-primary/15 text-primary'
                      : 'avatar-initials text-primary'
                  )}
                >
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-relaxed">
                    <span className="font-semibold text-primary">
                      {activity.user}
                    </span>{' '}
                    <span className="text-muted-foreground">{activity.action}</span>
                  </p>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {activity.target}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-muted-foreground/60">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Overlay when open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
