'use client'

import { Activity, Clock } from 'lucide-react'
import type { Activity as ActivityType } from '@/lib/crm-data'
import { cn } from '@/lib/utils'

interface ActivityFeedProps {
  activities: ActivityType[]
}

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <aside className="w-80 flex-shrink-0 border-l border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="h-4 w-4 text-primary" />
        <h2 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
          Team Activity
        </h2>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className={cn(
              'group rounded-lg border border-border bg-background p-3 transition-all duration-200 hover:border-primary/30',
              index === 0 && 'border-primary/20'
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold',
                  activity.user === 'System'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {activity.user.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-primary">
                    {activity.user}
                  </span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  <span className="font-mono text-xs">{activity.target}</span>
                </p>
                <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span className="font-mono text-xs">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MSC Engine Badge */}
      <div className="mt-6 rounded-lg border border-border/50 bg-background/50 p-4 text-center">
        <p className="font-mono text-xs text-muted-foreground">
          Powered by the
        </p>
        <p className="mt-1 font-mono text-sm font-semibold text-primary vader-glow-text">
          MSC Media Engine
        </p>
      </div>
    </aside>
  )
}
