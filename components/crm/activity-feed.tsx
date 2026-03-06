'use client'

import { Activity, Clock } from 'lucide-react'
import type { Activity as ActivityType } from '@/lib/crm-data'
import { cn } from '@/lib/utils'

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
  return (
    <aside className="w-72 flex-shrink-0 border-l border-border bg-card p-3 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-3.5 w-3.5 text-primary" />
        <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-foreground">
          Team Activity
        </h2>
      </div>
      
      <div className="space-y-2 flex-1 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              'rounded-sm border border-border bg-background p-2.5 transition-all duration-200',
              index === 0 && 'border-primary/30'
            )}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={cn(
                  'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm font-mono text-[10px] font-bold',
                  activity.user === 'System'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">
                  <span className="font-semibold text-primary">
                    {activity.user}
                  </span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate mt-0.5">
                  {activity.target}
                </p>
                <div className="mt-1.5 flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" />
                  <span className="font-mono text-[10px]">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      </aside>
  )
}
