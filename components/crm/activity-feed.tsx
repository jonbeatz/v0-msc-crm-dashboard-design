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
    <aside className="w-80 flex-shrink-0 border-l border-white/[0.06] glass-card p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
          <Activity className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-sm font-semibold text-foreground">
          Team Activity
        </h2>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto">
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
              {/* Avatar Initials */}
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
  )
}
